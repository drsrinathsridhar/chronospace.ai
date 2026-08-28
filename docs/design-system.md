# Before you change anything here

This site was built against a design system, and every part of it that still looks right
looks right because it used that system rather than its own judgement. The fastest way to
undo that is to make one reasonable-looking change that does not.

## The design system: `DESIGN.md`

Colour, type, spacing, radius, shadow and motion are all defined there, and they are the
only source for those values. If a value you need has a token, use the token. If it does
not, add it there first and then use it - a literal at the call site is how the next
person learns that literals are acceptable here.

## Copy the precedent: `src/app/sections/`

The sections already built are the worked examples: how a section is structured, where its
client-side parts live, how spacing and type are applied in practice. Match the nearest
one rather than deriving a second way of doing the same thing.

## What each page was built to do: `docs/pages`

One document per page, recording the intent behind it and the decisions already made.
Read the one for the page you are touching. It answers "why is it like this" before you
spend an afternoon deciding it was a mistake.

## Movement

CSS handles entrance, hover and decorative motion, and that covers most of it. A library is
for interactions that genuinely need one - runtime state, gestures, layout animation, or
motion that must be interruptible - and the library here is Motion (https://motion.dev),
which works the same way whatever this site is built with. One of them, not two: a second
brings its own easing vocabulary and the movement stops feeling like one piece of work.

Everything that moves respects `prefers-reduced-motion`.

## Before you call it done

- `npm run lint`
- `npm run typecheck`

New pages start the same way: the tokens, the style guide, then the nearest existing page.
