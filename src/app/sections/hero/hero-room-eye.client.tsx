"use client";

import { useEffect, useRef } from "react";

// Moves the eye. The pointer's position over the hero becomes `--eye-x` and
// `--eye-y`, in -1..1 from its centre, and the room reads them as its
// `perspective-origin` - so this island only ever writes a handful of
// numbers: the two, the cards' copy of them, and the eye's speed.
//
// Who steers, in order of precedence:
//
//   A pointer that is moving, or a finger that is down. Any pointer - a
//   mouse, a trackpad, a pen, a finger on a touch laptop or a phone. The
//   first build let only `(pointer: fine)` steer, on the theory that a room
//   leaning after a tap and then staying leant was worse than no room; the
//   client found the effect dead on machines whose primary pointer reports
//   coarse and on every phone (feedback round 3, slide 2d). So every
//   pointer steers now, and the two failure modes are handled where they
//   arise: a finger that lifts (pointerup) or a gesture the browser takes
//   for scrolling (pointercancel) releases the room at once, while a
//   hovering pointer that merely stops keeps the room where it left it for
//   IDLE_AFTER before handing over. The hero root carries `touch-action:
//   pan-y` (hero.tsx), so a vertical swipe still scrolls the page and a
//   sideways drag reaches us as pointer moves.
//
//   The phone's tilt. Where the browser exposes `deviceorientation` - Android
//   Chrome does without asking, iOS asks and only from inside a gesture - the
//   attitude the phone was first held at is centre, and leaning it moves the
//   eye at a reduced amplitude, with a dead zone so a hand's tremor does not
//   read as steering. On iOS `DeviceOrientationEvent.requestPermission`
//   exists and needs a user gesture, so the first pointerdown on the hero
//   asks; denied, absent or thrown, the finger-follow above is all a phone
//   gets. Nothing here ever throws on a browser without the API. Tilt is
//   only wired on devices that cannot hover: it is for a phone or tablet in
//   the hand, not a desktop that happens to have a sensor.
//
//   Nobody steering it, the eye drifts on its own: a slow figure on two
//   incommensurate periods, so the room is never still and never visibly
//   repeats - the no-hover builds get the drift at a smaller amplitude
//   rather than nothing (client feedback, September 2026: the hero read as
//   static until hovered). The chase is slower while the drift drives, so a
//   hand-off is soft.
//
// Reduced motion is honoured by taking away only what the setting is for:
// motion the user did not cause. The idle drift and the round-robin trail
// are gone and the eye rests at centre; the pointer still steers, because
// the room moving exactly as far as the hand moved and stopping when it
// stops is the direct manipulation the setting leaves alone. The first
// build returned before wiring anything, which made the hero a still image
// on every Windows PC with "Show animations" off and every Mac with Reduce
// Motion on - almost certainly the client's "some of our machines" (round
// 3, slide 2d) - and that was never the intent. Tilt is off too: a phone in
// the hand is never still, and the tremor is motion nobody meant.
//
// The same clock runs the captures' trail: once the load-time trail has
// collapsed and its colour drained, the cards take turns carrying their
// trail for a moment, round robin, so the room keeps showing what it does
// with time. A turn is `data-echo` on one card, and the CSS gives that card
// its trail AND its colour, exactly as it does a hovered one - so the
// coloured trail the client asked for on load keeps recurring, one figure
// at a time (hero-cards.module.css).
//
// The eye's speed is the trail's length. Each frame the distance the eye
// moved, per second, is normalised against SPEED_FULL and smoothed - quick
// to rise, slow to fall, so a flick leaves a smear that lingers - and
// written as `--eye-speed` in 0..1 next to the position. The smear reads
// it for its stretch and its opacity (hero-cards.module.css): a fast
// pointer pulls a long trail, a still one leaves a short soft one. Under
// reduced motion the property is never written and the CSS default of 0
// holds.
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
//   so it is answered with geometry. (Only the pointerdown that asks iOS
//   for the sensor listens on the section: that one has to be a gesture on
//   the hero itself.)
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
// And because the loop runs whenever the room is in view rather than only
// while a pointer moves, it parks the moment the hero leaves the viewport
// or the tab is hidden, and every timer parks with it.

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
/** And a little slower under tilt, which arrives at sensor rate with a hand's
    jitter in it: enough mass to read as the room following the phone. */
const TAU_TILT = 160;
/** Longest step the chase will take, ms - a backgrounded tab must not jump. */
const MAX_STEP = 64;
/** No pointer input for this long and the room starts to drift, ms. Only a
    hovering pointer gets this grace: a lifted finger releases at once. */
const IDLE_AFTER = 1500;
/** Drift amplitude as a fraction of the pointer's -1..1 range. */
const DRIFT = { hover: { x: 0.35, y: 0.2 }, touch: { x: 0.22, y: 0.12 } };
/** Two incommensurate periods, ms, so the path never repeats visibly. */
const DRIFT_PERIOD_X = 14000;
const DRIFT_PERIOD_Y = 9000;
/** Tilt: degrees of lean that count as the full travel, the dead zone around
    the resting attitude, and the fraction of the eye's range the full lean
    reaches - a phone in the hand should lean the room, not throw it. */
const TILT_RANGE = 18;
const TILT_DEAD = 1.5;
const TILT_AMP = { x: 0.6, y: 0.4 };
/** The resting attitude follows the hand slowly (time constant, ms), so a
    grip that settles differently from the first reading re-centres the room
    over a few seconds instead of leaving it leant against a stop. */
const TILT_RECENTRE = 6000;
/** A sensor that has said nothing for this long is treated as absent, ms. */
const TILT_STALE = 1000;
/** Eye speed, in units of the -1..1 range per second, that counts as 1 -
    about a sweep across half the hero in a quarter of a second. */
const SPEED_FULL = 4;
/** The speed's own smoothing: quick up, slow down, so a flick leaves a smear
    that lingers rather than one that vanishes with the hand. */
const TAU_SPEED_UP = 60;
const TAU_SPEED_DOWN = 350;
/** Delay before the first automatic trail, ms - well after the load-time
    trail has finished collapsing (--echo-hold 2.4s + 0.45s) and the figures
    have drained to grey (figure-intro ends at ~3.45s), so the first turn
    reads as a new event, not a stutter of the first. */
const ECHO_FIRST = 6000;
/** Interval between automatic trails, ms, and how long each stays out. The
    hold is shared with the phone carousel's pager (hero-pager.client.tsx),
    which gives the arriving slide the same turn. */
const ECHO_EVERY = 5000;
export const ECHO_HOLD = 1600;

/** iOS puts the permission request on the event constructor; nobody else
    has it, and the DOM typings do not know it. */
type OrientationEventConstructor = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied" | "prompt">;
};

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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Whether the primary pointer can hover decides only two things: how
    // far the drift wanders, and whether a pointer that stops still keeps
    // steering for a moment (a mouse at rest is still pointing; a lifted
    // finger is not) - and it gates the tilt, which is for a device held in
    // the hand.
    const hovers = window.matchMedia("(hover: hover)").matches;
    const amp = hovers ? DRIFT.hover : DRIFT.touch;
    // Below md the cards are a carousel and the pager owns the trail: each
    // swipe colours the slide that arrives (hero-pager.client.tsx), so a
    // turn firing here as well would light a card that is off screen or
    // stack two holds on the one that shows. The round robin runs from md
    // up, where all three stand in view, and follows a resize across the
    // line either way.
    const wide = window.matchMedia("(min-width: 48rem)");

    let pointerX = 0;
    let pointerY = 0;
    let tracking = false;
    let lastMove = -Infinity;
    let tiltX = 0;
    let tiltY = 0;
    let lastTilt = -Infinity;
    let x = 0;
    let y = 0;
    let speed = 0;
    let frame: number | undefined;
    let last = 0;

    function tick(now: number) {
      const step = Math.min(now - last, MAX_STEP);
      last = now;

      let targetX = 0;
      let targetY = 0;
      let tau = TAU;
      const steering = tracking && now - lastMove <= IDLE_AFTER;
      const tilting = !reduced && now - lastTilt <= TILT_STALE;

      if (steering) {
        const box = section!.getBoundingClientRect();
        const nx = ((pointerX - box.left) / box.width - 0.5) * 2;
        const ny = ((pointerY - box.top) / box.height - 0.5) * 2;
        // Outside the hero the room returns to centre rather than clamping,
        // so it never sits leaning against a stop.
        if (nx >= -1 && nx <= 1 && ny >= -1 && ny <= 1) {
          targetX = nx;
          targetY = ny;
        }
      } else if (tilting) {
        targetX = tiltX;
        targetY = tiltY;
        tau = TAU_TILT;
      } else if (!reduced) {
        targetX = amp.x * Math.sin((now / DRIFT_PERIOD_X) * 2 * Math.PI);
        targetY = amp.y * Math.sin((now / DRIFT_PERIOD_Y) * 2 * Math.PI + 1);
        tau = TAU_DRIFT;
      }
      // Reduced motion with nothing steering: the target is centre, on the
      // pointer's own chase, so the room settles where the hand left it.

      const chase = 1 - Math.exp(-step / tau);
      const dx = (targetX - x) * chase;
      const dy = (targetY - y) * chase;
      x += dx;
      y += dy;

      stage!.style.setProperty("--eye-x", x.toFixed(4));
      stage!.style.setProperty("--eye-y", y.toFixed(4));
      float?.style.setProperty("--float-x", x.toFixed(4));
      float?.style.setProperty("--float-y", y.toFixed(4));

      if (!reduced && step > 0) {
        const raw = Math.min(
          1,
          (Math.hypot(dx, dy) / (step / 1000)) * (1 / SPEED_FULL),
        );
        const ease =
          1 - Math.exp(-step / (raw > speed ? TAU_SPEED_UP : TAU_SPEED_DOWN));
        speed += (raw - speed) * ease;
        // The cards read it as an inherited property, so it is written where
        // they live as well as on the stage.
        stage!.style.setProperty("--eye-speed", speed.toFixed(3));
        float?.style.setProperty("--eye-speed", speed.toFixed(3));
      }

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

    // The trail cycle. One card at a time carries its trail for ECHO_HOLD,
    // the three taking turns; the CSS reads `data-echo` exactly as it reads
    // hover (hero-cards.module.css). The first turn waits for the load-time
    // trail to finish collapsing; after a pause the cycle resumes on its
    // ordinary interval. Never under reduced motion: it is motion the user
    // did not ask for, which is exactly what the setting declines.
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
      if (reduced || cards.length === 0 || !wide.matches) return;
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

    // A finger or pen that lifts is no longer pointing at anything, and a
    // pointercancel means the browser took the gesture for a scroll - either
    // way the room is released at once. A mouse button going up changes
    // nothing: the mouse is still where it is.
    function onUp(event: PointerEvent) {
      if (event.pointerType !== "mouse") tracking = false;
    }

    // Tilt. Calibrated to the first reading - the attitude the phone is held
    // at when the hero arrives is centre - then re-centred slowly toward
    // wherever the hand settles. gamma is the lean about the long axis
    // (left/right in portrait), beta the lean toward and away; in landscape
    // the two swap roles, so the screen's angle decides which is which.
    let baseBeta: number | undefined;
    let baseGamma: number | undefined;
    let lastReading = 0;

    function onTilt(event: DeviceOrientationEvent) {
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      const now = performance.now();
      if (baseBeta === undefined || baseGamma === undefined) {
        baseBeta = beta;
        baseGamma = gamma;
      } else {
        const ease = 1 - Math.exp(-(now - lastReading) / TILT_RECENTRE);
        baseBeta += (beta - baseBeta) * ease;
        baseGamma += (gamma - baseGamma) * ease;
      }
      lastReading = now;
      lastTilt = now;

      const landscape = (screen.orientation?.angle ?? 0) % 180 !== 0;
      const leanX = landscape ? beta - baseBeta : gamma - baseGamma;
      const leanY = landscape ? -(gamma - baseGamma) : beta - baseBeta;
      tiltX = lean(leanX) * TILT_AMP.x;
      tiltY = lean(leanY) * TILT_AMP.y;
    }

    /** Degrees of lean past the dead zone, clamped, as -1..1. */
    function lean(degrees: number) {
      const past = Math.max(0, Math.abs(degrees) - TILT_DEAD);
      return Math.sign(degrees) * Math.min(1, past / (TILT_RANGE - TILT_DEAD));
    }

    let tiltWired = false;

    function wireTilt() {
      if (tiltWired) return;
      tiltWired = true;
      window.addEventListener("deviceorientation", onTilt);
    }

    // iOS: the sensor is behind a permission that can only be requested from
    // a gesture, so the first pointerdown on the hero asks. Anything other
    // than "granted" - denied, dismissed, a browser that throws - leaves the
    // finger-follow as the phone's whole 3D effect.
    function onFirstDown() {
      section!.removeEventListener("pointerdown", onFirstDown);
      const Orientation = window.DeviceOrientationEvent as
        | OrientationEventConstructor
        | undefined;
      if (typeof Orientation?.requestPermission !== "function") return;
      try {
        Orientation.requestPermission()
          .then((state) => {
            if (state === "granted") wireTilt();
          })
          .catch(() => {});
      } catch {
        // Some builds throw synchronously outside a gesture; nothing to do.
      }
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

    // Crossing md: the cycle stops (and clears any turn in progress) and
    // resume() starts it again only if the new width allows it.
    function onWide() {
      stopEcho();
      resume();
    }

    const observer = new IntersectionObserver(onIntersect, { threshold: 0 });
    observer.observe(section);
    document.addEventListener("visibilitychange", onVisibility);
    wide.addEventListener("change", onWide);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    document.addEventListener("pointerleave", onGone);
    window.addEventListener("blur", onGone);

    if (!hovers && !reduced && "DeviceOrientationEvent" in window) {
      const Orientation = window.DeviceOrientationEvent as
        | OrientationEventConstructor
        | undefined;
      if (typeof Orientation?.requestPermission === "function") {
        section.addEventListener("pointerdown", onFirstDown);
      } else {
        // Android and everyone else without a permission gate: listen now.
        // A device without a sensor simply never fires, and the drift keeps
        // the room.
        wireTilt();
      }
    }

    // Start straight away: the drift needs no input, and the observer will
    // park it if the hero turns out to be off screen.
    resume();

    return () => {
      pause();
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      wide.removeEventListener("change", onWide);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerleave", onGone);
      window.removeEventListener("blur", onGone);
      section.removeEventListener("pointerdown", onFirstDown);
      if (tiltWired) window.removeEventListener("deviceorientation", onTilt);
      stage.style.removeProperty("--eye-x");
      stage.style.removeProperty("--eye-y");
      stage.style.removeProperty("--eye-speed");
      float?.style.removeProperty("--float-x");
      float?.style.removeProperty("--float-y");
      float?.style.removeProperty("--eye-speed");
    };
  }, []);

  return <span ref={ref} hidden />;
}
