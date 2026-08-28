# Splash page — implementation spec

Source frame: `Splash page 1` · node `7235:882` · **1496 × 820**
Design system reference: `DESIGN.md` (tokens are referenced by name below, not re-derived).

This is a **single-screen splash**, not a scrolling page. The whole composition is one
viewport-height hero: a full-bleed background image, a brand mark top-left, a
headline + rotating word + CTA in a right-hand column, a bordered "capture viewport"
below the CTA, and an investor credit bottom-left. There is no navbar, no footer, and
no scroll content.

The page is built on the design's 12-column grid: **1416px container, 40px page
margins, 20px gutters, 99.667px columns** at the 1496px design viewport. Every
horizontal position on the page resolves to that grid — the right-hand column is
exactly columns 8–12 (`5 × 99.667 + 4 × 20 = 578px`), and the left region is
columns 1–7.

---

## Contents

1. [Frames & breakpoints](#frames--breakpoints)
2. [Fonts](#fonts)
3. [Typography](#typography)
4. [Colours](#colours)
5. [Page shell & layout skeleton](#page-shell--layout-skeleton)
6. [Section 1 — splash-backdrop](#section-1--splash-backdrop)
7. [Section 2 — brand-mark](#section-2--brand-mark)
8. [Section 3 — hero-headline](#section-3--hero-headline)
9. [Section 4 — hero-word-ticker](#section-4--hero-word-ticker)
10. [Section 5 — hero-cta](#section-5--hero-cta)
11. [Section 6 — capture-viewport](#section-6--capture-viewport)
12. [Section 7 — backed-by](#section-7--backed-by)
13. [Content inventory (verbatim)](#content-inventory-verbatim)
14. [Components](#components)
15. [Spacing reference](#spacing-reference)
16. [Assets](#assets)
17. [Borders, hairlines & low-contrast decoration](#borders-hairlines--low-contrast-decoration)
18. [Effects](#effects)
19. [Animation](#animation)
20. [Responsive behaviour](#responsive-behaviour)

---

## Frames & breakpoints

The design provides **two** artboards for this screen:

| Frame                     | Node        | Size       | Notes                             |
| ------------------------- | ----------- | ---------- | --------------------------------- |
| `Splash page 1` (desktop) | `7235:882`  | 1496 × 820 | Two-column composition            |
| `Splash page 1 mobile`    | `7434:3464` | 375 × 780  | Single column, everything stacked |

There is no tablet artboard. Treat **1496px** as the desktop reference width and
**375px** as the mobile reference width; the breakpoint between them is
**768px** (below → mobile layout, at/above → desktop layout). Between 768px and
1496px the desktop layout holds and simply narrows: the container is
`min(1416px, 100vw - 80px)` and the right-hand column stays at 5/12 of the grid.

A third frame, `Splash page 2 - text change` (`7434:4399`), is not a layout — it is
the animation reference showing the three rotating words stacked. Its content is
folded into [Section 4](#section-4--hero-word-ticker).

**Height.** The desktop frame is 820px and the mobile frame is 780px, but both are
"one screen" compositions. Build the page as `min-height: 100vh` (use `100svh` on
mobile so the browser chrome does not clip the credit row) with the internal rhythm
below. Do not hard-code 820px.

---

## Fonts

Both families ship with the project as **variable fonts** in `public/fonts/`.
Neither is a web font from a CDN — do not load Nippo or Supreme from Google Fonts or
Fontshare at runtime; self-host the supplied files.

| File                                | Family (from the font's own name table) | Axis                              | Named instances                                                                                 |
| ----------------------------------- | --------------------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `public/fonts/Nippo-Variable.woff2` | `Nippo Variable`                        | `wght` 200 → 700, **default 700** | Extralight 200 · Light 300 · **Regular 378** · Medium 500 · Bold 700                            |
| `public/fonts/Supreme-Variable.ttf` | `Supreme Variable`                      | `wght` 100 → 800, **default 800** | Thin 100 · Extralight 200 · Light 300 · **Regular 400** · Medium 500 · Bold 700 · Extrabold 800 |

Two things follow from the table and both are easy to get wrong:

1. **Nippo's "Regular" is weight 378, not 400.** The 378 that the design reports is
   not a rounding artefact — it is the exact coordinate of Nippo's named `Regular`
   instance (`wght = 378.0488`). Every heading and label on this page is set at 378.
2. **Both files default to their heaviest instance** (Nippo 700, Supreme 800). If
   `font-weight` is not stated explicitly the text renders bold. Declare the axis
   range in `@font-face` and set `font-weight` on every rule.

```css
@font-face {
  font-family: "Nippo";
  src: url("/fonts/Nippo-Variable.woff2") format("woff2-variations");
  font-weight: 200 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Supreme";
  src: url("/fonts/Supreme-Variable.ttf") format("truetype-variations");
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
}
```

Reference them as `font-family: 'Nippo', sans-serif` and `font-family: 'Supreme', sans-serif`
so the names match what the design calls them.

**Supreme does not appear anywhere on this page.** Every string on the splash is
Nippo. Supreme is still registered because it is the body face for the rest of the
site, but if you are auditing this page only, a Supreme glyph on screen is a bug.

---

## Typography

Only three text styles are used. All three are Nippo at weight 378.

### `t-heading-2` — headline & rotating word

Published style `desktop/t-heading/2-rg`.

| Property       | Value                                            |
| -------------- | ------------------------------------------------ |
| Font family    | `Nippo`                                          |
| Font weight    | `378`                                            |
| Font size      | `48px`                                           |
| Line height    | `52.8px` (`110%` → use `line-height: 1.1`)       |
| Letter spacing | `-0.96px` (= `-0.02em`)                          |
| Colour         | `#FFFFFF` (headline) / `#F25324` (rotating word) |
| Case           | as typed (sentence case)                         |
| Used by        | `hero-headline`, `hero-word-ticker`              |

Mobile drops one step to **`t-heading-3`**: `40px` / `44px` line height /
`-0.8px` letter spacing (`-0.02em`), same family, weight and colours.

### `t-label-1` — CTA label

Published style `desktop/t-label/1-rg`.

| Property       | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Font family    | `Nippo`                                                    |
| Font weight    | `378`                                                      |
| Font size      | `16px`                                                     |
| Line height    | `17.6px` (`110%` → `1.1`)                                  |
| Letter spacing | `0`                                                        |
| Text transform | `uppercase` (the source string is stored in sentence case) |
| Colour         | `#FFFFFF`                                                  |
| Used by        | `hero-cta`                                                 |

Identical on mobile.

### `t-label-3` — investor credit

Not a published style; it is the design system's derived 12px label and is used
consistently across the site.

| Property       | Value                                       |
| -------------- | ------------------------------------------- |
| Font family    | `Nippo`                                     |
| Font weight    | `378`                                       |
| Font size      | `12px`                                      |
| Line height    | `13.2px` (`110%` → `1.1`)                   |
| Letter spacing | `0`                                         |
| Text transform | `uppercase`                                 |
| Colour         | `rgba(255, 255, 255, 0.32)` (`c-white-32p`) |
| Used by        | `backed-by`                                 |

Identical on mobile.

> **Letter-spacing is not optional.** The `-0.02em` on the 48px headline is worth
> roughly 9px across the line "We build AI to digitize" — enough to change where the
> line breaks. Headings carry `-0.02em`; labels carry `0`. Never swap them.

---

## Colours

Every colour on this page, with its role. All values are published fill styles from
the design system's Colors board.

| Hex                      | Token            | Role on this page                                                                  |
| ------------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| `#090B19`                | `c-black`        | Page canvas; opaque fill of the capture viewport frame                             |
| `#FFFFFF`                | `c-white`        | Headline text, CTA label, brand mark, investor logo, CTA arrow                     |
| `#F25324`                | `c-orange-500`   | Rotating word, CTA resting fill, the four reticle brackets                         |
| `#D13E13`                | `c-orange-600`   | CTA hover fill — **hover only, never a resting fill**                              |
| `#777CAD`                | `c-blue-300`     | 1px border of the capture viewport frame                                           |
| `#1B1C25`                | `c-grid-line`    | The two crosshair hairlines inside the capture viewport                            |
| `rgba(255,255,255,0.32)` | `c-white-32p`    | "BACKED BY" label                                                                  |
| `#FD7A39 → #EC168F`      | thermal gradient | False-colour tint baked into the three subject photographs (see [Assets](#assets)) |

No other colour appears. There is no border on the page body, no card fill, and no
grey — where text recedes it does so by lowering the alpha of `c-white`.

---

## Page shell & layout skeleton

```
<section data-section="splash">          position: relative; overflow: hidden;
                                          min-height: 100vh; background: #090B19;
  ├── [data-section="splash-backdrop"]    absolute inset:0; z-index:0  ← OVERLAY (behind)
  └── .splash__content                    position: relative; z-index: 1;
        max-width: 1416px; margin-inline: auto;
        padding: 60px 40px 25px;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        column-gap: 20px;
        ├── .splash__left    grid-column: 1 / span 7;
        │     display: flex; flex-direction: column;
        │     justify-content: space-between;
        │     ├── [data-section="brand-mark"]
        │     └── [data-section="backed-by"]
        └── .splash__right   grid-column: 8 / span 5;
              display: flex; flex-direction: column; align-items: flex-start;
              ├── [data-section="hero-headline"]     margin-bottom: 3px
              ├── [data-section="hero-word-ticker"]  margin-bottom: 32px
              ├── [data-section="hero-cta"]          margin-bottom: 32px
              └── [data-section="capture-viewport"]
```

The backdrop is the page's one genuine **overlay**: an absolutely-positioned layer
pinned to `inset: 0` behind everything, `pointer-events: none`, `z-index: 0`. Every
other element is in normal flow.

**Column arithmetic.** `grid-column: 8 / span 5` on a 12-column / 20px-gutter /
1416px grid resolves to exactly 578px wide, flush to the right margin — the same
578px the design frame reports. Do not hard-code 578px; let the grid produce it so
the column tracks the container at intermediate widths.

**Vertical rhythm (desktop, measured from the frame's top edge):**

| Landmark                      | Top | Height | Gap to next |
| ----------------------------- | --: | -----: | ----------: |
| Brand mark (left column)      |  60 |     56 |           — |
| Headline (right column)       |  60 |    106 |           3 |
| Word ticker                   | 169 |     53 |          32 |
| CTA button                    | 254 |     66 |          32 |
| Capture viewport              | 352 |    443 |           — |
| Investor credit (left column) | 742 |     53 |           — |
| Frame bottom                  | 820 |        |             |

Two alignments are structural and must survive a reflow:

- **The brand mark and the headline share a 60px top offset** — they are the two
  things that start the page.
- **The capture viewport and the investor credit are bottom-aligned**, both ending
  25px above the frame's bottom edge. This is what the left column's
  `justify-content: space-between` produces: the logo pins to the top, the credit
  pins to the bottom, and the bottom edge is set by the 25px bottom padding.

The 3px between the headline and the word ticker is not a design gap so much as the
seam where a fixed-height clipping window meets the text above it — the ticker is
optically the headline's third line. Keep it at 3px; do not round it to 4.

---

## Section 1 — splash-backdrop

**Node `7235:883`** · full-bleed 1496 × 820 · `layoutMode: NONE`, `clipsContent: true`

A full-bleed photographic backdrop — the "echo repeater": a wall of vertical bars
running from a saturated orange/magenta bloom at the lower left through deep blue to
near-black at the upper right, which is what keeps the headline legible.

In the design it is built from **two copies of the same source image** stacked at
slightly different scales and offsets (nodes `7235:884` at 3267 × 1656 and
`7235:885` at 3324 × 1685, both `NORMAL` blend at full opacity), which produces the
doubled-edge "echo" on the bars. Reproducing that layering in code is unnecessary —
export the parent frame and you get the composited result exactly.

- Wrapper: `position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden`
- Image: `width: 100%; height: 100%; object-fit: cover; object-position: center`
- Underneath it, the section keeps `background: #090B19` so the canvas is correct
  before the image decodes.
- **No border, no radius, no shadow, no overlay scrim.** The image is used raw; the
  legibility of the headline comes from the source image being near-black at the
  upper right, not from a gradient wash on top.

The backdrop reaches the full 1496px bleed — it is **not** clipped to the 1416px
content container. The container's `overflow: hidden` on the section root is what
stops it spilling.

**Mobile** re-crops the same source rather than scaling the desktop crop: node
`7434:3492`, a 2068 × 1049 rect placed at `left: -1498px; top: 0` inside the 375px
frame — i.e. the mobile screen shows the slice of the source between roughly 72% and
91% of its width. Expressed responsively:

```css
@media (max-width: 767px) {
  [data-section="splash-backdrop"] img {
    width: 551.47vw; /* 2068 / 375 */
    height: auto;
    position: absolute;
    left: -399.47vw; /* -1498 / 375 */
    top: 0;
    object-fit: none;
  }
}
```

If only one background asset is shipped, the acceptable fallback is the desktop
composite with `object-fit: cover; object-position: 45% center` on mobile — it keeps
the blue bar field behind the content and the orange bloom at the bottom left, which
is the read the design is after.

---

## Section 2 — brand-mark

**Node `7434:4454`** · VECTOR · 292.916 × 56 · fill `#FFFFFF`

The ChronoSpace lockup: a hexagonal "S" monogram followed by the wordmark, drawn as
a single vector. It is not a link target in this design and has no hover state.

- Position: first child of the left column, at the container's left edge (40px from
  the viewport edge) and 60px from the top.
- Render at `width: 293px; height: 56px` (`height: auto` from the SVG's intrinsic
  293 × 56 ratio).
- Colour is baked into the SVG as `fill="white"`. If it needs to be tokenised,
  swap the fills to `currentColor` and set `color: #FFFFFF`.
- No border, no background, no radius.

**Mobile** uses a separate, smaller instance: node `7434:4456`, **167.38 × 32**,
same artwork and colour, at `left: 16px; top: 40px`. Scale the same SVG to
`height: 32px; width: auto` — the ratio is identical (5.23:1).

---

## Section 3 — hero-headline

**Node `7235:903`** · TEXT · 459 × 106 · `textAutoResize: HEIGHT` (width fixed)

```
We build AI to digitize the physical world for
```

- Style: [`t-heading-2`](#t-heading-2--headline--rotating-word) — Nippo 378,
  48px / 52.8px, `-0.96px` letter-spacing, `#FFFFFF`.
- Semantics: this string plus the rotating word below form one sentence. Mark the
  whole group up as a single `<h1>` with the rotating word as a nested element, so
  the accessible name reads "We build AI to digitize the physical world for
  manufacturing."
- **`max-width: 459px`.** The text box is narrower than the 578px column on
  purpose: 459px is what forces the two-line break

  > We build AI to digitize
  > the physical world for

  Without the cap the line runs to 578px and the headline collapses to a different
  shape. Set `max-width: 459px` on the heading (not on the column) and verify the
  break lands after "digitize".

- `text-align: left`, `text-wrap: pretty` is fine but do not use `text-wrap: balance` —
  it will re-break the two lines.
- No border, no background.

**Mobile** (node `7434:3508`): `40px / 44px`, `-0.8px` letter-spacing, box width
343px, wrapping to **three** lines:

> We build AI to
> digitize the
> physical world for

---

## Section 4 — hero-word-ticker

**Node `7235:904`** (window) → **`7235:905`** (roll) · 578 × 53 · `clipsContent: true`

The rotating word that completes the headline. Structurally it is a **vertical roll
behind a one-line-tall window** — the design file makes this explicit rather than
leaving it to be inferred.

| Node              | Role            | Geometry                                                                                                                        |
| ----------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `7235:904` "text" | Clipping window | 578 × **53**, `overflow: hidden`                                                                                                |
| `7235:905` "txt"  | The roll        | 578 × **242**, `layoutMode: VERTICAL`, `itemSpacing: 10`, padding 0, `primaryAxisAlignItems: MIN`, `counterAxisAlignItems: MIN` |

The roll's four children, in order, each 53px tall and each set in
[`t-heading-2`](#t-heading-2--headline--rotating-word) at `#F25324`:

| #   | Node       | Text                      |
| --- | ---------- | ------------------------- |
| 1   | `7235:906` | `manufacturing.`          |
| 2   | `7235:907` | `robotics.`               |
| 3   | `7235:908` | `sports & entertainment.` |
| 4   | `7235:909` | `manufacturing.`          |

`4 × 53 + 3 × 10 = 242` — the roll height checks out. The fourth item is a
**deliberate duplicate of the first**, present so the loop can return to the start
without a visible jump.

- Window: `height: 53px; overflow: hidden; width: 100%` (it must be able to hold
  "sports & entertainment.", the widest of the three, at 578px).
- Roll: `display: flex; flex-direction: column; gap: 10px`, each row
  `height: 53px; line-height: 52.8px`.
- Step: **63px** (53px row + 10px gap). Translate the roll by
  `translateY(calc(var(--step) * -63px))` for step 0…3, then snap back to 0.
- No border, no background, no radius on either node.

See [Animation](#animation) for timing.

**Mobile** flattens this to a single static line — node `7434:3528`,
`manufacturing.` at 40px / 44px in `#F25324`, sitting 2px below the headline inside
a `gap: 2px` column (`7434:3533`). The rotation still reads well at 375px, so
running the same roll on mobile at a 44px row height and a 54px step (44 + 10) is a
faithful extension; if the roll is not implemented on mobile, `manufacturing.` is
the correct static word.

---

## Section 5 — hero-cta

**Node `7434:3623`** · FRAME · 578 × 66 · fill `#F25324` · `clipsContent: true`

```
BOOK A MEETING                                                              →
```

The primary call to action. Full-width in its column, square-cornered, with the
label pinned low-left and a chevron pinned right.

| Property      | Value                                                                      |
| ------------- | -------------------------------------------------------------------------- |
| Size          | `width: 100%` (578px in the design column) × `height: 66px`                |
| Background    | `#F25324` (`c-orange-500`)                                                 |
| Border        | **none**                                                                   |
| Border radius | `0`                                                                        |
| Overflow      | `hidden` (required — both the hover wipe and the arrow slide depend on it) |
| Position      | `relative` (positioning context for the hover fill)                        |

**Label** — node `7434:3625`, string `Book a meeting`, rendered uppercase via
`text-transform`. Style [`t-label-1`](#t-label-1--cta-label). Its 18px line box sits
at `left: 16px`, `top: 32px` — i.e. **16px from the left edge and 16px from the
bottom edge**, with the remaining 32px above it. The label is deliberately _not_
vertically centred; it is anchored to the bottom-left corner.

**Arrow** — node `7434:3626`, a 14 × 14 `overflow: hidden` box at `left: 551px`
(13px from the right edge), `top: 34px`. It contains **two identical 8 × 10 white
chevrons** (`7434:3627`, `7434:3628`), which is the tell for the slide-through hover
described in [Animation](#animation). At rest chevron A is visible at `x: 3` and
chevron B is parked off-canvas at `x: -27`.

Implementation that matches the measured offsets:

```css
[data-section="hero-cta"] {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 66px;
  padding: 0 13px 16px 16px;
  background: #f25324;
  border: 0;
  border-radius: 0;
}
[data-section="hero-cta"] .arrow {
  margin-bottom: 2px;
} /* arrow sits 2px above the label baseline row */
```

**Mobile** (node `7434:3633`): identical height, fill and label position, width
343px (full column). The arrow is **not visible** — its 14px box still sits at
`left: 551px`, which is outside the 343px button, so the clip removes it. Reproduce
that: hide the arrow below 768px.

---

## Section 6 — capture-viewport

**Node `7235:886`** · FRAME · 578 × 443 · `clipsContent: true`

The signature component of the system: a bordered instrument window with a
crosshair, four corner reticles, and the captured subject floating in the middle.

| Property      | Value                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------ |
| Size          | `width: 100%` (578px) · `aspect-ratio: 578 / 443` (≈ 1.3047)                                           |
| Background    | `#090B19` (`c-black`) — **opaque**; it masks the backdrop behind it                                    |
| Border        | `1px solid #777CAD` (`c-blue-300`), `strokeAlign: INSIDE` → CSS `border` with `box-sizing: border-box` |
| Border radius | `0`                                                                                                    |
| Overflow      | `hidden`                                                                                               |
| Position      | `relative`                                                                                             |

Everything inside is positioned relative to an inner **UI layer** (node `7235:887`,
538 × 403.5) inset **20px on all four sides**. Because the mobile instance is a
uniform 0.5934 scale of the desktop one (`343 / 578`), every inner measurement is
best expressed as a percentage of the frame so both breakpoints fall out of one
rule:

| Element              | Node       | Desktop px               | As a percentage of the frame                       |
| -------------------- | ---------- | ------------------------ | -------------------------------------------------- |
| UI inset             | `7235:887` | 20                       | `3.4602%` of width / `4.5147%` of height           |
| Horizontal crosshair | `7235:888` | 537.5 × 0, `1px #1B1C25` | full width of the UI layer, at `50%` of its height |
| Vertical crosshair   | `7235:889` | 0 × 403.5, `1px #1B1C25` | full height of the UI layer, at `50%` of its width |
| Reticle bracket      | ×4, below  | 13 × 13, `1px #F25324`   | `2.2491%` of frame width, `aspect-ratio: 1`        |

**Crosshairs.** Two 1px hairlines in `#1B1C25` crossing at the exact centre of the
UI layer. This colour is only a few percent lighter than the `#090B19` fill — it is
the single easiest thing on this page to lose. It is _not_ hidden and it is _not_
noise; build it.

```css
.viewport__crosshair-h {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #1b1c25;
}
.viewport__crosshair-v {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: #1b1c25;
}
```

**Reticle brackets.** Four 13 × 13 L-shaped corner marks in `#F25324` at 1px,
one at each corner of the UI layer. In the design they live in two
`SPACE_BETWEEN` rows (`7235:890` at the top, `7235:893` at the bottom, each 538 wide
with `itemSpacing: 512`). They are pure two-line shapes — build them in CSS, not as
images:

| Corner           | Borders                         | Node       |
| ---------------- | ------------------------------- | ---------- |
| Top-left `⌜`     | `border-top`, `border-left`     | `7235:891` |
| Top-right `⌝`    | `border-top`, `border-right`    | `7235:892` |
| Bottom-left `⌞`  | `border-bottom`, `border-left`  | `7235:894` |
| Bottom-right `⌟` | `border-bottom`, `border-right` | `7235:895` |

Each is `1px solid #F25324` on two edges only, sized 13 × 13, pinned to the four
corners of the UI layer (i.e. 20px in from the frame's border).

**The subject.** A single photograph, centred-ish in the frame, tinted with the
thermal gradient. Three subjects exist and they cycle in step with the word ticker:

| Word                      | Subject         | Node       | Desktop size | Offset from frame's top-left  | Rest state   |
| ------------------------- | --------------- | ---------- | ------------ | ----------------------------- | ------------ |
| `manufacturing.`          | Milling machine | `7235:898` | 322.85 × 374 | `left: 128px, top: 35px`      | **visible**  |
| `robotics.`               | Robot arm       | `7235:897` | 230 × 393    | `left: 174.43px, top: 45.5px` | `opacity: 0` |
| `sports & entertainment.` | Sprinter        | `7235:896` | 340 × 371    | `left: 120px, top: 59px`      | `opacity: 0` |

Each is an absolutely-positioned overlay inside the viewport, above the crosshairs
and below nothing (the reticles may sit above or below — they do not intersect the
subject). Only one is at `opacity: 1` at a time. Express the offsets and sizes as
percentages of the frame (e.g. the milling machine is `55.86%` wide, `84.42%` tall,
at `left: 22.15%; top: 7.90%`) so they scale with the viewport frame.

The thermal tint is **baked into the exported assets** — do not re-apply a gradient
in CSS. For reference, the design composites it as
`linear-gradient(180deg, #FD7A39 0%, #EC168F 100%)` over the photograph with a
`soft-light` pass; the export flattens all of that.

**Mobile** (node `7434:3510`): 343 × 262.89, same 1.3047 aspect ratio, same
structure at 0.5934 scale — 11.87px inset, 7.71px reticles, and a 0.593px border
(a scaled 1px stroke; **render it as 1px**, since sub-pixel borders disappear).

---

## Section 7 — backed-by

**Node `7434:3608`** · FRAME · 170 × 53 · `layoutMode: VERTICAL`, `itemSpacing: 16`,
padding 0, `primaryAxisAlignItems: MIN`, `counterAxisAlignItems: MIN`

The investor credit, bottom-left.

```
BACKED BY
[a16z / speedrun]
```

| Child | Node        | Detail                                                                                                                                                           |
| ----- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Label | `7434:3609` | `Backed by`, [`t-label-3`](#t-label-3--investor-credit) — Nippo 378, 12px / 13.2px, uppercase, `rgba(255,255,255,0.32)`. `layoutAlign: STRETCH` → `width: 100%`. |
| Logo  | `7434:3610` | `Logo/a16z Speedrun`, 170 × 24, three white vector paths, `overflow: hidden`                                                                                     |

- Layout: `display: flex; flex-direction: column; gap: 16px; align-items: flex-start`.
- Pinned to the bottom of the left column, ending 25px above the frame's bottom edge
  and bottom-aligned with the capture viewport.
- No border, no background.

**Mobile** (node `7434:3615`) flips this to a **horizontal row**:
`display: flex; flex-direction: row; justify-content: space-between; align-items: center; gap: 16px`,
width 343px (full column), height 24px — "BACKED BY" on the left, the a16z logo
flush right at its full 170 × 24. It sits 24px above the frame's bottom edge.

---

## Content inventory (verbatim)

Every string on the page, in document order. Copy exactly — including the trailing
full stops on the rotating words and the plain `&` in "sports & entertainment.".

| #   | Node        | String (as stored)                               | Rendered as      | Where                      |
| --- | ----------- | ------------------------------------------------ | ---------------- | -------------------------- |
| 1   | `7235:903`  | `We build AI to digitize the physical world for` | as stored        | Headline                   |
| 2   | `7235:906`  | `manufacturing.`                                 | as stored        | Ticker, step 0             |
| 3   | `7235:907`  | `robotics.`                                      | as stored        | Ticker, step 1             |
| 4   | `7235:908`  | `sports & entertainment.`                        | as stored        | Ticker, step 2             |
| 5   | `7235:909`  | `manufacturing.`                                 | as stored        | Ticker, step 3 (loop seam) |
| 6   | `7434:3625` | `Book a meeting`                                 | `BOOK A MEETING` | CTA label                  |
| 7   | `7434:3609` | `Backed by`                                      | `BACKED BY`      | Investor credit            |

Strings 6 and 7 are stored in sentence case and uppercased by `textCase: UPPER` in
the design — use CSS `text-transform: uppercase` rather than retyping them, so the
copy stays editable.

There is no other text: no nav, no eyebrow, no sub-headline, no legal line.

---

## Components

Only two reusable components appear, and both are documented in `DESIGN.md`. This
page's instances are noted here.

### Button (`c-orange-500`, 66px)

Matches the system button. Full-width in its container, `t-label-1` uppercase label
inset 16px from the left, 14px arrow glyph pinned right, zero radius, no border, no
shadow. The hover treatment is a **wipe, not a fade** — see [Animation](#animation).

The design file carries this as a two-variant component set (`7218:430`):
`Property 1=Default` (`7218:429`) and `Property 1=Variant2` (`7218:431`, the hover
state). The only difference between the two variants is the position of the
`#D13E13` fill rectangle and the two chevrons; the label does not move.

### Viewport frame

Matches the system's viewport-frame component: `c-black` fill, 1px `c-blue-300`
border, centred `c-grid-line` crosshairs, four 13px `c-orange-500` reticle brackets
inset 20px, subject image composited inside. Documented in full in
[Section 6](#section-6--capture-viewport).

No cards, no nav cells, no chips, no telemetry readouts, no section rules on this page.

---

## Spacing reference

Concrete pixel values, desktop then mobile.

### Desktop (1496px frame)

| Measurement                            | Value                                      |
| -------------------------------------- | ------------------------------------------ |
| Page margin (left / right)             | `40px`                                     |
| Content container                      | `1416px`                                   |
| Grid                                   | 12 columns, `99.667px` each, `20px` gutter |
| Right column                           | columns 8–12 = `578px`                     |
| Top padding (to brand mark / headline) | `60px`                                     |
| Bottom padding (to viewport / credit)  | `25px`                                     |
| Headline → word ticker                 | `3px`                                      |
| Word ticker → CTA                      | `32px`                                     |
| CTA → capture viewport                 | `32px`                                     |
| CTA internal padding                   | `0 13px 16px 16px`                         |
| Viewport frame → inner UI layer        | `20px` (all sides)                         |
| Credit label → investor logo           | `16px`                                     |
| Word-roll row gap                      | `10px` (roll step = `63px`)                |

### Mobile (375px frame)

| Measurement                     | Value                       |
| ------------------------------- | --------------------------- |
| Page margin (left / right)      | `16px`                      |
| Content column                  | `343px`                     |
| Top padding (to brand mark)     | `40px`                      |
| Brand mark → headline           | `48px`                      |
| Headline → orange word          | `2px`                       |
| Word → CTA                      | `32px`                      |
| CTA → capture viewport          | `46px`                      |
| Capture viewport → credit row   | `27px`                      |
| Bottom padding                  | `24px`                      |
| Viewport frame → inner UI layer | `11.87px` (= 20 × 0.5934)   |
| Credit label ↔ investor logo    | `16px` gap, `space-between` |

---

## Assets

Suggested destination: `public/images/` for rasters, `public/icons/` (or inlined
React components under `src/app/(home)/assets/`) for the vectors.

| File                          | Type   | Node ID     | Description                                                                                                                                 | Dimensions                                                         | Notes                                                                                                                                                                                                                                                |
| ----------------------------- | ------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `echo-repeater-bg.png`        | raster | `7235:883`  | Full-bleed backdrop — the composited "echo repeater" bar field, orange/magenta bloom lower-left through deep blue to near-black upper-right | 1496 × 820 (export @2x → 2992 × 1640)                              | Fully opaque, no alpha. Full-bleed: `width:100%; height:100%; object-fit:cover; object-position:center`. Parent must be `position:relative; overflow:hidden`. Export the **frame**, not the two child rects — the frame flattens the two-layer echo. |
| `echo-repeater-bg-mobile.png` | raster | `7434:3492` | Mobile crop of the same source, at a different zoom                                                                                         | 2068 × 1049                                                        | Not stretched to fit: place at `width:551.47vw; left:-399.47vw; top:0` inside the 375px frame. Optional — see the fallback in [Section 1](#section-1--splash-backdrop).                                                                              |
| `chronospace-logo.svg`        | logo   | `7434:4454` | ChronoSpace lockup — hexagonal "S" monogram + wordmark                                                                                      | viewBox `0 0 293 56`; renders 293 × 56 desktop, 167.38 × 32 mobile | Single-colour `#FFFFFF`. `preserveAspectRatio="xMidYMid meet"`. Consider swapping fills to `currentColor`.                                                                                                                                           |
| `a16z-speedrun-logo.svg`      | logo   | `7434:3610` | a16z / speedrun investor lockup (three paths: "a16z", the slash, "speedrun")                                                                | viewBox `0 0 170 24`; renders 170 × 24 at both breakpoints         | Single-colour `#FFFFFF`. Contains a `clipPath` — keep it; do not flatten. Export the **frame**, not the individual vectors.                                                                                                                          |
| `arrow-right.svg`             | icon   | `7434:3626` | Chevron glyph in the CTA                                                                                                                    | viewBox `0 0 14 14`, glyph occupies 8 × 10 at `x:3, y:2`           | Fill `#FFFFFF`. Used **twice** inside a 14 × 14 `overflow:hidden` box for the slide-through hover. Export the **frame** `7434:3626`, not the child vectors.                                                                                          |
| `subject-manufacturing.png`   | raster | `7235:898`  | Milling machine, thermal-tinted, transparent background                                                                                     | 322.85 × 374 (export @2x)                                          | Alpha PNG. Gradient and soft-light blend are already flattened into the export. `object-fit: contain`.                                                                                                                                               |
| `subject-robotics.png`        | raster | `7218:483`  | Robot arm, thermal-tinted, transparent background                                                                                           | 230 × 393 (export @2x)                                             | Alpha PNG. **The node on this page (`7235:897`) is at `opacity: 0`** — the inactive state of the subject cycle — so it cannot be exported directly; `7218:483` is the same image at the same size in a renderable state.                             |
| `subject-sports.png`          | raster | `7235:870`  | Sprinter, thermal-tinted, transparent background                                                                                            | source 3396 × 3674; renders 340 × 371                              | Alpha PNG. Same situation: this page's node (`7235:896`) is at `opacity: 0`. `7235:870` is the renderable source of the same artwork; scale it down and crop to the 340 × 371 box.                                                                   |

**Not assets — build these in CSS:**

- The four **reticle brackets** (`7235:891`, `7235:892`, `7235:894`, `7235:895`) —
  each is a 13 × 13 L of two 1px `#F25324` lines. Two CSS borders per corner.
- The two **crosshairs** (`7235:888`, `7235:889`) — 1px `#1B1C25` lines. Two divs.
- The CTA's **hover fill** — a `#D13E13` rectangle, not an image.

**Hidden layers — do not render.** Two nodes in this frame carry `visible: false`
and must not reach the build: `7434:3604` ("echo-repeater 11", a 1497 × 1913 raster)
and `7235:911` (a 339 × 56 vector, a superseded logo draw). They are off-design
scaffolding.

---

## Borders, hairlines & low-contrast decoration

Everything on this page that a pixel comparison would under-weight, listed
explicitly. Each of these is visible in the design and each is easy to drop.

| Element                 | Where                                         | Exact value                                                    |
| ----------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| Capture viewport border | `7235:886`, all four edges                    | `1px solid #777CAD`, inside-aligned → `box-sizing: border-box` |
| Horizontal crosshair    | `7235:888`, centre of the viewport's UI layer | `1px` line, `#1B1C25`, full width of the UI layer (537.5px)    |
| Vertical crosshair      | `7235:889`, centre of the viewport's UI layer | `1px` line, `#1B1C25`, full height of the UI layer (403.5px)   |
| Reticle bracket ×4      | corners of the viewport's UI layer            | `1px solid #F25324` on two edges, 13 × 13                      |
| "BACKED BY" label       | bottom-left                                   | `rgba(255,255,255,0.32)` — 32% white, not a grey               |

`#1B1C25` against the `#090B19` fill is roughly a 4% luminance step. It reads as a
faint cross when you look for it and vanishes when you don't — that is the intended
effect, and it is exactly why it has to be specified rather than eyeballed.

**Elements that explicitly have no border:** the page root, the backdrop layer, the
brand mark, the headline, the word-ticker window, the CTA button, and the investor
credit block. Do not add one.

**Background grid / guide lines:** none render. The frame does carry a Figma layout
grid (12 columns, 99.667px, 20px gutter, 40px offset, `STRETCH`) — that is the
editor guide the layout is built on, described in
[Page shell & layout skeleton](#page-shell--layout-skeleton), and it is not drawn on
the page. There are no zero-dimension ruler vectors, no baseline grid, and no
full-bleed divider lines in this frame.

---

## Effects

The system has no shadows and no blurs, and this page is no exception.

| Effect                   | Present? | Detail                                                                                                                                                                                |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Box shadow               | **No**   | `effects: []` on every node in the frame                                                                                                                                              |
| Blur / backdrop blur     | **No**   | No glassmorphism anywhere; the viewport frame's fill is a solid `#090B19`, not a translucent panel                                                                                    |
| Border radius            | **No**   | Every corner on the page is `0` — CTA, viewport frame, reticles, backdrop                                                                                                             |
| Gradient text            | **No**   | The rotating word is a flat `#F25324` fill, not a gradient. Do not apply `background-clip: text`.                                                                                     |
| Gradient fills           | **One**  | `linear-gradient(180deg, #FD7A39 0%, #EC168F 100%)`, applied only to the subject photographs and already flattened into the exported PNGs. Never apply it to text, buttons or panels. |
| Aspect-ratio constraints | **Yes**  | Capture viewport `578 / 443` (≈ 1.3047), identical at both breakpoints. Subject images use `object-fit: contain` inside their absolute boxes.                                         |
| Hover states             | **One**  | The CTA — see below                                                                                                                                                                   |

---

## Animation

The design file carries real prototype interactions; the values below are taken from
them, not inferred.

**Easing — one curve for everything:** `cubic-bezier(0.61, 0, 0.2, 1)`. Expose it as
`--ease-fluid`.

### Headline word cycle + subject crossfade

The word ticker and the capture viewport's subject animate **as one scene**. The
prototype runs four states in a loop:

| Step | Word shown                   | Subject shown   | Roll offset |
| ---: | ---------------------------- | --------------- | ----------: |
|    0 | `manufacturing.`             | milling machine |         `0` |
|    1 | `robotics.`                  | robot arm       |     `-63px` |
|    2 | `sports & entertainment.`    | sprinter        |    `-126px` |
|    3 | `manufacturing.` (duplicate) | milling machine |    `-189px` |

then resets instantly to step 0 — seamless, because steps 3 and 0 are visually
identical.

- **Hold:** `1.5s` on each step (`AFTER_TIMEOUT`, `timeout: 1.5`)
- **Transition:** `1s`, `cubic-bezier(0.61, 0, 0.2, 1)`
- **Full cycle:** `4 × 2.5s = 10s`

The word roll translates; the subjects crossfade (`opacity: 0 ↔ 1`) over the same
1s. The design's own measured roll offsets are `0 / −62 / −126 / −189`; the
underlying step is `63px` (53px row + 10px gap) and small hand-nudges account for
the difference — use a clean `-63px` step.

**The subject moves with the word, it does not only dissolve.** Measured off the
reference recording: on each step the outgoing subject rises `20px` as it fades
out and the incoming one rises the same `20px` into place as it fades in, on the
same 1s and the same curve as the roll above it. A crossfade with no travel reads
as two animations sharing a clock rather than one scene — `--subject-rise` in
`globals.css` is that distance. Each subject is also centred in the frame rather
than pinned to its Figma offset: the three artworks have different proportions,
and centring is what makes the instrument read as re-aiming at one fixed point.

**One scene, every breakpoint.** With the third word shortened to
`entertainment.` (see [Copy as shipped](#copy-as-shipped)) the longest of the three
is `manufacturing.` at `6.71em`, which fits its column from 375px up. So the roll
runs at every width — mobile on the spec's 54px step (44 + 10), `lg` on 63px — and
the subject cycle and reticle lock run with it. There is no width at which the word
freezes while the instrument keeps changing subject.

**From `lg`, the sentence is sized by its own line break.** The constraint is not
the rotating word but the headline's second line, "the physical world for" at
`9.38em` against its `9.5625em` cap (the design's 459px). The 5-column box it lives
in is `41.6667vw - 45px`, narrower than that cap at 48px until about `1220px`, so
below that the headline and the roll share one `.text-hero` size that follows the
column down and tops out at the design's 48px. Every measurement in the roll (row
height, gap, step, the line-break cap) is restated in `em` so it tracks. Without it
the type stays at 48px and the headline wraps to three lines instead of two.

**The page must not scroll, and the frame is what pays for it.** At the design's
1496 × 820 the composition fits exactly; on a shorter window it did not. From `md`
the page is `h-svh` and the chain down to the capture viewport is a flex column of
`min-h-0` boxes — headline, word and CTA `shrink-0` at their design sizes, and the
frame giving up its `578 / 443` aspect to absorb what is left. Nothing inside the
frame needs to know: every inner measurement is a percentage of it and each subject
is `object-contain`, so a flatter frame just holds a smaller, still-centred subject.
The frame stops at `200px`, below which the page scrolls rather than showing a
letterbox slit. Mobile stays in normal flow.

### Copy as shipped

The site departs from the design file in the places below, on client direction.
Keep the Figma records above as they are — they document the file, not the site.

| Where                      | Design file                                          | Shipped                                                                            |
| -------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Ticker step 2 (`7235:908`) | `sports & entertainment.`                            | `entertainment.`                                                                   |
| CTA (`7434:3623`)          | —                                                    | links to `https://calendar.app.google/JKqjSzst8t1QSRfZA`, new tab                  |
| Page title                 | `ChronoSpace — AI that digitizes the physical world` | `ChronoSpace - Digitizing the Physical World` (client's own hyphen, kept verbatim) |
| Bottom-left                | investor credit alone                                | `contact-email` above it — `contact@chronospace.ai`, no Figma node                 |
| Subject 3 (`7235:896`)     | sprinter                                             | dancer — `subject-entertainment.webp`, supplied by the client                      |
| `layout.tsx`               | —                                                    | Google Analytics `G-9P2J929L7B`, the snippet from the live chronospace.ai          |

The shortened word is also what the page description, the share-card alt text and
the share card itself now say. `contact-email` is a section without a node: it
mirrors `backed-by` deliberately — same `label-3` caption in `c-white-32p` over its
payload, same 16px gap — so the bottom-left corner reads as one pair rather than as
one designed block and one bolted on.

The dancer ships trimmed to its own alpha bounds — 519 × 755, no transparent
padding — unlike the other two subjects, which carry theirs. That is deliberate:
with no padding the element box _is_ the artwork, so the centring rule the other
two only approximate, the dancer hits exactly. Its height is the same 82.4% of the
frame they occupy, and its width falls out of the artwork's own ratio.

```css
.ticker__roll {
  transform: translateY(calc(var(--step, 0) * -63px));
  transition: transform 1s var(--ease-fluid);
}
```

### CTA hover — fill wipe

Component variants `Property 1=Default` → `Property 1=Variant2`, `ON_HOVER`,
`SMART_ANIMATE`, **400ms**, `cubic-bezier(0.61, 0, 0.2, 1)`.

A full-size `#D13E13` rectangle is parked **below** the 66px button (at `top: 70px`
relative to the button, i.e. 4px past its bottom edge) and slides **up** to cover it.
This is a wipe, not a `background-color` transition.

```css
[data-section="hero-cta"] .wipe {
  position: absolute;
  inset: 0;
  background: #d13e13;
  transform: translateY(100%);
  transition: transform 400ms var(--ease-fluid);
}
[data-section="hero-cta"]:hover .wipe,
[data-section="hero-cta"]:focus-visible .wipe {
  transform: translateY(0);
}
```

The label and arrow must sit above the wipe (`position: relative; z-index: 1`) —
they do not move.

### CTA hover — arrow slide-through

Inside the 14 × 14 `overflow: hidden` arrow box, two identical chevrons both
translate **+30px** on the same 400ms curve: chevron A exits right (`x: 3 → 33`)
while chevron B enters from the left (`x: -27 → 3`). The result is one chevron
leaving and an identical one arriving, rather than a single icon nudging.

```css
.arrow {
  position: relative;
  width: 14px;
  height: 14px;
  overflow: hidden;
}
.arrow svg {
  position: absolute;
  top: 0;
  transition: transform 400ms var(--ease-fluid);
}
.arrow svg:nth-child(1) {
  left: 0;
}
.arrow svg:nth-child(2) {
  left: -30px;
}
[data-section="hero-cta"]:hover .arrow svg {
  transform: translateX(30px);
}
```

### Reduced motion

Under `prefers-reduced-motion: reduce`, stop the word/subject cycle on step 0
(`manufacturing.` + the milling machine) and reduce the CTA wipe and arrow slide to
instant state changes.

### Signals checked and not found

No counters or stat numbers, no progress bars or loaders, no marquee or ticker rows
of logos, no ghost/faded text pairs, and no layer names carrying `[cycle]` /
`[marquee]` / `[typewriter]` hints. The cycle documented above comes from the
prototype interactions and the four-item roll, which is stronger evidence than a
naming convention.

---

## Responsive behaviour

### ≥ 768px — desktop layout

Two columns on the 12-column grid inside a `min(1416px, 100vw - 80px)` container.
Left column (cols 1–7) holds the brand mark pinned top and the investor credit
pinned bottom, `justify-content: space-between`. Right column (cols 8–12) is a flex
column holding headline → word ticker → CTA → capture viewport. Padding
`60px 40px 25px`. The backdrop bleeds full width behind both.

Between 768px and 1496px nothing re-flows — the container narrows, the right column
stays at 5/12, and the capture viewport shrinks with it (its `aspect-ratio` and
percentage-based internals keep the crosshairs centred and the reticles in the
corners). The headline's `max-width: 459px` holds until the column itself drops
below 459px, at which point the headline wraps to three lines, which is acceptable.

### < 768px — mobile layout

Single column, everything stacked in source order:

1. Brand mark (167.38 × 32) — 40px from the top
2. Headline, 40px / 44px, three lines — 48px below the mark
3. Rotating word, 40px / 44px, `#F25324` — 2px below the headline
4. CTA, full width (343px), 66px tall, **arrow hidden** — 32px below the word
5. Capture viewport, full width, `aspect-ratio: 578 / 443` — 46px below the CTA
6. Investor credit as a **horizontal `space-between` row**, 24px tall — 27px below
   the viewport, 24px above the bottom edge

Container `343px` with `16px` margins. Backdrop re-crops as described in
[Section 1](#section-1--splash-backdrop).

The single structural change between the two layouts is the investor credit flipping
from a vertical stack to a horizontal `space-between` row. Everything else is the
same components at a smaller scale — which is why the capture viewport's internals
are specified as percentages: the mobile instance is a uniform `0.5934` scale of the
desktop one and needs no separate rules.

### Between the two

There is no tablet artboard. At 768px the layout switches wholesale from two columns
to one; do not attempt an intermediate two-column-narrow state, which would push the
capture viewport below its legible size.
