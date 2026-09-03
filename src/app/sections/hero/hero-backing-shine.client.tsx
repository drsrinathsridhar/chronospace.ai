"use client";

import { useEffect, useRef } from "react";

// Arms the backing logo's shine. When scrolling carries the mark through
// the middle band of the viewport, data-shine lands on it once and the
// observer disconnects - the flare in hero-backing.module.css runs, leaves
// no trace, and never comes back. The island writes one attribute and
// owns nothing else.

export function HeroBackingShine() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mark = ref.current?.parentElement;
    if (!mark) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          mark.setAttribute("data-shine", "");
          observer.disconnect();
        }
      },
      // A zero-height band across the middle of the viewport: the shine
      // fires as the mark crosses it, not merely on appearing.
      { rootMargin: "-50% 0px -50% 0px" },
    );

    observer.observe(mark);
    return () => observer.disconnect();
  }, []);

  return <span ref={ref} hidden />;
}
