# Handoff

State of the build as of 2026-09-11, for the next working session. Two
client feedback rounds are in: round 1 (deck of 10 Sep, plan in
`docs/client-feedback-plan.md`, merged to `main` at `4e02ca6`, reviewed
state before it tagged `backup/pre-feedback-2026-09-10`) and round 2 (deck
received 11 Sep, slides 1-10, plan in `docs/feedback-round-2-plan.md`),
implemented on branch `claude/feedback-round-2-2026-09-11`; the state the
client reviewed for round 2 is tag `backup/pre-feedback-2-2026-09-11` at
`4e02ca6`. **How to swap any asset or setting: `docs/asset-swap-guide.md`.**

Out of scope for round 2, by the owner's decision: the manufacturing
animation rework (deck slides 3-4) - the owner builds the asset and drops
it into the `intro.manufacturing` and `hero.manufacturing` slots of
`src/media.config.ts`.

## Project

- **Repo**: https://github.com/tybura/chronospace-v2 (private, `main`,
  gh-authenticated as `tybura`). **Vercel is connected to the repo -
  pushing to `main` deploys.**
- **Figma source**: file `oAtcEKyNs0RVdQU6ivtXiJ`
  ("[SR007] ChronoSpace | Web Design"). Design width 1496, gutters 40,
  content box 1416. Node IDs for shipped sections are listed below.

## Stack and house rules (enforced by lint)

- Next 16.3.5 (App Router; breaking changes - docs live in
  `node_modules/next/dist/docs/`), React 19, Tailwind v4 (CSS-first,
  tokens in `src/app/globals.css`, arbitrary colors/typography are lint
  errors), CSS Modules for section geometry, native browser observers and
  events for runtime motion.
- Read `AGENTS.md`, `docs/architecture.md`, `docs/styling.md`, and
  `docs/section-workflow.md` before broad changes.
- Patterns: sections in `src/app/sections/<name>/` (server root +
  re-export-only `index.ts`), client islands named `*.client.tsx` and
  kept minimal, inline `style` only for CSS custom properties, every
  animation honours `prefers-reduced-motion`, SVGs go through
  `src/icons/source` + `npm run icons:generate` (generated output is
  read-only), raster media through `next/image` (`<video>` is fine).
- Verify with `npm run format`, `npm run lint`, `npm run typecheck`,
  `npm run build`, and `npm run test:e2e`.

## Page state (`src/app/page.tsx`: Hero -> Backers -> Problem -> Product -> Capture -> Team -> Science -> Closing, then ClosingBar as the `<footer>`)

Every section sits on one rhythm: `py-section` (120px) above and below,
`mt-section-gap` (80px) from the centred header stack to the content
(`globals.css` `@theme`). Section headers are centred on a 698px measure
with the lede 20px under - the product heading included, which the comp
had on a 42.23% column and the client read as skewed. CTA labels and nav
cells are vertically centred (the comp pinned them low). The glyph-scramble
hover is gone.

### Hero (`src/app/sections/hero/`, Figma `7762:5279`)

- CSS-built 3D room (`hero-room*`) with pointer parallax; faces clipped at
  the plate. The camera rig is gone (round 2) - the room is bare walls.
- Headline alone (the centre call to action is gone, round 2), centred on
  the back wall at `--copy-centre: 22.7cqw`; the two lines are separate
  spans with a space between them in the markup.
- **Figures** (`hero-cards.tsx`): three cutouts on one floor line (feet at
  109.17% of the plate), one scale of 1.4, spaced by what shows rather than
  by their boxes; the load-time trail plays in colour, then drains to the
  desaturated rest (`--figure-brightness` from `tuning.config.ts`), and
  hover / the round-robin turn hand the colour back. Eye travel of room
  and figures is scaled by `--hero-wiggle` (same file). The trail is one
  **motion smear** layer per card (round 3, slide 3: subject + shadow +
  smear, 12 hero `<img>` instead of 20; the smear is lazy at half
  resolution, the subject `priority`): stretched from the leading edge,
  blurred along x by the SVG filter in `src/icons/source/hero-trail-filters.svg`
  (mounted once in `hero.tsx`), masked to a fade, its length and opacity
  following `--eye-speed`. `heroTrail` in `tuning.config.ts` picks
  `smear | flare` and `true | accent | ink` (data attributes on the hero
  root) and multiplies length / blur / opacity; numbers and fallbacks in
  `hero-cards.module.css` (`.trail`).
- **Phone carousel** (below `md`, round 3, slide 8a): the same three cards
  are scroll-snap slides (`[data-float]` is the scroller, `overflow-x: auto;
scroll-snap-type: x mandatory`, one figure a screen, centred on its
  visible pieces, feet on the room's floor line at 65.5% of the hero; card
  base 56cqw x 1.5 / 1.45 / 1.22, so the cell reads at ~66vw, the arm group
  ~62vw, the dancer ~34vw), with `hero-pager.client.tsx` drawing three
  `TimelineTickIcon` ticks in 44px targets under the floor (active
  `text-accent`; tap scrolls smoothly, instantly under reduced motion) and
  handing the arriving slide `data-echo` for `ECHO_HOLD` on every swipe when
  reduced motion is not enabled -
  the eye island's round robin runs from `md` up only. The sub-`md` hero
  floor is `25rem + 90.5cqw` so the arm clears the headline; 768-1279 keep
  the 3-up strip, three CSS blocks in `hero-cards.module.css`.
- **The eye** (`hero-room-eye.client.tsx`): any pointer steers - mouse,
  trackpad, pen, finger (the hero root has `touch-action: pan-y`, so a
  vertical swipe scrolls and a sideways drag steers). A hovering pointer
  that stops keeps the room for 1.5s, a lifted finger or a cancelled
  gesture releases at once. Then the phone's tilt if there is one
  (`deviceorientation`, calibrated to the first reading, 1.5° dead zone,
  18° = full lean, 0.6/0.4 of the range; iOS asks for the sensor on the
  first tap on the hero), then the idle drift on a two-period Lissajous
  (0.35/0.2 hover, 0.22/0.12 no-hover). The loop runs whenever the hero is
  on screen and the tab visible, and parks otherwise (IntersectionObserver
  and visibilitychange). The same island runs the **trail round-robin**:
  from 6s, every 5s one card carries `data-echo` for 1.6s
  (`hero-cards.module.css` reads it like hover), and writes `--eye-speed`
  (0..1) for the trail's length. Reduced motion disables pointer tracking,
  drift, tilt, the round robin and `PointerDrift`, leaving centred static
  artwork.

  Coverage (round 3, slide 2d) - what moves in each case:

  | Input                       | Room + figures follow                                                  | Idle                     | Auto trail |
  | --------------------------- | ---------------------------------------------------------------------- | ------------------------ | ---------- |
  | Mouse                       | pointer over the hero; releases 1.5s after it stops                    | drift (0.35/0.2)         | yes        |
  | Trackpad                    | same as mouse (the cursor is the pointer)                              | drift                    | yes        |
  | Touch laptop, finger        | finger while down on the hero; releases on lift                        | drift                    | yes        |
  | Android, touch              | finger while down; vertical swipe scrolls                              | tilt, else drift         | yes        |
  | Android, tilt               | lean of the phone from its resting attitude, at 0.6/0.4 of the range   | -                        | yes        |
  | iOS, touch                  | finger while down; vertical swipe scrolls                              | drift until tilt granted | yes        |
  | iOS, tilt                   | after the first tap on the hero grants the sensor; denied = touch only | -                        | yes        |
  | Reduced motion (any device) | nothing; room and figures stay centred                                 | none (still)             | no         |
  | No JS                       | nothing moves; room at centre, figures grey, no trail                  | -                        | no         |

- **Live timecode** (`hero-timecode.client.tsx`): the ruler's readout counts
  at 30fps from 00:00:14:07, DOM-written, pauses when hidden and stays static
  under reduced motion.

### Problem / intro (`src/app/sections/problem/`)

Two columns on a 12-col grid: a still (`media.intro.picture`, the owner's
split-circle placeholder, square box, `object-contain`, centred on the
copy) in cols 1-5 with `PointerDrift`; cols 6-12 hold the lede (read-sweep,
two shortened paragraphs) and a `<dl>` of three readings with
`MeasureBracketIcon`. `id="problem"`. The manufacturing take that used to
run here in the compact `TimelinePlayer` is parked in
`media.intro.manufacturing` until the client decides on the visual
(round 2, slide 4) and the owner's rebuilt scene is ready.

### Product (`src/app/sections/product/`)

Centred header; three takes in the compact player on the page-wide panel
gap (`gap-panel`, 40px, shared with Team and Science). Card 1 `wild` is
**trimmed to its reconstruction pass (9.47s)** as a stand-in until the
client sends in-the-wild footage. Card 3 is the client's `queryable` clip
(round 2; 3.2 s, carries its own burned-in body-tracking HUD) with a small
static HUD of ours bottom-left; the old `measurable.mp4`, its timed
`MeasureOverlay` and the cover chips are gone. Every plate runs in colour
(`videoTone` in `tuning.config.ts`) and carries the **arc scrubber**
(`src/components/arc-scrubber.client.tsx`, drawn in CSS, bottom-right
inside the plate, sized in the plate's own container units): the round-2
arc, whose handle follows presented video time linearly. The accent sweep
runs from the arc's start to the handle, with a "Camera path" caption and a
"View n / N" counter. Dragging seeks to the same fraction of the clip, and
pointer moves are coalesced to one seek per display frame. No generated
camera data is required when replacing a video. Tapping the plate toggles
playback, and a refused autoplay shows a play glyph on the dial.

### Capture / viewer (`src/app/sections/capture/`)

`capture-player.client.tsx` renders a `MeasureOverlay` over `echo.mp4`
(`media.viewer.echo`): height bracket following the taller figure (21
keyframes at 0.25s), path tag integrating to 1.04 m, speed tag; corner HUD
(Frames kept / Tracked joints / Timebase) now bottom-left, the arc
scrubber bottom-right (linear playback progress, 90 fps counter). Note the figure sweeps x 29% -> 97% ->
26% across the frame. The marks are timed to this clip.

### Team (`src/app/sections/team/`)

"Team". Square portraits (JPEG, in colour at rest since round 3) in a
centred 976px row on the panel gap (299px each at 1496); below 768px they
become compact 112-144px horizontal rows. Caption: name, "LinkedIn" link
(the accessible one) with the LinkedIn glyph in accent, role. Portrait is an
`aria-hidden tabIndex=-1` link. Srinath's source is 512px - ask for a larger
one.

### Science (`src/app/sections/science/`)

Centred header; three cards in the product grammar (round 2): a 577/310
picture plate (`media.science.*`, placeholders), hairline, label, title,
blurb, outline action pinned to the foot. No border box, no header strip.

### Closing + bar (`src/app/sections/closing/`)

Vision and Footer merged (round 2). `Closing` (in `<main>`, `id="closing"`):
the woodworking loop full-bleed of the site frame (`closing-video.client.tsx`,
two renditions by viewport, plays on arrival, pauses on leave, poster only
under reduced motion) under a left-to-right scrim, headline left, one line
of sub-copy, "Connect with us" (inverse CTA) + "Follow on LinkedIn"
(outline). `ClosingBar` is the `<footer>` after `<main>`: logo + copyright
left, LinkedIn / Terms / Privacy / "Made by tonik" right; Terms and Privacy
render inert while `site.config` has `#`. The dancer/arm trails and the
figure brackets are gone.

### Navbar

The "Connect with us" cell turns to ink with paper type once the page
scrolls off the hero (`site-header.module.css` on `:root[data-scrolled]`);
`CtaLink` gained the matching `inverse` variant.

### Mobile scale and menu (round 3, slide 8)

- One phone scale, in `globals.css`: the `type-*` utilities that step down
  read `--type-*-size` variables and the section rhythm reads
  `--section-space` / `--section-gap` / `--panel-gap`; a single
  `@media (width < 40rem)` block on `:root` steps them all (display
  36/32/30, titles 20/18, body 17/16, lede 24; section 64, stack gap 48,
  panel 24, backing band 72, resting bar 56). Change a phone value there,
  never in a section.
- Header below `sm`: logo `h-6` (about 126px wide), CTA `gap-2 px-3` with a
  short "Connect" label (`aria-label` keeps the full name); the row is
  `min-w-0 overflow-clip`. Widths: 320 leaves ~24px of slack, 360 ~64, 390 ~94.
- Below `lg` a Menu button opens a sheet under the bar
  (`src/components/site-menu.client.tsx`: provider + button + sheet, the
  sheet a child of the header so the row's clip and reveal mask cannot hide
  it). Closes on link, Escape, outside press, `hashchange`, or a scroll of
  more than 60px; `:root[data-menu-open]` locks the page scroll meanwhile.

### Shared components added

- `src/components/measure-overlay.client.tsx` (+ `.module.css`): keyframed
  bracket / line / tag / chip marks over a sibling `<video>`, one rAF loop,
  DOM-written, optional tokenise sweep.
- `src/components/pointer-drift.client.tsx`: the vision tableau's pointer
  ease, moved from `vision-parallax.client.tsx` now the intro uses it too.

## Waiting on the client

- In-the-wild footage for "No stage required" (replaces the `wild` trim).
- Clean exports of `wild` and `navigable` without burned-in graphics; the
  final `queryable` clip (the current one carries its own tracking HUD).
- Real URLs: Research cards (`science.tsx`, all point at the Brown lab
  site), `siteConfig.links.linkedin`, `.terms`, `.privacy`.
- Final artwork for the three Research card plates.
- An SVG or white export of the NVIDIA Inception lockup (the PNG is turned
  white by a CSS filter meanwhile).
- A >= 1000px portrait of Srinath Sridhar.
- The manufacturing scene rework (owner) for the intro take and hero cutout.

## URL and metadata

- **`NEXT_PUBLIC_SITE_URL` is required for production builds.** Set it to the
  final origin, without a path, in every production environment. There is no
  Vercel or localhost fallback in production; canonical, Open Graph, sitemap
  and robots URLs all inherit the validated origin from `src/lib/env.ts`.
- Title: `ChronoSpace — AI to digitize the physical world` on the home
  page, `<page> — ChronoSpace` elsewhere via the root template
  (`src/lib/metadata.ts`). Share card: the static `public/og.png`
  (1200x630). Icons: `src/app/icon.svg` (grey mark), `favicon.ico`
  16/32/48 and `icon.png` (grey on transparent), `apple-icon.png`
  (grey on opaque paper), `public/icons/*` for the manifest (`src/app/manifest.ts`),
  `public/safari-pinned-tab.svg` for Safari. JSON-LD `Organization` in
  `layout.tsx`. How to redraw any of them: `docs/asset-swap-guide.md`.

## Tooling notes

- **Figma access**: the Dev Mode MCP tools normally cover it. If they
  drop out of the tool catalog, the desktop server answers JSON-RPC
  directly at `http://localhost:3845/mcp` (initialize ->
  notifications/initialized -> tools/call; session id arrives in the
  `mcp-session-id` response header). Exported assets download from
  `http://localhost:3845/assets/<hash>.png`.
- **Visual verification**: `npm run test:e2e` runs the checked-in Playwright
  suite against `next start` in desktop and mobile Chromium. Failure artifacts
  include screenshots and traces under `test-results/` and the HTML report.
- **Media**: every slot lives under `public/media/<section>/` and is
  named in `src/media.config.ts`; posters are first frames extracted with
  ffmpeg (`/opt/homebrew/bin/ffmpeg`, installed 2026-09-11). See
  `docs/asset-swap-guide.md`. The client's raw drops sit in
  `public/feedback-*/` (gitignored - never ship them).
- **Native bindings in the sandboxed shell**: `next build` and Tailwind's
  oxide fail with "library load disallowed by system policy" inside the
  agent sandbox; run the build outside it.
- **Known trap, fixed once already**: the React hooks lint forbids
  synchronous `setState` inside effects - drive state from media/DOM
  events instead.
