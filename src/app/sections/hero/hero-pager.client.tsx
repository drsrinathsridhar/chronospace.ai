"use client";

import { useEffect, useRef, useState } from "react";
import { TimelineTickIcon } from "@/icons/generated";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion.client";
import styles from "./hero-cards.module.css";
import { ECHO_HOLD } from "./hero-room-eye.client";

// The phone carousel's pager. Below md the three standing cards are slides
// in a scroll-snap strip (hero-cards.module.css, block 1), and this island
// is the little that needs a script about it: which slide is showing, a
// way to tap to another, and the colour trail on the one that arrives.
//
// Three ticks - the ruler's own corner glyph, TimelineTickIcon, at 8px
// inside 44px targets - stand in a row under the floor line, the showing
// slide's in accent and the others in the hairline grey. The server
// renders the first as active, so the pager is there and right before
// hydration and without scripting at all; the swipe itself is plain CSS
// scroll-snap and needs no script either. A tap scrolls the strip to that
// slide, smoothly - or at once for anyone who has asked for less motion,
// which is the only motion of this island's own that the setting takes
// away.
//
// The showing slide is read from the scroller's `scroll` events, at most
// once a frame: the index is scrollLeft over the scroller's width, rounded,
// which is the slide nearest the centre while a swipe is in flight and
// exactly the snapped one when it lands. Each change hands the arriving
// card `data-echo` for the round robin's hold (ECHO_HOLD, shared with
// hero-room-eye.client.tsx) and takes it off the others, so the CSS gives
// it the trail and the colour exactly as a hovered card or a desktop turn
// gets them - one attribute, no second set of rules. The eye island does
// not run its round robin below md (it reads the same breakpoint), so the
// attribute has one owner at any width. Reduced motion keeps the pager and
// instant scroll-snap navigation but does not fire the echo. It does not fire
// for the slide the page opens on either: the load-time trail already plays
// every card in colour.
//
// The scroller is found through the section rather than passed in: the
// pager is rendered by the same server component as the cards
// (hero-cards.tsx) and stands beside the strip, not inside it, because the
// strip clips and scrolls everything it holds.

export function HeroPager({ labels }: { labels: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const section = ref.current?.closest("section");
    const scroller = section?.querySelector<HTMLElement>("[data-float]");
    if (!scroller) return;
    scrollerRef.current = scroller;
    const cards = Array.from(scroller.querySelectorAll<HTMLElement>("article"));
    // The carousel exists below md only; above it the same element is the
    // strip or the room layer and never scrolls, but a resize across the
    // line can still fire one scroll event as its offset resets, and that
    // must not colour a desktop card.
    const wide = window.matchMedia("(min-width: 48rem)");

    let current = 0;
    let frame: number | undefined;
    let hold: ReturnType<typeof setTimeout> | undefined;

    function echo(index: number) {
      clearTimeout(hold);
      for (const card of cards) delete card.dataset.echo;
      const card = cards[index];
      if (!card) return;
      card.dataset.echo = "";
      hold = setTimeout(() => {
        delete card.dataset.echo;
        hold = undefined;
      }, ECHO_HOLD);
    }

    function measure(colour: boolean) {
      frame = undefined;
      const width = scroller!.clientWidth;
      if (width === 0) return;
      const index = Math.min(
        cards.length - 1,
        Math.max(0, Math.round(scroller!.scrollLeft / width)),
      );
      if (index === current) return;
      current = index;
      setActive(index);
      if (colour && !wide.matches && !reducedMotion) echo(index);
    }

    function onScroll() {
      if (frame === undefined)
        frame = requestAnimationFrame(() => measure(true));
    }

    scroller.addEventListener("scroll", onScroll, { passive: true });
    // A reload or a back-navigation can restore the strip mid-way; the
    // ticks follow without treating the restore as a swipe.
    measure(false);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
      clearTimeout(hold);
      for (const card of cards) delete card.dataset.echo;
      scrollerRef.current = null;
    };
  }, [reducedMotion]);

  function show(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({
      left: index * scroller.clientWidth,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <div
      ref={ref}
      data-hero-pager
      className={cn(styles.pager, "sweep-reveal")}
      style={{ "--reveal-index": 10 }}
    >
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          className={styles.tick}
          aria-label={`Show capture ${index + 1} of ${labels.length}`}
          aria-current={index === active ? "true" : undefined}
          onClick={() => show(index)}
        >
          <TimelineTickIcon
            width={8}
            height={8}
            className={cn(
              "transition-colors",
              index === active ? "text-accent" : "text-line",
            )}
          />
        </button>
      ))}
    </div>
  );
}
