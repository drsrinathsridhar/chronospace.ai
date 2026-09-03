"use client";

import { useEffect, useRef, useState } from "react";
import echoPoster from "./echo-poster.jpg";
import styles from "./capture.module.css";

// The player, and the point of it: the HUD is not a caption, it is a live
// readout. Every reading is a deterministic function of the take's clock,
// anchored on the comp's resting values, so the numbers move while the take
// plays and land wherever the scrubber is dropped - measurable at any t,
// which is the sentence above the player.
//
// One rAF loop owns all the motion: it writes the playhead as a single
// custom property, keeps the (invisible, native, keyboard-accessible) range
// input in step, and re-renders the HUD only when a decisecond boundary
// passes. The loop runs while the take plays and takes one frame to settle
// after a pause or a seek, the same wake discipline as the hero's eye.
//
// Autoplay is a motion preference, decided here against
// prefers-reduced-motion; the pause button and the scrubber work either way.

const FALLBACK_DURATION = 4.94;

// The comp's resting readout - also the server-rendered state.
const resting: [string, string][] = [
  ["Frames kept", "6"],
  ["Path", "1.04 m"],
  ["Tracked joints", "17"],
  ["Depth", "0.50 m"],
  ["View", "AZ 64°"],
  ["Height", "1.77 m"],
  ["Timebase", "Any t"],
];

// The readings at time t. Each one drifts around its comp anchor on its own
// slow phase; the path is the one true integral - distance covered so far,
// landing on the comp's 1.04 m as the take ends. Timebase stays "any t":
// that one is the claim, not a measurement.
function measure(t: number, duration: number): [string, string][] {
  return [
    ["Frames kept", String(Math.min(6, 1 + Math.floor((t / duration) * 6)))],
    ["Path", `${((t / duration) * 1.04).toFixed(2)} m`],
    ["Tracked joints", String(17 + Math.round(0.6 * Math.sin(t * 5.3)))],
    ["Depth", `${(0.5 + 0.11 * Math.sin(t * 1.9)).toFixed(2)} m`],
    ["View", `AZ ${Math.round(64 + 16 * Math.sin(t * 0.8))}°`],
    ["Height", `${(1.77 + 0.02 * Math.sin(t * 2.6)).toFixed(2)} m`],
    ["Timebase", "Any t"],
  ];
}

export function CapturePlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  // Paused until the take actually plays - the play event flips it, so the
  // button is honest with or without autoplay, script, or reduced motion.
  const [paused, setPaused] = useState(true);
  const [readout, setReadout] = useState(resting);

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

      const duration = video.duration || FALLBACK_DURATION;
      const t = video.currentTime;
      const progress = Math.min(1, t / duration);

      track.style.setProperty("--capture-progress", progress.toFixed(4));
      if (document.activeElement !== range) {
        range.value = String(Math.round(progress * 1000));
      }

      const tick = Math.floor(t * 10);
      if (tick !== lastTick) {
        lastTick = tick;
        setReadout(measure(t, duration));
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

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.play().catch(() => {});
    }
    wake();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("seeked", wake);
    };
  }, []);

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
    const duration = video.duration || FALLBACK_DURATION;
    video.currentTime = (Number(value) / 1000) * duration;
  }

  return (
    <div>
      <div className={styles.frame}>
        <video
          ref={videoRef}
          src="/videos/echo.mp4"
          poster={echoPoster.src}
          muted
          loop
          playsInline
          preload="metadata"
          className={styles.video}
        />

        <dl className="type-caption absolute right-2.5 bottom-2.5 flex w-42.75 max-w-full flex-col gap-1">
          {readout.map(([term, value]) => (
            <div key={term} className="flex items-center justify-between gap-4">
              <dt className="text-muted">{term}</dt>
              <dd className="text-ink text-right">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-line bg-ink/5 -mt-px flex items-center gap-5 border py-3 pr-5 pl-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={paused ? "Play the capture" : "Pause the capture"}
          className="border-line text-ink hover:bg-ink/10 flex size-10 shrink-0 items-center justify-center border transition-colors"
        >
          <span aria-hidden className={paused ? styles.play : styles.pause} />
        </button>

        <div ref={trackRef} className={styles.track}>
          <span aria-hidden className="bg-line block h-px w-full" />
          <span aria-hidden className="flex h-1.5 w-full justify-between">
            {Array.from({ length: 21 }, (_, index) => (
              <span key={index} className="bg-line h-1.5 w-px" />
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
            aria-label="Scrub the capture"
            className={styles.range}
          />
        </div>
      </div>
    </div>
  );
}
