"use client";

import { useScroll, useMotionValueEvent } from "motion/react";
import { useEffect } from "react";

// Flips `data-scrolled` on the document root once the page has left the top,
// with a little hysteresis so the bar never flutters around the threshold.
// The attribute shrinks --navbar-height and folds the logo wordmark away -
// see globals.css and site-header.module.css.

const ON_AT = 24;
const OFF_AT = 8;

export function SiteHeaderScroll() {
  const { scrollY } = useScroll();

  function update(y: number) {
    const root = document.documentElement;
    const scrolled = "scrolled" in root.dataset;
    if (!scrolled && y > ON_AT) root.dataset.scrolled = "";
    else if (scrolled && y < OFF_AT) delete root.dataset.scrolled;
  }

  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    update(scrollY.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
