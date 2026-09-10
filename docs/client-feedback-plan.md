# Client feedback implementation plan (September 2026)

Execution spec for an agent. Source: the client's "Website Design Feedback"
deck (10 slides, received 2026-09-10). Baseline: repo at `4e8a41b`, staging
https://chronospace-v2.vercel.app (Vercel auto-deploys `main`).

Every finding below was measured on staging at 1496x900 and 1920x1080 before
the fix was written. Numbers quoted are CSS px from the page top unless said
otherwise.

---

## 0. Working rules (read before any task)

**Branch and commits.** Work on the current branch
(`claude/chronospace-design-feedback-1d8277`). One commit per task, message
in the repo's style (a sentence saying what and why, no prefix), ending with
`Feedback item N`. Do NOT push to `main` or merge: `main` deploys to
production staging and the user decides when that happens.

**House rules that lint enforces** (`tooling/eslint/rules/`):

- Arbitrary Tailwind color/typography values are errors
  (`bg-[#...]`, `text-[14px]`, `leading-[...]`, `tracking-[...]`). Use tokens
  from `src/app/globals.css` (`bg-paper`, `text-ink`, `text-muted`,
  `border-line`, `text-accent`) and `type-*` utilities.
- Arbitrary layout values (`w-[100px]`, `pt-[64px]`) are warnings; values
  containing `var(`/`calc(`/`min(`/`max(`/`clamp(` are exempt. Prefer the
  spacing scale (`w-25`, `gap-5.5`, `mt-20`).
- `style={{}}` may contain ONLY `--custom-properties`. Everything else goes
  in a CSS module or Tailwind.
- No `"use client"` outside `*.client.tsx`. Section root files stay server
  components. Client islands are small and named `*.client.tsx`.
- No inline `<svg>` in TSX. Add SVGs to `src/icons/source/` and run
  `npm run icons:generate`. `src/icons/generated/` is read-only output.
- Raster images through `next/image`. `<video>` is fine.
- Every animation honours `prefers-reduced-motion` (globals.css collapses
  durations/delays globally; JS islands must bail on
  `matchMedia("(prefers-reduced-motion: reduce)")`).
- React hooks lint forbids synchronous `setState` inside effects. Drive
  state from DOM/media events or write to the DOM via refs.
- Section `index.ts` files are re-export-only.
- Colocate one-off assets/subcomponents in the section folder. Move to
  `src/components` only when two sections use it.

**Verify after every task** (all must pass):

```bash
npm run format:fix && npm run lint && npm run typecheck && npm run build
```

**Visual verification.** Serve the build with `npx next start -p 4939`
(check the port is free first). In this environment the browser pane
(`mcp__Claude_Browser__*`) may be hidden, so screenshots can fail; use
`javascript_tool` with the measurement snippet in section 9 instead. It
returns geometry for every checked element and the pass/fail list.
Emulate widths with `resize_window` (1440x900, 1496x900, 1920x1080, and
the `mobile` preset), reset with preset `desktop` when done.

**Tooling available:** `ffmpeg` at `/opt/homebrew/bin/ffmpeg`, `sips`,
`node`, `npm`. Scratch dir: the session scratchpad (see system prompt), not
`/tmp`.

**Tokens and geometry you will reuse:**

- Design width 1496, gutter `--gutter` = 40px at 1496, content box 1416.
  Three-column grid: `grid-cols-3 gap-5.5` gives 457px columns at
  x = 40 / 519 / 999.
- Type: `type-display-xs sm:type-display-sm lg:type-display-md` for section
  H2s, `type-body-xl` lede at `opacity-60`, `type-title-lg` card titles,
  `type-nav` (12px uppercase Nippo), `type-caption` (10px uppercase Nippo).
- Reveal system: wrap a section's content in `RevealScope`
  (`src/components/reveal-scope.client.tsx`); children use `shimmer-in`
  (text) or `sweep-in` (blocks) with `style={{ "--beat": n }}`.
- The hero uses the load-time variants `shimmer-reveal` / `sweep-reveal`
  with `--reveal-index`.

---

## 1. Decisions already taken (do not stop to ask)

1. Product section heading becomes centred like Viewer/Team/Science. (The
   comp offsets it; the client reads that as skew. Departure noted in the
   commit message.)
2. CTA labels are vertically centred in every size, nav cells included.
   (Departure from the comp's "label pinned low".)
3. The scramble hover effect is deleted, not made optional.
4. Team is rebuilt in the capture grammar (large desaturated portraits),
   not merely re-centred. Heading copy: "Meet the team".
5. Footer hides links whose href is `#` (Terms, Privacy) until real URLs
   exist in `site.config.ts`.
6. Hero cameras are billboards inside the perspective stage, not decals on
   the wall faces.
7. Interim media edits (trimming `wild.mp4` to its reconstruction pass,
   trimming `measurable.mp4` to a ~18s loop) are done now with a `TODO`
   comment naming the client asset that replaces them.
8. The `manufacturing.mp4` take (currently unused) becomes the intro
   section's visual.

Anything not covered: pick the option closest to an existing pattern in the
repo and note it in the commit message.

---

## 2. Task order

| #   | Task                                           | Items | Files (primary)                                                |
| --- | ---------------------------------------------- | ----- | -------------------------------------------------------------- |
| T1  | Section rhythm tokens + centred headers        | 7     | globals.css, product, capture, team, science, problem, vision  |
| T2  | CTA and nav cell centring                      | 4     | cta-link.tsx, site-header.tsx                                  |
| T3  | Remove scramble effect                         | 5     | scramble-label.\*, cta-link.tsx, site-header.tsx, footer       |
| T4  | Footer rebuild                                 | 12, 7 | footer.tsx                                                     |
| T5  | Hero copy anchored to the room                 | 1     | hero.tsx                                                       |
| T6  | Hero idle motion + trail cycle + live timecode | 2     | hero-room-eye.client.tsx, hero-cards.module.css, hero-timeline |
| T7  | Hero cameras                                   | 3     | hero-room-cameras.tsx, hero-room.module.css, camera.svg        |
| T8  | Intro section spread                           | 6     | sections/problem/\*, pointer-drift.client.tsx                  |
| T9  | Team rebuild                                   | 11    | sections/team/\*                                               |
| T10 | Measurement overlay: viewer + queryable take   | 9, 10 | measure-overlay.client.tsx, capture-player, product            |
| T11 | Interim trim of the "no stage" take            | 8     | public/videos/wild.mp4, product.tsx                            |
| T12 | Docs                                           | -     | docs/handoff.md                                                |

T1-T4 first (they are the client's "measurable" complaints). T5-T7 touch
only the hero folder. T8, T9, T10, T11 are independent of each other.

---

## T1. Section rhythm tokens and centred headers (item 7)

**Client:** "One capture..." heading skewed right; inconsistent spacing and
alignment across the site.

**Measured on staging (1496):**

| Section | Header                  | pt  | pb  | header→content |
| ------- | ----------------------- | --- | --- | -------------- |
| Problem | 42.23% offset, 698 wide | 120 | 120 | -              |
| Product | 42.23% offset, 698 wide | 108 | 120 | 152            |
| Viewer  | centred                 | 80  | 136 | 112            |
| Team    | centred                 | 80  | 120 | 64             |
| Science | centred                 | 72  | 120 | 80             |
| Vision  | centred                 | 120 | 120 | -              |

**Target:** every section `py` = 120px, header→content gap = 80px, headers
centred on a 698px measure with the lede 20px under.

### Edits

`src/app/globals.css`, in `@theme inline`: replace the unused
`--spacing-section: clamp(4rem, 8vw, 7rem);` with

```css
/* Section rhythm: 120 above and below every section, 80 from a
     section's header stack to its content. */
--spacing-section: 7.5rem;
--spacing-section-gap: 5rem;
```

(Confirm with `grep -rn "section\b" src --include=*.tsx` that nothing uses
`py-section`/`-section` today. `section-container` is unrelated and stays.)

`src/app/sections/product/product.tsx`:

- `<section id="product" className="section-container relative pt-27 pb-30">`
  → `className="section-container relative py-section"`.
- Replace the header block

  ```tsx
  <div className={styles.column}>
    <h2 className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in text-balance" style={{ "--beat": 0 }}>
    <p className="type-body-xl shimmer-in mt-6 max-w-115 opacity-60" style={{ "--beat": 1 }}>
  ```

  with the Team/Viewer pattern:

  ```tsx
  <div className="flex flex-col items-center gap-5 text-center">
    <h2
      className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
      style={{ "--beat": 0 }}
    >
      One capture, three things nobody else can hand you
    </h2>
    <p
      className="type-body-xl shimmer-in max-w-115 text-pretty opacity-60"
      style={{ "--beat": 1 }}
    >
      For anyone training models on the physical world, the capture itself is
      the asset.
    </p>
  </div>
  ```

- Cards grid: `className="mt-20 grid grid-cols-1 gap-5.5 md:mt-38 md:grid-cols-3"`
  → `className="mt-section-gap grid grid-cols-1 gap-5.5 md:grid-cols-3"`.
- Delete `import styles from "./product.module.css";` and delete
  `product.module.css` (it only holds `.column`). Update the file's header
  comment: the heading is centred now, not on the 42.23% column.

`src/app/sections/capture/capture.tsx`:

- `pt-20 pb-34` → `py-section`.
- Player wrapper `"sweep-in mx-auto mt-16 max-w-206.5 md:mt-28"` →
  `"sweep-in mx-auto mt-section-gap max-w-206.5"`.

`src/app/sections/team/team.tsx` (T9 rewrites this file; if T9 is done in
the same pass, apply there): `pt-20 pb-30` → `py-section`; grid `mt-16` →
`mt-section-gap`.

`src/app/sections/science/science.tsx`: `pt-18 pb-30` → `py-section`; grid
`mt-20` → `mt-section-gap`.

`src/app/sections/problem/problem.tsx`: `py-30` → `py-section` (same value,
now tokenised). T8 rewrites this section; keep the token.

`src/app/sections/vision/vision.tsx`: `py-30` → `py-section`.

### Acceptance

- Measurement snippet: every section in `#problem #product #viewer #team
#science #vision` reports `pt === pb === 120`.
- `#product h2` centre x within 2px of viewport centre; `#product` grid top
  minus lede bottom = 80 (±2).
- Viewer/Team/Science: content top minus lede bottom = 80 (±2).

---

## T2. CTA and nav cell centring (item 4)

**Client:** "Connect with us" not centre-aligned in its container.

**Measured:** hero CTA box y 310-370 (h 60); label box y 340-355, centre
347.5 vs box centre 340. Cause: `pt-8 pb-4` in the `hero` size. `nav` size
uses `items-end pb-4`; `list` uses `pt-6 pb-4`. Horizontal padding is
already symmetric.

### Edits

`src/components/cta-link.tsx` `sizes`:

```ts
  nav: {
    root: "h-full items-center justify-center gap-2.5 px-6",
    ...
  },
  hero: {
    root: "h-15 w-52 items-center justify-between px-4",
    ...
  },
  list: {
    root: "h-13.5 w-59.75 items-center justify-between px-4",
    ...
  },
```

Update the file's header comment (remove "label pinned low in the box";
say the label and arrow are centred on the box's midline at the client's
request, September 2026).

`src/components/site-header.tsx`:

- `const navCell = "hover:bg-paper focus-visible:bg-paper flex h-full items-end transition-colors duration-150 ease-out";`
  → `items-center`.
- Nav link className `"${navCell} type-nav text-ink hidden px-6 pb-4 lg:flex"`
  → `"${navCell} type-nav text-ink hidden px-6 lg:flex"`.

Footer cells (`items-end pb-4`) are replaced wholesale in T4.

### Acceptance

- Hero CTA: `|labelCentreY - boxCentreY| <= 1` and `|arrowCentreY - boxCentreY| <= 1`.
- Nav: each `header nav a` label centre y within 1px of the header's centre y.
- Science list CTAs and the contact page's "Book a call" (`variant="outline"`,
  default size) still render 60px/54px tall with centred labels.

---

## T3. Remove the scramble hover (item 5)

**Client:** the text scramble animation is distracting.

### Edits

- Delete `src/components/scramble-label.client.tsx` and
  `src/components/scramble-label.module.css`.
- `src/components/cta-link.tsx`: remove the import; replace

  ```tsx
  <span className={style.label}>
    {typeof children === "string" ? (
      <ScrambleLabel>{children}</ScrambleLabel>
    ) : (
      children
    )}
  </span>
  ```

  with `<span className={style.label}>{children}</span>`.

- `src/components/site-header.tsx`: remove the import; `<ScrambleLabel>{item.label}</ScrambleLabel>`
  → `{item.label}`. Fix the header comment (lines 15-16 mention the
  shuffle): nav cells fill with the page ground on hover, nothing else.
- `src/app/sections/footer/footer.tsx`: remove the import and usage (T4
  rewrites the file anyway).
- `grep -rn "Scramble\|scramble" src` must return nothing.

### Acceptance

Lint/typecheck pass; hovering nav cells shows only the `bg-paper` fill;
hovering CTAs shows only the arrow nudge.

---

## T4. Footer rebuild (item 12, plus grid alignment from item 7)

**Client:** links stacked with excessive space, no grouping or hierarchy,
disconnected from the layout.

**Measured (1496):** five rows of 64px in a 399px column (x 1097-1496),
wordmark 678x130, © row styled like the links, Terms/Privacy href `#`. The
column ignores the 3-column grid (column three is x 999-1456).

### Target layout

Two rows inside `section-container`, on the same 3-column grid as the
cards above:

```
┌──────────────────────────────────────────┬──────────────────────┐
│ [wordmark, ~1/3 page wide]               │ COMPANY    LEGAL     │
│ [fig. brackets under it]                 │ LinkedIn   Terms     │
│                                          │ Contact    Privacy   │
├──────────────────────────────────────────┴──────────────────────┤
│ © 2026 ChronoSpace AI                            Made by tonik   │
└──────────────────────────────────────────────────────────────────┘
```

### Edits - rewrite `src/app/sections/footer/footer.tsx`

Keep `figures`, `Measure` and the `ChronospaceLogoIcon` block (with its
aspect fix). Delete `rows`, `cell`, `cellLink`, the `ScrambleLabel` import.
New structure:

```tsx
const groups: { label: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    label: "Company",
    links: [
      { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
      { label: "Contact", href: siteConfig.links.contact },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms and conditions", href: siteConfig.links.terms },
      { label: "Privacy Policy", href: siteConfig.links.privacy },
    ],
  },
]
  // Placeholder links stay out of the page until site.config has real ones.
  .map((group) => ({ ...group, links: group.links.filter((link) => link.href !== "#") }))
  .filter((group) => group.links.length > 0);

export function Footer() {
  return (
    <footer className="section-container relative">
      <RevealScope className="border-line flex flex-col gap-10 border-t pt-10 pb-8">
        <div className="grid gap-10 md:grid-cols-3 md:gap-5.5">
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Half of a two-thirds column: a third of the page. */}
            <div className="flex w-2/3 flex-col gap-6 md:w-1/2">
              <ChronospaceLogoIcon ... className="text-ink sweep-in aspect-(--logo-aspect) h-auto min-h-0 w-full" style={{ "--logo-aspect": "167.381 / 32", "--beat": 0 }} />
              <div aria-hidden className="sweep-in hidden sm:flex" style={{ "--beat": 1 }}>
                {figures.map(...)}   {/* unchanged */}
              </div>
            </div>
          </div>

          <nav aria-label="Footer" className="flex gap-16 md:gap-20">
            {groups.map((group, index) => (
              <div key={group.label} className="sweep-in flex flex-col gap-4" style={{ "--beat": 2 + index }}>
                <p className="type-caption text-muted">{group.label}</p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="type-nav text-ink hover:text-accent focus-visible:text-accent transition-colors duration-150 ease-out" {...(link.external && { target: "_blank", rel: "noreferrer" })}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="border-line sweep-in flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between" style={{ "--beat": 4 }}>
          <p className="type-caption text-muted">© 2026 ChronoSpace AI</p>
          <a href={siteConfig.links.madeBy} target="_blank" rel="noreferrer" className="type-caption text-muted hover:text-ink transition-colors duration-150 ease-out">
            Made by tonik
          </a>
        </div>
      </RevealScope>
    </footer>
  );
}
```

Rewrite the header comment to describe this structure (two rows, groups on
grid column three, placeholder links filtered).

### Acceptance

- Footer height at 1496 under 260px (was 360).
- `footer nav` left edge x = 999 (±1) at 1496 - same as the third product
  card.
- With `terms`/`privacy` = `#`, the Legal group is absent; setting them to a
  URL in `site.config.ts` brings it back (check once, then revert).
- Keyboard: every link focusable, focus shows `text-accent`.

---

## T5. Hero copy anchored to the room (item 1)

**Client:** headline too high, escapes the room; awkward empty space between
headline and the figures.

**Measured:**

| Viewport  | back wall top | h1 top | CTA bottom | cards top (min) |
| --------- | ------------- | ------ | ---------- | --------------- |
| 1440x900  | 144           | 164    | 370        | ~385            |
| 1496x900  | 150           | 164    | 370        | 386             |
| 1920x1080 | 192           | 164    | 370        | 489             |

Cause: `hero.tsx` line 45 `pt-24 ... md:pt-26` is fixed px (60 navbar + 104
= 164) while the plate is `max(60%, 48.4vw)` tall and the back wall's top
edge is 20.68% of the plate (119.1/576 in the plate survey).

### Edit

`src/app/sections/hero/hero.tsx` line 45:

```tsx
<div className="section-container relative flex flex-col items-center pt-24 text-center md:pt-26">
```

→

```tsx
<div className="section-container relative flex flex-col items-center pt-24 text-center md:pt-[max(6.5rem,calc(12.5vw-var(--spacing-navbar-rest)))]">
```

(`max(`/`calc(`/`var(` make this an allowed structural escape hatch.)

Resulting headline top = max(164, 12.5vw): 164 at ≤1312px (unchanged from
today), 180 at 1440, 187 at 1496, 240 at 1920, 320 at 2560. The back wall
top is 10vw at xl+, so the headline always sits ≥ 2.5vw inside it.

Update the comment above (lines 13-16 mention "104 below the navbar to the
headline"): the offset now scales with the room, 12.5vw floored at 104.

Do not change the cards' `feet`; they stand on the floor line.

### Acceptance (measurement snippet, xl+ widths 1440/1496/1920)

- `h1.top >= backWall.top + 24`.
- `min(card.top) - cta.bottom` between -20 and 80. (Card boxes are
  invisible windows; figure pixels start ~30-60px below the box top.)
- Below `xl` (1024 wide, mobile preset): h1 top unchanged from before
  (156 at sm, 164 at md), cards still in the three-column strip.

---

## T6. Hero idle motion, trail cycle, live timecode (item 2)

**Client:** graphics static unless hovered; wants default motion.

**Current:** `hero-room-eye.client.tsx` writes `--eye-x/--eye-y` and
`--float-x/--float-y` only from `pointermove`, bails on coarse pointers, and
parks its rAF loop when settled. Echo trails (`hero-cards.module.css`) show
once for 2.4s on load then only on hover.

### 6a. Idle drift - edit `hero-room-eye.client.tsx`

Constants to add:

```ts
/** No pointer input for this long and the room starts to drift, ms. */
const IDLE_AFTER = 1500;
/** Drift amplitude as a fraction of the pointer's -1..1 range. */
const DRIFT = { fine: { x: 0.35, y: 0.2 }, coarse: { x: 0.22, y: 0.12 } };
/** Two incommensurate periods, ms, so the path never repeats visibly. */
const DRIFT_PERIOD_X = 14000;
const DRIFT_PERIOD_Y = 9000;
/** The chase is slower when the drift is driving, so a hand-off is soft. */
const TAU_DRIFT = 400;
```

Behaviour changes:

1. Replace the coarse-pointer early return with
   `const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;`
   Attach `pointermove`/`pointerleave`/`blur` listeners only when `fine`.
   Keep the reduced-motion early return.
2. Track `let lastMove = -Infinity;` set to `now` in `onMove`.
3. In `tick`: `const idle = !tracking || now - lastMove > IDLE_AFTER;`
   If idle:
   ```ts
   const amp = fine ? DRIFT.fine : DRIFT.coarse;
   targetX = amp.x * Math.sin((now / DRIFT_PERIOD_X) * 2 * Math.PI);
   targetY = amp.y * Math.sin((now / DRIFT_PERIOD_Y) * 2 * Math.PI + 1);
   ```
   else compute the pointer target as today. Use `TAU_DRIFT` when idle,
   `TAU` otherwise.
4. The loop no longer parks on settle (the target is always moving). It
   parks when the hero is off-screen or the tab is hidden:
   - `IntersectionObserver` on `section` (threshold 0): on intersect →
     `wake()`; on leave → `cancelAnimationFrame(frame); frame = undefined`.
   - `document.addEventListener("visibilitychange", ...)`: hidden → cancel;
     visible → wake.
     Keep `MAX_STEP` so a resumed loop never jumps.
5. `wake()` on mount so the drift starts without any pointer input.
6. Cleanup removes every listener/observer and the four properties.

Update the header comment: the eye drifts on its own when nobody is
steering it, on every device, and stops when the hero is off-screen.

### 6b. Trail round-robin

`hero-cards.module.css`: change `.card:hover .echo {` to
`.card:hover .echo, .card[data-echo] .echo {`. Update the comment.

`hero-room-eye.client.tsx` (same island; it already owns the hero clock):

```ts
/** Delay before the first automatic trail, ms - after the load-time trail
    has finished collapsing (--echo-hold 2.4s + 0.45s + stagger). */
const ECHO_FIRST = 6000;
/** Interval between automatic trails, ms, and how long each stays out. */
const ECHO_EVERY = 5000;
const ECHO_HOLD = 1600;
```

`const cards = section.querySelectorAll<HTMLElement>("[data-float] article");`
Cycle: `setTimeout(ECHO_FIRST)` then `setInterval(ECHO_EVERY)`; each firing
sets `data-echo=""` on `cards[i % cards.length]`, removes it after
`ECHO_HOLD`, increments `i`. Pause/clear the timers when the section is not
intersecting or the document is hidden (reuse the observers from 6a).
Reduced motion: never started (the early return covers it).

### 6c. Live timecode

New `src/app/sections/hero/hero-timecode.client.tsx`:

```tsx
"use client";
import { useEffect, useRef } from "react";

// The ruler's timecode runs while the page is up: HH:MM:SS:FF at 30fps
// from the comp's resting 00:00:14:07. Written straight to the node on
// each frame - no React state, nothing re-renders. Static under reduced
// motion and while the tab is hidden.

const FPS = 30;
const START_FRAMES = ((0 * 60 + 0) * 60 + 14) * FPS + 7;

function format(frames: number) {
  /* HH:MM:SS:FF, zero-padded */
}

export function HeroTimecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    // reduced-motion bail; rAF loop computing
    // START_FRAMES + Math.floor((performance.now() - t0) / 1000 * FPS);
    // write ref.current.textContent only when the frame count changes;
    // pause on visibilitychange hidden.
  }, []);
  return <span ref={ref}>00:00:14:07</span>;
}
```

`hero-timeline.tsx`: replace `<span>00:00:14:07</span>` with
`<HeroTimecode />`. Update the comment.

### Acceptance

- With no pointer movement, `--eye-x` on `[data-stage]` changes over 3s
  (read via `getComputedStyle(stage).getPropertyValue("--eye-x")` twice).
- Mobile preset: same check passes (drift on coarse pointers).
- After ~11s at least one `article[data-echo]` has appeared and been
  removed.
- Timecode text changes between two reads 1s apart.
- With `prefers-reduced-motion: reduce` emulated (Chromium:
  `Emulation.setEmulatedMedia` is not available via the pane; instead
  temporarily toggle the matchMedia checks by hand once, or trust the early
  returns) - at minimum re-read the three early returns.
- `document.hidden` path: cannot be driven from the pane; review by reading.

---

## T7. Hero cameras (item 3)

**Client:** place visible cameras in the 3D scene to show how capture
occurs.

**Context:** the client's real room (visible in every take) is lined with
small wall-mounted camera units. The hero room is the same box, bare.

### Geometry you need (from `hero-room.module.css`)

Stage: `perspective: 100cqw`, `perspective-origin: 49.82% 73.09%`, faces are
direct children with `position:absolute; top:0; left:0; transform-origin:0 0`
(rule `.stage > *`) and every face's transform starts with `var(--eye)`.
Face planes: left wall at x = -2.735cqw, right wall at x = 102.375cqw, back
wall at z = -81.82cqw, ceiling at y = -22.2cqh, floor at y = 98.2cqh. The
visible room runs z from 0 (plate plane) back to -81.82cqw.

### 7a. Icon

`src/icons/source/camera.svg` - a housing with a lens hole (one evenodd
path so the lens shows the wall through it):

```svg
<svg viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1 0h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Zm5 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" fill="currentColor"/>
</svg>
```

Run `npm run icons:generate` → `CameraIcon`.

### 7b. Component `src/app/sections/hero/hero-room-cameras.tsx` (server)

Returns a fragment of `<span>` units so each is a direct child of the stage
(the `.stage > *` rule must apply):

```tsx
type Unit = { x: string; y: string; z: string; cone?: string; ledDelay: string; ledPeriod: string };

// Stage coordinates: x/z in cqw, y in cqh. Two rows per side wall, one
// along the back wall, a hair off each plane so the glyph never z-fights
// the face. `cone` is the rotation, degrees, of a faint view cone toward
// the room's centre; only four units carry one.
const units: Unit[] = [
  // left wall (x just inside -2.735cqw)
  { x: "-1.6cqw", y: "8cqh",  z: "-68cqw", ledDelay: "0s",   ledPeriod: "4.1s" },
  { x: "-1.6cqw", y: "8cqh",  z: "-44cqw", ledDelay: "1.3s", ledPeriod: "5.3s", cone: "-28deg" },
  { x: "-1.6cqw", y: "8cqh",  z: "-20cqw", ledDelay: "2.7s", ledPeriod: "4.7s" },
  { x: "-1.6cqw", y: "40cqh", z: "-68cqw", ledDelay: "0.8s", ledPeriod: "6.1s" },
  { x: "-1.6cqw", y: "40cqh", z: "-44cqw", ledDelay: "3.4s", ledPeriod: "4.3s" },
  { x: "-1.6cqw", y: "40cqh", z: "-20cqw", ledDelay: "1.9s", ledPeriod: "5.9s" },
  // right wall (mirror, x just inside 102.375cqw)
  { x: "100.2cqw", ... same z/y grid, cone: "28deg" on the y 8 / z -44 unit ... },
  // back wall (z just in front of -81.82cqw), one row
  { x: "15cqw", y: "8cqh", z: "-80.5cqw", ... },
  { x: "38cqw", y: "8cqh", z: "-80.5cqw", cone: "-10deg", ... },
  { x: "62cqw", y: "8cqh", z: "-80.5cqw", cone: "10deg", ... },
  { x: "85cqw", y: "8cqh", z: "-80.5cqw", ... },
];

export function HeroRoomCameras() {
  return units.map((unit) => (
    <span key={`${unit.x}${unit.y}${unit.z}`} className={styles.camera}
      style={{ "--cam-x": unit.x, "--cam-y": unit.y, "--cam-z": unit.z, "--led-delay": unit.ledDelay, "--led-period": unit.ledPeriod, "--cone": unit.cone }}>
      {unit.cone && <span className={styles.cone} />}
      <CameraIcon width="100%" height="100%" />
      <span className={styles.led} />
    </span>
  ));
}
```

`hero-room.tsx`: render `<HeroRoomCameras />` inside `[data-stage]` after
`<span className={styles.back} />`. Keep `aria-hidden` on the room.

### 7c. CSS - append to `hero-room.module.css`

```css
/*
 * The capture rig. The client's room is lined with small camera units, so
 * this one is too: billboards standing a hair off each wall inside the
 * same perspective as the faces, so they shrink with depth and ride the
 * eye move for free. Sized in cqw like everything else in the box. A few
 * carry a faint view cone toward the floor; every one carries a recording
 * LED that flicks on its own irregular clock.
 */
.camera {
  width: 2cqw;
  aspect-ratio: 12 / 8;
  color: color-mix(in srgb, var(--ink) 28%, transparent);
  transform: var(--eye) translate3d(var(--cam-x), var(--cam-y), var(--cam-z));
}

.led {
  position: absolute;
  top: 12%;
  right: 8%;
  width: 14%;
  aspect-ratio: 1;
  background: var(--accent);
  animation: led-flick var(--led-period, 5s) steps(1, end) infinite;
  animation-delay: var(--led-delay, 0s);
}

@keyframes led-flick {
  0%,
  91% {
    opacity: 1;
  }
  93% {
    opacity: 0.15;
  }
  95%,
  100% {
    opacity: 1;
  }
}

.cone {
  position: absolute;
  top: 100%;
  left: 50%;
  width: 6cqw;
  height: 34cqh;
  transform-origin: 50% 0;
  transform: translateX(-50%) rotate(var(--cone, 0deg));
  background: linear-gradient(
    to bottom,
    rgb(255 255 255 / 5%),
    transparent 85%
  );
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
  pointer-events: none;
}
```

Reduced motion: globals.css collapses the LED animation to its final frame
(opacity 1). Nothing else moves. No JS.

### Tuning (one pass, then stop)

Serve, screenshot or measure at 1496. If the cones read as flashlights,
drop `.cone` opacity to 3% or remove the two back-wall cones. If the units
read as noise, drop to one row per side wall. Density target: "a rig",
not "wallpaper".

### Acceptance

- 16 `.camera` spans render inside `[data-stage]`; each has a non-identity
  `transform` and lies within the plate's box at 1496 and 1920.
- Lighthouse-ish sanity: the hero still animates at 60fps in DevTools
  performance (cannot be measured from the pane - skip if unavailable, note
  it).

---

## T8. Intro ("Problem") section spread (item 6)

**Client:** heavily text-dense, no animation or visual breaks; feels like a
placeholder.

**Current:** two 32px paragraphs on a 698px column at `margin-left:
42.23%`; left 42% is empty; only motion is the read sweep.

### 8a. Shared pointer drift

`src/app/sections/vision/vision-parallax.client.tsx` becomes
`src/components/pointer-drift.client.tsx`, export `PointerDrift` (same
body; it attaches to `closest("section")`). Update the vision import and
its comments. Both sections now use it, which is the rule for moving a file
to `src/components`.

### 8b. Poster

```bash
ffmpeg -y -i public/videos/manufacturing.mp4 -frames:v 1 -q:v 4 src/app/sections/problem/manufacturing-poster.jpg
```

### 8c. Rewrite `src/app/sections/problem/problem.tsx`

```tsx
import { MeasureBracketIcon } from "@/icons/generated";
import { PointerDrift } from "@/components/pointer-drift.client";
import { ReadProgress } from "@/components/read-progress.client";
import { RevealScope } from "@/components/reveal-scope.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import manufacturingPoster from "./manufacturing-poster.jpg";
import styles from "./problem.module.css";

const paragraphs = [
  "Frontier models have consumed everything that was already digital. The physical world - where the work actually happens - was never recorded in a form a machine can use.",
  "ChronoSpace records it: full geometry over time, from any viewpoint, at any moment. A finished capture streams like ordinary video and stays measurable inside it.",
];

// The three questions a finished capture answers, each with the reading
// the viewer below will land on - the claim rehearsed before it is proved.
const readings: [string, string][] = [
  ["Where a part travelled", "1.04 m"],
  ["How long a cycle took", "00:00:14:07"],
  ["Whether a foot crossed the line", "Yes · 00:00:09:12"],
];

export function Problem() {
  let wordIndex = 0;
  return (
    <section id="problem" className="section-container py-section relative">
      <RevealScope className="grid gap-12 md:grid-cols-12 md:gap-5.5">
        <PointerDrift>
          <div
            className={`${styles.visual} sweep-in md:col-span-5`}
            style={{ "--beat": 0 }}
          >
            <TimelinePlayer
              src="/videos/manufacturing.mp4"
              poster={manufacturingPoster.src}
              fallbackDuration={8}
              aspect="4 / 5"
              name="the manufacturing take"
              compact
              preload="none"
            />
          </div>
        </PointerDrift>

        <div className="flex flex-col gap-10 md:col-span-7 md:max-w-174.5">
          <div
            className={styles.copy}
            data-read-copy
            style={{ "--word-count": wordCount }}
          >
            {/* paragraphs → words, exactly as today (sr-only full text + aria-hidden word spans) */}
          </div>

          <dl className="flex flex-col">
            {readings.map(([term, value], index) => (
              <div
                key={term}
                className="border-line sweep-in flex items-center justify-between gap-6 border-t py-4 last:border-b"
                style={{ "--beat": 1 + index }}
              >
                <dt className="type-body-lg flex items-center gap-4 font-light">
                  <MeasureBracketIcon
                    width={13.5}
                    height={13.5}
                    className="text-accent shrink-0"
                  />
                  {term}
                </dt>
                <dd className="type-nav text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <ReadProgress />
        </div>
      </RevealScope>
    </section>
  );
}
```

Note: `PointerDrift` renders a `display: contents` wrapper, so the
`md:col-span-5` child still participates in the grid. `ReadProgress`
looks for `[data-read-copy]` among its parent's children - keep it a
sibling of the copy div, as above.

`problem.module.css`: remove the `margin-left: 42.23%` / `max-width` block
(the grid handles it). Add:

```css
/* The take hangs at its own depth behind the copy: it eases a few pixels
   against the pointer (pointer-drift.client.tsx), the copy holds still. */
.visual {
  transform: translate(
    calc(var(--drift-x, 0px) * 0.6),
    calc(var(--drift-y, 0px) * 0.6)
  );
}
```

Keep `.copy` (`--read-progress: 1; display:flex; flex-direction:column;
gap:1.2em`) and `.word`.

Rewrite the header comment: two columns, the take on the left, the lede
and the three readings on the right; geometry as fractions of the 12-col
grid (5/12 ≈ the comp's 42%).

### Acceptance

- At 1496: visual column x 40-616 (5 cols), copy starts x ≈ 638.
- Video autoplays on arrival (IntersectionObserver in TimelinePlayer);
  `preload="none"` so no bytes before that.
- Read sweep still runs on the lede (words change colour with scroll).
- Mobile: visual stacks above copy, `aspect 4/5` full width.

---

## T9. Team rebuild (item 11)

**Client:** left-skewed; dated, "corporate 2000s".

**Current:** centred header; per column a 153px square portrait + name +
role left-aligned in a 457px column with `px-8 py-6`. Heading "Meet Team".
PNGs: check sizes with `sips -g pixelWidth -g pixelHeight`; `aashish-rai.png`
is 2.1MB.

### 9a. Assets

The sources are square: `aashish-rai.png` 1280x1280 (2.1MB),
`tamar-kreitman.png` 800x800, `srinath-sridhar.png` 512x512. Keep them
square (no crop, no upscale) and re-encode to JPEG so the repo stops
carrying 3.4MB of PNG:

```bash
for n in aashish-rai tamar-kreitman srinath-sridhar; do
  ffmpeg -y -i src/app/sections/team/$n.png -vf "scale='min(1000,iw)':-2" -q:v 3 src/app/sections/team/$n.jpg
done
```

Delete the PNGs once the JPGs are imported. The 512px portrait is soft at
the 457px column on 2x displays; add "higher-resolution portrait of
Srinath Sridhar (≥1000px)" to the client asks (section 10).

### 9b. Rewrite `src/app/sections/team/team.tsx`

```tsx
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import { CtaArrowIcon } from "@/icons/generated";
import styles from "./team.module.css";
// import the three .jpg files

export function Team() {
  return (
    <section id="team" className="section-container py-section relative">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Meet the team
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Years of frontier research on reconstructing the physical world, now
            building the infrastructure for it.
          </p>
        </div>

        <div className="mt-section-gap grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className={`${styles.card} sweep-in flex flex-col`}
              style={{ "--beat": 2 + index }}
            >
              {/* The portrait is a link too, but the caption's link is the
                  accessible one - one LinkedIn entry per person for the
                  keyboard and screen readers. */}
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden
                className={`${styles.portrait} relative block aspect-square overflow-clip`}
              >
                <Image
                  src={founder.photo}
                  alt=""
                  fill
                  sizes="(min-width: 48rem) 33vw, 100vw"
                  className="object-cover"
                />
              </a>
              <div className="border-line flex flex-col gap-3 border-t py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-title-lg">{founder.name}</h3>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${founder.name} on LinkedIn`}
                    className="type-nav text-muted hover:text-ink focus-visible:text-ink flex items-center gap-2 transition-colors duration-150 ease-out"
                  >
                    LinkedIn
                    <CtaArrowIcon
                      width={6.4}
                      height={8}
                      className="-rotate-45"
                    />
                  </a>
                </div>
                <p className="type-body-lg leading-tight font-light">
                  {founder.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
```

New `team.module.css`:

```css
/* The portraits rest in the room's grey like the hero figures and the
   takes, and take their colour back when the card is asked about -
   hovering the caption counts, so the whole card is one object. */
.portrait img {
  filter: grayscale(1);
  transition: filter 0.35s ease;
}

.card:hover .portrait img,
.card:focus-within .portrait img {
  filter: none;
}
```

Rewrite the header comment (capture grammar; the comp's 153px tiles and
`7802:8912` are superseded at the client's request).

### Acceptance

- Three portraits each 457px wide at 1496, tops aligned, captions'
  hairlines on one y.
- Hovering anywhere on a card colours its portrait.
- `article a[aria-hidden]` is not in the tab order; the caption link is.
- No PNG left in `src/app/sections/team/`.

---

## T10. Measurement overlay - viewer and the queryable take (items 9, 10)

**Client (slide 8):** the "queryable" take shows nothing interactive; add a
tokenisation effect or height/width measurement. **(slide 9):** overlay
height, width, motion or speed metrics directly onto the subjects.

**Current:** `capture-player.client.tsx` renders a 7-row HUD `<dl>` in the
frame's corner, values synthesised from `currentTime`. `product.tsx` plays
`measurable.mp4` (60s, 960x540, burned-in "Long Duration - Playing at 30x"
label top-left and a heat-map strip bottom-left) with no overlay.
`TimelinePlayer` accepts `children` rendered inside `.frame` over the video.

### 10a. Shared component `src/components/measure-overlay.client.tsx`

Self-contained: on mount it finds the sibling `<video>`
(`ref.current.parentElement.querySelector("video")`), listens to
`play`/`pause`/`seeked`, and runs one rAF loop while the take plays (same
wake discipline as `timeline-player.client.tsx`). Each frame it evaluates
every mark at `video.currentTime` and writes CSS custom properties and
`textContent` directly on the mark nodes. No React state after mount.
Reduced motion: still attaches (the marks follow the paused/scrubbed frame
too), but the tokenisation sweep is skipped.

```ts
export type Keyframe = {
  t: number;
  x: number;
  y: number;
  w?: number;
  h?: number;
};
export type Mark =
  | {
      kind: "bracket";
      id: string;
      keyframes: Keyframe[];
      top?: Label;
      right?: Label;
    }
  | {
      kind: "line";
      id: string;
      y: number;
      from: number;
      to: number;
      activeFrom?: number;
      label: Label;
    }
  | { kind: "tag"; id: string; keyframes: Keyframe[]; label: Label };
type Label = string | ((t: number, duration: number) => string);

export function MeasureOverlay({
  marks,
  tokenise = false,
}: {
  marks: Mark[];
  tokenise?: boolean;
});
```

- Keyframe values are percentages of the frame (0-100). Linear
  interpolation between neighbours; before the first / after the last
  keyframe the mark is hidden (`--mark-opacity: 0`) unless it is the only
  keyframe (then it holds).
- `bracket`: a box at `(x, y, w, h)` drawn with four `MeasureBracketIcon`
  corners (rotations 0/90/180/270, `text-accent`, 13.5px). Optional labels:
  `top` centred above the box, `right` rotated vertical along the right
  edge. Labels: `type-caption text-ink bg-paper px-1`.
- `line`: 1px full-width-or-partial horizontal rule at `y` from `from`% to
  `to`% in `--line`; from `activeFrom` seconds it turns `--accent` and the
  label appears at its right end.
- `tag`: a 4px accent dot at `(x, y)` with a 24px leader to a label.
- `tokenise`: a full-frame layer with a dotted grid
  (`radial-gradient(circle, rgb(255 255 255 / 40%) 0.5px, transparent 1px) 0 0 / 12px 12px`)
  masked by a left-to-right wipe that plays once each time the take wraps
  to `t < 0.15` (detect `t < previousT`), 1.2s, then hides. CSS in
  `measure-overlay.module.css`; the island toggles `data-sweep` to replay.
- The overlay root is `position:absolute; inset:0; pointer-events:none;
aria-hidden`. All mark geometry is `left/top/width/height` in `%` from
  `--mark-x/--mark-y/--mark-w/--mark-h`.

### 10b. Viewer - edit `capture-player.client.tsx`

`echo.mp4` is 640x368, 4.94s. Annotate: extract frames
`ffmpeg -i public/videos/echo.mp4 -vf fps=4 <scratch>/echo-%02d.png` and
read them; record the taller figure's bounding box (x,y,w,h in % of frame)
at t = 0, 0.5, ... 4.5, and the moving hand/box position. Starting guess
from a 6-frame contact sheet (verify, then replace): the taller figure
enters around x 28%, y 18%, w 12%, h 78% and drifts right to about x 47%
by t ≈ 2.5s, then holds.

Marks:

```ts
const marks: Mark[] = [
  { kind: "bracket", id: "height", keyframes: [...], right: "1.77 m" },
  { kind: "tag", id: "path", keyframes: [...floor point under the moving figure...],
    label: (t, d) => `${((t / d) * 1.04).toFixed(2)} m` },
  { kind: "tag", id: "speed", keyframes: [...hand/box...], label: (t) => `${(0.4 + 0.25 * Math.sin(t * 3.1)).toFixed(1)} m/s` },
];
```

Render `<MeasureOverlay marks={marks} />` as the first child of
`TimelinePlayer`, keep the corner `<dl>` but trim `resting`/`measure()` to
three rows: `Frames kept`, `Tracked joints`, `Timebase` (Path/Depth/View/
Height moved onto the picture). Update the header comment.

### 10c. Queryable take - `product.tsx` + media

1. Trim the take to an 18s loop that contains the standing/walking
   passage and skips the burned-in-heavy opening if possible. Inspect:
   `ffmpeg -i public/videos/measurable.mp4 -vf fps=0.5 -q:v 5 <scratch>/m-%02d.jpg`,
   read the sheet, choose `SS`. Then:
   ```bash
   ffmpeg -y -ss SS -t 18 -i public/videos/measurable.mp4 -c:v libx264 -crf 24 -preset slow -an -movflags +faststart <scratch>/measurable.mp4 && mv <scratch>/measurable.mp4 public/videos/measurable.mp4
   ffmpeg -y -i public/videos/measurable.mp4 -frames:v 1 -q:v 4 src/app/sections/product/measurable-poster.jpg
   ```
   Set `cards[2].duration` to the new length (`ffprobe -show_entries format=duration`).
2. Cover the burned-in graphics with HUD chrome of our own: add two static
   `bg-paper` chips inside the overlay - top-left (x 1.5%, y 2%, w ≈ 22%,
   h ≈ 7%) showing `type-caption text-muted` "Long duration · 30×", and
   bottom-left (x 1.5%, y 76%, w ≈ 25%, h ≈ 22%) holding the three-row
   readings list (`Frames kept`, `Cycle`, `Timebase`). Measure the burned-in
   boxes on a frame first so the chips fully cover them at every size (they
   are percentages, so one measurement holds).
3. Marks: `bracket` height on the standing person (`right: "1.68 m"`),
   `line` at the floor y of the walking path with `activeFrom` at the moment
   a foot crosses it (`label: "Line crossed 00:00:12"`), `tokenise: true`.
4. Keyframes: annotate as in 10b with `fps=1` frames over the 18s.

`product.tsx`: the `Card` type gets `overlay?: ReactNode`; render
`{card.overlay}` as the `TimelinePlayer` child. Only the third card sets
it. Import `MeasureOverlay` and the marks from a colocated
`measurable-marks.ts` in `sections/product/`.

Add to the card comment: the burned-in tool graphics are covered by HUD
chips until the client sends a clean export (`TODO`).

### Acceptance

- Viewer: bracket tracks the figure through the 4.94s loop without lagging
  more than one frame; the path label reaches `1.04 m` at the loop end.
- Queryable: no burned-in label or heat-map visible at 1496 or mobile; the
  tokenisation sweep plays once per loop, not on every frame; the floor
  line turns accent once per loop.
- Scrubbing the range input moves the marks (they follow `seeked`).
- No React re-render per frame (React DevTools not available; verify by
  reading: the loop touches DOM via refs only).

---

## T11. Interim trim of the "no stage" take (item 8)

**Client:** the take shows a controlled studio with visible mounting
equipment; wants genuine in-the-wild capture. Not fixable without client
footage; do the interim and flag it.

1. `ffmpeg -i public/videos/wild.mp4 -vf fps=1 -q:v 5 <scratch>/w-%02d.jpg`,
   read the sheet, find the reconstruction (point-cloud) segment - roughly
   t 9-18s on the current file.
2. Trim to that segment (same command shape as T10c, `-t` = segment length),
   regenerate `wild-poster.jpg`, update `cards[0].duration`.
3. In `product.tsx` above `cards`, add:
   `// TODO(client): replace wild.mp4 with in-the-wild footage (outdoor / factory / field). The current file is trimmed to the reconstruction pass so the studio rig is not the subject; it is a stand-in.`

### Acceptance

The first product take shows the point cloud, not the camera-lined studio,
for its whole loop.

---

## T12. Docs

`docs/handoff.md`: update "Page state" for hero (copy offset in vw, idle
drift, trail cycle, cameras, timecode), problem (two-column spread), team
(capture grammar), footer (two rows), and add `measure-overlay.client.tsx`
and `pointer-drift.client.tsx` under shared components. Add a "Waiting on
client" list: in-the-wild footage, clean exports of the three takes, real
links (Research cards, Calendly, LinkedIn company, Terms, Privacy).

---

## 9. Measurement snippet

Run in the browser pane's `javascript_tool` after `resize_window` to each
width. Returns geometry and a `checks` array; every check must be `true`.

```js
const r = (el) => {
  const b = el.getBoundingClientRect();
  return {
    x: Math.round(b.left),
    y: Math.round(b.top + scrollY),
    w: Math.round(b.width),
    h: Math.round(b.height),
    bottom: Math.round(b.bottom + scrollY),
    cx: b.left + b.width / 2,
    cy: b.top + scrollY + b.height / 2,
  };
};
window.scrollTo(0, 0);
const hero = document.querySelector("main > section");
const stage = hero.querySelector("[data-stage]");
const backWall = r(stage.querySelector("span:nth-child(5)")); // ceiling, floor, left, right, back
const h1 = r(hero.querySelector("h1"));
const cta = hero.querySelector('a[href="/contact"]');
const ctaBox = r(cta),
  ctaLabel = r(cta.querySelector("span")),
  ctaArrow = r(cta.querySelector("svg"));
const cards = [...hero.querySelectorAll("[data-float] article")].map(r);
const sections = [
  "#problem",
  "#product",
  "#viewer",
  "#team",
  "#science",
  "#vision",
].map((s) => {
  const el = document.querySelector(s);
  const cs = getComputedStyle(el);
  return {
    s,
    pt: parseFloat(cs.paddingTop),
    pb: parseFloat(cs.paddingBottom),
    h2: el.querySelector("h2") ? r(el.querySelector("h2")) : null,
  };
});
const product = document.querySelector("#product");
const productLede = r(product.querySelector("h2 + p"));
const productGrid = r(
  product.querySelector("h2 + p").parentElement.nextElementSibling,
);
const productCards = [...product.querySelectorAll("article")].map(r);
const footer = document.querySelector("footer");
const footerNav = footer.querySelector("nav");
const xl = innerWidth >= 1280;
const checks = {
  h1InsideRoom: !xl || h1.y >= backWall.y + 24,
  ctaToCardsGap:
    !xl || Math.min(...cards.map((c) => c.y)) - ctaBox.bottom <= 80,
  ctaLabelCentred:
    Math.abs(ctaLabel.cy - ctaBox.cy) <= 1 &&
    Math.abs(ctaArrow.cy - ctaBox.cy) <= 1,
  sectionPadding: sections.every((s) => s.pt === 120 && s.pb === 120),
  productHeaderCentred: Math.abs(sections[1].h2.cx - innerWidth / 2) <= 2,
  productHeaderGap: Math.abs(productGrid.y - productLede.bottom - 80) <= 2,
  footerOnGrid:
    innerWidth < 768 ||
    !footerNav ||
    Math.abs(r(footerNav).x - productCards[2].x) <= 1,
  footerHeight: r(footer).h < 260,
};
({
  viewport: [innerWidth, innerHeight],
  backWall,
  h1,
  ctaBox,
  cards,
  sections,
  productLede,
  productGrid,
  productCards,
  footer: r(footer),
  footerNav: footerNav && r(footerNav),
  checks,
});
```

(At 1496 the footer nav and the third product card both start at x = 999.)

For motion checks (T6) read `--eye-x` twice:

```js
const s = document.querySelector("[data-stage]");
const a = getComputedStyle(s).getPropertyValue("--eye-x");
await new Promise((r) => setTimeout(r, 3000));
({
  a,
  b: getComputedStyle(s).getPropertyValue("--eye-x"),
  moved: a !== getComputedStyle(s).getPropertyValue("--eye-x"),
  echo: !!document.querySelector("article[data-echo]"),
  timecode: document.querySelector("main > section p span:nth-child(2)")
    ?.textContent,
});
```

---

## 10. Waiting on the client (do not block on these)

- In-the-wild footage for "No stage required" (replaces the T11 stand-in).
- Clean exports of `wild`, `navigable`, `measurable` without burned-in
  graphics (removes the T10c chips).
- Real URLs: Research cards (`science.tsx` all point at
  https://ivl.cs.brown.edu/), `siteConfig.links.calendly`, `.linkedin`,
  `.terms`, `.privacy`.
- Confirmation of "Meet the team" copy.
- A higher-resolution portrait of Srinath Sridhar (current source is
  512x512).
