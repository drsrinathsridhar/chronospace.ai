# Styling

Styling is Tailwind-first and token-first.

## Tokens

Global tokens live in `src/app/globals.css`. Use semantic classes such as:

- `bg-paper`
- `bg-surface`
- `text-ink`
- `text-muted`
- `border-line`
- `rounded-card`
- `shadow-soft`

Prefer changing tokens over scattering one-off values through JSX.

Keep `src/app/globals.css` focused on tokens, Tailwind `@theme`, base styles, and custom `@utility` definitions. Do not add global component classes such as `.eyebrow`, `.card`, or `.panel`; use React components for reused UI pieces, or inline Tailwind classes for one-off composition.

## Typography

Use typography utilities from `src/app/globals.css`, not raw size stacks in JSX:

```tsx
<h1 className="type-display-md lg:type-display-xl text-balance">...</h1>
<p className="text-muted type-body-md">...</p>
```

Define typography utilities with Tailwind v4 `@utility` so breakpoint variants work, for example `lg:type-display-xl`. Inline font-size, weight, line-height, and tracking inside each utility; do not create separate CSS variables for every typography property unless a value is shared elsewhere.

Use runtime CSS variables for values reused by base CSS or non-Tailwind CSS. For one-hop Tailwind tokens such as simple radii, shadows, and spacing, define the value directly in `@theme` or `@utility`.

## Fonts

Font setup lives in `src/app/fonts.ts`. The app ships with system font fallbacks and no bundled font binaries.

When adding local brand fonts, place files in `src/assets/fonts`, update `src/app/fonts.ts` to use `next/font/local`, keep `src/assets/fonts/README.md` in sync, and add font license notes for any bundled files.

## Tailwind Rules

Use semantic tokens for visual-system decisions and Tailwind numeric spacing-scale utilities for local layout geometry.

Arbitrary color and typography values are lint errors. Use existing color and typography tokens such as `bg-paper`, `text-ink`, `text-muted`, `border-line`, and `type-*` utilities instead of classes like `bg-[#f8f4ee]`, `text-[17px]`, or `leading-[1.1]`.

Simple arbitrary layout, radius, and shadow values are lint warnings. Prefer Tailwind scale utilities such as `w-25`, `h-127`, `gap-7`, and `px-13` over `w-[100px]`, `w-[6.25rem]`, or `gap-[28px]` when the value maps to the spacing scale. Use semantic tokens for repeated radii and shadows.

For stacked spacing, prefer parent-controlled spacing with `gap-*` or `space-y-*` when it fits the structure. When individual margins are clearer, prefer `mb-*` on the preceding element over `mt-*` on the next element. Use `mt-*` when it keeps the layout simpler or more local.

Allowed escape hatches are structural values that tokens do not model well, such as complex grid templates, masks, animation-specific values, and runtime sizing through CSS variables. Keep them rare.

Use inline `style` only to set CSS custom properties, then consume them from Tailwind or CSS:

```tsx
<div
  className="w-[var(--card-width)]"
  style={{ "--card-width": `${cardWidth}px` }}
/>
```

Do not put regular CSS properties in `style`. Use Tailwind tokens, global tokens, or section CSS for those.

## Motion

Use CSS for static entrance, hover, and decorative motion. Add an animation library only when the interaction needs runtime state, pointer/gesture input, layout animation, or interruptible animation.

Every animation must support reduced motion.
