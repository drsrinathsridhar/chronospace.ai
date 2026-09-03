import Image from "next/image";
import type { StaticImageData } from "next/image";
import manufacturingRoom from "./manufacturing-room.png";
import manufacturingSubject from "./manufacturing-subject.png";
import roboticsArm from "./robotics-arm.png";
import roboticsMan from "./robotics-man.png";
import roboticsRoom from "./robotics-room.png";
import sportsRoom from "./sports-room.png";
import sportsSubject from "./sports-subject.png";
import styles from "./hero-cards.module.css";

// The three captures, cut loose from the timeline and hung around the claim
// like frames pinned over the room. Each one is a grey room plate with its
// subject printed back in colour - the capture, and the thing captured.
//
// Two kinds of motion, both defined in hero-cards.module.css:
//
//   The float. The cards drift with the pointer off the same chase the room
//   runs on, but through a slower, softer pair of numbers (--float-x/y,
//   written by hero-room-eye.client.tsx), so they read as hanging in front
//   of the room rather than bolted to it.
//
//   The echo. On arrival each subject carries its motion trail - offset
//   copies at falling opacities, the reference build's dancer trail - which
//   then collapses copy by copy into the single coloured subject. Hovering
//   a card replays it: the trail grows back out, and folds away again on
//   leave, always staggered.
//
// Positions are the comp's at 1496x716: cards on 6.95%/20.72%/79.81% with
// their tops at 139/418/257px. Below the xl breakpoint the scatter would
// collide with the headline, so the cards fall into the strip they came
// from: a three-column row above the ruler.

type Piece = {
  image: StaticImageData;
  left: string;
  top: string;
  width: string;
  aspect: string;
};

type FloatingCard = {
  label: string;
  count: string;
  roomImage: StaticImageData;
  room: { left: string; top: string; width: string; aspect: string };
  pieces: Piece[];
  left: string;
  top: string;
  /** How far one unit of eye travel moves this card - depth, per card. */
  drift: string;
  reveal: number;
};

const cards: FloatingCard[] = [
  {
    label: "Sports & entertainment",
    count: "(01)",
    roomImage: sportsRoom,
    room: { left: "0.25%", top: "-50%", width: "100.2%", aspect: "864 / 1152" },
    pieces: [
      {
        image: sportsSubject,
        left: "27.15%",
        top: "9.72%",
        width: "45.81%",
        aspect: "81 / 113",
      },
    ],
    left: "6.95%",
    top: "139px",
    drift: "12px",
    reveal: 7,
  },
  {
    label: "Manufacturing",
    count: "(01)",
    roomImage: manufacturingRoom,
    room: { left: "-0.4%", top: "-50%", width: "101.5%", aspect: "864 / 1152" },
    pieces: [
      {
        image: manufacturingSubject,
        left: "-2.26%",
        top: "24.77%",
        width: "102.93%",
        aspect: "182 / 79",
      },
    ],
    left: "20.72%",
    top: "418px",
    drift: "16px",
    reveal: 8,
  },
  {
    label: "Robotics",
    count: "(01)",
    roomImage: roboticsRoom,
    room: {
      left: "-1.35%",
      top: "-44.2%",
      width: "109.25%",
      aspect: "1236 / 1458",
    },
    pieces: [
      {
        image: roboticsArm,
        left: "-3.61%",
        top: "3.25%",
        width: "50.79%",
        aspect: "89.8 / 124.2",
      },
      {
        image: roboticsMan,
        left: "67.86%",
        top: "47.69%",
        width: "11.31%",
        aspect: "20 / 59",
      },
    ],
    left: "79.81%",
    top: "257px",
    drift: "10px",
    reveal: 9,
  },
];

// The trail, nearest copy first: opacity falls as the echo reaches back.
const echoes = [
  { index: 1, opacity: 0.6 },
  { index: 2, opacity: 0.35 },
  { index: 3, opacity: 0.2 },
];

function Pieces({ pieces }: { pieces: Piece[] }) {
  return pieces.map((piece) => (
    <span
      key={piece.image.src}
      className={styles.piece}
      style={{
        "--piece-left": piece.left,
        "--piece-top": piece.top,
        "--piece-width": piece.width,
        "--piece-aspect": piece.aspect,
      }}
    >
      <Image
        src={piece.image}
        alt=""
        fill
        sizes="200px"
        className="object-cover"
      />
    </span>
  ));
}

export function HeroCards() {
  return (
    <div className={styles.cards} data-float>
      {cards.map((card) => (
        <article
          key={card.label}
          className={`${styles.card} sweep-reveal`}
          style={{
            "--reveal-index": card.reveal,
            "--card-left": card.left,
            "--card-top": card.top,
            "--card-drift": card.drift,
          }}
        >
          <header className="bg-paper border-line type-label text-ink flex items-baseline justify-between gap-2 border-b p-3">
            <span>{card.label}</span>
            <span className="type-micro text-muted">{card.count}</span>
          </header>

          <div className={styles.body}>
            <span
              className={styles.plate}
              style={{
                "--plate-left": card.room.left,
                "--plate-top": card.room.top,
                "--plate-width": card.room.width,
                "--plate-aspect": card.room.aspect,
              }}
            >
              <Image
                src={card.roomImage}
                alt=""
                fill
                priority
                sizes="200px"
                className="object-cover"
              />
            </span>

            {echoes.map((echo) => (
              <span
                key={echo.index}
                aria-hidden
                className={styles.echo}
                style={{
                  "--echo-index": echo.index,
                  "--echo-opacity": echo.opacity,
                }}
              >
                <Pieces pieces={card.pieces} />
              </span>
            ))}

            <span className={styles.subject}>
              <Pieces pieces={card.pieces} />
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
