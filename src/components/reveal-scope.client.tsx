"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

// The generic scroll trigger for the shimmer-in / sweep-in utilities:
// everything inside waits with `--reveal: 0` until the block scrolls into
// view, then the whole choreography releases on its `--beat` staggers.
// Leaving the viewport flips it back, so returning replays it. The gate
// itself lives in globals.css under [data-reveal-scope], behind the
// scripting and motion guards, so a reader without JS never waits on this
// island.

export function RevealScope(props: ComponentPropsWithoutRef<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

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

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} data-reveal-scope {...props} />;
}
