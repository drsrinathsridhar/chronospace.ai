import { CameraIcon } from "@/icons/generated";
import styles from "./hero-room.module.css";

// The capture rig. The client's real room - the one in every take - is lined
// with small wall-mounted camera units, and the hero's room is the same box,
// so it gets the same rig (client feedback, September 2026: show how the
// capture happens). Sixteen units: two rows of three down each side wall and
// one row of four along the back wall.
//
// Each unit is a billboard standing a hair inside its wall, a direct child
// of the perspective stage like the five faces (hero-room.module.css) - so
// it is placed in the room's own coordinates, shrinks with depth, and rides
// the eye move for free through the shared `--eye` transform. Nothing here
// is rotated onto a wall face: the faces are separate flattened layers with
// no depth buffer between them, so a decal on a face could never be occluded
// or lit correctly anyway, and a small plate facing the viewer reads as a
// unit on the wall from where the eye stands.
//
// Coordinates are the stage's: x and z in cqw, y in cqh, from the survey in
// hero-room.module.css. The left wall stands at x = -2.735, the right at
// 102.375, the back at z = -81.82; the ceiling at y = -22.2 and the floor at
// 98.2. The side-wall rows at y = 8 and y = 40 land a quarter and a half of
// the way down the walls once projected. The back-wall row sits higher, at
// y = -18, just under the cove: the headline stands in front of the back
// wall with its top at 25.8% of the plate, and a row at y = 8 projected to
// 37% - straight through the copy. At -18 it projects to 22.5%, in the band
// between the ceiling line (20.7%) and the headline, where the footage puts
// its units too. Every unit carries a recording LED on its own irregular
// clock; four carry a faint view cone toward the floor.

type Unit = {
  x: string;
  y: string;
  z: string;
  /** Rotation of the view cone, degrees - only a few units carry one. */
  cone?: string;
  ledDelay: string;
  ledPeriod: string;
};

const units: Unit[] = [
  // Left wall: the unit's box runs from x to x + 2cqw, so its far edge
  // stands 0.135cqw off the wall plane, the same clearance as the right.
  { x: "-2.6cqw", y: "8cqh", z: "-68cqw", ledDelay: "0s", ledPeriod: "4.1s" },
  {
    x: "-2.6cqw",
    y: "8cqh",
    z: "-44cqw",
    cone: "-28deg",
    ledDelay: "1.3s",
    ledPeriod: "5.3s",
  },
  {
    x: "-2.6cqw",
    y: "8cqh",
    z: "-20cqw",
    ledDelay: "2.7s",
    ledPeriod: "4.7s",
  },
  {
    x: "-2.6cqw",
    y: "40cqh",
    z: "-68cqw",
    ledDelay: "0.8s",
    ledPeriod: "6.1s",
  },
  {
    x: "-2.6cqw",
    y: "40cqh",
    z: "-44cqw",
    ledDelay: "3.4s",
    ledPeriod: "4.3s",
  },
  {
    x: "-2.6cqw",
    y: "40cqh",
    z: "-20cqw",
    ledDelay: "1.9s",
    ledPeriod: "5.9s",
  },
  // Right wall, mirrored.
  {
    x: "100.2cqw",
    y: "8cqh",
    z: "-68cqw",
    ledDelay: "2.2s",
    ledPeriod: "5.1s",
  },
  {
    x: "100.2cqw",
    y: "8cqh",
    z: "-44cqw",
    cone: "28deg",
    ledDelay: "0.4s",
    ledPeriod: "4.9s",
  },
  {
    x: "100.2cqw",
    y: "8cqh",
    z: "-20cqw",
    ledDelay: "3.9s",
    ledPeriod: "6.3s",
  },
  {
    x: "100.2cqw",
    y: "40cqh",
    z: "-68cqw",
    ledDelay: "1.6s",
    ledPeriod: "4.5s",
  },
  {
    x: "100.2cqw",
    y: "40cqh",
    z: "-44cqw",
    ledDelay: "2.9s",
    ledPeriod: "5.7s",
  },
  {
    x: "100.2cqw",
    y: "40cqh",
    z: "-20cqw",
    ledDelay: "0.6s",
    ledPeriod: "4.2s",
  },
  // Back wall, one row under the cove, just in front of the plane at
  // z = -81.82.
  {
    x: "15cqw",
    y: "-18cqh",
    z: "-80.5cqw",
    ledDelay: "1.1s",
    ledPeriod: "5.5s",
  },
  {
    x: "38cqw",
    y: "-18cqh",
    z: "-80.5cqw",
    cone: "-10deg",
    ledDelay: "3.1s",
    ledPeriod: "4.4s",
  },
  {
    x: "62cqw",
    y: "-18cqh",
    z: "-80.5cqw",
    cone: "10deg",
    ledDelay: "0.2s",
    ledPeriod: "6.0s",
  },
  {
    x: "85cqw",
    y: "-18cqh",
    z: "-80.5cqw",
    ledDelay: "2.4s",
    ledPeriod: "4.8s",
  },
];

// A fragment of spans rather than a wrapper: each unit has to be a direct
// child of the stage for the `.stage > *` placement rule to apply.
export function HeroRoomCameras() {
  return units.map((unit) => (
    <span
      key={`${unit.x} ${unit.y} ${unit.z}`}
      className={styles.camera}
      style={{
        "--cam-x": unit.x,
        "--cam-y": unit.y,
        "--cam-z": unit.z,
        "--led-delay": unit.ledDelay,
        "--led-period": unit.ledPeriod,
        "--cone": unit.cone,
      }}
    >
      {unit.cone && <span className={styles.cone} />}
      <CameraIcon width="100%" height="100%" />
      <span className={styles.led} />
    </span>
  ));
}
