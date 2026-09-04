# Handoff

State of the build as of 2026-09-04, for the next working session.

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

## Page state (`src/app/page.tsx`: Hero -> Problem -> Capture)

### Hero (`src/app/sections/hero/`, Figma `7762:5279`, latest revision)

- CSS-built 3D room (`hero-room*`) with pointer parallax; faces are
  clipped at the plate (`overflow: clip`) - this fixed a seam where
  projected walls escaped below the room.
- **Three floating cards** (`hero-cards.tsx` / `.module.css`): grey room
  plates + coloured subject cutouts, scattered at the comp's positions
  at xl+, falling back to a three-column strip below xl. Behaviours:
  - Pointer float via `--float-x/--float-y`, chased at TAU 240ms vs the
    room's 80ms, per-card `--card-drift` (10-16px).
  - Scroll parallax via unitless `--scroll-y` times per-card
    `--card-lift` (0.08 / 0.12 / 0.06) - cards rise slightly faster
    than the page.
  - Echo trail: three offset copies (opacity 0.6/0.35/0.2, stepped back
    6.5% apiece) shown on load, collapsed copy by copy, replayed on
    hover. The intro animation uses `fill: backwards` specifically so
    it hands opacity back to the hover transition when done.
- All hero motion vars are written by `hero-room-eye.client.tsx` - one
  rAF loop with wake/settle discipline; bails on reduced motion and
  coarse pointers.
- Timecode ruler (`hero-timeline.tsx`) sits alone at the hero's foot
  with a left-to-right clip wipe; accent ticks are `TimelineTickIcon`.
  The robotics in-card measure marks were removed at client request.
- The backing a16z mark shines **once** when scrolling carries it
  through the middle of the viewport (`hero-backing-shine.client.tsx`
  - `hero-backing.module.css` - a copy of the navbar logotype flare).
- The hero pads with `pt-navbar-rest` (`--navbar-height-rest`) so the
  navbar's scroll shrink never reflows the section.

### Problem (`src/app/sections/problem/`, Figma `7762:5338`)

- `(INTRO)` label on the gutter + two lede paragraphs on a
  42.23% / 698px column (the section's shared measure).
- Scroll-read effect: words split on the server with indices, island
  (`problem-read-progress.client.tsx`) writes one `--read-progress`
  number, per-word colour falls out of a `color-mix` calc in the
  module CSS. Rests at 1, so no-JS / reduced motion reads as settled
  ink. Carries `id="problem"` (nav anchor).

### Capture (`src/app/sections/capture/`, Figma `7762:5403`)

- "Every frame is a measurement." + custom player for
  `/videos/echo.mp4`.
- The take is stylised with `mix-blend-mode: luminosity` over the paper
  ground (the exact treatment used in Figma - client confirmed).
- Live HUD readings are deterministic functions of `currentTime`,
  anchored on the comp's resting values; TIMEBASE stays "ANY T" on
  purpose (it is the claim, not a measurement).
- Pause/play button with CSS-drawn glyphs and an invisible native
  `<input type="range">` over the ticked rail for scrubbing (pointer,
  keyboard, screen readers). One rAF loop owns playhead + HUD.

## Not yet built

Nav anchors without sections: `#how-it-works`, `#applications`,
`#research` (see `src/site.config.ts`). The capture section has no id -
it could plausibly become `#how-it-works`.

## Tooling notes

- **Figma access**: the Dev Mode MCP tools normally cover it. If they
  drop out of the tool catalog, the desktop server answers JSON-RPC
  directly at `http://localhost:3845/mcp` (initialize ->
  notifications/initialized -> tools/call; session id arrives in the
  `mcp-session-id` response header). Exported assets download from
  `http://localhost:3845/assets/<hash>.png`.
- **Visual verification**: no browser tool in the session - use
  `playwright-core` with the cached Chromium at
  `~/Library/Caches/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-mac-arm64/chrome-headless-shell`.
  Working scripts (`shot*.mjs`, `check-*.mjs`) live in the approved
  temp dir `/private/var/folders/4x/mc_zpzhs71s34sfkzfbf_37m0000gn/T/opencode/`.
  Serve with `npx next start -p 4939` (ports 4321/4939 are sometimes
  contested by other local apps - check before trusting a response).
- **Media**: videos are served from `public/videos/`; posters are
  first frames extracted with ffmpeg and colocated with their section.
  `sports/manufacturing/robotics.mp4` are currently unused (hero card
  videos were retired in the floating-cards redesign; manufacturing.mp4
  is the updated take) but kept in case the client returns to them.
- **Known trap, fixed once already**: the React hooks lint forbids
  synchronous `setState` inside effects - drive state from media/DOM
  events instead.
