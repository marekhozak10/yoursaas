# Screens

Four routes. Nothing else ships. All Czech, strings from `docs/06-copy.md`.

## Shell

Top bar, 56px, white, 1px bottom border.

- Left: Peoplebase mark (24px rounded square, brand fill, chevron glyph) plus
  wordmark, a vertical divider, then the section name.
- Right: tenant name "Alpina Hotels Group" in muted text, then the **person
  switcher**: an avatar circle with initials that opens a two item menu, Jana and
  Petra. Picking one sets the `pb_person` cookie and reloads.
- Sections in the bar: Požadavky, Ke schválení. The second shows a count badge when
  the current person has something pending, which only ever happens for Petra.

The switcher is what makes the demo work: submit as Jana, switch to Petra, approve,
switch back. Two clicks, no confirmation dialog.

## `/`

Redirect to `/pozadavky`. Use Czech route segments, they are visible in the URL bar
on a projector.

## `/pozadavky` — the list

Page title "Požadavky na pozice", primary button "Nový požadavek" top right.

Table, newest first:

| Column | Notes |
|---|---|
| Číslo | `POZ-2026-014`, mono, muted |
| Pozice | title in ink, team underneath in muted |
| Žadatel | initials avatar plus name |
| Stav | status pill |
| Aktualizováno | relative Czech, "před 3 minutami" |

Row click opens the detail. Filter chips above: Vše, Probíhá, Ke schválení, Otevřené,
Zamítnuté. No search, no pagination, the seed has five rows.

## `/pozadavky/novy` — the form

Matches `docs/mockups/form.html` exactly. Six fields, in this order:

1. **Tým** — select, options from the seeded teams
2. **Název pozice** — text, required
3. **Seniorita** — segmented control: Junior, Medior, Senior, Lead
4. **Nástup od** — date, defaults to the first of the month two months out
5. **Lokalita** — text, defaults to "Praha, hybridně"
6. **Proč tuto pozici a proč teď** — textarea, required, min 40 characters, helper
   text underneath

Buttons "Odeslat požadavek" and "Zrušit". Validation with zod, errors inline under
the field in the danger color, no toast.

On submit: create the request with status `submitted`, fire the Appmixer trigger,
redirect straight to the detail page. Do not await the trigger before redirecting.

Keep the muted footer line from the mockup. It is part of the narration.

## `/pozadavky/[id]` — the detail

The screen Marek stands on for most of the demo. Two columns, 2fr and 1fr.

**Header**: number, position title as the page title, team and location underneath,
status pill on the right. When the status is `open`, four small system chips.

**Left column, each block appearing as the workflow reports it:**

1. **Požadavek** — what Jana submitted, as a definition list. Always visible.
2. **Kontext** — on `context.loaded`. Three stat tiles: mzdové pásmo, medián doby
   obsazení, poslední inzerát týmu.
3. **Návrh** — on `draft.ready`. Agent accent. The job ad in a scrollable panel, the
   five criteria as chips, the annual cost. This is the moment, give it room.
4. **Rozhodnutí** — on `approval.requested`. When the current person is Petra and her
   decision is pending, render the approval card from `docs/mockups/approval.html`
   with both buttons live. For Jana, the waiting state.
5. **Systémy** — on the first `system.updated`. Four cards in a 2x2 grid: ATS,
   job board, náborový kanál, složka se scorecardy. Status dot, reference, a link
   that goes nowhere. They fill in one by one, not at once.

**Right column**: the **timeline**. Newest at the bottom, auto scrolled. A dot on a
vertical rule, a bold one line summary, the actor, the time to the second. This is
what proves it is live, so do not make it subtle.

**Polling**: a client component polls `GET /api/pozadavky/[id]` every 1500ms while
the status is not terminal (`open`, `declined`, `failed`), then stops. A small "Živě"
indicator in the timeline header while polling, "Hotovo" after.

## `/ke-schvaleni` — approvals

Requests where the current person has a pending decision. Empty state otherwise. Each
entry is the approval card, inline, with the two buttons.

"Schválit" goes through immediately. "Zamítnout" opens a small dialog asking for one
line of reason, which is required.

That is the whole approval process. One person, two buttons, no second approver, no
"request changes" path. It was simplified on purpose: the demo has to show that a
human decides, not how an approval matrix works.
