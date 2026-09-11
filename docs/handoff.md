# Handoff

State of the build as of 2026-09-10, for the next working session. The
September client feedback round is implemented on branch
`claude/chronospace-design-feedback-1d8277` (plan and measurements in
`docs/client-feedback-plan.md`); the reviewed state before it is tag and
branch `backup/pre-feedback-2026-09-10` at `4e8a41b`.

## Project

- **Repo**: https://github.com/tybura/chronospace-v2 (private, `main`,
  gh-authenticated as `tybura`). **Vercel is connected to the repo -
  pushing to `main` deploys.**
- **Figma source**: file `oAtcEKyNs0RVdQU6ivtXiJ`
  ("[SR007] ChronoSpace | Web Design"). Design width 1496, gutters 40,
  content box 1416. Node IDs for shipped sections are listed below.

## Stack and house rules (enforced by lint)

- Next 16.2.9 (App Router; breaking changes - docs live in
  `node_modules/next/dist/docs/`), React 19, Tailwind v4 (CSS-first,
  tokens in `src/app/globals.css`, arbitrary colors/typography are lint
  errors), CSS Modules for section geometry, `motion` library used only
  by the header scroll.
- Read `AGENTS.md`, `docs/architecture.md`, `docs/styling.md`, and
  `docs/section-workflow.md` before broad changes.
- Patterns: sections in `src/app/sections/<name>/` (server root +
  re-export-only `index.ts`), client islands named `*.client.tsx` and
  kept minimal, inline `style` only for CSS custom properties, every
  animation honours `prefers-reduced-motion`, SVGs go through
  `src/icons/source` + `npm run icons:generate` (generated output is
  read-only), raster media through `next/image` (`<video>` is fine).
- Verify with `npm run format`, `npm run lint`, `npm run typecheck`,
  and `next build`.

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
  the plate.
- Copy stack offset scales with the room: `md:pt-[max(6.5rem, 12.5vw -
navbar)]`, so the headline stays inside the back wall (top edge 20.68% of
  the plate) at every width. Headline top = 12.5vw at xl+ (187 at 1496,
  240 at 1920).
- **Camera rig** (`hero-room-cameras.tsx`): 16 billboard units as direct
  children of the stage - two rows of three per side wall, one row of four
  along the back wall at y = -18cqh (just under the cove, above the
  headline). Each has a blinking accent LED; four carry faint view cones.
  `CameraIcon` via the icon pipeline.
- **Idle motion** (`hero-room-eye.client.tsx`): with no pointer input for
  1.5s the eye drifts on a two-period Lissajous (0.35/0.2 fine, 0.22/0.12
  coarse - touch devices get the drift too). Pointer takes over on move.
  The loop runs whenever the hero is on screen and the tab visible, and
  parks otherwise (IntersectionObserver + visibilitychange). The same
  island runs the **echo round-robin**: from 6s, every 5s one card carries
  `data-echo` for 1.6s (`hero-cards.module.css` reads it like hover).
- **Live timecode** (`hero-timecode.client.tsx`): the ruler's readout counts
  at 30fps from 00:00:14:07, DOM-written, pauses when hidden.
- Three standing cards (`hero-cards.tsx`) unchanged otherwise.

### Problem / intro (`src/app/sections/problem/`)

Two columns on a 12-col grid: the manufacturing take (`/videos/manufacturing.mp4`,
768x1024, 8s, compact `TimelinePlayer`, `aspect 4 / 5`, `preload="none"`)
in cols 1-5 with `PointerDrift`; cols 6-12 hold the lede (read-sweep, two
shortened paragraphs) and a `<dl>` of three readings with
`MeasureBracketIcon`. `id="problem"`.

### Product (`src/app/sections/product/`)

Centred header; three takes in the compact player. Card 1 `wild.mp4` is
**trimmed to its reconstruction pass (9.47s)** as a stand-in until the
client sends in-the-wild footage (TODO in the file). Card 3
`measurable.mp4` is **trimmed to an 18s loop (t 4-22 of the original)**
and carries a `MeasureOverlay` (`measurable-marks.ts`): height bracket,
floor line active from t=7, tokenisation sweep on each loop wrap, and two
`bg-paper` chips covering the burned-in label and heat-map until a clean
export arrives.

### Capture / viewer (`src/app/sections/capture/`)

`capture-player.client.tsx` renders a `MeasureOverlay` over `echo.mp4`:
height bracket following the taller figure (21 keyframes at 0.25s), path
tag integrating to 1.04 m, speed tag; corner HUD trimmed to Frames kept /
Tracked joints / Timebase. Note the take is a camera orbit - the figure
sweeps x 29% -> 97% -> 26%.

### Team (`src/app/sections/team/`)

"Meet the team". Full-column square portraits (JPEG, grayscale at rest,
colour on card hover/focus-within, `team.module.css`), caption under a
hairline: name, "LinkedIn" text link (the accessible one) with the CTA
arrow at -45deg, role. Portrait is an `aria-hidden tabIndex=-1` link.
Srinath's source is 512px - ask for a larger one.

### Footer (`src/app/sections/footer/`)

Two rows on the cards' grid: wordmark + figure brackets across cols 1-2,
captioned link groups in col 3 (Company: LinkedIn, Contact; Legal is
filtered out while `terms`/`privacy` are `#`), then a rule with the
copyright and "Made by tonik" in caption type.

### Shared components added

- `src/components/measure-overlay.client.tsx` (+ `.module.css`): keyframed
  bracket / line / tag / chip marks over a sibling `<video>`, one rAF loop,
  DOM-written, optional tokenise sweep.
- `src/components/pointer-drift.client.tsx`: the vision tableau's pointer
  ease, moved from `vision-parallax.client.tsx` now the intro uses it too.

## Waiting on the client

- In-the-wild footage for "No stage required" (replaces the wild.mp4 trim).
- Clean exports of `wild`, `navigable`, `measurable` without burned-in
  graphics (removes the chips in `product.tsx`).
- Real URLs: Research cards (`science.tsx`, all point at the Brown lab
  site), `siteConfig.links.calendly`, `.linkedin`, `.terms`, `.privacy`.
- Copy confirmation: "Meet the team".
- A >= 1000px portrait of Srinath Sridhar.

## Tooling notes

- **Figma access**: the Dev Mode MCP tools normally cover it. If they
  drop out of the tool catalog, the desktop server answers JSON-RPC
  directly at `http://localhost:3845/mcp` (initialize ->
  notifications/initialized -> tools/call; session id arrives in the
  `mcp-session-id` response header). Exported assets download from
  `http://localhost:3845/assets/<hash>.png`.
- **Visual verification**: the in-app browser pane may report the tab
  hidden (no rAF, screenshots blank) - the puppeteer MCP (headless, counts
  as visible) works for motion checks. Otherwise no browser tool in the session - use
  `playwright-core` with the cached Chromium at
  `~/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell`.
  Working scripts (`shot*.mjs`, `check-*.mjs`) live in the approved
  temp dir `/private/var/folders/4x/mc_zpzhs71s34sfkzfbf_37m0000gn/T/opencode/`.
  Serve with `npx next start -p 4939` (ports 4321/4939 are sometimes
  contested by other local apps - check before trusting a response).
- **Media**: videos are served from `public/videos/`; posters are
  first frames extracted with ffmpeg and colocated with their section.
  `sports/robotics.mp4` are unused (hero card videos were retired in the
  floating-cards redesign) but kept in case the client returns to them;
  `manufacturing.mp4` is the intro section's take.
- **Known trap, fixed once already**: the React hooks lint forbids
  synchronous `setState` inside effects - drive state from media/DOM
  events instead.
