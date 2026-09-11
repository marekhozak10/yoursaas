# Build order

Eight steps. Paste them one at a time into Claude Code, in this order, and check the
"done when" line before moving on.

Do not paste two at once. The reason this order works is that the data, the copy and
the contract exist before any screen is built, so nothing gets invented twice.

---

## Step 0. Scaffold

> Set up a new Next.js 15 app in this directory. TypeScript strict, App Router,
> Tailwind v4, `src/` directory, import alias `@/*`. Then add shadcn/ui and install
> only these primitives: button, input, textarea, select, badge, dialog,
> dropdown-menu. Install zod, nanoid, date-fns and @upstash/redis. Set up Plus
> Jakarta Sans and JetBrains Mono with next/font/google. Set the html lang to `cs`
> and configure date-fns with the Czech locale as the default everywhere.
> Do not build any pages yet. Show me the file tree and package.json when done.

**Done when** `npm run dev` serves the default page and the fonts load.

---

## Step 1. Design system and copy

> Read `docs/03-design-system.md` and `docs/06-copy.md`. Put the token block into
> `app/globals.css` as a Tailwind v4 `@theme` and wire the two fonts. Put every
> Czech string from the copy doc into `lib/copy.ts` as one typed object, including
> the status label map and the timeline summary builders. Nothing anywhere else in
> the codebase contains a Czech string literal.
> Build the primitives in `components/ui-kit/`: `StatusPill`, `Avatar`, `Card`,
> `SectionHeading`, `Eyebrow`, `FieldLabel`, `Stat`. Then `components/shell/TopBar.tsx`
> with the mark, wordmark, section name, tenant and a person switcher that looks
> right but is not wired up yet.
> Finally `app/style-guide/page.tsx` rendering every primitive and every status pill
> on one page so I can compare it to the mockups.

**Done when** `/style-guide` matches the mockups side by side and no Czech string
lives outside `lib/copy.ts`.

---

## Step 2. Types, store, seed

> Read `docs/02-data-model.md`. Write `lib/types.ts` with those types and zod schemas
> in `lib/schemas.ts`. Write `lib/store.ts` with the `StoreDriver` interface and two
> drivers: `file` writing `data/store.json` through a temp file and rename, and
> `redis` using a single Upstash key. `mutate()` serialises writes with an in-process
> promise queue. Pick the driver from `STORE_DRIVER`.
> Add `scripts/reset.ts` and an `npm run reset` that restores `data/store.json` from
> `data/seed.json`. Never touch `data/seed.json`.
> Write `lib/person.ts`: read the `pb_person` cookie, default to `u_jana`, expose
> `currentUser()`.

**Done when** `npm run reset` works and a script can read the seeded requests.

---

## Step 3. The list and the detail, static

> Read `docs/01-screens.md`. Build `/pozadavky` and `/pozadavky/[id]` as Server
> Components reading from the store, with no live behaviour yet. The detail renders
> whichever blocks the request has data for, and blocks with no data do not render at
> all. Wire the person switcher so it sets the cookie and reloads.
> Use the seeded history to check every status renders, including the terminal ones
> and a request with no draft.
> Czech dates and relative times throughout, Europe/Prague.

**Done when** every seeded request renders and nothing breaks on a request without a
draft.

---

## Step 4. The form

> Build `/pozadavky/novy` to match `docs/mockups/form.html` exactly: six fields, zod
> validation, inline Czech errors from `lib/copy.ts`. On submit a server action
> creates the request with status `submitted`, appends the `local.submitted` timeline
> event and redirects to the detail page. Nothing calls Appmixer yet.
> Open the mockup file and compare your result to it before telling me it is done.

**Done when** submitting adds a row to the list and lands on a detail page.

---

## Step 5. The Appmixer contract

> Read `docs/04-appmixer-integration.md`. Build both halves.
> Outbound: `lib/appmixer.ts` with `triggerFlow(request)` building the exact payload
> in the doc, signed, 5 second timeout, never throws, and on failure appends
> `local.trigger_failed`. Call it from the submit action after the write, without
> making the redirect wait on it.
> Inbound: `app/api/appmixer/callback/route.ts` verifying the bearer token and the
> signature against the raw body, deduplicating on `eventId`, applying the event
> through a single reducer in `lib/apply-event.ts`. Guard every transition, ignore
> events for terminal requests, never return 500.
> Add `GET /api/pozadavky/[id]` returning the request as JSON.
> All six events, and only those six.

**Done when** I can curl a `flow.started` then a `draft.ready` and see the detail page
change after a refresh.

---

## Step 6. Live and the decision

> Make the detail page poll `GET /api/pozadavky/[id]` every 1500ms while the status
> is not terminal, stopping when it is. Keep the page a Server Component with the
> polling in a small client component that takes the initial request as a prop. New
> timeline events fade in over 250ms with a 6px rise, the list auto scrolls, the
> header shows `Živě` then `Hotovo`. Nothing else animates.
> Then build `/ke-schvaleni` and the live approval block on the detail page, both
> matching `docs/mockups/approval.html`, shown only when the current person is Petra
> and her decision is pending. `Schválit` goes through immediately, `Zamítnout` opens
> the dialog and requires a reason. A decision updates the store optimistically and
> posts to `APPMIXER_DECISION_URL` with the same never throw rule. Add the count
> badge on `Ke schválení` in the top bar.

**Done when** I can submit as Jana, switch to Petra, approve, switch back, and watch
the systems fill in.

---

## Step 7. Scripted mode

> Read the scripted mode section of `docs/04-appmixer-integration.md`. Write
> `lib/scripted-run.ts` replaying that sequence with those delays through the same
> `applyEvent` reducer, using `data/scripted-draft.md`. It pauses before the decision
> and continues when one lands.
> Run it instead of the real trigger when `DEMO_MODE=scripted`, and as the fallback
> when the real trigger fails. Add a small amber `nanečisto` badge in the top bar so
> I can see which mode I am in, readable to me and easy to miss from the audience.

**Done when** the whole demo runs end to end with the network off.

---

## Step 8. The rehearsal pass

> Read `docs/05-demo-script.md` and walk the whole thing yourself. Then fix, in this
> order: anything that differs from the mockups, any Czech text that wraps badly or
> reads like a translation, any moment where the screen sits still for more than two
> seconds with nothing to look at, and any state that survives `npm run reset` when
> it should not.
> Add one smoke test: submit, run scripted mode to the decision, approve, assert the
> request ends `open` with four created systems.
> Then list what you changed and what you still think is fragile.

**Done when** you have walked it twice without deviating from the script.

---

## Not in scope

No embedded designer, no template gallery, no chat panel, no settings area. The
manager touches a form and nothing else. If a step tempts you to add Appmixer UI, it
is the wrong step.
