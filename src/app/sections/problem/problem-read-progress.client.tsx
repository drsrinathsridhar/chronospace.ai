"use client";

import { useEffect, useRef } from "react";

// Writes the read. The copy's position in the viewport becomes a single
// number on the block, --read-progress in 0..1, and every word's colour is
// derived from it in CSS - the island never touches a word.
//
// The reading line: the copy starts being read when its top crosses 85% of
// the viewport and is finished as its bottom passes 40%, so the boundary
// clears the block comfortably before the block leaves the screen.
//
// Measured once per frame at most - scroll events only mark it dirty - and
// never attached at all under reduced motion, where the block keeps its
// resting value of 1: settled, fully-read ink.

const START = 0.85;
const END = 0.4;

export function ProblemReadProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const copy =
      ref.current?.parentElement?.querySelector<HTMLElement>(
        "[data-read-copy]",
      );
    if (!copy) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number | undefined;

    function measure() {
      frame = undefined;
      if (!copy) return;

      const box = copy.getBoundingClientRect();
      const start = window.innerHeight * START;
      const end = window.innerHeight * END;
      const travelled = start - box.top;
      const span = box.height + (start - end);
      const progress = Math.min(1, Math.max(0, travelled / span));

      copy.style.setProperty("--read-progress", progress.toFixed(4));
    }

    function wake() {
      frame ??= requestAnimationFrame(measure);
    }

    wake();
    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      copy.style.removeProperty("--read-progress");
    };
  }, []);

  return <span ref={ref} hidden />;
}
