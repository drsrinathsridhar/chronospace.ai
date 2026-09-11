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
// The subjects are the coloured cutouts, resting desaturated and lifted
// bright: the capture filed in the room's own grey - "pristine white",
// how bright is the client's knob, --figure-brightness in
// src/tuning.config.ts - until the pointer asks about it, when the colour
// comes back with the trail - the film run, not just the frame. On load
// the figures arrive in colour with their trails out and drain to the grey
// as the trails fold (client feedback, round 2: fire the effect once, in
// colour, on arrival). The desaturation is a filter
// (hero-cards.module.css), so the hover trades one filter for none and the
// echoes inherit the same colour for free.
//
// The stand is the anchor: each card's bottom edge is pinned to a fraction
// of the room plate's height (--card-feet), so the frame sits on the floor
// line wherever the viewport puts it, and the whole card scales from that
// bottom edge by its depth (--card-scale). Since feedback round 2 all three
// stand on the same line at the same depth, so the two numbers are the same
// for every card - the mechanism stays per card so a scatter is one edit
// away.
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
// Geometry: one line. All three feet stand on 109.17% of the plate height -
// the floor line the manufacturing capture always stood on, now shared - at
// one scale of 1.3 over a base card of 19.1cqw, the comp's 178.826px at the
// design width grown 1.6x and measured in the site frame's cqw so the
// figures keep their proportion to the room on any display (client
// feedback, round 2: with the centre call to action gone, the figures stand
// in a row and grow a step). The comp's scatter was 17.38%/39.71%/68.85%
// with the flanks a step deeper (feet 95.77%/95.93%, scale 1.153) and the
// centre nearest (1.386). The row keeps its order - robot left, dancer
// right, both client feedback - and is placed by what shows, not by the
// invisible card boxes: the robot's pieces span 0..82% of its body, the
// line -1..101%, the dancer 26..73%, and the 9-degree stances foreshorten
// the flanks, so equal card gaps would read as a row leaning right. Instead
// the three FIGURES are spaced with even gaps (about 6.4cqw; measured
// 96/97px at 1496) and the row of them is centred on the vanishing point
// (49.82%), which puts the manufacturing line's centre at 53.3% - within
// half a percent of where the client had nudged it (2% left of the comp's
// 41.71%). The dancer's box stands 6px off the line's at 1496: the flank
// lefts cannot come closer without the boxes overlapping.
// With every card at the same depth the shift factors are one number:
// physically eyeshift * -z / (P - z) at 30cqw in front of the plate plane,
// with the room's P of 100cqw and its 8cqw / 5.1cqh travel, is -3.5cqw /
// -1.09cqw - but a row front and centre taking the full move reads as
// restless rather than deep, so all three take the calmer fraction the
// centre card already took, and move as one. Below the xl breakpoint the
// row would sit in the headline's lap, so the cards fall into a
// three-column strip above the ruler.

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
    left: "14.7%",
    feet: 1.0917,
    scale: 1.3,
    shiftX: "-1.44cqw",
    shiftY: "-0.45cqw",
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
    left: "40.9%",
    feet: 1.0917,
    scale: 1.3,
    shiftX: "-1.44cqw",
    shiftY: "-0.45cqw",
    /* Facing the viewer squarely, and barely turning with the eye: the
       flanks carry the standing angles. */
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
    left: "66.12%",
    feet: 1.0917,
    scale: 1.3,
    shiftX: "-1.44cqw",
    shiftY: "-0.45cqw",
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
