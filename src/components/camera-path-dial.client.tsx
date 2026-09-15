"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import type { CameraPath } from "@/media.config";
import styles from "./camera-path-dial.module.css";

// The camera path dial: a plan of the capture seen from above, in the
// plate's corner. The subject is the dot at the centre; the camera's
// recorded path is an arc of an ellipse around it (an ellipse, not a
// circle, so the plan reads as a ground seen from a raised angle); the
// camera is the handle dot travelling that arc in step with the take; an
// accent trail marks the part of the path already travelled, and a hairline
// view ray runs from the camera to the subject. The client's reference is
// "FREE VIEWPOINT · VIEW 22 / 60" over a synthesised orbit (feedback round
// 3, item 5a): the round-2 arc read as a curved timeline, and a timeline in
// disguise told nobody that the camera was moving.
//
// Two modes, one from each take's `camera` in media.config.ts. An orbit
// (`from` to `to` degrees) draws the path and moves the camera along it. A
// fixed camera holds its bearing, the ray stands still, and the ring around
// the subject carries the playback instead - the diagram never claims a
// motion the footage does not have.
//
// Bearings: degrees around the subject, 0 straight in front (the bottom of
// the plan, nearest the viewer), positive clockwise as seen from above; so
// 90 is the subject's right side, seen from the left of the plan.
//
// Everything that moves is CSS reading one custom property, --player-
// progress in 0..1, that the timeline player's rAF loop writes on the dial
// element each frame (camera-path-dial.module.css): the bearing, the dot's
// place on the ellipse (sin/cos), the ray's length and angle (hypot/atan2)
// and the trail's span are all computed in the stylesheet. This file only
// hands the per-take geometry over as static custom properties.
//
// Pointer input: a drag anywhere on the dial seeks - the pointer's bearing
// on the ellipse maps into the path (with a little overshoot at either end;
// points off the far side are ignored rather than made to jump), or, for a
// fixed camera, its angle around the subject maps into the ring. The
// pointer is captured on the dial for the drag. Keyboard and assistive tech
// keep the native range input, visually hidden inside the dial but still
// focusable; it draws the focus ring around the dial through :has().
//
// No inline SVG (house rule): the path is a bordered ellipse masked to its
// span by a conic gradient, the dots and ray are positioned spans.

/** The plan's foreshortening: the ellipse's ry over its rx. Mirrored by
 *  --plan-squash in camera-path-dial.module.css. */
export const PLAN_SQUASH = 0.55;
/** How far past either end of the path a pointer still clamps to it. */
const PATH_OVERSHOOT = 30;

type CameraPathDialProps = {
  /** Receives --player-progress each frame; measured for the pointer. */
  dialRef: RefObject<HTMLDivElement | null>;
  /** The native range, kept for keyboard and assistive tech. */
  rangeRef: RefObject<HTMLInputElement | null>;
  /** Names the take: "Scrub {name}". */
  name: string;
  /** The take's camera: an orbit's span or a fixed bearing. */
  camera: CameraPath;
  /** The range's spoken value before the loop's first tick. */
  valueText: string;
  /** Seeks the take to a progress in 0..1. */
  onSeek: (progress: number) => void;
  /** The drag's start and end, so the player can hold its range sync. */
  onScrub: (scrubbing: boolean) => void;
};

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/** Wraps an angle into (-180, 180]. */
function wrap(degrees: number) {
  return degrees - 360 * Math.ceil((degrees - 180) / 360);
}

/**
 * The angle at which a bearing appears on the plan, in the CSS rotate
 * convention (0 up, clockwise): the ellipse's squash pulls every bearing
 * towards the horizontal, so a conic gradient - which sweeps true angles -
 * has to be given these rather than the bearings themselves. The camera at
 * bearing b sits at (-rx sin b, ry cos b) from the centre.
 */
function planAngle(bearing: number) {
  const b = toRadians(bearing);
  return toDegrees(Math.atan2(-Math.sin(b), -PLAN_SQUASH * Math.cos(b)));
}

/**
 * The static geometry the stylesheet reads, written as custom properties on
 * the dial: the orbit's two bearings (equal for a fixed camera, so the
 * stylesheet's one formula holds still), where the rest path starts and how
 * far it runs in plan angles, and the start's sine and cosine for browsers
 * without CSS trigonometry.
 */
function geometry(camera: CameraPath) {
  const from = camera.kind === "fixed" ? camera.at : camera.from;
  const to = camera.kind === "fixed" ? camera.at : camera.to;
  // The rest path runs from the lower bearing to the higher one whichever
  // way the orbit turns; its span in plan angles wraps once at the bottom
  // of the plan, which the modulo puts right. A full turn stays a full turn.
  const low = Math.min(from, to);
  const high = Math.max(from, to);
  const span =
    high - low >= 360
      ? 360
      : (((planAngle(high) - planAngle(low)) % 360) + 360) % 360;
  return {
    from: `${from}deg`,
    to: `${to}deg`,
    start: `${planAngle(low).toFixed(2)}deg`,
    span: `${span.toFixed(2)}deg`,
    sin: Math.sin(toRadians(from)).toFixed(4),
    cos: Math.cos(toRadians(from)).toFixed(4),
  };
}

/** The pointer's progress along the path, or undefined when it is off it. */
function progressAt(
  dial: HTMLDivElement,
  camera: CameraPath,
  clientX: number,
  clientY: number,
) {
  // The dial box is 2rx + 2i wide and 2ry + 2i tall with ry = squash * rx
  // (camera-path-dial.module.css), so the difference of the two is
  // 2rx(1 - squash), and the centre is the box's centre.
  const box = dial.getBoundingClientRect();
  const rx = (box.width - box.height) / (2 * (1 - PLAN_SQUASH));
  const ry = rx * PLAN_SQUASH;
  const dx = clientX - (box.left + box.width / 2);
  const dy = clientY - (box.top + box.height / 2);

  if (camera.kind === "fixed") {
    // The ring around the subject: its sweep starts at the top and runs
    // clockwise, like the conic gradient that draws it.
    const angle = toDegrees(Math.atan2(dx, -dy));
    return (((angle % 360) + 360) % 360) / 360;
  }

  // The pointer's bearing on the ellipse, then its place along the path
  // measured from the path's middle, so a path longer than a half turn
  // never has its far end wrap to the wrong side of the start.
  const bearing = toDegrees(Math.atan2(-dx / rx, dy / ry));
  const span = camera.to - camera.from;
  const length = Math.abs(span);
  const along = wrap(bearing - camera.from - span / 2) + span / 2;
  const travelled = span < 0 ? -along : along;
  if (travelled < -PATH_OVERSHOOT || travelled > length + PATH_OVERSHOOT) {
    return undefined;
  }
  return Math.min(1, Math.max(0, travelled / length));
}

export function CameraPathDial({
  dialRef,
  rangeRef,
  name,
  camera,
  valueText,
  onSeek,
  onScrub,
}: CameraPathDialProps) {
  function seekTo(event: ReactPointerEvent<HTMLDivElement>) {
    const progress = progressAt(
      event.currentTarget,
      camera,
      event.clientX,
      event.clientY,
    );
    if (progress !== undefined) onSeek(progress);
  }

  // The drag is tracked by pointer id here rather than asked of the
  // browser's capture state: capture is the means of keeping the pointer
  // once it leaves the dial, not the record of the drag, and it can be
  // refused (a pointer the browser no longer holds) without the drag being
  // any less real.
  const dragRef = useRef<number | null>(null);

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 || dragRef.current !== null) return;
    event.preventDefault();
    dragRef.current = event.pointerId;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Not captured: the drag still runs while the pointer is over the dial.
    }
    onScrub(true);
    seekTo(event);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current !== event.pointerId) return;
    seekTo(event);
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onScrub(false);
  }

  const plan = geometry(camera);

  return (
    <div
      ref={dialRef}
      className={styles.dial}
      data-mode={camera.kind}
      style={{
        "--path-from": plan.from,
        "--path-to": plan.to,
        "--path-start": plan.start,
        "--path-span": plan.span,
        "--from-sin": plan.sin,
        "--from-cos": plan.cos,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <span aria-hidden className={styles.path} />
      <span aria-hidden className={styles.trail} />
      <span aria-hidden className={styles.ring} />
      <span aria-hidden className={styles.ray} />
      <span aria-hidden className={styles.subject} />
      <span aria-hidden className={styles.camera} />
      <input
        ref={rangeRef}
        type="range"
        min={0}
        max={1000}
        defaultValue={0}
        onInput={(event) => onSeek(Number(event.currentTarget.value) / 1000)}
        aria-label={`Scrub ${name}`}
        aria-valuetext={valueText}
        className={styles.range}
      />
    </div>
  );
}
