# Architecture

## Routes

App Router under `src/app/`. A route is a folder with a `page.tsx`; the shell is `layout.tsx`. Every
page exports `metadata` (title + description at minimum) — it is what search and social show.

## Sections

A page is a stack of sections, one component per section, under `src/components/`. A section owns its
own markup and copy and takes no props unless it genuinely varies. Keep them independent: a section
should be movable up or down the page without touching the others.

## Server vs client

Everything is a server component by default. `'use client'` belongs on the smallest component that
actually needs state, effects or event handlers — never on `page.tsx` or `layout.tsx`, which would pull
the whole subtree into the client bundle (lint error).

## Icons and assets

Icons are components in the icon module, imported by name — no pasted `<svg>` in a section. Images live
in `public/` and are referenced from the root (`/logo.svg`); prefer `.webp` and keep them small.
