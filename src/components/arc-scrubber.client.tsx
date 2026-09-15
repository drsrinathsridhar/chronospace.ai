"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";
import styles from "./arc-scrubber.module.css";

// The arc scrubber: the dial that replaced the linear tick track (client
// feedback round 2, item 5b). A ~150 degree arc stands over a centre dot,
// a handle rides the arc, an accent sweep runs from the arc's start to the
// handle, and a hairline spoke joins the centre to the handle - the
// reference's "free viewpoint" dial, drawn in the site's tokens. Since
// round 3 (item 5a) the handle is the camera: the timeline player puts it
// at the camera's bearing in the footage at the current moment - the
// take's mean position at the arc's centre, 90 degrees either way at its
// ends - so the arc reads as the camera's trajectory around the scene and
// the sweep as how far around it the camera has come.
//
// Everything on the dial is CSS reading one custom property, --player-
// progress in 0..1, that the timeline player's rAF loop writes on the dial
// element each frame (arc-scrubber.module.css). The dial never sees the
// clip's duration, its frame count or its camera track, so the same
// instrument sits over any take - the three product clips and the viewer
// alike (item 10b).
//
// Pointer input: a drag anywhere on the dial moves the handle. The
// pointer's angle from the arc's centre maps into 0..1 across the sweep
// and goes to the player as a place on the arc (`onPlace`), which the
// player turns into a moment of the take - the one the camera was nearest
// that bearing; points within the arc's span (plus a little overshoot at
// either end) clamp, points on the far side of the centre are ignored
// rather than made to jump. The pointer is captured on the dial for the
// drag, so the pointer may leave the surface without dropping the handle.
// Keyboard and assistive tech keep the native range input, visually hidden
// inside the dial but still focusable; it steps through the take's time
// (`onSeek`), speaks the view number, and draws the focus ring around the
// dial through :has().
//
// No inline SVG (house rule): the arc is a conic gradient masked to a ring
// and clipped to the sweep's span, the handle a dot rotated about the
// centre and pushed out by the radius.

/** Where the arc starts, in the CSS rotate convention: 0 up, clockwise. */
export const ARC_START = -75;
/** How far the arc runs from its start, in degrees. */
export const ARC_SWEEP = 150;
/** How far past either end of the arc a pointer still clamps to it. */
const ARC_OVERSHOOT = 30;

type ArcScrubberProps = {
  /** Receives --player-progress each frame; measured for the pointer. */
  dialRef: RefObject<HTMLDivElement | null>;
  /** The native range, kept for keyboard and assistive tech. */
  rangeRef: RefObject<HTMLInputElement | null>;
  /** Names the take: "Scrub {name}". */
  name: string;
  /** The range's spoken value before the loop's first tick. */
  valueText: string;
  /** The pointer has put the handle at a place on the arc, 0..1 across
   *  the sweep. */
  onPlace: (along: number) => void;
  /** The range's keys have moved to a fraction of the take's length. */
  onSeek: (played: number) => void;
  /** The drag's start and end, so the player can hold its range sync. */
  onScrub: (scrubbing: boolean) => void;
};

/** The pointer's place along the arc, or undefined when it is off it. */
function placeAt(dial: HTMLDivElement, clientX: number, clientY: number) {
  // The dial box is 2r + 2i wide and r + 2i tall (arc-scrubber.module.css),
  // so the radius is the difference and the centre sits r + i from the top.
  const box = dial.getBoundingClientRect();
  const radius = box.width - box.height;
  const centreX = box.left + box.width / 2;
  const centreY = box.top + (box.height + radius) / 2;
  const dx = clientX - centreX;
  const dy = clientY - centreY;
  // atan2 with up as zero and clockwise positive, like CSS rotate().
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  const along = angle - ARC_START;
  if (along < -ARC_OVERSHOOT || along > ARC_SWEEP + ARC_OVERSHOOT) {
    return undefined;
  }
  return Math.min(1, Math.max(0, along / ARC_SWEEP));
}

export function ArcScrubber({
  dialRef,
  rangeRef,
  name,
  valueText,
  onPlace,
  onSeek,
  onScrub,
}: ArcScrubberProps) {
  function placeFrom(event: ReactPointerEvent<HTMLDivElement>) {
    const along = placeAt(event.currentTarget, event.clientX, event.clientY);
    if (along !== undefined) onPlace(along);
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
    placeFrom(event);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current !== event.pointerId) return;
    placeFrom(event);
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    if (dragRef.current !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onScrub(false);
  }

  return (
    <div
      ref={dialRef}
      className={styles.dial}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <span aria-hidden className={styles.ring} />
      <span aria-hidden className={styles.spoke} />
      <span aria-hidden className={styles.centre} />
      <span aria-hidden className={styles.handle} />
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
