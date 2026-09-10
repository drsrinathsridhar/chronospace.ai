import Image from "next/image";
import type { StaticImageData } from "next/image";
import manufacturingSubject from "./manufacturing-subject.png";
import roboticsArm from "./robotics-arm.png";
import roboticsMan from "./robotics-man.png";
import sportsSubject from "./sports-subject.png";
import styles from "./hero-cards.module.css";

// The three captures, standing in the room. No frame, no label - each card
// is just an invisible measured window with the subject standing in it, so
// the room shows straight through and the figure reads as standing inside
// it rather than printed on a card.
//
// The subjects are the coloured cutouts, resting desaturated: the capture
// filed in the room's own grey until the pointer asks about it, when the
// colour comes back with the trail - the film run, not just the frame. The
// desaturation is a filter (hero-cards.module.css), so the hover trades one
// filter for none and the echoes inherit the same colour for free.
//
// The stand is the anchor: each card's bottom edge is pinned to a fraction
// of the room plate's height (--card-feet), so the frame sits on the floor
// line wherever the viewport puts it, and the whole card scales from that
// bottom edge by its depth (--card-scale) - the manufacturing line stands
// nearest and largest, the two flanking captures a step further in.
//
// Two kinds of motion, both defined in hero-cards.module.css:
//
//   The move. The cards ride the same eye the room does, at the same speed
//   (--float-x/y, written by hero-room-eye.client.tsx on the room's own
//   clock), each scaled by the parallax factor at its depth - so the cards
//   move exactly as the room's geometry moves, standing in it rather than
//   floating over it.
//
//   The echo. On arrival each subject carries its motion trail - offset
//   copies at falling opacities, the reference build's dancer trail - which
//   then collapses copy by copy into the single figure. Hovering a card
//   replays it: the trail grows back out, and folds away again on leave,
//   always staggered.
//
// Geometry is the comp's at 1496: cards on 17.38%/39.71%/68.85% - the
// manufacturing line nudged 2% left of the comp's 41.71% on client
// feedback, and the flanking captures swapped (robot left, dancer right,
// also client feedback) while keeping the comp's slot geometry - with their
// feet at 95.77%/109.17%/95.93% of the plate height - the flanking pair
// dropped 50px from the comp to sit deeper into the floor - and scales of
// 1.153/1.386/1.153 over a base card of 19.1cqw, the comp's 178.826px at
// the design width grown 1.6x and measured in viewport units so the
// figures keep their proportion to the room on any display. The shift factors keep
// the comp's original depths: eyeshift * -z / (P - z) with the room's P of
// 100cqw and its 8cqw / 5.1cqh eye travel, the flanking captures about
// 58cqw into the room and the manufacturing line 30cqw in front of the
// plate plane. Below the xl breakpoint the scatter would collide with the
// headline, so the cards fall into a three-column strip above the ruler.

type Piece = {
  image: StaticImageData;
  left: string;
  width: string;
  aspect: string;
};

type StandingCard = {
  /** Not rendered - names the capture in the data and keys the list. */
  label: string;
  pieces: Piece[];
  left: string;
  /** Where the card's bottom edge sits, as a fraction of the plate height. */
  feet: number;
  /** The card's size for its depth, scaled from the bottom edge. */
  scale: number;
  /** One unit of eye travel at this card's depth, per axis. */
  shiftX: string;
  shiftY: string;
  /** The standing angle: turned toward the vanishing point, like its wall. */
  tilt: string;
  /** How many degrees one unit of eye travel adds to the tilt. */
  tiltGain: string;
  reveal: number;
};

const cards: StandingCard[] = [
  {
    label: "Robotics",
    pieces: [
      {
        image: roboticsArm,
        left: "-0.12%",
        width: "50.71%",
        aspect: "103.554 / 143.242",
      },
      {
        image: roboticsMan,
        left: "71.25%",
        width: "11.2%",
        aspect: "22.87 / 68.61",
      },
    ],
    left: "17.38%",
    feet: 0.9577,
    scale: 1.3,
    shiftX: "2.98cqw",
    shiftY: "0.93cqw",
    tilt: "9deg",
    tiltGain: "3.2deg",
    reveal: 7,
  },
  {
    label: "Manufacturing",
    pieces: [
      {
        image: manufacturingSubject,
        left: "-1.47%",
        width: "102.83%",
        aspect: "252.352 / 109.353",
      },
    ],
    left: "39.71%",
    feet: 1.0917,
    scale: 1.386,
    // Physically this card, nearest of the three, would take the biggest
    // move (-3.5cqw / -1.09cqw at its depth) - but front and centre, the
    // full value reads as restless rather than deep, so it takes a calmer
    // fraction of it and barely turns.
    shiftX: "-1.44cqw",
    shiftY: "-0.45cqw",
    tilt: "0deg",
    tiltGain: "1.28deg",
    reveal: 8,
  },
  {
    label: "Sports & entertainment",
    pieces: [
      {
        image: sportsSubject,
        left: "25.96%",
        width: "47.5%",
        aspect: "97 / 135",
      },
    ],
    left: "68.85%",
    feet: 0.9593,
    scale: 1.3,
    shiftX: "2.93cqw",
    shiftY: "0.91cqw",
    tilt: "-9deg",
    tiltGain: "3.2deg",
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
        "--piece-width": piece.width,
        "--piece-aspect": piece.aspect,
      }}
    >
      <Image
        src={piece.image}
        alt=""
        fill
        sizes="(min-width: 80rem) 30vw, 180px"
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
          className={styles.card}
          style={{
            "--reveal-index": card.reveal,
            "--card-left": card.left,
            "--card-feet": card.feet,
            "--card-scale": card.scale,
            "--card-shift-x": card.shiftX,
            "--card-shift-y": card.shiftY,
            "--card-tilt": card.tilt,
            "--card-tilt-gain": card.tiltGain,
          }}
        >
          {/*
           * The faked floor shadow: one more copy of the subject, flipped
           * about the feet line and squashed onto the floor - blackened,
           * blurred and fading as it reaches toward the viewer
           * (hero-cards.module.css). The trail gets no shadow: one per
           * figure is what the eye expects, and three would read as a
           * puddle.
           *
           * The reveal is split: the body takes the sweep, but the sweep's
           * mask clips its element to its own box, and the shadow lies
           * entirely outside the card's - so the shadow arrives by plain
           * opacity on the same beat instead (hero-cards.module.css).
           */}
          <span aria-hidden className={styles.shadow}>
            <Pieces pieces={card.pieces} />
          </span>

          <div className={`${styles.body} sweep-reveal`}>
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
