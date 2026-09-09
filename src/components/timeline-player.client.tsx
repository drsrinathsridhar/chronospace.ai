"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./timeline-player.module.css";

// The timeline player: the take in a blended plate with the transport bar
// under it - a drawn play/pause glyph and the tick track with the invisible
// native range input stretched over it. Built for the capture viewer and
// reused by the product cards, so the two read as the same instrument.
//
// Two builds, one flag. `compact` is the card build: no frame of its own
// (the card draws the border), a top-rule-only transport at a smaller
// scale, and fewer ticks on the track.
//
// One rAF loop owns all the motion: it writes the playhead as a single
// custom property (--player-progress), keeps the range input in step, and
// calls onTick only when a decisecond boundary passes - the capture HUD
// re-renders on that beat and nothing else does. The loop runs while the
// take plays and takes one frame to settle after a pause or a seek, the
// same wake discipline as the hero's eye.
//
// Autoplay is an arrival, not a page load: the take starts the first time
// the plate scrolls into view, gated on prefers-reduced-motion - and with
// preload="none" the bytes wait for that moment too, which is what lets
// three takes sit in one row of cards without loading megabytes up front.
// The pause button and the scrubber work either way.

type TimelinePlayerProps = {
  src: string;
  poster?: string;
  /** Used for seeking before the metadata arrives. */
  fallbackDuration: number;
  /** The plate's aspect ratio, e.g. "640 / 368". */
  aspect: string;
  /** Names the take in the control labels: "Play {name}". */
  name: string;
  /** The card build: no own frame, compact transport. */
  compact?: boolean;
  preload?: "none" | "metadata";
  /** Fires on decisecond boundaries while the take moves. */
  onTick?: (t: number, duration: number) => void;
  /** Overlays inside the frame, over the blended take. */
  children?: ReactNode;
};

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
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  // Paused until the take actually plays - the play event flips it, so the
  // button is honest with or without autoplay, script, or reduced motion.
  const [paused, setPaused] = useState(true);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    const video = videoRef.current;
    const track = trackRef.current;
    const range = rangeRef.current;
    if (!video || !track || !range) return;

    let frame: number | undefined;
    let lastTick = -1;

    function sync() {
      frame = undefined;
      if (!video || !track || !range) return;

      const duration = video.duration || fallbackDuration;
      const t = video.currentTime;
      const progress = Math.min(1, t / duration);

      track.style.setProperty("--player-progress", progress.toFixed(4));
      if (document.activeElement !== range) {
        range.value = String(Math.round(progress * 1000));
      }

      const tick = Math.floor(t * 10);
      if (tick !== lastTick) {
        lastTick = tick;
        onTickRef.current?.(t, duration);
      }

      if (!video.paused) wake();
    }

    function wake() {
      frame ??= requestAnimationFrame(sync);
    }

    function onPlay() {
      setPaused(false);
      wake();
    }

    function onPause() {
      setPaused(true);
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

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }

  function seek(value: string) {
    const video = videoRef.current;
    if (!video) return;
    const duration = video.duration || fallbackDuration;
    video.currentTime = (Number(value) / 1000) * duration;
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
      </div>

      <div className={styles.transport}>
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? `Play ${name}` : `Pause ${name}`}
          className={styles.button}
        >
          <span aria-hidden className={paused ? styles.play : styles.pause} />
        </button>

        <div ref={trackRef} className={styles.track}>
          <span aria-hidden className={styles.rule} />
          <span aria-hidden className={styles.ticks}>
            {Array.from({ length: compact ? 11 : 21 }, (_, index) => (
              <span key={index} />
            ))}
          </span>
          <span aria-hidden className={styles.playhead} />
          <input
            ref={rangeRef}
            type="range"
            min={0}
            max={1000}
            defaultValue={0}
            onInput={(event) => seek(event.currentTarget.value)}
            aria-label={`Scrub ${name}`}
            className={styles.range}
          />
        </div>
      </div>
    </div>
  );
}
