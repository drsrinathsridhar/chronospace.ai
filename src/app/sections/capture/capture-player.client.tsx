"use client";

import { useState } from "react";
import { TimelinePlayer } from "@/components/timeline-player.client";
import echoPoster from "./echo-poster.jpg";

// The viewer, and the point of it: the HUD is not a caption, it is a live
// readout. Every reading is a deterministic function of the take's clock,
// anchored on the comp's resting values, so the numbers move while the take
// plays and land wherever the scrubber is dropped - measurable at any t,
// which is the sentence above the player.
//
// The instrument itself - the blended plate, the transport, the rAF clock -
// is the shared timeline player (src/components/timeline-player.client.tsx),
// which the product cards also run; this island only owns the readings,
// re-rendered on the player's decisecond tick and nothing else.

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
  const [readout, setReadout] = useState(resting);

  return (
    <TimelinePlayer
      src="/videos/echo.mp4"
      poster={echoPoster.src}
      fallbackDuration={FALLBACK_DURATION}
      aspect="640 / 368"
      name="the capture"
      onTick={(t, duration) => setReadout(measure(t, duration))}
    >
      <dl className="type-caption absolute right-2.5 bottom-2.5 flex w-42.75 max-w-full flex-col gap-1">
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
