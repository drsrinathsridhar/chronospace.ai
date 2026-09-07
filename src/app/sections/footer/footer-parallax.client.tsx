"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The echo-repeater answers the pointer: moving across the footer eases the
// plate a few pixels the other way, so the cascade reads as a pane hanging
// behind the type rather than paint on it. The wrapper carries a slight
// scale so the drift never pulls the plate's edges into view.
//
// The island only writes two custom properties - the transform lives in the
// wrapper's classes - and the offset is eased toward the pointer on its own
// animation frame loop, which parks itself once the plate settles. Fine
// pointers only; reduced motion never starts.

/** Largest drift from centre, px. */
const DRIFT_X = 18;
const DRIFT_Y = 10;
/** Fraction of the remaining distance covered per frame. */
const EASE = 0.08;

export function FooterParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const scene = node?.closest("footer");
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
      node!.style.setProperty("--parallax-x", `${x.toFixed(2)}px`);
      node!.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);

      frame =
        Math.abs(targetX - x) > 0.1 || Math.abs(targetY - y) > 0.1
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
      className="pointer-events-none absolute inset-0 translate-x-(--parallax-x) translate-y-(--parallax-y) scale-103 will-change-transform"
      style={{ "--parallax-x": "0px", "--parallax-y": "0px" }}
    >
      {children}
    </div>
  );
}
