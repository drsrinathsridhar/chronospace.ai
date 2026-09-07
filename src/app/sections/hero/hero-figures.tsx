import Image from "next/image";
import type { StaticImageData } from "next/image";
import manufacturingSubject from "./manufacturing-subject.png";
import roboticsArm from "./robotics-arm.png";
import roboticsMan from "./robotics-man.png";
import sportsSubject from "./sports-subject.png";
import styles from "./hero-figures.module.css";

// The captures, standing in the room. The three application subjects - the
// athlete, the production line, the robot arm and its operator - are planes
// in the same one-point perspective the room is built in, each at its own
// depth with its feet on the floor line, so the room's eye move parallaxes
// them against the walls like occupants rather than decals.
//
// Each figure is drawn white - the capture's subject as geometry, not as
// photograph: the cutout through a grayscale lift, lit by the same blue the
// room is. A soft pool of shadow lies flat on the floor plane under each
// one, which is most of what makes them stand rather than float.
//
// Positions are world coordinates in the room's own units (x in cqw across
// the plate, z in cqw into it, the floor at 98.2cqh - see the survey at the
// top of hero-room.module.css): the athlete mid-room on the left, the line
// deep against the back wall behind the claim, the arm and operator near
// the right wall. They arrive on the page reveal at the indices the old
// floating cards held.

type Figure = {
  image: StaticImageData;
  /** Left edge across the room, in cqw. */
  x: string;
  /** Depth into the room, in cqw - 0 is the plate, -81.82 the back wall. */
  z: string;
  /** Plane width, in cqw, before the perspective has it. */
  width: string;
  /** Shadow pool width, in cqw - wider than the figure for a soft splay. */
  shadow: string;
  reveal: number;
};

// Deepest first: the stage has no preserve-3d, so paint order is DOM order,
// and a nearer figure has to cover a farther one where they overlap.
const figures: Figure[] = [
  {
    image: manufacturingSubject,
    x: "7.3cqw",
    z: "-72cqw",
    width: "34cqw",
    shadow: "38cqw",
    reveal: 8,
  },
  {
    image: sportsSubject,
    x: "4cqw",
    z: "-30cqw",
    width: "17.5cqw",
    shadow: "22cqw",
    reveal: 7,
  },
  {
    image: roboticsMan,
    x: "73cqw",
    z: "-24cqw",
    width: "4.5cqw",
    shadow: "6cqw",
    reveal: 9,
  },
  {
    image: roboticsArm,
    x: "78cqw",
    z: "-24cqw",
    width: "15cqw",
    shadow: "19cqw",
    reveal: 9,
  },
];

export function HeroFigures() {
  return figures.map((figure) => (
    <span
      key={figure.image.src}
      className={styles.spot}
      style={{
        "--figure-x": figure.x,
        "--figure-z": figure.z,
        "--figure-width": figure.width,
        "--figure-shadow": figure.shadow,
        "--figure-aspect": `${figure.image.width} / ${figure.image.height}`,
        "--reveal-index": figure.reveal,
      }}
    >
      <span className={`${styles.shadow} sweep-reveal`} />
      <span className={`${styles.figure} sweep-reveal`}>
        <Image
          src={figure.image}
          alt=""
          fill
          priority
          sizes="30vw"
          className="object-cover"
        />
      </span>
    </span>
  ));
}
