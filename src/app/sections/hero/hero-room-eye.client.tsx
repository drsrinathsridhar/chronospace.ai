"use client";

import { useEffect, useRef } from "react";

// Moves the eye. The pointer's position over the hero becomes `--eye-x` and
// `--eye-y`, in -1..1 from its centre, and the room reads them as its
// `perspective-origin` - so this island only ever writes two numbers.
//
// Three things it is careful about, each of which was a bug first:
//
//   The pointer is tracked on the window, not on the section. The navbar is
//   fixed and sits over the hero's top 60px, so a listener on the section
//   gets `pointerleave` the moment the pointer crosses into it - and the
//   room would drop back to centre exactly when someone reached for the
//   nav. Whether the pointer is over the hero is a question about geometry,
//   so it is answered with geometry.
//
//   Moves only record a position. The measuring and the maths happen in the
//   frame callback, so a 1000Hz mouse cannot force a thousand layouts a
//   second - the rect is read once per frame, and only while something is
//   actually moving.
//
//   The variables are written on the stage, not on the section. A custom
//   property is inherited, so setting it on the section would invalidate
//   style for every descendant - the headline and the whole measured stage
//   included - sixty times a second, to move a backdrop.

/**
 * Time constant of the chase, ms - two thirds of the distance covered in
 * this long, and the step is taken from the clock rather than assumed, so
 * it settles at the same rate on a 60Hz panel and a 120Hz one. The room
 * should feel weighted, not late; this is the dial for that, and anything
 * past ~150 starts reading as lag rather than mass.
 */
const TAU = 80;
/** Longest step the chase will take, ms - a backgrounded tab must not jump. */
const MAX_STEP = 64;
/** Below this, the room is close enough to its target to stop the loop. */
const SETTLED = 0.0005;

export function HeroRoomEye() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage =
      ref.current?.parentElement?.querySelector<HTMLElement>("[data-stage]");
    const section = ref.current?.closest("section");
    if (!stage || !section) return;
    // The standing cards, if the layout is showing them. The same eye on the
    // same clock - the cards are geometry in the room, so they move with it
    // exactly; their CSS scales the shared value by each card's depth.
    const float = section.querySelector<HTMLElement>("[data-float]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A room that leans on tap and then stays leaning is worse than no room.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    let pointerX = 0;
    let pointerY = 0;
    let tracking = false;
    let x = 0;
    let y = 0;
    let frame: number | undefined;
    let last = 0;

    function tick(now: number) {
      const step = Math.min(now - last, MAX_STEP);
      last = now;

      let targetX = 0;
      let targetY = 0;

      if (tracking) {
        const box = section!.getBoundingClientRect();
        const nx = ((pointerX - box.left) / box.width - 0.5) * 2;
        const ny = ((pointerY - box.top) / box.height - 0.5) * 2;
        // Outside the hero the room returns to centre rather than clamping,
        // so it never sits leaning against a stop.
        if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
          targetX = nx;
          targetY = ny;
        }
      }

      const chase = 1 - Math.exp(-step / TAU);
      x += (targetX - x) * chase;
      y += (targetY - y) * chase;

      const settled =
        Math.abs(targetX - x) < SETTLED && Math.abs(targetY - y) < SETTLED;
      if (settled) {
        x = targetX;
        y = targetY;
      }

      stage!.style.setProperty("--eye-x", x.toFixed(4));
      stage!.style.setProperty("--eye-y", y.toFixed(4));
      float?.style.setProperty("--float-x", x.toFixed(4));
      float?.style.setProperty("--float-y", y.toFixed(4));

      frame = settled ? undefined : requestAnimationFrame(tick);
    }

    function wake() {
      if (frame !== undefined) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function onMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      tracking = true;
      wake();
    }

    function onGone() {
      tracking = false;
      wake();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onGone);
    window.addEventListener("blur", onGone);

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onGone);
      window.removeEventListener("blur", onGone);
      stage.style.removeProperty("--eye-x");
      stage.style.removeProperty("--eye-y");
      float?.style.removeProperty("--float-x");
      float?.style.removeProperty("--float-y");
    };
  }, []);

  return <span ref={ref} hidden />;
}
