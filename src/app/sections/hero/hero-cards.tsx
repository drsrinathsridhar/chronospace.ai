import Image from "next/image";
import { media } from "@/media.config";
import styles from "./hero-cards.module.css";

// The three captures, standing in the room. No frame, no label - each card
// is just an invisible measured window with the subject standing in it, so
// the room shows straight through and the figure reads as standing inside
// it rather than printed on a card.
//
// The subjects are the coloured cutouts, resting desaturated and lifted
// bright: the capture filed in the room's own grey - "pristine white",
// how bright and how crisp are the client's knobs, --figure-brightness and
// --figure-contrast in src/tuning.config.ts - until the pointer asks about it, when the colour
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
// the floor line the manufacturing capture always stood on, now shared -
// over a base card of 19.1cqw, the comp's 178.826px at the design width
// grown 1.6x and measured in the site frame's cqw so the figures keep their
// proportion to the room on any display (client feedback, round 2: with
// the centre call to action gone, the figures stand in a row and grow a
// step). The scales are per card - 1.75 / 1.73 / 1.08 - chosen so the
// PEOPLE in the three pictures stand at one height (owner's request, 11
// Sep 2026): the robotics figure is a small man beside a large arm, the
// manufacturing workers fill about 55% of their frame under the gantry, and the dancer
// fills hers, so equal card scales gave three different people. The comp's
// scatter was 17.38%/39.71%/68.85% with the flanks a step deeper (feet
// 95.77%/95.93%, scale 1.153) and the centre nearest (1.386). The row keeps
// its order - robot left, dancer right, both client feedback - and is
// placed by what shows, not by the invisible card boxes: the robot's pieces
// span 0..82% of its body, the line -1..101%, the dancer 26..73%, and the
// 9-degree stances foreshorten the flanks. The flanks stand at 8.3% /
// 76.5%, the line at 40.9% (its centre a little right of the vanishing
// point, where the client had nudged it): the robot's box clears the
// line's at 1496 by a hair - it cannot come closer without the boxes
// overlapping - and the dancer's smaller box sits where her figure stood
// before. Measured at 1496: the robotics man 162px tall, the workers about
// 167, the dancer's body about 175 (212 to the raised hand).
// With every card at the same depth the shift factors are one number:
// physically eyeshift * -z / (P - z) at 30cqw in front of the plate plane,
// with the room's P of 100cqw and its 8cqw / 5.1cqh travel, is -3.5cqw /
// -1.09cqw - but a row front and centre taking the full move reads as
// restless rather than deep, so all three take the calmer fraction the
// centre card already took, and move as one. Below the xl breakpoint the
// row would sit in the headline's lap, so the cards fall into a
// three-column strip above the ruler.

type Piece = {
  /** Public path of the cutout - see media.config.ts. */
  image: string;
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
      // The client's new arm and worker (11 Sep 2026), each cropped to its
      // opaque bounds, so the aspects are the files' own pixel ratios. The
      // worker's width is set for his height: 34.6% of the card, which
      // puts him level with the manufacturing workers and the dancer.
      {
        image: media.hero.roboticsArm,
        left: "-0.12%",
        width: "50.71%",
        aspect: "613 / 854",
      },
      {
        image: media.hero.roboticsMan,
        left: "64%",
        width: "9.6%",
        aspect: "161 / 579",
      },
    ],
    left: "8.3%",
    feet: 1.0917,
    scale: 1.75,
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
        // The client's manufacturing scene (14 Sep 2026): two workers at a
        // machine under a gantry crane, cropped to its opaque bounds, so
        // the aspect is the file's own pixel ratio. Narrower than the
        // first cut of the scene (the pallet is gone), so the piece takes
        // 81% of the card, centred, to keep the workers at the height the
        // scale was set for.
        image: media.hero.manufacturing,
        left: "9.45%",
        width: "81.1%",
        aspect: "1232 / 923",
      },
    ],
    left: "40.9%",
    feet: 1.0917,
    scale: 1.73,
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
      // The dancer at the file's own pixel ratio (864x1152 = 0.750). She
      // was declared 97/135 (0.7185) and object-cover took 4% off her
      // sides; the width grew by the same ratio and the left edge gave up
      // half the difference, so she stands as tall and as centred as before
      // with nothing cropped (client feedback, round 3, slide 2).
      {
        image: media.hero.sports,
        left: "24.92%",
        width: "49.58%",
        aspect: "864 / 1152",
      },
    ],
    left: "76.5%",
    feet: 1.0917,
    scale: 1.08,
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

// What a piece draws at, for the browser's choice of image variant. In the
// room (80rem up) a card is 19.1cqw wide (hero-cards.module.css) times its
// scale, and the piece a fraction of that; the site frame caps at 2560px,
// so cqw is vw for this purpose, and a tenth on top rounds the hint up
// rather than down. In the strip below, the cards cap at 178.826px each.
// The old hint was 30vw for every piece - two to six times what the small
// ones draw at, so the browser fetched the wrong variant for all of them.
const roomCardVw = 19.1;
const stripCardPx = 179;

function pieceSizes(piece: Piece, scale: number) {
  const fraction = parseFloat(piece.width) / 100;
  const room = Math.ceil(roomCardVw * scale * fraction * 1.1);
  const strip = Math.ceil(stripCardPx * fraction);
  return `(min-width: 80rem) ${room}vw, ${strip}px`;
}

function Pieces({
  pieces,
  scale,
  priority = false,
}: {
  pieces: Piece[];
  /** The card's --card-scale, which the drawn width depends on. */
  scale: number;
  /**
   * The visible figure is the first screen's largest paint, so it is
   * fetched first and preloaded; the shadow and the trail are copies of the
   * same file and ride on its cache. Next 16 keeps the fetch priority a
   * separate prop from `priority` (eager load plus preload), so both are
   * set from this one flag.
   */
  priority?: boolean;
}) {
  return pieces.map((piece) => (
    <span
      key={piece.image}
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
        sizes={pieceSizes(piece, scale)}
        priority={priority}
        fetchPriority={priority ? "high" : undefined}
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
            <Pieces pieces={card.pieces} scale={card.scale} />
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
                <Pieces pieces={card.pieces} scale={card.scale} />
              </span>
            ))}

            <span className={styles.subject}>
              <Pieces pieces={card.pieces} scale={card.scale} priority />
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
