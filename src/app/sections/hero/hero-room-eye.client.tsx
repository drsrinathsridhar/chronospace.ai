"use client";

import { useEffect, useRef } from "react";

// Moves the eye. The pointer's position over the hero becomes `--eye-x` and
// `--eye-y`, in -1..1 from its centre, and the room reads them as its
// `perspective-origin` - so this island only ever writes two numbers (four,
// with the cards' copy of them).
//
// Nobody steering it, the eye drifts on its own: a slow figure on two
// incommensurate periods, so the room is never still and never visibly
// repeats, on every device - the coarse-pointer builds get the drift at a
// smaller amplitude rather than nothing (client feedback, September 2026:
// the hero read as static until hovered). A pointer takes over the moment
// it moves and hands back after a second and a half of rest, on a slower
// chase so the hand-off is soft.
//
// The same clock runs the captures' trail: once the load-time trail has
// collapsed and its colour drained, the cards take turns carrying their
// echo for a moment, round robin, so the room keeps showing what it does
// with time. A turn is `data-echo` on one card, and the CSS gives that card
// its trail AND its colour, exactly as it does a hovered one - so the
// coloured trail the client asked for on load keeps recurring, one figure
// at a time (hero-cards.module.css).
//
// How far the eye travels is not decided here: the amplitude and the
// client's wiggle knob (--hero-wiggle, src/tuning.config.ts) live in the
// CSS that reads --eye-x/--eye-y, so this island keeps writing -1..1.
//
// Three things it is careful about, each of which was a bug first:
//
//   The pointer is tracked on the window, not on the section. The navbar is
//   fixed and sits over the hero's top 60px, so a listener on the section
//   gets `pointerleave` the moment the pointer crosses into it - and the
//   room would drop back to centre exactly when someone reached for the
//   nav. Whether the pointer is over the hero is a question about geometry,
//   so it is answered with geometry.
//
//   Moves only record a position. The measuring and the maths happen in the
//   frame callback, so a 1000Hz mouse cannot force a thousand layouts a
//   second - the rect is read once per frame.
//
//   The variables are written on the stage, not on the section. A custom
//   property is inherited, so setting it on the section would invalidate
//   style for every descendant - the headline and the whole measured stage
//   included - sixty times a second, to move a backdrop.
//
// And because the loop now runs whenever the room is in view rather than
// only while a pointer moves, it parks the moment the hero leaves the
// viewport or the tab is hidden, and every timer parks with it.

/**
 * Time constant of the chase, ms - two thirds of the distance covered in
 * this long, and the step is taken from the clock rather than assumed, so
 * it settles at the same rate on a 60Hz panel and a 120Hz one. The room
 * should feel weighted, not late; this is the dial for that, and anything
 * past ~150 starts reading as lag rather than mass.
 */
const TAU = 80;
/** The chase is slower when the drift is driving, so a hand-off is soft. */
const TAU_DRIFT = 400;
/** Longest step the chase will take, ms - a backgrounded tab must not jump. */
const MAX_STEP = 64;
/** No pointer input for this long and the room starts to drift, ms. */
const IDLE_AFTER = 1500;
/** Drift amplitude as a fraction of the pointer's -1..1 range. */
const DRIFT = { fine: { x: 0.35, y: 0.2 }, coarse: { x: 0.22, y: 0.12 } };
/** Two incommensurate periods, ms, so the path never repeats visibly. */
const DRIFT_PERIOD_X = 14000;
const DRIFT_PERIOD_Y = 9000;
/** Delay before the first automatic trail, ms - well after the load-time
    trail has finished collapsing (--echo-hold 2.4s + 0.3s stagger + 0.45s)
    and the figures have drained to grey (figure-intro ends at ~3.45s), so
    the first turn reads as a new event, not a stutter of the first. */
const ECHO_FIRST = 6000;
/** Interval between automatic trails, ms, and how long each stays out. */
const ECHO_EVERY = 5000;
const ECHO_HOLD = 1600;

export function HeroRoomEye() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage =
      ref.current?.parentElement?.querySelector<HTMLElement>("[data-stage]");
    const section = ref.current?.closest("section");
    if (!stage || !section) return;
    // The standing cards, if the layout is showing them. The same eye on the
    // same clock - the cards are geometry in the room, so they move with it
    // exactly; their CSS scales the shared value by each card's depth.
    const float = section.querySelector<HTMLElement>("[data-float]");
    const cards = Array.from(
      section.querySelectorAll<HTMLElement>("[data-float] article"),
    );
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // A room that leans on tap and then stays leaning is worse than no room,
    // so only a fine pointer gets to steer; everyone gets the drift.
    const fine = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const amp = fine ? DRIFT.fine : DRIFT.coarse;

    let pointerX = 0;
    let pointerY = 0;
    let tracking = false;
    let lastMove = -Infinity;
    let x = 0;
    let y = 0;
    let frame: number | undefined;
    let last = 0;

    function tick(now: number) {
      const step = Math.min(now - last, MAX_STEP);
      last = now;

      let targetX = 0;
      let targetY = 0;
      const idle = !tracking || now - lastMove > IDLE_AFTER;

      if (idle) {
        targetX = amp.x * Math.sin((now / DRIFT_PERIOD_X) * 2 * Math.PI);
        targetY = amp.y * Math.sin((now / DRIFT_PERIOD_Y) * 2 * Math.PI + 1);
      } else {
        const box = section!.getBoundingClientRect();
        const nx = ((pointerX - box.left) / box.width - 0.5) * 2;
        const ny = ((pointerY - box.top) / box.height - 0.5) * 2;
        // Outside the hero the room returns to centre rather than clamping,
        // so it never sits leaning against a stop.
        if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
          targetX = nx;
          targetY = ny;
        }
      }

      const chase = 1 - Math.exp(-step / (idle ? TAU_DRIFT : TAU));
      x += (targetX - x) * chase;
      y += (targetY - y) * chase;

      stage!.style.setProperty("--eye-x", x.toFixed(4));
      stage!.style.setProperty("--eye-y", y.toFixed(4));
      float?.style.setProperty("--float-x", x.toFixed(4));
      float?.style.setProperty("--float-y", y.toFixed(4));

      // The target is always moving now, so the loop never settles; it is
      // parked from outside instead, when the room is not being looked at.
      frame = requestAnimationFrame(tick);
    }

    function wake() {
      if (frame !== undefined) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    }

    function sleep() {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    }

    // The trail cycle. One card at a time carries its echo for ECHO_HOLD,
    // the three taking turns; the CSS reads `data-echo` exactly as it reads
    // hover (hero-cards.module.css). The first turn waits for the load-time
    // trail to finish collapsing; after a pause the cycle resumes on its
    // ordinary interval.
    let echoIndex = 0;
    let echoStarted = false;
    let echoTimer: ReturnType<typeof setTimeout> | undefined;
    let echoInterval: ReturnType<typeof setInterval> | undefined;
    let echoHold: ReturnType<typeof setTimeout> | undefined;

    function fireEcho() {
      const card = cards[echoIndex % cards.length];
      echoIndex += 1;
      card.dataset.echo = "";
      echoHold = setTimeout(() => {
        delete card.dataset.echo;
        echoHold = undefined;
      }, ECHO_HOLD);
    }

    function startEcho() {
      if (cards.length === 0) return;
      if (echoTimer !== undefined || echoInterval !== undefined) return;
      echoTimer = setTimeout(
        () => {
          echoTimer = undefined;
          fireEcho();
          echoInterval = setInterval(fireEcho, ECHO_EVERY);
        },
        echoStarted ? ECHO_EVERY : ECHO_FIRST,
      );
      echoStarted = true;
    }

    function stopEcho() {
      clearTimeout(echoTimer);
      clearInterval(echoInterval);
      clearTimeout(echoHold);
      echoTimer = echoInterval = echoHold = undefined;
      for (const card of cards) delete card.dataset.echo;
    }

    // Whether the room is being looked at: on screen and in a visible tab.
    // Both gates have to open for the clock to run.
    let intersecting = true;

    function resume() {
      if (!intersecting || document.hidden) return;
      wake();
      startEcho();
    }

    function pause() {
      sleep();
      stopEcho();
    }

    function onMove(event: PointerEvent) {
      pointerX = event.clientX;
      pointerY = event.clientY;
      lastMove = performance.now();
      tracking = true;
    }

    function onGone() {
      tracking = false;
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

    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });
    observer.observe(section);
    document.addEventListener("visibilitychange", onVisibility);
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onGone);
      window.addEventListener("blur", onGone);
    }

    // Start straight away: the drift needs no input, and the observer will
    // park it if the hero turns out to be off screen.
    resume();

    return () => {
      pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onGone);
      window.removeEventListener("blur", onGone);
      stage.style.removeProperty("--eye-x");
      stage.style.removeProperty("--eye-y");
      float?.style.removeProperty("--float-x");
      float?.style.removeProperty("--float-y");
    };
  }, []);

  return <span ref={ref} hidden />;
}
