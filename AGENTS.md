<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ChronoSpace Web

The second design direction for the ChronoSpace landing page. Same stack and
same house rules as `tonik/a16z-sr007-chronospace-ai`, which stays untouched
as the reference build — the tooling, tokens, type ramp, fonts, and lint
rules here were lifted from it deliberately, so fixes should flow between the
two rather than diverge.

## Commands

- `npm run dev` - local dev server
- `npm run format` - Prettier check with Tailwind class sorting
- `npm run format:fix` - write Prettier changes
- `npm run lint` - icon freshness check plus ESLint
- `npm run lint:fix` - ESLint autofix
- `npm run typecheck` - TypeScript check
- `npm run icons:generate` - regenerate React icon components from SVG sources
- `npm run icons:check` - verify generated icons are current

## Architecture Rules

- Follow `docs/architecture.md` for route shape, sections, client components, and shared code rules.

## Styling Rules

- Follow `docs/styling.md` for Tailwind, token, typography, spacing, and motion rules.

## Media And Icons

- Use `next/image` for raster images. Do not use raw `<img>`.
- Keep page/section assets colocated near the component that owns them.
- Do not inline SVG in TSX. Add SVGs to `src/icons/source` and run `npm run icons:generate`.
- Treat `src/icons/generated` as read-only generated output.

Read `docs/architecture.md`, `docs/styling.md`, and `docs/section-workflow.md` before making broad app changes.
