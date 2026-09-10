import type { Mark } from "@/components/measure-overlay.client";

// The readings drawn on the "queryable" take (measurable.mp4, an 18s loop
// cut from the client's long-duration export at 30x). Annotated frame by
// frame at one-second steps over a 10% grid; every value is a percentage
// of the 960x540 frame, so the marks hold at any plate width.
//
// Strings only: this file is read by the server-rendered product section
// and crosses into the overlay island as props, so no label functions.

// The taller dancer - white sweater, jeans - through the loop. She leaves
// the frame in a fast camera pass around t = 16, so the bracket lets go
// at 14.5 and picks her up again on the wrap, under the tokenisation sweep.
const dancer: Mark = {
  kind: "bracket",
  id: "height",
  right: "1.68 m",
  keyframes: [
    { t: 0, x: 42, y: 30, w: 18, h: 70 },
    { t: 1, x: 54, y: 34, w: 16, h: 66 },
    { t: 2, x: 41, y: 25, w: 19, h: 75 },
    { t: 3, x: 47, y: 25, w: 19, h: 75 },
    { t: 4, x: 40, y: 26, w: 18, h: 74 },
    { t: 5, x: 34, y: 24, w: 16, h: 74 },
    { t: 6, x: 46, y: 30, w: 17, h: 70 },
    { t: 7, x: 35, y: 25, w: 18, h: 69 },
    { t: 8, x: 49, y: 31, w: 17, h: 69 },
    { t: 9, x: 54, y: 33, w: 16, h: 67 },
    { t: 10, x: 48, y: 34, w: 18, h: 66 },
    { t: 11, x: 36, y: 32, w: 16, h: 68 },
    { t: 12, x: 50, y: 33, w: 15, h: 67 },
    { t: 13, x: 48, y: 32, w: 20, h: 68 },
    { t: 14, x: 60, y: 28, w: 18, h: 72 },
    { t: 14.5, x: 60, y: 28, w: 18, h: 72 },
  ],
};

// A line across the floor at 94% of the frame. The dancers step back
// beyond it around t = 6.5 and her shoe comes back over it at t = 7.0
// (checked at 4fps), which is when the rule turns accent.
const floorLine: Mark = {
  kind: "line",
  id: "floor",
  y: 94,
  from: 26,
  to: 72,
  activeFrom: 7,
  label: "Line crossed 00:00:07",
};

export const measurableMarks: Mark[] = [dancer, floorLine];

// The client's export carries two burned-in tool graphics: the
// "Long Duration - Playing at 30x" label (x 4.8-45.5%, y 1.8-9.3%) and
// the heat-map strip (x 4.2-34.5%, y 71.2-98.2%). These boxes cover each
// with about 1% to spare; the product section draws its own HUD in them.
export const measurableChips = {
  mode: { x: 3.5, y: 0.8, w: 43.5, h: 9.7 },
  readings: { x: 3.2, y: 70, w: 32.5, h: 29.5 },
};
