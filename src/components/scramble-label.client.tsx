"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./scramble-label.module.css";

// The site's hover signature, shared by the navbar cells and every CTA:
// hovering the control shuffles its label - every character flickers through
// other glyphs of the same alphabet before settling on its own, left to
// right, and the whole word is resolved in about half a second. Spaces are
// left alone so the shape of the phrase never changes.
//
// The hover target is the enclosing control, not the label - cells and
// buttons are wide and the text sits in one corner of them - so the
// listeners go on the closest anchor rather than on this span.

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** One frame of the shuffle, ms. */
const TICK = 32;
/** Frames before the first character settles, and between each one after. */
const LEAD = 3;
const STAGGER = 1;

function shuffle(text: string, tick: number) {
  let out = "";

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const settled = tick >= LEAD + i * STAGGER;
    out +=
      settled || char === " "
        ? char
        : ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }

  return out;
}

export function ScrambleLabel({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    const cell = ref.current?.closest("a");
    if (!cell) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lastTick = LEAD + (children.length - 1) * STAGGER;
    let timer: number | undefined;

    function stop() {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
      setDisplay(null);
    }

    function start() {
      stop();
      let tick = 0;
      setDisplay(shuffle(children, tick));
      timer = window.setInterval(() => {
        tick += 1;
        setDisplay(shuffle(children, tick));
        if (tick >= lastTick) stop();
      }, TICK);
    }

    cell.addEventListener("pointerenter", start);
    cell.addEventListener("pointerleave", stop);
    cell.addEventListener("focus", start);
    cell.addEventListener("blur", stop);

    return () => {
      stop();
      cell.removeEventListener("pointerenter", start);
      cell.removeEventListener("pointerleave", stop);
      cell.removeEventListener("focus", start);
      cell.removeEventListener("blur", stop);
    };
  }, [children]);

  return (
    <span
      ref={ref}
      className={styles.label}
      data-shuffling={display === null ? undefined : ""}
    >
      <span className={styles.real}>{children}</span>
      <span aria-hidden className={styles.shuffled}>
        {display}
      </span>
    </span>
  );
}
