# ChronoSpace Web

Second design direction for the ChronoSpace landing page, built from the
`-SR007- ChronoSpace- Web Design` Figma file (`LP` page, `Hero` frame
`7731:2732`).

```bash
npm install
npm run dev
```

## Stack

Mirrors `tonik/a16z-sr007-chronospace-ai`, which is the reference build for
this project and is not modified by it.

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS v4, CSS-first (`@theme` / `@utility`, no `tailwind.config`)
- Local variable brand fonts — Nippo for chrome, Supreme for reading copy
- SVGR icon pipeline: `src/icons/source/*.svg` → `src/icons/generated/*.tsx`
- Seven local ESLint rules that keep styling token-first and client
  boundaries visible (`tooling/eslint/rules`)

Carried over from the reference build but not yet needed here, so left out:
`three` / `@react-three/fiber` (the WebGL echo field), Radix, and CVA. Add
them back the moment a section actually calls for them.

## Where things live

```
src/app/sections/hero/
  hero.tsx                  the section, and the comp's vertical rhythm
  hero-room.tsx             the lit room behind everything
  hero-room-eye.client.tsx  moves the eye with the pointer
  hero-stage.tsx            the measured frame and the four-frame echo
  hero-readout.tsx          what the capture recovered from the leap
src/components/             navbar, CTA, the hover scramble
src/app/globals.css         palette, type ramp, reveal animation
```

## The room

The comp ships the background as a flat plate, but that plate is a
photograph of a box in one-point perspective — five matte faces and a cove
light round the ceiling, nothing brighter than 23/255 — so it is rebuilt
here as the box it is and then looked into. Moving the pointer across the
hero moves the eye sideways, which slides the back wall against the near
walls; a _turn_ of the head would be a pure homography and carry no depth at
all, so the camera translates instead. The plate's own plane sits at z = 0,
which is why the room can never tear away from its edges.

That eye move is expressed with `transform` alone. Animating
`perspective-origin` is the obvious way to write it and does not survive
contact with real browsers — Safari drops the 3D context, GPU-composited
Chrome does not reliably repaint on it — so the faces translate by `-d` and
the stage by `+d` instead, which is provably the same picture (the two
differ by exactly `-d`, a constant) using the one property every engine
composites and invalidates. For the same reason the faces are direct
children of the perspective with no `preserve-3d` anywhere: they tile the
view rather than intersecting one another, so they never needed to share a
3D space.

Geometry and shading are both measured off the original plate and land
within ~1.4/255 of it at rest, so the image is gone — no 360KB JPEG, and the
room is resolution-independent. The one value a photograph of a box cannot
give you is how deep the box is (the same picture is made by a short wide
room and a long narrow one), so that is chosen for feel.

It rests at dead centre, so no-JS, reduced-motion, and coarse-pointer all
get exactly the comp.

The pointer is tracked on the window rather than on the section, because the
navbar is fixed and sits over the hero's top 60px — a listener on the section
gets `pointerleave` the moment you reach for the nav. Moves only record a
position; the rect is measured once per frame in the animation callback, so a
high-polling-rate mouse cannot force a layout per event. `--eye-x` / `--eye-y`
are written on the room rather than the section, so a backdrop moving at 60Hz
does not invalidate style for the headline and the whole stage along with it.
`TAU` in `hero-room-eye.client.tsx` is the dial for how heavy the room feels.

## Fidelity

The hero is built to the comp at its 1496px design width and measures to it
within a pixel: eyebrow at y220, headline at y253, action at y399, backing
line at y619, stage at y712 spanning x41–1456. Below that width the rhythm
tightens on breakpoints and the stage drops its readout into the flow above
the figure.

Two deliberate departures. The comp lands the room's fade on `#020413`
exactly where the room plate stops, which leaves a hard four-level step
straight across the page; the fade here carries one stop further and lands
on the page ground instead. And the background is rebuilt as geometry rather
than laid in as a plate — see below.

## Verify

```bash
npm run format && npm run lint && npm run typecheck && npm run build
```
