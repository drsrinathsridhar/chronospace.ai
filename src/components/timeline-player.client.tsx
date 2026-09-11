"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { ArcScrubber } from "./arc-scrubber.client";
import styles from "./timeline-player.module.css";

// The timeline player: the take in a plate with its one control overlaid
// in the plate's bottom-right corner on a translucent surface - the arc
// scrubber, centred, with the frame counter centred under it. The
// play/pause glyph and the "Timecode" caption that used to share the
// surface are gone (owner's request, 11 Sep 2026): the dial is the whole
// instrument. Built for the capture viewer
// and reused by the product cards and the intro, so all five plates read
// as the same instrument. The arc replaced the linear tick track under the
// plate (client feedback round 2, item 5b); see arc-scrubber.client.tsx.
//
// Two builds, one flag. `compact` is the card build: no frame of its own
// (the card draws the border) and a smaller surface - a tighter arc radius.
// The surface is as wide as its dial and no wider, and the counter is
// centred inside it in tabular figures, so the box never changes size as
// the frame number ticks over (it used to grow with the digits).
//
// One rAF loop owns all the motion: it writes the playhead as a single
// custom property (--player-progress) on the dial, keeps the range input
// in step, and on each decisecond boundary writes the frame counter and
// calls onTick - the capture HUD re-renders on that beat and nothing else
// does. The loop runs while the take plays and takes one frame to settle
// after a pause or a seek, the same wake discipline as the hero's eye. The
// range is left alone while it has focus or while the arc is being dragged,
// so the loop never fights the hand on the control.
//
// The frame counter reads `frame n / N` at 30 fps, the rate every take is
// encoded at - the count is derived from time, so a take at another rate
// would count wrong, which is why the rate is one constant here.
//
// Autoplay is an arrival, not a page load: the take starts the first time
// the plate scrolls into view, gated on prefers-reduced-motion - and with
// preload="none" the bytes wait for that moment too, which is what lets
// three takes sit in one row of cards without loading megabytes up front.
// The scrubber works either way; without a pause control the take simply
// runs (muted, looping) once it has arrived.

/** The frame rate every take is encoded at; the counter counts in it. */
const FRAME_RATE = 30;

type TimelinePlayerProps = {
  src: string;
  poster?: string;
  /** Used for seeking and the counter before the metadata arrives. */
  fallbackDuration: number;
  /** The plate's aspect ratio, e.g. "640 / 368". */
  aspect: string;
  /** Names the take in the control labels: "Play {name}". */
  name: string;
  /** The card build: no own frame, compact controls. */
  compact?: boolean;
  preload?: "none" | "metadata";
  /** Fires on decisecond boundaries while the take moves. */
  onTick?: (t: number, duration: number) => void;
  /** Overlays inside the frame, over the take, under the controls. */
  children?: ReactNode;
};

function frames(seconds: number) {
  return Math.round(seconds * FRAME_RATE);
}

export function TimelinePlayer({
  src,
  poster,
  fallbackDuration,
  aspect,
  name,
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

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const video = videoRef.current;
    const dial = dialRef.current;
    const range = rangeRef.current;
    const counter = counterRef.current;
    if (!video || !dial || !range || !counter) return;

    let frame: number | undefined;
    let lastTick = -1;

    function sync() {
      frame = undefined;
      if (!video || !dial || !range || !counter) return;

      const duration = video.duration || fallbackDuration;
      const t = video.currentTime;
      const progress = Math.min(1, t / duration);

      dial.style.setProperty("--player-progress", progress.toFixed(4));
      if (document.activeElement !== range && !scrubbingRef.current) {
        range.value = String(Math.round(progress * 1000));
      }

      const tick = Math.floor(t * 10);
      if (tick !== lastTick) {
        lastTick = tick;
        counter.textContent = `${Math.floor(t * FRAME_RATE)} / ${frames(duration)}`;
        onTickRef.current?.(t, duration);
      }

      if (!video.paused) wake();
    }

    function wake() {
      frame ??= requestAnimationFrame(sync);
    }

    function onPlay() {
      wake();
    }

    function onPause() {
      wake();
    }

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeked", wake);

    // The arrival: play once the plate is properly in view, and stay
    // started - leaving the viewport pauses nothing, exactly like the
    // reference viewer once it has begun.
    let observer: IntersectionObserver | undefined;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            video.play().catch(() => {});
            observer?.disconnect();
            observer = undefined;
          }
        },
        { threshold: 0.35 },
      );
      observer.observe(video);
    }
    wake();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer?.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", wake);
    };
  }, [fallbackDuration]);

  // Seeks to a progress in 0..1 - from the arc's pointer or the range's
  // keys alike - and moves the dial and the range at once rather than a
  // frame later, so the handle stays under the hand and the range reads
  // true to assistive tech mid-drag; the loop confirms both on `seeked`.
  function seek(progress: number) {
    const video = videoRef.current;
    if (!video) return;
    const duration = video.duration || fallbackDuration;
    video.currentTime = progress * duration;
    dialRef.current?.style.setProperty(
      "--player-progress",
      progress.toFixed(4),
    );
    if (rangeRef.current) {
      rangeRef.current.value = String(Math.round(progress * 1000));
    }
  }

  function scrub(scrubbing: boolean) {
    scrubbingRef.current = scrubbing;
  }

  return (
    <div className={compact ? styles.embedded : styles.framed}>
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

        <div className={styles.surface}>
          <ArcScrubber
            dialRef={dialRef}
            rangeRef={rangeRef}
            name={name}
            onSeek={seek}
            onScrub={scrub}
          />

          <p className={`${styles.counter} type-caption text-ink`}>
            <span className="text-muted">Frame </span>
            <span ref={counterRef}>0 / {frames(fallbackDuration)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
