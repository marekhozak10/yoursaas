# Peoplebase demo app

Read `docs/00-brief.md` before your first change. The docs in `docs/` are the source
of truth for this repo. If something here contradicts them, they win, and you should
say so instead of guessing.

## What this is

A fake HR platform called **Peoplebase**, built for one purpose: a live demo at a
conference in Prague. A hiring manager fills in a six field form, an Appmixer
workflow picks it up, an AI agent drafts the job ad, one person approves it, and four
systems get provisioned.

The form is the only place the user touches the automation. Nothing else from
Appmixer is embedded: no workflow designer, no template gallery, no chat. The
workflow runs entirely in the background. Do not build UI for any of it.

## Language

**The whole application is in Czech.** Every visible string: labels, buttons, status
names, timeline entries, empty states, validation errors, dates. Czech with full
diacritics, never stripped.

Code stays English: identifiers, types, status keys, file names, comments, commit
messages, API fields. Only what a user reads is Czech.

Czech strings are longer than English ones and inflect. Two consequences: never build
a sentence by concatenating fragments, always use a complete phrase per case, and
check that nothing wraps badly at 1920x1080 before calling a screen finished. Dates
render as `1. listopadu 2026`, times as `9:14`, money as `1,86 mil. Kč`.

Every user visible string comes from `docs/06-copy.md`. Do not invent one, and do not
translate an English one yourself. If a string is missing, add it to that file first
and tell me.

## Stack

- Next.js 15, App Router, TypeScript strict
- Tailwind v4 with the tokens in `docs/03-design-system.md`
- shadcn/ui primitives only: button, input, select, textarea, dialog, badge
- No database. State lives behind `lib/store.ts` with two drivers: `file`
  (`data/store.json`, local) and `redis` (Upstash REST, deployed). `STORE_DRIVER` picks.
- No auth. A two person switcher in the top bar sets a cookie.

## Rules

1. **Never invent Appmixer behaviour.** The trigger payload and every callback event
   are in `docs/04-appmixer-integration.md`. If the flow needs something not in that
   doc, add it to the doc first and say so.
2. **All reads and writes go through `lib/store.ts`.** No `fs` calls elsewhere.
3. **Server Components by default.** `'use client'` only for the form, the person
   switcher, the polling detail view and the approval buttons.
4. **No new dependencies** beyond next, react, tailwindcss, the shadcn primitives,
   zod, nanoid, date-fns and @upstash/redis. Anything else, ask.
5. **Every outbound call to Appmixer has a 5 second timeout** and falls back to
   scripted mode rather than throwing. A failed call must never leave a spinner up.
6. **Do not build**: auth, dark mode, English, a settings area, an embedded designer,
   a template gallery, a chat panel, email sending, file uploads, or tests beyond the
   one smoke test in the last step.
7. `npm run reset` restores `data/store.json` from `data/seed.json`. Never edit or
   delete `data/seed.json`.
8. Commit after each numbered step in `PROMPTS.md`, with the step number in the message.

## Demo safety

`DEMO_MODE=live` calls the real Appmixer flow. `DEMO_MODE=scripted` replays the event
sequence in `lib/scripted-run.ts` with realistic delays and never touches the network.
Both paths produce an identical UI, because scripted mode is the backup if the venue
wifi is bad. Build it at step 7, not at the end.

## Conventions

- Times stored as ISO 8601 UTC, rendered in Europe/Prague.
- Money stored in minor units (haléře) with an explicit currency code.
- IDs: `nanoid()` internally, plus a human `publicId` like `POZ-2026-014`.
- Status values are the exact English keys in `docs/02-data-model.md`. Their Czech
  labels live in one map, in one file.
- Server actions for form mutations, route handlers for anything Appmixer calls.
