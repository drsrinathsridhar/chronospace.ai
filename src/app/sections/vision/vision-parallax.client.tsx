"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The tableau answers the pointer: moving across the vision section eases
// both capture trails a few pixels the other way, the arm a touch farther
// than the dancer, so the set pieces hang at their own depths behind the
// claim while the type holds still.
//
// The island only writes two custom properties on a display:contents
// wrapper - each trail's own factor and the transforms live in
// vision.module.css - and the offset is eased toward the pointer on its own
// animation frame loop, which parks itself once the trails settle. Fine
// pointers only; reduced motion never starts.

/** Largest drift from centre, px, before each trail's factor. */
const DRIFT_X = 8;
const DRIFT_Y = 5;
/** Fraction of the remaining distance covered per frame. */
const EASE = 0.08;

export function VisionParallax({ children }: { children: ReactNode }) {
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
