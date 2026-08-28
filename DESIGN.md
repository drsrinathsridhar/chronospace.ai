---
version: alpha
name: ChronoSpace
description: Instrument-panel design system for a 4D physical-world capture platform — near-black canvas, hairline structure, a single orange signal colour.
colors:
  # Published Figma fill styles (exact, from the file's own Colors board)
  c-black: "#090B19"
  c-white: "#FFFFFF"
  grey: "#EDEDED"
  c-orange-500: "#F25324"
  c-orange-600: "#D13E13"
  pink-500: "#E61876"
  c-blue-900: "#30323E"
  c-blue-500: "#1C29A2"
  c-blue-300: "#777CAD"
  c-blue-200: "#B7B9FF"
  c-black-18p: "#090B192E"
  c-black-8p: "#090B1914"
  c-white-16p: "#FFFFFF29"
  # Derived from usage — consistent across pages but not published as styles
  c-white-32p: "#FFFFFF52"
  c-grid-line: "#1B1C25"
  gradient-thermal-from: "#FD7A39"
  gradient-thermal-to: "#EC168F"
typography:
  t-heading-1:
    fontFamily: Nippo
    fontSize: 56px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-heading-2:
    fontFamily: Nippo
    fontSize: 48px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-heading-3:
    fontFamily: Nippo
    fontSize: 40px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-heading-4:
    fontFamily: Nippo
    fontSize: 32px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-heading-5:
    fontFamily: Nippo
    fontSize: 24px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-heading-6:
    fontFamily: Nippo
    fontSize: 20px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: -0.02em
  t-paragraph-lead:
    fontFamily: Supreme
    fontSize: 32px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  t-paragraph-1:
    fontFamily: Supreme
    fontSize: 20px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  t-paragraph-2:
    fontFamily: Supreme
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  t-paragraph-3:
    fontFamily: Supreme
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  t-paragraph-4:
    fontFamily: Supreme
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  t-paragraph-light:
    fontFamily: Supreme
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: 0em
  t-label-1:
    fontFamily: Nippo
    fontSize: 16px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: 0em
    textTransform: uppercase
  t-label-2:
    fontFamily: Nippo
    fontSize: 14px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: 0em
    textTransform: uppercase
  t-label-3:
    fontFamily: Nippo
    fontSize: 12px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: 0em
    textTransform: uppercase
  t-label-4:
    fontFamily: Nippo
    fontSize: 10px
    fontWeight: 378
    lineHeight: 1.1
    letterSpacing: 0em
    textTransform: uppercase
rounded:
  none: 0px
spacing:
  3xs: 2px
  2xs: 4px
  xs: 8px
  sm: 16px
  gutter: 20px
  md: 24px
  lg: 32px
  xl: 40px
  2xl: 48px
  3xl: 60px
  4xl: 80px
layout:
  container: 1416px
  viewport: 1496px
  margin-desktop: 40px
  margin-mobile: 16px
  columns-desktop: 12
  columns-mobile: 4
  gutter: 20px
  hairline: 1px
motion:
  easing:
    fluid: cubic-bezier(0.61, 0, 0.2, 1)
  duration:
    hover: 400ms
    scene: 1000ms
components:
  page:
    background: "{colors.c-black}"
    color: "{colors.c-white}"
  button:
    background: "{colors.c-orange-500}"
    backgroundHover: "{colors.c-orange-600}"
    color: "{colors.c-white}"
    typography: "{typography.t-label-1}"
    radius: "{rounded.none}"
    height: 66px
    paddingInline: "{spacing.sm}"
    iconSize: 14px
    transition: "{motion.duration.hover} {motion.easing.fluid}"
  navbar:
    height: 60px
    background: "{colors.c-black}"
    borderColor: "{colors.c-blue-900}"
    borderBottomColor: "{colors.c-white-16p}"
    color: "{colors.c-white}"
    typography: "{typography.t-label-3}"
    cellPaddingInline: "{spacing.md}"
    ctaBackground: "{colors.c-orange-500}"
  card:
    background: "{colors.c-black}"
    borderColor: "{colors.c-blue-900}"
    radius: "{rounded.none}"
    headerPadding: "{spacing.lg}"
    mediaPadding: "{spacing.md}"
    footerPaddingBlock: "{spacing.xl}"
    footerPaddingInline: "{spacing.lg}"
    dividerColor: "{colors.c-blue-900}"
  eyebrow:
    background: "{colors.c-blue-900}"
    color: "{colors.c-white}"
    typography: "{typography.t-label-3}"
    paddingBlock: 3px
    paddingInline: 6px
    gap: "{spacing.sm}"
    glyphColor: "{colors.c-white-32p}"
  viewport-frame:
    background: "{colors.c-black}"
    borderColor: "{colors.c-blue-300}"
    crosshairColor: "{colors.c-grid-line}"
    reticleColor: "{colors.c-orange-500}"
    reticleSize: 13px
    inset: "{spacing.md}"
  telemetry-readout:
    keyColor: "{colors.c-white-32p}"
    valueColor: "{colors.c-orange-500}"
    typography: "{typography.t-label-4}"
    rowGap: "{spacing.2xs}"
  rule:
    color: "{colors.c-blue-900}"
    thickness: "{layout.hairline}"
    tickColor: "{colors.c-orange-500}"
    tickSize: 6px
---

## Overview

ChronoSpace records the physical world in 4D. The design system is built to look
like the readout of the instrument that does the recording, not like a marketing
site about it.

Three decisions carry the whole identity:

1. **Near-black canvas, never pure black.** `c-black` `#090B19` is a blue-shifted
   black. It sits under the blue/orange capture imagery without the imagery
   looking pasted onto a void, and it keeps the dark UI from feeling like an OLED
   test card.
2. **Zero radius, hairline structure.** Nothing in the entire file is rounded and
   nothing casts a shadow. Structure is communicated with 1px `c-blue-900` rules
   and orange tick marks — the vocabulary of a measurement overlay. Softness
   would read as "app"; the product is an instrument.
3. **One signal colour.** `c-orange-500` `#F25324` is the only colour allowed to
   mean _action_ or _live value_. Everything else is black, white, or a muted
   blue-grey. Because the accent is rationed, a single orange word in a headline
   carries the whole page.

The system is a **dark system only** — there is no light theme. The one light
surface in the file is the favicon-on-light artboard.

## Colors

The palette is published as Figma fill styles and documented on the file's own
Colors board; the values below are taken verbatim from it.

**Foundation**

| Token         | Value       | Role                                                                                                                                                                              |
| ------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `c-black`     | `#090B19`   | Page canvas, card fills, nav cells. The default surface.                                                                                                                          |
| `c-white`     | `#FFFFFF`   | Primary text, logo, icons.                                                                                                                                                        |
| `c-white-32p` | `#FFFFFF52` | Secondary/meta text — eyebrow glyphs, `(Applications)`, `BACKED BY`, telemetry keys. This is the muted-text colour of the system and it appears far more often than `c-blue-300`. |
| `c-blue-900`  | `#30323E`   | The structural colour: every hairline rule, card border, nav-cell border, and the eyebrow chip fill.                                                                              |

**Accent**

| Token          | Value     | Role                                                                                |
| -------------- | --------- | ----------------------------------------------------------------------------------- |
| `c-orange-500` | `#F25324` | The signal. Buttons, live values, reticle marks, the emphasised word in a headline. |
| `c-orange-600` | `#D13E13` | Hover/pressed state of `c-orange-500` only. Never a resting fill.                   |

**Support** — present in the palette, used sparingly

| Token        | Value     | Role                                                                                   |
| ------------ | --------- | -------------------------------------------------------------------------------------- |
| `c-blue-300` | `#777CAD` | Border of the viewport/capture frame.                                                  |
| `c-blue-200` | `#B7B9FF` | Diagram and annotation strokes.                                                        |
| `c-blue-500` | `#1C29A2` | Deep blue, palette-only in the current pages.                                          |
| `pink-500`   | `#E61876` | Palette-only in the current pages; relates to the magenta end of the capture gradient. |
| `grey`       | `#EDEDED` | Palette-only; reserved for light surfaces.                                             |

**Alpha tokens** — for overlays on top of imagery, where a solid fill would block the capture texture.

`c-black-18p` `#090B192E` · `c-black-8p` `#090B1914` · `c-white-16p` `#FFFFFF29`
(the navbar's bottom edge) · `c-white-32p` `#FFFFFF52`.

**The capture gradient.** Subject imagery is tinted with a linear gradient from
`#FD7A39` to `#EC168F` — orange through to magenta, the false-colour ramp of a
thermal or depth capture. This is the one place the system is allowed to be
saturated and loud, and it is always applied to photography, never to UI.

`c-grid-line` `#1B1C25` is the crosshair inside the viewport frame. It is
deliberately only a few percent lighter than the canvas: present when you look
for it, invisible when you don't.

## Typography

Two families, and the split between them is strict.

**Nippo** (Fontshare, variable) — every heading and every label. Nippo is a
geometric sans with slightly mechanical, drawn-with-a-compass letterforms; it is
what makes the brand read as _instrument_ rather than _startup_. Figma reports
weight **378**, which is the Regular instance of the variable font. Set
`font-weight: 378` against the variable file; if only the static Regular is
available, 400 is the correct substitute.

**Supreme** (Fontshare) — every paragraph. Supreme is quieter and more neutral
than Nippo, so body copy recedes and the headline keeps the voice.

The two families are never mixed within a single text block, and Supreme is
never used for a heading or a label.

**Headings** — Nippo, line-height `1.1`, letter-spacing `-0.02em` at every size.
The negative tracking is uniform across the ramp, so headings tighten
proportionally as they grow rather than needing per-size correction.

`t-heading-1` 56px · `t-heading-2` 48px (the workhorse — section and hero
headlines) · `t-heading-3` 40px (mobile hero) · `t-heading-4` 32px ·
`t-heading-5` 24px · `t-heading-6` 20px.

**Paragraphs** — Supreme, line-height `1.2`, letter-spacing `0`.

`t-paragraph-lead` 32px · `t-paragraph-1` 20px (standard body) · `t-paragraph-2`
16px · `t-paragraph-3` 14px · `t-paragraph-4` 12px · `t-paragraph-light` 18px
Light 300, used for card body copy where the text must sit under a heading
without competing.

**Labels** — Nippo, **always uppercase**, line-height `1.1`, letter-spacing `0`.
Labels do not use negative tracking; uppercase needs the room.

`t-label-1` 16px (primary button) · `t-label-2` 14px (secondary button) ·
`t-label-3` 12px (navigation, eyebrows, `BACKED BY`) · `t-label-4` 10px (machine
readouts — timecodes, telemetry keys and values, section markers).

Only `t-heading-1…6`, `t-paragraph-1…4` and `t-label-1` exist as published Figma
text styles. `t-label-2/3/4`, `t-paragraph-lead` and `t-paragraph-light` are
derived from consistent, high-volume usage across the live pages — the 12px and
10px labels alone account for over 120 text nodes and are the most-used type in
the interface. Treat them as first-class.

> **Do not use the `mobile/*` Figma text styles.** The file still contains a set
> of `mobile/t-heading/*` and `mobile/t-paragraph/*` styles built on **Switzer**
> and **Geist Mono**. They are unreferenced by any node, including the mobile
> artboard, and are leftovers from a superseded brand direction. The mobile
> layouts use the same Nippo/Supreme `desktop/*` styles as the desktop layouts.

## Layout

**Grid.** 12 columns, 20px gutters, 40px page margins, stretched. At the 1496px
design viewport this gives a 1416px content container and a 99.67px column.
Mobile is 4 columns, 20px gutters, 16px margins at a 375px viewport.

**Full-bleed vs. contained.** Section backgrounds, capture imagery, and the
horizontal rules that separate sections run the full 1496px bleed. Everything
readable is confined to the 1416px container. This is what produces the
signature look of a rule running edge-to-edge past the text it belongs to.

**Vertical rhythm.** Sections are tall and unequal — 680px for a CTA, 820–1059px
for heroes, 1339–1362px for content sections. Height follows content; there is
no fixed section height. Within a section the stack gaps are `2 / 4 / 8 / 16 /
20 / 24 / 32 / 40 / 48 / 60 / 80`, with **24px the default block gap** and 16px
the standard label-to-content gap. The two small steps are specific: `2px` is the
mobile seam between a headline and the word that completes it, and `20px` is the
grid gutter, reused as the capture frame's inset.

10px gaps appear throughout the Figma file on single-child auto-layout frames —
these are Figma's default and carry no layout meaning. Ignore them.

**Border collapse.** Adjacent bordered elements (navbar cells, stacked card
rows) are laid out with a **−1px gap** so their 1px borders overlap into a single
shared hairline. Reproduce this in code with negative margins or
`border-collapse` semantics — doubled 2px borders are a fidelity failure.

## Elevation & Depth

**There are no shadows and no blurs anywhere in the live design.** Depth is not
simulated.

Layering is instead communicated by three means:

- **Hairlines.** A 1px `c-blue-900` border is the entire vocabulary for "this is
  a separate surface."
- **Alpha over imagery.** Where a panel sits on top of capture imagery it uses
  `c-black-18p` / `c-black-8p` rather than a solid fill, so the texture stays
  legible underneath.
- **The imagery itself.** The blue/orange "echo repeater" backgrounds carry all
  the atmospheric depth on a page. UI stays resolutely flat on top of them.

If a component needs to feel raised, give it a border — not a shadow.

## Shapes

**Every corner radius in the system is 0.** This is not an oversight; it is
checked across every live node. Buttons, cards, nav cells, chips, image frames
and the viewport are all hard-cornered.

The recurring shape language is drawn from measurement instruments:

- **Reticle brackets** — 13px L-shaped corner marks in `c-orange-500` at 1px,
  placed at the four corners of a capture frame (8px on mobile).
- **Crosshairs** — full-width and full-height 1px `c-grid-line` lines through the
  centre of a viewport frame.
- **Ruler ticks** — 6px orange squares punctuating a `c-blue-900` hairline, used
  as a section rule.
- **Measure marks** — paired 13px orange brackets that bracket a block of content
  vertically, as in the CTA section.

Strokes are `1px` and `inside`-aligned. The only other stroke weight in the file
is `0.59px`, which is a scaled-down instance of a 1px stroke, not a token.

## Motion

Motion is taken from the prototype interactions in the Figma file, not invented.

**One easing curve for everything: `cubic-bezier(0.61, 0, 0.2, 1)`.** It eases in
gently, accelerates, and settles hard at the end — an expo-out feel with **no
overshoot** (the curve stays within 0–1, so nothing ever bounces past its target).
Mechanical and decisive, matching the instrument metaphor. Expose it as
`--ease-fluid` and use it for every transition.

**Two durations.**

- `400ms` — interactive feedback: button hover, nav hover, link states.
- `1000ms` — scene transitions: the splash headline cycling through
  _manufacturing / robotics / sports & entertainment_, and crossfades between
  capture stills.

**The button hover is a wipe, not a fade.** The `c-orange-600` fill is a
full-size rectangle parked directly below the button's 66px box; on hover it
translates up by exactly its own height to cover the `c-orange-500` base. Build
it as `transform: translateY(100% → 0)` on an absolutely-positioned overlay with
`overflow: hidden` on the button, at `400ms var(--ease-fluid)`. A plain
`background-color` transition is the wrong effect.

Nav cells and cards use the same 400ms/fluid pairing. Respect
`prefers-reduced-motion` by dropping the looping headline cycle and the wipe to
instant state changes.

## Components

**Button** — 66px tall, square, full-width in its container. `c-orange-500` fill,
`t-label-1` uppercase white text inset 16px from the left, and a 14px arrow glyph
pinned right. Hover wipes `c-orange-600` up from below over 400ms. The 14px
`t-label-2` variant is used in narrower CTA contexts.

**Navbar** — 60px tall, full-bleed, with a `c-white-16p` hairline along its
bottom. Nav items are equal-width cells (196px) with `c-blue-900` borders on the
left, right and bottom, joined with a −1px gap so borders collapse. The logo cell
is wider (226px). The final cell is the CTA and takes a `c-orange-500` fill,
making the call to action part of the navigation grid rather than a floating
button. Labels are `t-label-3` uppercase white with 24px horizontal padding.

**Card** — a bordered `c-blue-900` box, 457px wide in a 3-up row, split into
three stacked regions divided by internal hairlines: a **header** (32px padding),
a **media well** (24px padding), and a **footer** (40px vertical / 32px
horizontal padding). Background is `c-black`. No radius, no shadow, no hover
lift.

**Eyebrow / section chip** — a `c-blue-900` pill-less chip with 3px/6px padding
holding `t-label-3` uppercase text preceded by small chevron glyphs at
`c-white-32p`. Marks the start of a section. The parenthesised variant —
`(Applications)` at `c-white-32p` with no chip fill — marks the section a heading
belongs to.

**Viewport frame** — the signature component. A `c-black` box with a 1px
`c-blue-300` border, containing centred `c-grid-line` crosshairs and four 13px
`c-orange-500` reticle brackets inset ~20px from the edges, with the subject
image composited inside. This is how ChronoSpace presents any captured object.

**Telemetry readout** — a vertical stack (4px gap) of space-between rows, each
pairing a `t-label-4` uppercase key in `c-white-32p` with its value in
`c-orange-500`: `FRAMES KEPT 6`, `TRACKED JOINTS 17`, `DEPTH 0.50 M`. The
orange-on-muted pairing is what sells the "live instrument" read.

**Section rule** — a full-bleed 1px `c-blue-900` line interrupted by 6px
`c-orange-500` tick squares, often paired above and below a row of `t-label-4`
metadata (`SECTION: APPLICATIONS`). Used to open and close major sections.

**Footer** — 680px tall, opened by a full-bleed hairline, dominated by the
ChronoSpace wordmark set at 1416px wide in `c-white`. The logo is the footer.

## Do's and Don'ts

**Do**

- Keep every corner at 0px and every separator at 1px `c-blue-900`.
- Ration `c-orange-500`. One accent per viewport is usually right.
- Set all headings in Nippo and all body copy in Supreme — never the reverse.
- Uppercase every label, at 16/14/12/10px.
- Use `c-white-32p` for secondary text rather than a mid-grey; the muting comes
  from alpha so text stays keyed to whatever is behind it.
- Let rules and imagery bleed to the full viewport while text stays in the
  1416px container.
- Use one easing curve, `cubic-bezier(0.61, 0, 0.2, 1)`, for every transition.
- Collapse adjacent borders with −1px gaps.

**Don't**

- Don't add border-radius, box-shadow, or backdrop-blur to UI. The live design
  has none of the three.
- Don't use `c-orange-600` as a resting fill — it exists only as the hover state.
- Don't reach for the `mobile/*` Switzer or Geist Mono styles still sitting in
  the Figma file; they are dead.
- Don't fade the button background on hover — wipe the darker fill upward.
- Don't introduce a light theme or invert the surface; the system is dark-only.
- Don't apply the thermal gradient (`#FD7A39 → #EC168F`) to text, buttons or
  panels. It belongs to photography only.
- Don't invent intermediate greys. If text needs to recede, lower the alpha of
  `c-white`.
- Don't let paragraphs run at Nippo or labels run in sentence case.
