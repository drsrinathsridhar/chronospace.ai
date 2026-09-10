"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The pointer drift: moving across a section eases whatever this wraps a
// few pixels the other way, so the set pieces hang at their own depths
// behind the copy while the type holds still. Shared by the vision
// tableau, where both capture trails ride it, and the intro, where the
// manufacturing take does.
//
// The island only writes two custom properties on a display:contents
// wrapper - each piece's own factor and the transforms live in the owning
// section's CSS module - and the offset is eased toward the pointer on its
// own animation frame loop, which parks itself once the pieces settle. It
// listens on the nearest <section>, so the drift answers the pointer across
// the whole section, not just the wrapped block. Fine pointers only;
// reduced motion never starts.

/** Largest drift from centre, px, before each piece's factor. */
const DRIFT_X = 8;
const DRIFT_Y = 5;
/** Fraction of the remaining distance covered per frame. */
const EASE = 0.08;

export function PointerDrift({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const scene = node?.closest("section");
    if (!node || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    let frame: number | undefined;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function step() {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;
      node!.style.setProperty("--drift-x", `${x.toFixed(2)}px`);
      node!.style.setProperty("--drift-y", `${y.toFixed(2)}px`);

      frame =
        Math.abs(targetX - x) > 0.05 || Math.abs(targetY - y) > 0.05
          ? requestAnimationFrame(step)
          : undefined;
    }

    function schedule() {
      frame ??= requestAnimationFrame(step);
    }

    function onMove(event: PointerEvent) {
      const rect = scene!.getBoundingClientRect();
      targetX = (0.5 - (event.clientX - rect.left) / rect.width) * 2 * DRIFT_X;
      targetY = (0.5 - (event.clientY - rect.top) / rect.height) * 2 * DRIFT_Y;
      schedule();
    }

    function onLeave() {
      targetX = 0;
      targetY = 0;
      schedule();
    }

    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="contents"
      style={{ "--drift-x": "0px", "--drift-y": "0px" }}
    >
      {children}
    </div>
  );
}
