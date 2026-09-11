# Czech copy

Every user visible string. These are narration: Marek says something on stage and the
screen says the same thing. Do not reword them, do not translate anything new
yourself, and keep the diacritics.

Put them in one module, `lib/copy.ts`, not scattered through components.

## Shell

- Sections: `Požadavky`, `Ke schválení`
- Tenant: `Alpina Hotels Group`
- Switcher menu heading: `Přihlášen jako`
- Scripted mode badge: `nanečisto`

## List

- Title: `Požadavky na pozice`
- Primary button: `Nový požadavek`
- Columns: `Číslo`, `Pozice`, `Žadatel`, `Stav`, `Aktualizováno`
- Filters: `Vše`, `Probíhá`, `Ke schválení`, `Otevřené`, `Zamítnuté`
- Empty: `Zatím tu nic není. První požadavek začíná formulářem.`

## Status labels

| key | label |
|---|---|
| `submitted` | `Odesláno` |
| `processing` | `Probíhá` |
| `awaiting_approval` | `Čeká na schválení` |
| `approved` | `Schváleno` |
| `open` | `Otevřeno` |
| `declined` | `Zamítnuto` |
| `failed` | `Chyba` |

## Form

- Eyebrow: `Nábor`
- Title: `Nový požadavek na pozici`
- Subtitle: `Provoz, střední Evropa. HR partner se vám ozve do dvou pracovních dnů.`
- Labels: `Tým`, `Název pozice`, `Seniorita`, `Nástup od`, `Lokalita`,
  `Proč tuto pozici a proč teď`
- Seniority options: `Junior`, `Medior`, `Senior`, `Lead`
- Helper on the textarea: `čím víc kontextu, tím lepší podklad`
- Buttons: `Odeslat požadavek`, `Zrušit`
- Footer: `Šest polí. Žádný schvalovací řetězec k zapamatování, žádný automatizační nástroj, do kterého se musíte přihlásit, žádný ticket na HR.`

Validation:

- required: `Tohle pole vyplňte.`
- too short: `Napište aspoň pár vět, agent z toho vychází.`
- date in the past: `Datum nástupu musí být v budoucnu.`

## Detail

- Section headings: `Požadavek`, `Kontext`, `Návrh`, `Rozhodnutí`, `Systémy`
- Timeline header: `Živě` while polling, `Hotovo` when terminal
- Request fields: `Tým`, `Seniorita`, `Nástup od`, `Lokalita`, `Zdůvodnění`
- Context tiles: `Mzdové pásmo`, `Doba obsazení`, `Poslední inzerát týmu`
- Context captions: `v rozmezí` / `mimo rozmezí`, `medián, tato pozice`
- Draft eyebrow: `Inzerát, napsaný podle vašich posledních tří`
- Draft link: `Zobrazit celý návrh`
- Criteria heading: `Kritéria pro screening`
- Cost label: `Roční náklad`, caption `včetně odvodů`
- Waiting state: `Dokud někdo neklikne, nikde se nic nezveřejní ani nezaloží.`

## Timeline summaries

One per event. The bracket says whose dot it is.

| Event | Summary |
|---|---|
| `local.submitted` | `Požadavek odeslán` [requester] |
| `flow.started` | `Workflow převzalo požadavek` [workflow] |
| `context.loaded` | `Načteno mzdové pásmo a poslední inzeráty týmu` [workflow] |
| `draft.ready` | `Inzerát napsaný, pět kritérií, spočítaný náklad` [agent] |
| `draft.ready` out of band | `Inzerát napsaný, ale mzda vybočuje z pásma` [agent] |
| `local.approved` | `Petra Málková schválila` [u_petra] |
| `local.declined` | `Petra Málková zamítla` [u_petra] |
| `system.updated` ats | `Pozice založená v ATS` [system] |
| `system.updated` job_board | `Inzerát zveřejněný na job boardu` [system] |
| `system.updated` slack | `Náborový kanál založený, panel pozvaný` [system] |
| `system.updated` drive | `Složka se scorecardy vytvořená ze šablony` [system] |
| `flow.completed` | `Pozice je otevřená` [workflow] |
| `flow.failed` | `Workflow se zastavilo: {message}` [workflow] |
| `local.trigger_failed` | `Workflow nedosažitelné, běží náhradní scénář` [system] |

## Approval card

- Lead line: `Nový požadavek na pozici od {jméno v 2. pádě}, {funkce}. Čeká na tvoje rozhodnutí.`
  Seed the genitive forms in the data rather than deriving them: `Jany Dvořákové`.
- Stat labels: `Mzdové pásmo`, `Roční náklad`, `Doba obsazení`
- Buttons: `Schválit`, `Zamítnout`
- Waiting footer: `Čeká na Petru Málkovou, HR partnerku.`
- Decided footer: `Schválila Petra Málková v {čas}.` / `Zamítla Petra Málková v {čas}.`
- Decline dialog title: `Proč to zamítáte?`
- Decline dialog helper: `Jednou větou. Vrátí se to žadateli.`
- Decline dialog buttons: `Zamítnout požadavek`, `Zpět`

## Systems

- Titles: `Pozice v ATS`, `Inzerát na job boardu`, `Náborový kanál`, `Složka se scorecardy`
- Pending caption: `čeká`
- Done captions: `založeno`, `zveřejněno`, `založen, pozváno 6 lidí`, `vytvořeno ze šablony`
- Failed caption: `nepovedlo se`

## Approvals page

- Title: `Ke schválení`
- Empty: `Nic na vás nečeká.`

## Dates and numbers

- Dates: `1. listopadu 2026`
- Times: `9:14`
- Relative: `před 3 minutami`, `před hodinou`, `včera`
- Money: `1,86 mil. Kč` for the annual figure, `95 000 až 120 000 Kč` for a band
- Never abbreviate months, never use an English locale by accident
