"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

// The generic scroll trigger for the shimmer-in / sweep-in utilities:
// everything inside waits with `--reveal: 0` until the block scrolls into
// view, then the whole choreography releases on its `--beat` staggers.
// Leaving the viewport flips it back, so returning replays it. The gate
// itself lives in globals.css under [data-reveal-scope], behind the
// scripting and motion guards, so a reader without JS never waits on this
// island.
//
// `watch` names another element to take the cue from - a CSS selector -
// for a scope whose own position says nothing about whether it can be
// seen: the closing block is pinned under the page and uncovered as <main>
// scrolls off it, so it watches the sentinel at the end of <main>
// (app/page.tsx) rather than itself. If the selector finds nothing the
// scope watches itself as before.

type RevealScopeProps = ComponentPropsWithoutRef<"div"> & {
  /** Selector of the element whose arrival releases this scope. */
  watch?: string;
};

export function RevealScope({ watch, ...props }: RevealScopeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const target = (watch && document.querySelector(watch)) || node;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) node.dataset.revealed = "";
        else delete node.dataset.revealed;
      },
      // Fire once the block has actually entered the picture, not the
      // moment its first pixel crosses the fold.
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [watch]);

  return <div ref={ref} data-reveal-scope {...props} />;
}
