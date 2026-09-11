# Peoplebase demo, starter pack

Everything needed to vibecode the Innovation Week demo app. No application code yet,
on purpose: the spec, the copy, the data and the Appmixer contract exist before the
first line, so nothing gets invented twice and then rewritten.

## How to start

1. Put this folder somewhere sensible and `git init` it.
2. `cp .env.example .env.local` and fill in what you have. Leave the Appmixer
   variables blank for now, the app falls back to scripted mode.
3. Open Claude Code in this folder.
4. Open `PROMPTS.md` and paste **Step 0**. Nothing else.
5. Work through the steps in order, checking the "done when" line each time.

Claude Code reads `CLAUDE.md` on its own. That file points at everything else.

## The three decisions baked in

**The app is Czech.** Every visible string, with diacritics. Code stays English. All
Czech text lives in `lib/copy.ts` and comes from `docs/06-copy.md`, so it can be
proofread in one place rather than hunted through components.

**The form is the only Appmixer surface.** No embedded designer, no template gallery,
no chat, no automations settings page. The manager fills in a form and the automation
happens out of sight. That is the point of this example.

**One approver.** Petra decides, two buttons, no second approver and no "request
changes" path. The demo has to show that a human decides, not how an approval matrix
works.

## What is here

```
CLAUDE.md                  the rules Claude Code follows, read first
PROMPTS.md                 eight prompts, in order, paste one at a time
.env.example               every variable, with the tunnel note

docs/00-brief.md           the story on stage and what is in scope
docs/01-screens.md         four routes, spelled out screen by screen
docs/02-data-model.md      types, status machine, the store interface
docs/03-design-system.md   tokens, type scale, components, lifted from the mockups
docs/04-appmixer-integration.md   the contract, both directions. The important one.
docs/05-demo-script.md     three minute stage script, Czech, written to be read aloud
docs/06-copy.md            every Czech string in the app
docs/07-appmixer-flow.md   what to build on the Appmixer side
docs/mockups/*.html        four reference renders, open them in a browser

data/seed.json             two people, three teams, nine bands, five past requests
data/scripted-draft.md     the canned Czech agent output for when the network is off
data/build_seed.py         regenerates seed.json if it drifts
```

`docs/mockups/designer.html` is the workflow as built in Appmixer. It is **not** built
in this app. It is there so whoever writes the code understands what the backend is
doing, and so the flow on the slide and the flow in the contract cannot drift apart.

## The two things that will bite you

**The tunnel.** Appmixer runs in the cloud and the app runs on your laptop, so the
callbacks need a public hostname. `cloudflared tunnel --url http://localhost:3000`,
paste the hostname into `APP_PUBLIC_URL`, restart. It changes every time the tunnel
restarts. When the timeline stalls on stage, this is why.

**Diacritics.** The agent writes Czech. Check the whole chain end to end early:
form, trigger payload, agent output, callback, store, screen. One `latin1` in the
middle and the job ad reads like a fax from 1998.

## Technical decisions already made

Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn primitives. No
database, no auth, one tenant, a two person switcher instead of login. State behind a
two driver store: a JSON file locally, Upstash Redis when deployed. The detail page
polls every 1500ms rather than using websockets, because polling cannot half fail in
front of an audience.

To change any of these, change them now, before step 0, and update `CLAUDE.md` in the
same commit.
