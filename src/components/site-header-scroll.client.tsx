"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion.client";

// Flips `data-scrolled` on the document root once the page has left the top,
// with a little hysteresis so the bar never flutters around the threshold.
// The attribute shrinks --navbar-height and folds the logo wordmark away -
// see globals.css and site-header.module.css.

const ON_AT = 24;
const OFF_AT = 8;

export function SiteHeaderScroll() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      delete root.dataset.scrolled;
      return;
    }

    function update() {
      const scrolled = "scrolled" in root.dataset;
      if (!scrolled && window.scrollY > ON_AT) root.dataset.scrolled = "";
      else if (scrolled && window.scrollY < OFF_AT)
        delete root.dataset.scrolled;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [reducedMotion]);

  return null;
}
