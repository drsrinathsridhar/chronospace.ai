"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion.client";
import type { ReactNode } from "react";
import { MeasureBracketIcon } from "@/icons/generated";
import styles from "./measure-overlay.module.css";

// The measurement overlay: readings drawn on the picture itself, riding the
// take's clock. A bracket stands on the subject with its height along one
// edge, tags pin a distance or a speed to a point that moves with the body,
// a floor line waits in the room's hairline colour and turns accent the
// moment a foot crosses it, and - where asked - a tokenisation sweep passes
// over the frame once each time the loop restarts.
//
// It is a self-contained island rendered as a child of the timeline player,
// inside the frame, over the blended video. On mount it finds that sibling
// <video>, and from then on one rAF loop runs while the take plays (settling
// one frame after a pause or a seek, the same wake discipline as the player
// itself), evaluating every mark at video.currentTime and writing the result
// straight onto the mark nodes as custom properties and textContent. No
// React state after mount: nothing re-renders per frame.
//
// Geometry is in percentages of the frame, so one annotation holds at every
// size the plate is shown at. Keyframes interpolate linearly; outside the
// first and last keyframe a mark is hidden, unless it has a single keyframe,
// in which case it holds. Reduced motion leaves the server-rendered resting
// marks in place and does not attach the animation loop.

export type Keyframe = {
  /** Seconds into the take. */
  t: number;
  /** Left edge (bracket) or anchor point (tag), % of the frame width. */
  x: number;
  /** Top edge (bracket) or anchor point (tag), % of the frame height. */
  y: number;
  w?: number;
  h?: number;
};

/**
 * A label is fixed text or a function of the clock. Functions only work
 * from client components - a server section passing marks must use strings.
 */
export type Label = string | ((t: number, duration: number) => string);

export type Mark =
  | {
      kind: "bracket";
      id: string;
      keyframes: Keyframe[];
      /** Centred above the box. */
      top?: Label;
      /** Set vertically along the right edge (the left when near it). */
      right?: Label;
    }
  | {
      kind: "line";
      id: string;
      /** The rule's height, % of the frame. */
      y: number;
      /** Start and end, % of the frame width. */
      from: number;
      to: number;
      /** From this second the rule turns accent and shows its label. */
      activeFrom?: number;
      label: Label;
    }
  | { kind: "tag"; id: string; keyframes: Keyframe[]; label: Label }
  | {
      kind: "chip";
      id: string;
      x: number;
      y: number;
      w: number;
      h: number;
      /** Static HUD content sitting on the page ground. */
      children: ReactNode;
    };

type MeasureOverlayProps = {
  marks: Mark[];
  /** Replay the tokenisation sweep each time the take wraps. */
  tokenise?: boolean;
};

/** The sweep's length, ms - matches the animation in the module CSS. */
const SWEEP_MS = 1200;
/** A tag's label swings to the other side of its point past this x, %. */
const FLIP_AT = 70;
/** A bracket's edge label swings to the left edge past this right edge, %. */
const BRACKET_FLIP_AT = 88;

type Box = { x: number; y: number; w: number; h: number };

/** Linear interpolation over sorted keyframes; null while hidden. */
function sample(keyframes: Keyframe[], t: number): Box | null {
  const first = keyframes[0];
  const last = keyframes[keyframes.length - 1];
  if (!first || !last) return null;
  if (keyframes.length === 1) {
    return { x: first.x, y: first.y, w: first.w ?? 0, h: first.h ?? 0 };
  }
  if (t < first.t || t > last.t) return null;

  let index = 0;
  while (index < keyframes.length - 2 && keyframes[index + 1]!.t < t) index++;
  const a = keyframes[index]!;
  const b = keyframes[index + 1]!;
  const span = b.t - a.t;
  const mix = span > 0 ? Math.min(1, Math.max(0, (t - a.t) / span)) : 1;
  const lerp = (from: number, to: number) => from + (to - from) * mix;

  return {
    x: lerp(a.x, b.x),
    y: lerp(a.y, b.y),
    w: lerp(a.w ?? 0, b.w ?? 0),
    h: lerp(a.h ?? 0, b.h ?? 0),
  };
}

function read(label: Label, t: number, duration: number) {
  return typeof label === "string" ? label : label(t, duration);
}

function resting(label: Label | undefined) {
  return typeof label === "string" ? label : "";
}

export function MeasureOverlay({
  marks,
  tokenise = false,
}: MeasureOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);
  const marksRef = useRef(marks);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    marksRef.current = marks;
  }, [marks]);

  useEffect(() => {
    const root = ref.current;
    const video = root?.parentElement?.querySelector("video");
    if (!root || !video) return;
    if (reducedMotion) return;

    // The mark nodes, once, by id. Keyframes are sorted defensively so the
    // interpolation can walk them.
    const live = marksRef.current
      .filter((mark) => mark.kind !== "chip")
      .map((mark) => {
        const node = root.querySelector<HTMLElement>(
          `[data-mark="${mark.id}"]`,
        );
        const labels = node
          ? Array.from(node.querySelectorAll<HTMLElement>("[data-label]"))
          : [];
        const keyframes =
          "keyframes" in mark
            ? [...mark.keyframes].sort((a, b) => a.t - b.t)
            : [];
        return { mark, node, labels, keyframes, flipped: false, active: false };
      });

    let frame: number | undefined;
    let previousT = -1;
    let sweepTimer: ReturnType<typeof setTimeout> | undefined;

    function paint() {
      frame = undefined;
      if (!root || !video) return;

      const t = video.currentTime;
      const duration =
        Number.isFinite(video.duration) && video.duration > 0
          ? video.duration
          : 1;

      // The take wrapped (the clock went backwards to the start, not a
      // scrub): run the sweep once. It clears itself after the animation so
      // the next wrap can start it again.
      if (tokenise && t < previousT && t < 0.15) {
        root.dataset.sweep = "";
        clearTimeout(sweepTimer);
        sweepTimer = setTimeout(() => {
          delete root.dataset.sweep;
        }, SWEEP_MS + 100);
      }
      previousT = t;

      for (const entry of live) {
        const { mark, node } = entry;
        if (!node) continue;

        if (mark.kind === "line") {
          const active = t >= (mark.activeFrom ?? 0);
          if (active !== entry.active) {
            entry.active = active;
            if (active) node.dataset.active = "";
            else delete node.dataset.active;
          }
          for (const label of entry.labels) {
            const text = read(mark.label, t, duration);
            if (label.textContent !== text) label.textContent = text;
          }
          continue;
        }

        const box = sample(entry.keyframes, t);
        if (!box) {
          node.style.setProperty("--mark-opacity", "0");
          continue;
        }

        node.style.setProperty("--mark-opacity", "1");
        node.style.setProperty("--mark-x", box.x.toFixed(2));
        node.style.setProperty("--mark-y", box.y.toFixed(2));
        if (mark.kind === "bracket") {
          node.style.setProperty("--mark-w", box.w.toFixed(2));
          node.style.setProperty("--mark-h", box.h.toFixed(2));
        }

        const flipped =
          mark.kind === "bracket"
            ? box.x + box.w > BRACKET_FLIP_AT
            : box.x > FLIP_AT;
        if (flipped !== entry.flipped) {
          entry.flipped = flipped;
          if (flipped) node.dataset.flip = "";
          else delete node.dataset.flip;
        }

        for (const label of entry.labels) {
          const which = label.dataset.label;
          const source =
            mark.kind === "tag"
              ? mark.label
              : which === "top"
                ? mark.top
                : mark.right;
          if (!source) continue;
          const text = read(source, t, duration);
          if (label.textContent !== text) label.textContent = text;
        }
      }

      if (!video.paused) wake();
    }

    function wake() {
      frame ??= requestAnimationFrame(paint);
    }

    video.addEventListener("play", wake);
    video.addEventListener("pause", wake);
    video.addEventListener("seeked", wake);
    video.addEventListener("timeupdate", wake);
    wake();

    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      clearTimeout(sweepTimer);
      delete root.dataset.sweep;
      for (const entry of live) {
        const { mark, node, labels } = entry;
        if (!node) continue;
        for (const property of [
          "--mark-opacity",
          "--mark-x",
          "--mark-y",
          "--mark-w",
          "--mark-h",
        ]) {
          node.style.removeProperty(property);
        }
        delete node.dataset.active;
        delete node.dataset.flip;
        for (const label of labels) {
          const source =
            mark.kind === "line" || mark.kind === "tag"
              ? mark.label
              : label.dataset.label === "top"
                ? mark.top
                : mark.right;
          label.textContent = resting(source);
        }
      }
      video.removeEventListener("play", wake);
      video.removeEventListener("pause", wake);
      video.removeEventListener("seeked", wake);
      video.removeEventListener("timeupdate", wake);
    };
  }, [reducedMotion, tokenise]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`${styles.overlay} pointer-events-none absolute inset-0`}
    >
      {tokenise && <span className={styles.sweep} />}

      {marks.map((mark) => {
        switch (mark.kind) {
          case "bracket":
            return (
              <span
                key={mark.id}
                data-mark={mark.id}
                className={`${styles.mark} ${styles.bracket} text-accent`}
              >
                <MeasureBracketIcon className={styles.corner} />
                <MeasureBracketIcon className={styles.corner} />
                <MeasureBracketIcon className={styles.corner} />
                <MeasureBracketIcon className={styles.corner} />
                {mark.top && (
                  <span
                    data-label="top"
                    className={`${styles.label} ${styles.labelTop} type-caption text-ink bg-paper px-1`}
                  >
                    {resting(mark.top)}
                  </span>
                )}
                {mark.right && (
                  <span
                    data-label="right"
                    className={`${styles.label} ${styles.labelRight} type-caption text-ink bg-paper px-1`}
                  >
                    {resting(mark.right)}
                  </span>
                )}
              </span>
            );

          case "tag":
            return (
              <span
                key={mark.id}
                data-mark={mark.id}
                className={`${styles.mark} ${styles.tag}`}
              >
                <span className={styles.dot} />
                <span className={styles.lead}>
                  <span className={styles.leader} />
                  <span
                    data-label="tag"
                    className={`${styles.label} type-caption text-ink bg-paper px-1`}
                  >
                    {resting(mark.label)}
                  </span>
                </span>
              </span>
            );

          case "line":
            return (
              <span
                key={mark.id}
                data-mark={mark.id}
                className={styles.line}
                style={{
                  "--mark-x": mark.from,
                  "--mark-y": mark.y,
                  "--mark-w": mark.to - mark.from,
                }}
              >
                <span
                  data-label="line"
                  className={`${styles.label} ${styles.lineLabel} type-caption text-ink bg-paper px-1`}
                >
                  {resting(mark.label)}
                </span>
              </span>
            );

          case "chip":
            return (
              <div
                key={mark.id}
                className={`${styles.chip} bg-paper`}
                style={{
                  "--mark-x": mark.x,
                  "--mark-y": mark.y,
                  "--mark-w": mark.w,
                  "--mark-h": mark.h,
                }}
              >
                {mark.children}
              </div>
            );
        }
      })}
    </div>
  );
}
