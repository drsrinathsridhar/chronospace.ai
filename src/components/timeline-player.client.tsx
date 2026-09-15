"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PlayIcon } from "@/icons/generated";
import type { CameraPath } from "@/media.config";
import { CameraPathDial } from "./camera-path-dial.client";
import styles from "./timeline-player.module.css";

// The timeline player: the take in a plate with its one instrument overlaid
// in the plate's bottom-right corner on a translucent surface - the camera
// path dial, with "Camera path" under it and the view counter under that.
// Built for the capture viewer and reused by the product cards, so all four
// plates read as the same instrument. The dial replaced the round-2 arc
// (client feedback round 3, item 5a: the arc read as a curved timeline, the
// client wanted the camera's trajectory); see camera-path-dial.client.tsx.
//
// Two builds, one flag. `compact` is the card build: no frame of its own
// (the card draws the border) and a smaller surface - a tighter plan. The
// surface is a set width with the dial centred in it and the counter in
// tabular figures, so the box never changes size as the view number ticks.
//
// One rAF loop owns all the motion: it writes the playhead as a single
// custom property (--player-progress) on the dial, keeps the range input
// in step, and on each decisecond boundary writes the view counter and the
// range's spoken value and calls onTick - the capture HUD re-renders on
// that beat and nothing else does. The loop runs while the take plays and
// takes one frame to settle after a pause or a seek, the same wake
// discipline as the hero's eye. The range is left alone while it has focus
// or while the dial is being dragged, so the loop never fights the hand on
// the control.
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
  /** The camera's path over the take, drawn by the dial. */
  camera?: CameraPath;
  /** The card build: no own frame, compact controls. */
  compact?: boolean;
  preload?: "none" | "metadata";
  /** Fires on decisecond boundaries while the take moves. */
  onTick?: (t: number, duration: number) => void;
  /** Overlays inside the frame, over the take, under the controls. */
  children?: ReactNode;
};

/** The dial's default: a camera standing in front of the subject. */
const FRONT: CameraPath = { kind: "fixed", at: 0 };

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
  camera = FRONT,
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

    let frame: number | undefined;
    let lastTick = -1;
    let settle: number | undefined;

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
        const view = Math.floor(t * fps);
        const total = views(duration, fps);
        counter.textContent = `${view} / ${total}`;
        range.setAttribute("aria-valuetext", `View ${view} of ${total}`);
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
    const stillness = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!video) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          if (stillness.matches) setAsked(true);
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
      window.clearTimeout(settle);
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", wake);
    };
  }, [fallbackDuration, fps]);

  // Seeks to a progress in 0..1 - from the dial's pointer or the range's
  // keys alike - and moves the dial and the range at once rather than a
  // frame later, so the camera stays under the hand and the range reads
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
          <CameraPathDial
            dialRef={dialRef}
            rangeRef={rangeRef}
            name={name}
            camera={camera}
            valueText={`View 0 of ${total}`}
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
