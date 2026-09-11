# The Appmixer side

Not in this repo, but the demo does not work without it. The shopping list for
whoever builds the flow, written against `docs/04-appmixer-integration.md`.
`docs/mockups/designer.html` shows the same thing laid out on a canvas.

Confirm every component name against the current connector library first. The names
below say what the flow must do, not what a component is called.

## Components, in order

1. **Webhook trigger.** Receives the payload in the integration doc. Its URL becomes
   `APPMIXER_TRIGGER_URL`. Verify `X-Peoplebase-Signature` if the flow can.

2. **Callback helper.** A pattern, not a component: an HTTP request back to
   `callbackUrl` with the bearer token from the payload. Used after almost every
   step, so build it once and copy it. Six calls in total.

3. `flow.started`, immediately.

4. **Context.** Two reads:
   - the salary band for `team.id` plus `role.seniority`
   - the last three job ads for that team
   For the demo these can be an HTTP request to a small JSON endpoint you host, or a
   Google Sheet. It does not have to be a real HRIS. It does have to be a real call.

5. `context.loaded`.

6. **AI agent.** The instructions are in the inspector panel of
   `docs/mockups/designer.html`, in Czech. Use that text. Tools: mzdová pásma,
   minulé inzeráty, model nákladů.
   It must return the exact `AiDraft` shape from `docs/02-data-model.md`, with
   exactly five criteria, and it must write **in Czech**. Pin the output to that
   schema rather than parsing prose. Make sure nothing in the chain strips diacritics.

7. `draft.ready` with the agent's output. This is what puts it in front of Petra.

8. **Wait.** The flow pauses here. The app owns the decision.

9. **Second webhook**, `APPMIXER_DECISION_URL`, receiving the decision payload from
   the integration doc. On `declined` the flow stops and sends nothing further. On
   `approved` it continues.

10. **Fan out**, four branches, each followed by its own `system.updated`:
    - create the opening in the ATS
    - publish the ad to a job board
    - create the Slack channel and invite the panel
    - copy the scorecard folder from a template in Google Drive
    Stagger them by a second or two. Four cards appearing at once reads as fake.

11. `flow.completed`.

12. **Error path.** Any step that fails sends `flow.failed` with the step name and a
    one line Czech message, then stops.

That is eleven components plus the callbacks. It fits on one screen in the designer,
which is the point: if a screenshot of the flow needs scrolling, it is too big for
the slide.

## Before the rehearsal

- The flow is live, not a draft.
- `APPMIXER_TRIGGER_URL` and `APPMIXER_DECISION_URL` in `.env.local` match it.
- The signing secret is identical on both sides.
- `APP_PUBLIC_URL` is the current tunnel hostname. It changes every time the tunnel
  restarts, and it is the single most likely thing to break on the day.
- The agent's output really is Czech, with diacritics, end to end.
- Run it twice and check every timeline summary reads the way `docs/06-copy.md` says.
