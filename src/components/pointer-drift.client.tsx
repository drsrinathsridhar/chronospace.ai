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
// the whole section, not just the wrapped block.
//
// Every pointer steers, the same rules as the hero's eye
// (sections/hero/hero-room-eye.client.tsx, feedback round 3, slide 2d): a
// mouse, a trackpad, a pen, or a finger dragging across the section - the
// section is given `touch-action: pan-y` from here, so a vertical swipe
// still scrolls and a sideways drag reaches us as pointer moves. A finger
// that lifts, or a gesture the browser takes for the scroll (pointercancel),
// eases the pieces home; a hovering pointer keeps them where it left them
// until it leaves the section. Reduced motion changes nothing here: this
// is motion the user is causing with their own hand, exactly as far as the
// hand moves, and it stops when the hand stops - the setting is for motion
// they did not ask for, and this island has none (no idle drift, no
// autoplay).

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

    // A lifted finger or pen is gone; a mouse button going up is not.
    function onUp(event: PointerEvent) {
      if (event.pointerType !== "mouse") onLeave();
    }

    // Set from here rather than in every owning section's markup, so the
    // sections stay ignorant of how the drift is driven; without scripting
    // there is no drift and nothing to allow.
    const touchAction = scene.style.touchAction;
    scene.style.touchAction = "pan-y";

    scene.addEventListener("pointermove", onMove, { passive: true });
    scene.addEventListener("pointerdown", onMove, { passive: true });
    scene.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      scene.style.touchAction = touchAction;
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerdown", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
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
