import Image from "next/image";
import type { StaticImageData } from "next/image";
import manufacturingFigure from "./manufacturing-figure.png";
import roboticsArmFigure from "./robotics-arm-figure.png";
import roboticsManFigure from "./robotics-man-figure.png";
import sportsFigure from "./sports-figure.png";
import styles from "./hero-cards.module.css";

// The three captures, standing in the room. Same card grammar as ever - a
// hairline frame with a labelled header - but the body is now transparent:
// no plate behind the subject, so the room shows straight through and the
// figure reads as standing inside it, held by the frame rather than printed
// on a card.
//
// The stand is the anchor: each card's bottom edge is pinned to a fraction
// of the room plate's height (--card-feet), so the frame sits on the floor
// line wherever the viewport puts it, and the whole card scales from that
// bottom edge by its depth (--card-scale) - the manufacturing line stands
// nearest and largest, the two flanking captures a step further in.
//
// Two kinds of motion, both defined in hero-cards.module.css:
//
//   The float. The cards drift with the pointer off the same chase the room
//   runs on, but through a slower, softer pair of numbers (--float-x/y,
//   written by hero-room-eye.client.tsx), so they read as standing in the
//   room rather than bolted to it.
//
//   The echo. On arrival each subject carries its motion trail - offset
//   copies at falling opacities, the reference build's dancer trail - which
//   then collapses copy by copy into the single figure. Hovering a card
//   replays it: the trail grows back out, and folds away again on leave,
//   always staggered.
//
// Geometry is the comp's at 1496: cards on 17.38%/41.71%/68.85% with their
// feet at 88.87%/109.17%/89.03% of the plate height and scales of
// 1.153/1.386/1.153 over the base 178.826px card. Below the xl breakpoint
// the scatter would collide with the headline, so the cards fall into a
// three-column strip above the ruler.

type Piece = {
  image: StaticImageData;
  left: string;
  top: string;
  width: string;
  aspect: string;
};

type StandingCard = {
  label: string;
  count: string;
  pieces: Piece[];
  left: string;
  /** Where the card's bottom edge sits, as a fraction of the plate height. */
  feet: number;
  /** The card's size for its depth, scaled from the bottom edge. */
  scale: number;
  /** How far one unit of eye travel moves this card - depth, per card. */
  drift: string;
  /** Extra rise per scrolled pixel - the same depth, read vertically. */
  lift: string;
  reveal: number;
};

const cards: StandingCard[] = [
  {
    label: "Sports & entertainment",
    count: "(01)",
    pieces: [
      {
        image: sportsFigure,
        left: "25.96%",
        top: "5.69%",
        width: "47.5%",
        aspect: "97 / 135",
      },
    ],
    left: "17.38%",
    feet: 0.8887,
    scale: 1.153,
    drift: "12px",
    lift: "0.08",
    reveal: 7,
  },
  {
    label: "Manufacturing",
    count: "(02)",
    pieces: [
      {
        image: manufacturingFigure,
        left: "-1.47%",
        top: "21.89%",
        width: "102.83%",
        aspect: "252.352 / 109.353",
      },
    ],
    left: "41.71%",
    feet: 1.0917,
    scale: 1.386,
    drift: "16px",
    lift: "0.12",
    reveal: 8,
  },
  {
    label: "Robotics",
    count: "(03)",
    pieces: [
      {
        image: roboticsArmFigure,
        left: "-0.12%",
        top: "3.26%",
        width: "50.71%",
        aspect: "103.554 / 143.242",
      },
      {
        image: roboticsManFigure,
        left: "71.25%",
        top: "47.85%",
        width: "11.2%",
        aspect: "22.87 / 68.61",
      },
    ],
    left: "68.85%",
    feet: 0.8903,
    scale: 1.153,
    drift: "10px",
    lift: "0.06",
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
        sizes="260px"
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
            "--card-feet": card.feet,
            "--card-scale": card.scale,
            "--card-drift": card.drift,
            "--card-lift": card.lift,
          }}
        >
          <header className="bg-paper border-line type-label text-ink flex items-baseline justify-between gap-2 border-b p-3">
            <span>{card.label}</span>
            <span className="type-micro text-muted">{card.count}</span>
          </header>

          <div className={styles.body}>
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
