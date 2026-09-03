# Section Workflow

Use this workflow when adding or changing a landing-page section.

1. Identify the route that owns the section.
2. Create or update `src/app/**/sections/<section-name>/`.
3. Keep `index.ts` as re-export-only.
4. Implement the section in `<section-name>.tsx` as a server component.
5. Add `*.client.tsx` only for the smallest interactive island.
6. Name client shadcn/Radix primitives `*.client.tsx` before using them from server sections.
7. Keep one-off subcomponents and assets inside the section folder.
8. Use shared components only when reuse is real.
9. Use token-backed Tailwind classes and `type-*` typography utilities.
10. Prefer `gap-*` or `space-y-*` for stacked spacing; when using margins, prefer `mb-*` before `mt-*` unless `mt-*` is simpler.
11. Use CSS custom properties for runtime layout values that Tailwind cannot express statically.
12. Add icons through `src/icons/source` and regenerate.
13. Run `npm run format`, `npm run lint`, and `npm run typecheck`.

For design implementation, map source values to existing global tokens first and only add new tokens when the design needs a reusable semantic concept.
