"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PlayIcon } from "@/icons/generated";
import { useReducedMotion } from "@/lib/use-reduced-motion.client";
import { ArcScrubber } from "./arc-scrubber.client";
import styles from "./timeline-player.module.css";

// The timeline player: the take in a plate with its one instrument overlaid
// in the plate's bottom-right corner on a translucent surface - the arc
// scrubber, with "Camera path" under it and the view counter under that.
// Built for the capture viewer and reused by the product cards, so all four
// plates read as the same instrument. The arc is the round-2 dial (client
// feedback round 2, item 5b) with a new meaning: its handle is the camera.
// The client read the arc as a curved timeline and asked for the camera's
// trajectory around the scene (round 3, item 5a). The handle follows the
// presented video time linearly, so it remains visibly synchronized and a
// replacement clip needs no separately generated camera data.
//
// Two builds, one flag. `compact` is the card build: no frame of its own
// (the card draws the border) and a smaller surface - a tighter arc radius.
// The surface is a set width with the dial centred in it and the counter in
// tabular figures, so the box never changes size as the view number ticks.
//
// One video-frame loop owns all the motion: it writes the handle's place as a single
// custom property (--player-progress) on the dial, keeps the range input in
// step with the time, and on each decisecond boundary writes the view
// counter and the range's spoken value and calls onTick - the capture HUD
// re-renders on that beat and nothing else does. The loop runs while the
// take plays and takes one frame to settle after a pause or a seek, the
// same wake discipline as the hero's eye. The range is left alone while it
// has focus or while the dial is being dragged, so the loop never fights
// the hand on the control.
//
// Browsers with requestVideoFrameCallback drive it from mediaTime, the frame
// actually presented by the decoder. The rAF fallback covers older browsers.
// Pointer moves are coalesced to one seek per display frame so a fast drag
// cannot queue hundreds of expensive video seeks.
//
// The counter reads `View n / N` - a view per synthesised frame, as in the
// client's reference - in the take's own frame rate (`fps`, from
// media.config.ts; the viewer's clip is 90fps, the rest 30).
//
// Playback is an arrival, not a page load: the take plays while the plate
// is properly in view and pauses when it scrolls out (it used to play on
// through), and with preload="none" the bytes wait for that moment too,
// which is what lets three takes sit in one row of cards without loading
// megabytes up front. prefers-reduced-motion turns the arrival off. Either
// way the plate itself is a button - a tap toggles play and pause - and
// once the plate has been asked to play and stands still (autoplay refused
// by a browser or Low Power Mode, reduced motion, or a deliberate pause) a
// small play glyph sits in the surface's corner, so the take is never a
// frozen poster with no way to start it (round 2 had removed the control).

type TimelinePlayerProps = {
  src: string;
  poster?: string;
  /** Used for seeking and the counter before the metadata arrives. */
  fallbackDuration: number;
  /** The plate's aspect ratio, e.g. "640 / 368". */
  aspect: string;
  /** Names the take in the control labels: "Play {name}". */
  name: string;
  /** The take's frame rate; the view counter counts in it. */
  fps?: number;
  /** The card build: no own frame, compact controls. */
  compact?: boolean;
  preload?: "none" | "metadata";
  /** Fires on decisecond boundaries while the take moves. */
  onTick?: (t: number, duration: number) => void;
  /** Overlays inside the frame, over the take, under the controls. */
  children?: ReactNode;
};

function views(seconds: number, fps: number) {
  return Math.round(seconds * fps);
}

export function TimelinePlayer({
  src,
  poster,
  fallbackDuration,
  aspect,
  name,
  fps = 30,
  compact = false,
  preload = "metadata",
  onTick,
  children,
}: TimelinePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const scrubbingRef = useRef(false);
  const onTickRef = useRef(onTick);
  const placeFrameRef = useRef<number | undefined>(undefined);
  const pendingPlaceRef = useRef<number | undefined>(undefined);
  const lastPlaceRef = useRef(0);
  const reducedMotion = useReducedMotion();

  // Two facts, not per-frame state: whether the take stands still, from the
  // media events, and whether it has been asked to play at all - by its
  // arrival in view or by a tap. Together they say when the play glyph is
  // wanted: a plate not yet reached is a poster, not a refusal.
  const [paused, setPaused] = useState(true);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const video = videoRef.current;
    const dial = dialRef.current;
    const range = rangeRef.current;
    const counter = counterRef.current;
    if (!video || !dial || !range || !counter) return;
    if (reducedMotion) video.pause();

    let frame: number | undefined;
    let videoFrame: number | undefined;
    let lastTick = -1;
    let settle: number | undefined;

    function paint(t: number) {
      frame = undefined;
      videoFrame = undefined;
      if (!video || !dial || !range || !counter) return;

      const duration = video.duration || fallbackDuration;

      dial.style.setProperty(
        "--player-progress",
        Math.min(1, t / duration).toFixed(4),
      );
      if (document.activeElement !== range && !scrubbingRef.current) {
        range.value = String(Math.round(Math.min(1, t / duration) * 1000));
      }

      const tick = Math.floor(t * 10);
      if (tick !== lastTick) {
        lastTick = tick;
        const view = Math.floor(t * fps);
        const total = views(duration, fps);
        counter.textContent = `${view} / ${total}`;
        range.setAttribute("aria-valuetext", `View ${view} of ${total}`);
        onTickRef.current?.(t, duration);
      }

      if (!video.paused) wake();
    }

    function sync() {
      paint(video!.currentTime);
    }

    function wake() {
      if (
        !video!.paused &&
        typeof video!.requestVideoFrameCallback === "function"
      ) {
        videoFrame ??= video!.requestVideoFrameCallback((_now, metadata) =>
          paint(metadata.mediaTime),
        );
      } else {
        frame ??= requestAnimationFrame(sync);
      }
    }

    function onPlay() {
      setPaused(false);
      wake();
    }

    function onPause() {
      setPaused(true);
      if (videoFrame !== undefined) video!.cancelVideoFrameCallback(videoFrame);
      videoFrame = undefined;
      wake();
    }

    // Asking is not playing: play() may be refused - then it rejects, and
    // some browsers say nothing at all - so a second after the ask the
    // element's own word settles the state, whatever events did or did not
    // fire.
    function ask() {
      setAsked(true);
      video?.play().catch(() => {});
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        if (video) setPaused(video.paused);
      }, 1000);
    }

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", wake);

    // The arrival, every time: play when the plate is properly in view,
    // pause when it leaves - a take nobody can see needs no decoding, and a
    // refused play gets its next chance on the next arrival. Under reduced
    // motion the observer only records that the plate has been reached, so
    // the play glyph shows and the take waits for a hand.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!video) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          if (reducedMotion) setAsked(true);
          else ask();
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    wake();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (videoFrame !== undefined) video.cancelVideoFrameCallback(videoFrame);
      if (placeFrameRef.current !== undefined)
        cancelAnimationFrame(placeFrameRef.current);
      window.clearTimeout(settle);
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", wake);
    };
  }, [fallbackDuration, fps, reducedMotion]);

  // Puts the take at a time and moves the dial and the range at once rather
  // than a frame later, so the handle stays under the hand and the range
  // reads true to assistive tech mid-drag; the loop confirms both on
  // `seeked`.
  function seekTo(t: number, duration: number) {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = t;
    dialRef.current?.style.setProperty(
      "--player-progress",
      Math.min(1, t / duration).toFixed(4),
    );
    if (rangeRef.current) {
      rangeRef.current.value = String(Math.round((t / duration) * 1000));
    }
  }

  // The range's keys: a fraction of the take's length.
  function seek(played: number) {
    const duration = videoRef.current?.duration || fallbackDuration;
    seekTo(played * duration, duration);
  }

  function placeNow(along: number) {
    const duration = videoRef.current?.duration || fallbackDuration;
    seekTo(along * duration, duration);
  }

  // At most one seek per display frame, while the handle itself stays under
  // the pointer immediately. This prevents high-rate pointer devices from
  // overwhelming the video decoder with stale seek requests.
  function place(along: number) {
    lastPlaceRef.current = along;
    pendingPlaceRef.current = along;
    dialRef.current?.style.setProperty("--player-progress", along.toFixed(4));
    placeFrameRef.current ??= requestAnimationFrame(() => {
      placeFrameRef.current = undefined;
      const pending = pendingPlaceRef.current;
      pendingPlaceRef.current = undefined;
      if (pending !== undefined) placeNow(pending);
    });
  }

  function scrub(scrubbing: boolean) {
    scrubbingRef.current = scrubbing;
    if (!scrubbing) {
      if (placeFrameRef.current !== undefined)
        cancelAnimationFrame(placeFrameRef.current);
      placeFrameRef.current = undefined;
      pendingPlaceRef.current = undefined;
      placeNow(lastPlaceRef.current);
    }
  }

  // The plate's tap. A play here is a deliberate ask, so it counts as one
  // even under reduced motion; the pause event and the loop do the rest.
  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    setAsked(true);
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  const total = views(fallbackDuration, fps);

  return (
    <div
      className={compact ? styles.embedded : styles.framed}
      data-needs-play={asked && paused ? "" : undefined}
    >
      <div className={styles.frame}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload={preload}
          className={styles.video}
          style={{ "--player-aspect": aspect }}
        />
        {children}

        {/* The whole plate toggles playback. It sits over the take and the
            overlays (which take no pointer) and under the surface, so the
            dial keeps its own pointer and nothing interactive nests. */}
        <button
          type="button"
          className={styles.toggle}
          onClick={toggle}
          aria-label={`${paused ? "Play" : "Pause"} ${name}`}
        />

        <div className={styles.surface}>
          <ArcScrubber
            dialRef={dialRef}
            rangeRef={rangeRef}
            name={name}
            valueText={`View 0 of ${total}`}
            onPlace={place}
            onSeek={seek}
            onScrub={scrub}
          />

          <p className={`${styles.caption} type-caption text-muted`}>
            Camera path
          </p>

          <p className={`${styles.counter} type-caption text-ink`}>
            <span className="text-muted">View </span>
            <span ref={counterRef}>0 / {total}</span>
          </p>

          <PlayIcon aria-hidden className={styles.play} />
        </div>
      </div>
    </div>
  );
}
