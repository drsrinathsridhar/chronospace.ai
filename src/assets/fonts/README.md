# Fonts

ChronoSpace uses two Fontshare families, each bundled as a single variable file:

| File                           | Family  | Axis range | Role                                         |
| ------------------------------ | ------- | ---------- | -------------------------------------------- |
| `Nippo-Variable.woff2`         | Nippo   | `200 700`  | Display: headlines, nav, buttons, HUD labels |
| `Supreme-Variable.woff2`       | Supreme | `100 800`  | Text: body copy                              |
| `Supreme-VariableItalic.woff2` | Supreme | `100 800`  | Text, italic                                 |

They are loaded in `src/app/fonts.ts` with `next/font/local` and exposed as the
CSS variables `--font-brand-display` (Nippo) and `--font-brand-sans` (Supreme).
A second Nippo declaration, `--font-brand-display-caps`, serves the uppercase
utilities (same file, one download). Each stack ends in a hand-tuned stand-in
(`Nippo Fallback`, `Nippo Caps Fallback`, `Supreme Fallback` in
`src/app/globals.css`): Arial scaled to the real font's measured width so the
swap does not reflow the page. Re-measure them if a font file changes; the
method is in `docs/lighthouse/font-fallback-2026-09-17/README.md`.
`src/app/globals.css` reads those through `--font-display-brand` and
`--font-sans-brand`; keep the variable names in sync if you swap a family.

## Licences

Both families are distributed by the Indian Type Foundry under the ITF Free
Font License, which permits self-hosting for web use. The full text ships
alongside the binaries:

- `LICENSE-Nippo.txt`
- `LICENSE-Supreme.txt`

Add the licence file for any future bundled font here as well.
