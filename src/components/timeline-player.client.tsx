"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { PlayIcon } from "@/icons/generated";
import { ArcScrubber } from "./arc-scrubber.client";
import styles from "./timeline-player.module.css";

// The timeline player: the take in a plate with its one instrument overlaid
// in the plate's bottom-right corner on a translucent surface - the arc
// scrubber, with "Camera path" under it and the view counter under that.
// Built for the capture viewer and reused by the product cards, so all four
// plates read as the same instrument. The arc is the round-2 dial (client
// feedback round 2, item 5b) with a new meaning: its handle is the camera.
// The client read the arc as a curved timeline and asked for the camera's
// trajectory around the scene (round 3, item 5a); the owner's steer was to
// keep the arc as it was and drive the handle by where the camera actually
// is in the footage, so the handle now stands at the camera's bearing at
// the current moment - measured off each clip and shipped next to it as a
// `.camera.json` (media.config.ts, `camera`) - and the accent sweep from
// the arc's start to the handle reads as how far around the scene the
// camera has come. A fixed camera holds the arc's centre while the counter
// ticks; a take without a track falls back to the handle following
// playback linearly, as it did in round 2.
//
// Two builds, one flag. `compact` is the card build: no frame of its own
// (the card draws the border) and a smaller surface - a tighter arc radius.
// The surface is a set width with the dial centred in it and the counter in
// tabular figures, so the box never changes size as the view number ticks.
//
// One rAF loop owns all the motion: it writes the handle's place as a single
// custom property (--player-progress) on the dial, keeps the range input in
// step with the time, and on each decisecond boundary writes the view
// counter and the range's spoken value and calls onTick - the capture HUD
// re-renders on that beat and nothing else does. The loop runs while the
// take plays and takes one frame to settle after a pause or a seek, the
// same wake discipline as the hero's eye. The range is left alone while it
// has focus or while the dial is being dragged, so the loop never fights
// the hand on the control.
//
// The camera track is fetched once the player mounts and kept in a ref -
// the loop reads it each frame without a render - and until it arrives, or
// if it never does, the loop uses the linear fallback. Scrubbing reads it
// the other way: the pointer's place on the arc is a bearing, and the take
// seeks to the moment the camera was nearest that bearing (see `timeNear`).
// The hidden range steps through time as before; its spoken value is the
// view number, which is what a keyboard user is moving through.
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
  /** The public path of the take's camera track (`.camera.json`). */
  camera?: string;
  /** The card build: no own frame, compact controls. */
  compact?: boolean;
  preload?: "none" | "metadata";
  /** Fires on decisecond boundaries while the take moves. */
  onTick?: (t: number, duration: number) => void;
  /** Overlays inside the frame, over the take, under the controls. */
  children?: ReactNode;
};

/**
 * What the player keeps of a `.camera.json`: the camera's horizontal
 * bearing in degrees relative to the take's mean, one sample every 1/fps
 * seconds from t = 0, positive to the right of the mean. The file's other
 * fields (the clip's name, its kind and span, the lens) describe the
 * measurement and are not needed to draw it.
 */
type CameraTrack = { fps: number; bearing: number[] };

/** How far a sample's bearing may sit from the pointer's and still be the
 *  moment it means, in degrees; under this, a drag follows the camera's
 *  current pass rather than jumping to a closer match on another. */
const NEAR_DEG = 2;

function isCameraTrack(data: unknown): data is CameraTrack {
  if (typeof data !== "object" || data === null) return false;
  const { fps, bearing } = data as Record<string, unknown>;
  return (
    typeof fps === "number" &&
    fps > 0 &&
    Array.isArray(bearing) &&
    bearing.length > 0 &&
    bearing.every((b) => typeof b === "number")
  );
}

/** The camera's bearing at t: linear between the samples, held at the ends. */
function bearingAt(track: CameraTrack, t: number) {
  const { fps, bearing } = track;
  const last = bearing.length - 1;
  const at = Math.min(Math.max(t * fps, 0), last);
  const lo = Math.floor(at);
  const hi = Math.min(lo + 1, last);
  return bearing[lo] + (bearing[hi] - bearing[lo]) * (at - lo);
}

/** Where a bearing puts the handle: the mean at the arc's centre, ±90° at
 *  its ends, and anything further clamped to them. */
function alongOf(bearing: number) {
  return Math.min(1, Math.max(0, 0.5 + bearing / 180));
}

/** The bearing a place on the arc stands for - `alongOf` the other way. */
function bearingOf(along: number) {
  return (along - 0.5) * 180;
}

/** The handle's place at t: the camera's bearing when there is a track,
 *  the fraction of the take played when there is not. */
function handleAt(track: CameraTrack | undefined, t: number, duration: number) {
  return track ? alongOf(bearingAt(track, t)) : Math.min(1, t / duration);
}

/**
 * The moment the camera was nearest a bearing. A camera can swing back over
 * the same bearings, so the nearest sample overall would make a drag jump
 * between passes; the search walks outward from the current moment and
 * takes the first sample within NEAR_DEG, so the handle follows the pass it
 * is on, and only when no sample comes that close does it settle for the
 * nearest one met on the walk - the closest to now among equals, which for
 * a fixed camera is now itself, so dragging its handle moves nothing.
 */
function timeNear(track: CameraTrack, target: number, from: number) {
  const { fps, bearing } = track;
  const last = bearing.length - 1;
  const start = Math.min(Math.max(Math.round(from * fps), 0), last);
  let best = start;
  for (let step = 0; step <= Math.max(start, last - start); step++) {
    const ahead = start + step;
    const behind = start - step;
    for (const i of ahead === behind ? [ahead] : [ahead, behind]) {
      if (i < 0 || i > last) continue;
      const off = Math.abs(bearing[i] - target);
      if (off <= NEAR_DEG) return i / fps;
      if (off < Math.abs(bearing[best] - target)) best = i;
    }
  }
  return best / fps;
}

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
  camera,
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
  const trackRef = useRef<CameraTrack | undefined>(undefined);
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

      dial.style.setProperty(
        "--player-progress",
        handleAt(trackRef.current, t, duration).toFixed(4),
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

    // The camera track, once: the JSON is static next to the clip, so the
    // browser's cache may answer, and a plate unmounted before the answer
    // drops the request. A missing or malformed file leaves the ref empty
    // and the handle on the linear fallback; an answer wakes the loop so a
    // standing plate's handle moves to the camera's bearing at once.
    trackRef.current = undefined;
    const fetching = new AbortController();
    if (camera) {
      fetch(camera, { cache: "force-cache", signal: fetching.signal })
        .then((response) => (response.ok ? response.json() : undefined))
        .then((data: unknown) => {
          if (isCameraTrack(data)) {
            trackRef.current = data;
            wake();
          }
        })
        .catch(() => {});
    }

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
      fetching.abort();
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", wake);
    };
  }, [camera, fallbackDuration, fps]);

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
      handleAt(trackRef.current, t, duration).toFixed(4),
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

  // The arc's pointer: a place on the arc, which is a camera bearing when
  // the take has a track - the take goes to the moment the camera was
  // there - and a fraction of the take's length when it has not.
  function place(along: number) {
    const duration = videoRef.current?.duration || fallbackDuration;
    const track = trackRef.current;
    if (!track) return seekTo(along * duration, duration);
    const now = videoRef.current?.currentTime ?? 0;
    seekTo(timeNear(track, bearingOf(along), now), duration);
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
