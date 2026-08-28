# chronospace.ai

The ChronoSpace splash page: a Next.js 16 (App Router) app, Tailwind v4, built
against the design system in [`DESIGN.md`](DESIGN.md).

This replaces the previous hand-written HTML/CSS site.

## Why this repo has a site *and* a source tree in it

GitHub Pages for this repo is configured as **`build_type: legacy`, serving
`main` at `/`**. That means Pages copies files straight out of the branch root —
it does not run a build, and it does not run an Actions workflow. Switching it to
"GitHub Actions" needs repo-admin rights.

So the repo holds both:

| At the root | What it is |
| --- | --- |
| `index.html`, `404.html`, `_next/`, `fonts/`, `style-guide.html`, icons, `*.jpg` | The **built** site. This is what chronospace.ai actually serves. Generated — never hand-edit. |
| `CNAME` | The custom domain. Sourced from `public/CNAME` so every export carries it. |
| `.nojekyll` | Required. Without it Jekyll drops every path starting with `_`, which is all of `_next/` — the site would load with no CSS or JS. |
| `src/`, `public/`, `docs/`, `package.json`, … | The **source**. Edit here. |

If Pages is ever switched to the Actions build type, the committed output can be
deleted and replaced with a normal deploy workflow.

## Working on it

```bash
npm install
npm run dev          # http://localhost:3000
```

Before calling a change done:

```bash
npm run lint
npm run typecheck
```

## Publishing a change

The built site is committed, so it does not update itself. After changing
anything under `src/` or `public/`:

```bash
npm run build:pages   # STATIC_EXPORT=1 next build -> out/
cp -R out/. .         # copy the export over the repo root
```

Then commit both the source change and the regenerated output together, and push
to `main`. Pages picks it up within a minute or so.

`build:pages` differs from `build` only in setting `STATIC_EXPORT=1`, which turns
on `output: "export"` in `next.config.ts`. Plain `npm run build` stays a normal
server build, so the same source also deploys to a host like Vercel unchanged.

## Where things are

| Path | |
| --- | --- |
| `src/app/(home)/page.tsx` | The splash. One 12-column grid. |
| `src/app/sections/` | One directory per section, each documenting its own decisions. |
| `src/app/globals.css` | Design tokens, keyframes, the entrance. |
| `DESIGN.md` | The design system: colour, type, spacing, motion. The source for those values. |
| `docs/pages/page.md` | Why the page is built the way it is, including where it departs from the Figma file and why. |
| `docs/design-system.md` | Read before changing anything. |
| `/style-guide` | The system rendered live from the project's own tokens. `noindex`. |

## Analytics

Google Analytics `G-9P2J929L7B`, in `src/app/layout.tsx` via `next/script`. It
fires on load with no consent gate — the same behaviour as the previous site.
