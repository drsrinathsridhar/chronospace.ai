# Architecture

Keep this app standalone, root-app shaped, and section-oriented.

## Route Shape

Use `src/app`. A page composes sections and shared chrome:

```tsx
import { Hero } from "./sections/hero";

export default function HomePage() {
  return <Hero />;
}
```

Each section lives in a route-local folder:

```text
src/app/sections/hero/
  index.ts
  hero.tsx
  hero-orbit.client.tsx
```

`index.ts` is re-export-only. The root section component stays server-rendered unless the whole section truly needs client state, which should be rare.

## Client Components

Use client components only as small islands named `*.client.tsx`. Do not put `'use client'` in pages, layouts, or section root files.

Good:

```text
sections/hero/hero.tsx
sections/hero/hero-orbit.client.tsx
```

Bad:

```text
sections/hero/hero.tsx // contains 'use client'
```

Shared shadcn/Radix UI primitives follow the same rule. If the component needs `'use client'`, rename the file to `*.client.tsx` before importing it from server sections:

```text
src/components/ui/accordion.client.tsx
src/components/ui/tabs.client.tsx
```

Server sections may import these client primitives directly; the filename makes the hydration boundary visible.

## Shared Code

Keep one-off code colocated. Move code to shared folders only when it is reused by at least two sections/pages or is a true primitive:

- `src/components` for shared UI/chrome
- `src/components/ui` for shadcn-style primitives
- `src/lib` for utilities, env, metadata
- `src/icons` for generated icon components

## Verification

Before merging changes, run:

```bash
npm run format
npm run lint
npm run typecheck
```
