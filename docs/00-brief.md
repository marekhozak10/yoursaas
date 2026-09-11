# Brief

## The story on stage

Alpina Hotels Group runs eleven properties in Prague, Vienna and Bratislava. Their HR
team uses **Peoplebase**, an HR platform. Peoplebase has Appmixer embedded inside it,
and one of the automations built on it starts with a form.

1. Jana Dvorakova, director of operations, needs a revenue manager. She opens
   Peoplebase and fills in six fields. She has never heard of Appmixer.
2. The workflow pulls the context she should not have to look up: the approved salary
   band, the last three ads for her team, the median time to fill.
3. An AI agent turns her three sentences of free text into a job ad in the company
   voice, five screening criteria, and a fully loaded annual cost.
4. One person decides. Petra Malkova, the HR business partner, approves or declines.
   Nothing is published until she clicks.
5. On approval, four systems open in parallel: the ATS opening, the job board
   posting, the hiring channel, the scorecard folder. The status goes back into
   Peoplebase.

The line that closes it: nobody in this flow opened an automation tool.

## The one design constraint

**The form is the only Appmixer surface in this app.** No designer, no template
gallery, no chat, no automations settings page. The manager interacts with a form and
nothing else, and the automation happens out of sight. That is the whole point of
this particular example, and adding any other Appmixer UI would weaken it.

## What this repo is

The Peoplebase side only: the form, the request list, the request detail with a live
timeline, and the approval screen. The workflow itself lives in Appmixer and is not
in this repo.

## What this repo is not

Not a real HR product. No auth, no multi tenancy, no permissions. One tenant, two
seeded people, a switcher instead of login. No English.

## Success criteria

- From "Odeslat požadavek" to the approval card: under 20 seconds.
- The detail page shows the workflow progressing without a refresh.
- The whole run works with the network unplugged, in scripted mode, identically.
- It resets to a clean state in one command between rehearsals.

## Visual reference

`docs/mockups/` holds the approved renders. Match them closely.

- `form.html` — the form, the screen that starts everything
- `approval.html` — the approval card, the payoff screen
- `designer.html` — the workflow as built in Appmixer. Reference only, **not built
  in this app**, it is there so you understand what the backend is doing.
- `flow.html` — the five step diagram for the slide, not built here

## People in the demo

| Name | Role | Used for |
|---|---|---|
| Jana Dvořáková | ředitelka provozu, střední Evropa | fills in the form |
| Petra Málková | HR partnerka | the only approver |

Two people. That is the whole cast, and it is deliberate: one asks, one decides.
