# Appmixer integration contract

The interface between the app and the workflow, and the source of truth for both
sides. The app is written against this and nothing else.

## Shape

One outbound call when the form is submitted. Several inbound callbacks as the flow
progresses. The app never polls Appmixer.

```
Peoplebase ──POST trigger──► Appmixer flow
Peoplebase ◄─POST callback── Appmixer flow   (repeatedly, one per step)
```

## Environment

```
APPMIXER_TRIGGER_URL=      # the flow's webhook URL
APPMIXER_DECISION_URL=     # the second webhook, for the human decision
APPMIXER_SIGNING_SECRET=   # shared secret, both directions
APP_PUBLIC_URL=            # public base URL of this app, no trailing slash
DEMO_MODE=live             # live | scripted
STORE_DRIVER=file          # file | redis
```

Local development needs a public URL for the callbacks:
`cloudflared tunnel --url http://localhost:3000`, then put the hostname it prints
into `APP_PUBLIC_URL`. This is the step people forget.

## Outbound: trigger

`POST {APPMIXER_TRIGGER_URL}`

```
Content-Type: application/json
X-Peoplebase-Signature: sha256=<hex hmac of the raw body, APPMIXER_SIGNING_SECRET>
X-Peoplebase-Request-Id: <request id>
```

```json
{
  "requestId": "V1StGXR8_Z5jdHi6B",
  "publicId": "POZ-2026-014",
  "submittedAt": "2026-10-01T07:14:03.412Z",
  "tenant": { "id": "alpina", "name": "Alpina Hotels Group" },
  "requester": {
    "id": "u_jana",
    "name": "Jana Dvořáková",
    "email": "jana.dvorakova@alpinahotels.example",
    "title": "ředitelka provozu, střední Evropa"
  },
  "team": {
    "id": "t_revmgmt",
    "name": "Revenue management, střední Evropa",
    "costCenter": "CE-RM-01"
  },
  "role": {
    "title": "Revenue manager",
    "seniority": "senior",
    "location": "Praha, hybridně",
    "targetStartDate": "2026-11-01"
  },
  "justification": "V březnu nám odešel revenue lead ve Vídni a regionální tým od té doby pokrývá dva trhy. Nejvíc nám protéká mezi prsty cenotvorba za Q4 a v lednu začíná práce na skupinových sazbách na rok 2027.",
  "callbackUrl": "https://<APP_PUBLIC_URL>/api/appmixer/callback",
  "callbackToken": "<opaque, unique per request>"
}
```

Send UTF-8 and do not strip diacritics anywhere in the chain. The agent writes Czech,
so it needs Czech in.

Client rules: 5 second timeout, no retry. On failure, append a `local.trigger_failed`
timeline event and start the scripted run instead. The user never sees an error page.

## Inbound: callbacks

`POST {APP_PUBLIC_URL}/api/appmixer/callback`

```
Authorization: Bearer <callbackToken from the trigger payload>
X-Appmixer-Signature: sha256=<hex hmac of the raw body, APPMIXER_SIGNING_SECRET>
```

Both are checked. A mismatch returns 401 and writes nothing.

Envelope, identical for every event:

```json
{
  "eventId": "evt_01J8...",
  "requestId": "V1StGXR8_Z5jdHi6B",
  "event": "draft.ready",
  "at": "2026-10-01T07:14:11.006Z",
  "flowRunId": "run_7f21",
  "data": { }
}
```

`eventId` is deduplicated: an id already in the timeline returns 200 and does nothing.
An unknown `event` returns 200, appends a generic timeline entry, and changes no
status. Never return 500 to the flow.

## Events

Six, down from the longer set. Each one appends a `TimelineEvent` whose Czech summary
comes from `docs/06-copy.md`.

| Event | `data` | Effect |
|---|---|---|
| `flow.started` | `{}` | status → `processing` |
| `context.loaded` | `{ band, medianTimeToFillDays, lastAdWrittenAt }` | fills `context` |
| `draft.ready` | `{ jobAd, screeningCriteria, annualCostMinor, currency, seniorityDetected, inBand, band, note }` | fills `draft`, status → `awaiting_approval`, creates `approval` as pending for `u_petra` |
| `system.updated` | `{ system, status, ref, url }` | updates one entry in `systems` |
| `flow.completed` | `{ outcome }` | status → `open` |
| `flow.failed` | `{ step, message }` | status → `failed`, message on the timeline |

`screeningCriteria` must be exactly five strings. If the flow sends more, take the
first five and log it. `jobAd` is Czech markdown.

There is no `approval.requested` event: with a single fixed approver, `draft.ready`
is enough to put it in front of Petra. There is no `approval.decided` event either,
because the app is where the decision is made. See below.

## The human decision

Petra decides in Peoplebase, so the app knows first and tells the flow.

`POST {APPMIXER_DECISION_URL}`, same signing header:

```json
{
  "requestId": "V1StGXR8_Z5jdHi6B",
  "publicId": "POZ-2026-014",
  "decision": "approved",
  "decidedBy": { "id": "u_petra", "name": "Petra Málková" },
  "comment": null,
  "decidedAt": "2026-10-01T07:15:44.002Z"
}
```

`comment` is required when `decision` is `declined`.

The app updates its own state optimistically and does not wait for a confirmation.
The flow resumes and sends `system.updated` events as usual. On a decline, the flow
sends nothing further and the app is already terminal.

Same never throw rule as the trigger: 5 second timeout, failure logs to the timeline
and the UI still moves.

## Scripted mode

`lib/scripted-run.ts` replays this sequence against the store, with delays:

```
0.6s  flow.started
2.1s  context.loaded
6.4s  draft.ready
      (waits for the human, no timeout)
1.2s  system.updated  ats
2.4s  system.updated  job_board
3.1s  system.updated  slack
4.0s  system.updated  drive
4.6s  flow.completed
```

Timed to feel like real work without dead air. It goes through the same reducer as
the real callbacks, so there is exactly one code path that changes state.

The draft content is in `data/scripted-draft.md`, the same text as the approval
mockup, so the two never disagree on stage.
