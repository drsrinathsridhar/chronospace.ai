"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion.client";

// The ruler's timecode runs while the page is up: HH:MM:SS:FF at 30fps
// from the comp's resting 00:00:14:07, so the instrument reads as an
// instrument rather than a printed label (client feedback, September 2026).
// Written straight to the node on each frame that changes the count - no
// React state, nothing re-renders. Static under reduced motion; while the
// tab is hidden it pauses and picks up where it stopped, the way a paused
// take would.

const FPS = 30;
const START_FRAMES = ((0 * 60 + 0) * 60 + 14) * FPS + 7;
const START = format(START_FRAMES);

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function format(frames: number) {
  const ff = frames % FPS;
  const seconds = Math.floor(frames / FPS);
  const ss = seconds % 60;
  const mm = Math.floor(seconds / 60) % 60;
  const hh = Math.floor(seconds / 3600) % 100;
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

export function HeroTimecode() {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reducedMotion) return;

    // The count is rebased on every resume: `base` is where it stood when
    // the clock stopped, `t0` when it started again.
    let base = START_FRAMES;
    let t0 = performance.now();
    let shown = START_FRAMES;
    let frame: number | undefined;
    let intersecting = true;

    function tick(now: number) {
      const frames = base + Math.floor(((now - t0) / 1000) * FPS);
      if (frames !== shown) {
        shown = frames;
        node!.textContent = format(frames);
      }
      frame = requestAnimationFrame(tick);
    }

    function wake() {
      if (frame !== undefined || !intersecting || document.hidden) return;
      t0 = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function sleep() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      base = shown;
    }

    function onVisibility() {
      if (document.hidden) sleep();
      else wake();
    }

    const section = node.closest("section");
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? false;
      if (intersecting) wake();
      else sleep();
    });
    if (section) observer.observe(section);

    document.addEventListener("visibilitychange", onVisibility);
    if (!document.hidden) wake();

    return () => {
      sleep();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      node.textContent = START;
    };
  }, [reducedMotion]);

  return <span ref={ref}>{START}</span>;
}
