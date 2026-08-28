# Styling

## Tokens

The design system lives as CSS custom properties in `src/app/globals.css` — one `:root` block for the
raw values and a Tailwind v4 `@theme` block that exposes them as utilities. Every colour and every type
step in the design has a token. Add the token first, then use the utility; never hardcode the value at
the call site.

```css
:root {
  --color-brand: #4f46e5;
  --text-body: 1rem;
}
@theme {
  --color-brand: var(--color-brand);
}
```

`bg-brand` — yes. `bg-[#4f46e5]` — no (lint error): the second one drifts the moment the brand changes.

## Typography

Type sizes, weights and line heights are tokens too. A one-off `text-[13px]` is a lint error; if the
design really needs a new step, add it to the scale.

## Layout

Arbitrary values ARE allowed for layout (`w-[37px]`, `top-[12px]`, `gap-[18px]`). Fidelity to the design
matters more here, and there is no token to drift from.

## Fonts

Brand fonts live in `src/assets/fonts/` and are wired up in `src/app/fonts.ts` with
`next/font/local`, which self-hosts them and reserves their metrics so the page does not reflow when
they load. Expose each as a CSS variable and let the token layer reference it, the same as any other
part of the design system.

Give every family a real fallback stack. A font that fails to load should degrade to something close,
not to whatever the browser picks.

Note the licence next to any font file committed to the repo. A binary nobody can account for is a
problem for whoever ships this, and it is cheaper to write the line now than to trace it later.

## Motion

Keep transitions short and purposeful (150–300ms), animate transform/opacity rather than layout
properties, and respect `prefers-reduced-motion`.

CSS covers entrance, hover and decorative movement, and that is most of it. Reach for a library only
when the interaction needs runtime state, pointer or gesture input, layout animation, or motion that
must be interruptible - and when you do, use Motion (https://motion.dev). It is the same API on every
stack, so the rule does not change from project to project, and it drives the Web Animations API
rather than a render loop of its own. One animation library per project, not two.

## The one escape hatch

`npm run lint` rejects `style={{ ... }}`, with a single exception it makes on purpose: setting CSS
custom properties.

```tsx
<div
  className="w-[var(--card-width)]"
  style={{ "--card-width": `${width}px` }}
/>
```

A value only known at runtime has no Tailwind class, so this is how it reaches the styles. Regular CSS
properties do not belong here - they are a lint error, and a token or a utility is the answer instead.
