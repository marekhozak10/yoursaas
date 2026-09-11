# Design system

Lifted from the approved mockups in `docs/mockups/`. Use these values exactly. Do not
round them to a 4px grid, do not substitute Tailwind defaults, do not add colors.

**Czech text is longer.** Labels that fit in English will wrap. Check every screen at
1920x1080 before calling it finished, give table headers and stat tiles room, and let
long words break rather than overflow (`overflow-wrap: anywhere` on stat labels).
Never squeeze the type size to make something fit, change the layout instead.

## Fonts

Plus Jakarta Sans for everything. JetBrains Mono for references, IDs, and cost
figures. Both from Google Fonts via `next/font/google`.

```
--font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI', sans-serif
--font-mono: 'JetBrains Mono', ui-monospace, monospace
```

Body gets `-webkit-font-smoothing: antialiased`.

## Tokens

Drop this into `app/globals.css` as a Tailwind v4 `@theme` block.

```css
@theme {
  /* ink */
  --color-ink:        #1b1a17;
  --color-ink-soft:   #3a3730;
  --color-muted:      #6f6b62;
  --color-faint:      #969187;

  /* surfaces */
  --color-surface:    #ffffff;
  --color-canvas:     #faf9f7;
  --color-sunken:     #f5f4f0;
  --color-well:       #f3f1ec;

  /* lines */
  --color-line:       #e3e0d9;
  --color-hairline:   #eceae4;
  --color-input:      #dcd8d0;

  /* brand, Peoplebase */
  --color-brand:        #12655f;
  --color-brand-hover:  #0d4d48;
  --color-brand-soft:   #e4efec;
  --color-brand-line:   #cfe2dd;
  --color-brand-ink:    #125b56;

  /* agent, everything the AI produced */
  --color-agent:        #9a5548;
  --color-agent-soft:   #f6eae6;
  --color-agent-tint:   #fbf3f0;
  --color-agent-line:   #ecd9d3;
  --color-agent-ink:    #7b5449;

  /* states */
  --color-ok:           #2f6b4a;
  --color-ok-soft:      #e6f1ea;
  --color-ok-line:      #cfe5d9;
  --color-danger:       #9c3b32;
  --color-danger-soft:  #f7eae8;
  --color-danger-line:  #eed6d2;
  --color-wait:         #8a6a1c;
  --color-wait-soft:    #f6efdd;
  --color-wait-line:    #e8dcbe;

  --radius-chip: 6px;
  --radius-ctl:  7px;
  --radius-field:8px;
  --radius-card: 9px;
  --radius-panel:12px;

  --shadow-card:   0 1px 2px rgb(27 26 23 / 0.05);
  --shadow-raised: 0 6px 16px rgb(27 26 23 / 0.10);
}
```

The agent color is load bearing. Anything the AI wrote or decided is terracotta.
Anything a human decided is brand teal. Keep that rule and the demo explains itself.

## Type scale

| Use | Size | Weight | Tracking |
|---|---|---|---|
| Page title | 23px | 700 | -.025em |
| Section heading | 15px | 700 | -.02em |
| Card title | 12.5px | 700 | -.01em |
| Body | 12.5px | 400 | 0, line-height 1.6 |
| Field label | 11px | 600 | 0 |
| Small / helper | 11px | 400 | 0 |
| Eyebrow | 9px | 700 | .1em, uppercase |
| Stat number | 22px | 700 | -.02em |

Yes, the base size is small. It is a dense B2B product on a projector, and the
mockups are calibrated for it. Do not scale it up.

## Components

**Buttons.** Primary: brand fill, white text, 12px/600, padding 12px 22px, radius 8.
Secondary: white, 1px `--color-input` border, ink text, padding 8px 16px, radius 7.
Ghost: muted text, no border. Minimum height 36px, 44px on the form's submit.

**Inputs.** White, 1px `--color-input`, radius 8, padding 11px 13px, 12.5px text.
Focus: 1px brand border plus a 3px `--color-brand-soft` ring. Error: danger border,
message underneath at 11px in danger.

**Segmented control.** One row, 1px border, radius 8, dividers `--color-hairline`.
Selected segment gets brand fill and white 600 text.

**Cards.** White, 1px `--color-line`, radius 12, padding 20px, `--shadow-card`.
The draft panel uses a 1.5px `--color-agent` border and `--color-agent-tint` fill.

**Status pills.** 9px/700 uppercase, .09em tracking, radius 4, padding 2px 6px,
1px border.

| Status | Label | Colors |
|---|---|---|
| `submitted` | Odesláno | muted on well |
| `processing` | Probíhá | wait |
| `awaiting_approval` | Čeká na schválení | agent |
| `approved` | Schváleno | ok |
| `open` | Otevřeno | ok |
| `declined` | Zamítnuto | danger |
| `failed` | Chyba | danger |

**Timeline.** 1px vertical rule in `--color-line` at x=7px. Each event: a 7px dot
(brand for human actions, agent for AI, `--color-faint` for system), a 12.5px/600
summary, then actor and time at 11px muted. Newest at the bottom. A 1.5s fade in on
arrival, nothing bouncier than that.

**Avatars.** 26px circle, `#e8e4dc` fill, 9.5px/700 initials in `#6c665c`.

## Motion

One rule: new information fades in over 250ms with a 6px rise. No spinners longer
than 400ms, no skeleton screens, no progress bars. The timeline is the progress bar.
