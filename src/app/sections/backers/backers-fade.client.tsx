"use client";

import { useEffect, useRef, type ReactNode } from "react";

// The conveyor's edge fade, per mark. A gradient mask over the band faded
// whatever pixels happened to sit under it, so a two-part mark (icon plus
// wordmark) lost its icon first and left the bare word standing at half
// ink next to "Backed by" (client feedback round 3). This island dims each
// <li> as one unit instead: full ink through the middle of the band, easing
// to nothing over the last stretch before either edge, so a mark is gone
// before the band's overflow clip could cut into it. The band itself only
// keeps a sliver of soft edge (backers.module.css) for the frames before
// hydration.
//
// The markup is the server's; this wrapper is display:contents and only
// writes `opacity` on the marks it finds inside. One animation frame loop
// reads every mark's rect, then writes the few that changed - reads before
// writes, so the frame costs a single layout. The band's own box and the
// fade width are measured on resize, not per frame. The loop parks when
// the band leaves the viewport, when the tab is hidden, and under reduced
// motion, where the conveyor stands still anyway and the marks are handed
// back their full ink.

/** Width of the fade at either edge, rem - roughly one mark. */
const FADE_REM = 6;
/** Opacity deltas below this are not worth a style write. */
const EPSILON = 0.002;

export function BackersFade({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const band = node?.parentElement;
    if (!node || !band) return;

    const marks = Array.from(node.querySelectorAll<HTMLLIElement>("li"));
    if (marks.length === 0) return;
    // What each mark was last given, so unchanged marks cost nothing.
    const written = new Float64Array(marks.length).fill(1);

    // The band's edges in viewport space and the fade width in px. The fade
    // shrinks on narrow bands so the widest mark still reaches full ink
    // somewhere between the two zones instead of living half-dimmed.
    let bandLeft = 0;
    let bandRight = 0;
    let fade = 0;

    function measure() {
      const rect = band!.getBoundingClientRect();
      bandLeft = rect.left;
      bandRight = rect.right;
      const rem = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      let widest = 0;
      for (const mark of marks) widest = Math.max(widest, mark.offsetWidth);
      fade = Math.max(0, Math.min(FADE_REM * rem, (rect.width - widest) / 2));
    }

    function ease(t: number) {
      // Smoothstep: no kink at either end of the fade.
      return t * t * (3 - 2 * t);
    }

    let frame: number | undefined;

    function step() {
      frame = requestAnimationFrame(step);
      if (fade <= 0) return;

      // Reads.
      const rects = marks.map((mark) => mark.getBoundingClientRect());

      // Writes. Travel is right to left: a mark enters through the right
      // zone with its leading (left) edge and leaves through the left zone
      // with its trailing (right) edge, so the entry fade watches the
      // mark's right edge against the band's right, and the exit fade the
      // mark's left edge against the band's left.
      for (let i = 0; i < marks.length; i++) {
        const rect = rects[i]!;
        const fromLeft = Math.min(
          1,
          Math.max(0, (rect.left - bandLeft) / fade),
        );
        const fromRight = Math.min(
          1,
          Math.max(0, (bandRight - rect.right) / fade),
        );
        const opacity = ease(Math.min(fromLeft, fromRight));
        if (Math.abs(opacity - written[i]!) < EPSILON) continue;
        written[i] = opacity;
        marks[i]!.style.opacity = opacity >= 1 ? "" : opacity.toFixed(3);
      }
    }

    function clear() {
      for (let i = 0; i < marks.length; i++) {
        marks[i]!.style.removeProperty("opacity");
        written[i] = 1;
      }
    }

    // Whether the fade is worth computing: the band on screen, the tab
    // visible, and the conveyor actually moving.
    let intersecting = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    function resume() {
      if (!intersecting || document.hidden || reduced.matches) return;
      measure();
      frame ??= requestAnimationFrame(step);
    }

    function pause() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    }

    function onIntersect(entries: IntersectionObserverEntry[]) {
      intersecting = entries[entries.length - 1]!.isIntersecting;
      if (intersecting) resume();
      else pause();
    }

    function onVisibility() {
      if (document.hidden) pause();
      else resume();
    }

    function onMotionPreference() {
      if (reduced.matches) {
        pause();
        clear();
      } else {
        resume();
      }
    }

    const resizer = new ResizeObserver(measure);
    resizer.observe(band);
    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });
    observer.observe(band);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotionPreference);

    // Start straight away; the observer parks the loop if the band turns
    // out to be off screen.
    resume();

    return () => {
      pause();
      clear();
      resizer.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotionPreference);
    };
  }, []);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
