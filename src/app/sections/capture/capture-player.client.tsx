"use client";

import { useState } from "react";
import { MeasureOverlay } from "@/components/measure-overlay.client";
import type { Mark } from "@/components/measure-overlay.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import { media } from "@/media.config";

// The viewer, and the point of it: the readings are not a caption, they are
// drawn on the picture. A bracket stands on the figure with his height up
// its edge, one tag rides the floor under him with the distance covered so
// far, another rides his hands with their speed - all of it following the
// take frame by frame, and landing wherever the scrubber is dropped.
// Measurable at any t, which is the sentence above the player.
//
// The marks are the shared measurement overlay (client feedback, item 9;
// src/components/measure-overlay.client.tsx), the same instrument the
// queryable product take runs. The corner HUD keeps only what has no place
// on the picture: the frames the echo keeps, the joints tracked, and the
// timebase - re-rendered on the player's decisecond tick and nothing else.
// It sits bottom-left, clear of the player's own control surface in the
// bottom-right corner (the arc scrubber, feedback round 2); the marks
// never reach that corner - the bracket's left edge stays past 26% and the
// floor tag past 32% of the frame.
//
// The instrument itself - the blended plate, the transport, the rAF clock -
// is the shared timeline player (src/components/timeline-player.client.tsx),
// which the product cards also run.

const take = media.viewer.echo;

// The comp's resting readout - also the server-rendered state.
const resting: [string, string][] = [
  ["Frames kept", "6"],
  ["Tracked joints", "17"],
  ["Timebase", "Any t"],
];

// The corner readings at time t. Frames kept counts up through the take,
// the joints drift around the comp's 17 on a slow phase, and the timebase
// stays "any t": that one is the claim, not a measurement.
function measure(t: number, duration: number): [string, string][] {
  return [
    ["Frames kept", String(Math.min(6, 1 + Math.floor((t / duration) * 6)))],
    ["Tracked joints", String(17 + Math.round(0.6 * Math.sin(t * 5.3)))],
    ["Timebase", "Any t"],
  ];
}

// The echo take annotated at 0.25s steps over a 10% grid (echo.mp4, 640x368,
// 4.94s: a camera orbit around a man stacking boxes, his past positions
// echoed behind him). The bracket follows the solid figure - he sweeps
// right across the frame as the camera comes round, to 97% at 2.5s, and
// back to the left by the end; the floor point sits under his feet and the
// hand point on the box he is carrying. A final keyframe past the end holds
// each mark through the wrap.
const marks: Mark[] = [
  {
    kind: "bracket",
    id: "height",
    right: "1.77 m",
    keyframes: [
      { t: 0, x: 29, y: 52, w: 18, h: 46 },
      { t: 0.25, x: 31, y: 22, w: 16, h: 75 },
      { t: 0.5, x: 35, y: 24, w: 15, h: 71 },
      { t: 0.75, x: 46, y: 19, w: 13, h: 73 },
      { t: 1, x: 54, y: 17, w: 14, h: 68 },
      { t: 1.25, x: 58, y: 17, w: 12, h: 68 },
      { t: 1.5, x: 66, y: 16, w: 14, h: 70 },
      { t: 1.75, x: 73, y: 17, w: 13, h: 72 },
      { t: 2, x: 78, y: 20, w: 14, h: 76 },
      { t: 2.25, x: 84, y: 22, w: 13, h: 74 },
      { t: 2.5, x: 84, y: 23, w: 13, h: 72 },
      { t: 2.75, x: 80, y: 24, w: 13, h: 71 },
      { t: 3, x: 75, y: 24, w: 13, h: 68 },
      { t: 3.25, x: 67, y: 22, w: 13, h: 68 },
      { t: 3.5, x: 60, y: 19, w: 12, h: 70 },
      { t: 3.75, x: 53, y: 18, w: 12, h: 69 },
      { t: 4, x: 42, y: 15, w: 14, h: 73 },
      { t: 4.25, x: 36, y: 17, w: 14, h: 72 },
      { t: 4.5, x: 30, y: 15, w: 13, h: 76 },
      { t: 4.75, x: 26, y: 22, w: 14, h: 75 },
      { t: 5, x: 26, y: 22, w: 14, h: 75 },
    ],
  },
  {
    kind: "tag",
    id: "path",
    // The one true integral: distance covered so far, landing on the comp's
    // 1.04 m as the take ends.
    label: (t, duration) => `${((t / duration) * 1.04).toFixed(2)} m`,
    keyframes: [
      { t: 0, x: 37, y: 98 },
      { t: 0.25, x: 37, y: 96 },
      { t: 0.5, x: 42, y: 95 },
      { t: 0.75, x: 51, y: 92 },
      { t: 1, x: 60, y: 85 },
      { t: 1.25, x: 63, y: 85 },
      { t: 1.5, x: 72, y: 86 },
      { t: 1.75, x: 80, y: 89 },
      { t: 2, x: 86, y: 96 },
      { t: 2.25, x: 90, y: 96 },
      { t: 2.5, x: 88, y: 96 },
      { t: 2.75, x: 86, y: 95 },
      { t: 3, x: 82, y: 92 },
      { t: 3.25, x: 75, y: 90 },
      { t: 3.5, x: 65, y: 89 },
      { t: 3.75, x: 57, y: 87 },
      { t: 4, x: 47, y: 89 },
      { t: 4.25, x: 43, y: 90 },
      { t: 4.5, x: 36, y: 92 },
      { t: 4.75, x: 32, y: 97 },
      { t: 5, x: 32, y: 97 },
    ],
  },
  {
    kind: "tag",
    id: "speed",
    label: (t) => `${(0.4 + 0.25 * Math.sin(t * 3.1)).toFixed(1)} m/s`,
    keyframes: [
      { t: 0, x: 41, y: 85 },
      { t: 0.25, x: 48, y: 47 },
      { t: 0.5, x: 52, y: 55 },
      { t: 0.75, x: 55, y: 47 },
      { t: 1, x: 62, y: 47 },
      { t: 1.25, x: 66, y: 48 },
      { t: 1.5, x: 74, y: 55 },
      { t: 1.75, x: 80, y: 57 },
      { t: 2, x: 84, y: 62 },
      { t: 2.25, x: 87, y: 65 },
      { t: 2.5, x: 86, y: 62 },
      { t: 2.75, x: 83, y: 60 },
      { t: 3, x: 78, y: 58 },
      { t: 3.25, x: 74, y: 55 },
      { t: 3.5, x: 67, y: 50 },
      { t: 3.75, x: 60, y: 50 },
      { t: 4, x: 50, y: 50 },
      { t: 4.25, x: 48, y: 52 },
      { t: 4.5, x: 42, y: 50 },
      { t: 4.75, x: 40, y: 50 },
      { t: 5, x: 40, y: 50 },
    ],
  },
];

export function CapturePlayer() {
  const [readout, setReadout] = useState(resting);

  return (
    <TimelinePlayer
      src={take.src}
      poster={take.poster}
      fallbackDuration={take.duration}
      fps={take.fps}
      camera={take.camera}
      aspect="640 / 368"
      name="the capture"
      onTick={(t, duration) => setReadout(measure(t, duration))}
    >
      <MeasureOverlay marks={marks} />
      <dl className="type-caption absolute bottom-2.5 left-2.5 flex w-42.75 max-w-[calc(50%-1rem)] flex-col gap-1">
        {readout.map(([term, value]) => (
          <div key={term} className="flex items-center justify-between gap-4">
            <dt className="text-muted">{term}</dt>
            <dd className="text-ink text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </TimelinePlayer>
  );
}
