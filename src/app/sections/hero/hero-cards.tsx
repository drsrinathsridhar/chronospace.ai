import Image from "next/image";
import { media } from "@/media.config";
import styles from "./hero-cards.module.css";
import { HeroPager } from "./hero-pager.client";

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
// as the trails fade (client feedback, round 2: fire the effect once, in
// colour, on arrival). The desaturation is a filter
// (hero-cards.module.css), so the hover trades one filter for none and the
// trail, a copy of the same pieces, inherits the same colour for free.
//
// The stand is the anchor: cards scale from their feet on the room's floor
// line. The base width is capped by the scene height so the copy, funders,
// and footer can share one viewport without clipping the captures.
//
// Two kinds of motion, both defined in hero-cards.module.css:
//
//   The move. The cards ride the same eye the room does, at the same speed
//   (--float-x/y, written by hero-room-eye.client.tsx on the room's own
//   clock), each scaled by the parallax factor at its depth - so the cards
//   move exactly as the room's geometry moves, standing in it rather than
//   floating over it.
//
//   The trail. One more copy of the pieces stands behind the subject and
//   in front of the shadow: the motion smear - stretched back along the
//   figure's travel from its leading edge, blurred along that axis by an
//   SVG filter and faded to nothing along the tail, its length breathing
//   with the eye's speed (--eye-speed from hero-room-eye.client.tsx). On
//   arrival it is out and fades; hovering a card, or its turn in the round
//   robin, brings it back. It replaced three stepped copies at falling
//   opacities that the client read as "very extra" (feedback round 3, slide
//   3) - and as three more full-size image decodes per figure. The client's
//   knobs for it - smear or the logo's flare, true colour or a brand flood,
//   length, blur, opacity - are `heroTrail` in src/tuning.config.ts; the
//   layer is lazy and asks for half the subject's resolution, being
//   blurred anyway.
//
// All three captures share a floor line 3rem above the ruler. Their visible
// centres sit at 18.58%, 50%, and 80% of the frame; centring on the pieces
// keeps those positions stable when height limits the card width. The base
// room width is 19.1cqw, with depth scales 1.5 / 1.45 / 1.22 to preserve the
// approved relative sizes of the robot, manufacturing cell, and dancer.
//
// With every card at the same depth the shift factors are one number:
// physically eyeshift * -z / (P - z) at 30cqw in front of the plate plane,
// with the room's P of 100cqw and its 8cqw / 5.1cqh travel, is -3.5cqw /
// -1.09cqw - but a row front and centre taking the full move reads as
// restless rather than deep, so all three take the calmer fraction the
// centre card already took, and move as one.
//
// Below the xl breakpoint the row would sit in the headline's lap, so
// between md and xl the cards fall into a three-column strip above the
// ruler. Below md (48rem) even the strip was three figures ~111px wide at
// 390 - "too tiny" (client feedback, round 3, slide 8a: "one asset
// centred, swipe to move between them") - so there the cards are slides
// in a scroll-snap carousel: each `.slide` wrapper is one viewport wide,
// the card standing centred at its foot, and the whole strip stands on
// the room's floor line with its feet where the room's would be. The
// wrappers are `display: contents` from md up, so the strip and the room
// see the cards as their direct children as before. Sizes keep the room's
// 1.5 / 1.45 / 1.22 over a 56cqw base (hero-cards.module.css has the
// numbers), and a card is centred on what shows rather than on its box:
// `centre` is the middle of its pieces' span - the robot's arm and man run
// -0.12..73.6%, so 36.74%; the line 9.45..90.55%, 50%; the dancer
// 24.92..74.5%, 49.71% - and the CSS translates the card by 50% minus
// that. The pager under the floor is hero-pager.client.tsx, rendered here
// beside the strip so it is neither clipped nor scrolled by it.

type Piece = {
  /** Public path of the cutout - see media.config.ts. */
  image: string;
  left: string;
  width: string;
  aspect: string;
};

type StandingCard = {
  /** Names the capture: the slide's accessible label, and the list key. */
  label: string;
  pieces: Piece[];
  left: string;
  /** The middle of the pieces' visible span, as a fraction of the card -
      what the carousel centres on the screen. */
  centre: string;
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
    left: "18.58%",
    centre: "36.74%",
    feet: 1.0917,
    scale: 1.5,
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
    left: "50%",
    centre: "50%",
    feet: 1.0917,
    scale: 1.45,
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
    left: "80%",
    centre: "49.71%",
    feet: 1.0917,
    scale: 1.22,
    shiftX: "-1.44cqw",
    shiftY: "-0.45cqw",
    tilt: "-9deg",
    tiltGain: "3.2deg",
    reveal: 9,
  },
];

// What a piece draws at, for the browser's choice of image variant, one
// term per layout (hero-cards.module.css). In the room (80rem up) a card is
// 19.1cqw wide times its scale, and the piece a fraction of that; the site
// frame caps at 2560px, so cqw is vw for this purpose, and a tenth on top
// rounds the hint up rather than down. In the strip (48 to 80rem) the cards
// cap at 178.826px each. In the carousel below md a card is 56cqw times its
// scale, again a viewport fraction - the cell's piece draws at about 66vw.
// The old hint was 30vw for every piece - two to six times what the small
// ones draw at, so the browser fetched the wrong variant for all of them.
// `detail` scales the hint for a copy that need not be sharp: the trail is
// blurred along its length, so half the subject's resolution is plenty.
const roomCardVw = 19.1;
const stripCardPx = 179;
const slideCardVw = 56;

function pieceSizes(piece: Piece, scale: number, detail: number) {
  const fraction = (parseFloat(piece.width) / 100) * detail;
  const room = Math.ceil(roomCardVw * scale * fraction * 1.1);
  const strip = Math.ceil(stripCardPx * fraction);
  const slide = Math.ceil(slideCardVw * scale * fraction * 1.1);
  return `(min-width: 80rem) ${room}vw, (min-width: 48rem) ${strip}px, ${slide}vw`;
}

function Pieces({
  pieces,
  scale,
  priority = false,
  eager = false,
  detail = 1,
  highQuality = false,
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
  /**
   * Fetched with the document but not preloaded: the second and third
   * captures on a phone, where only the first slide is on screen at the
   * first paint and four preloads were racing it for the connection.
   */
  eager?: boolean;
  /** Fraction of the drawn width to ask the variant for - see pieceSizes. */
  detail?: number;
  /** Preserve detail on the foreground; the shadow and smear stay cheaper. */
  highQuality?: boolean;
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
        sizes={pieceSizes(piece, scale, detail)}
        quality={highQuality ? 90 : undefined}
        priority={priority}
        loading={eager && !priority ? "eager" : undefined}
        fetchPriority={priority ? "high" : undefined}
        className="object-cover"
      />
    </span>
  ));
}

export function HeroCards() {
  // The group's role and description name the strip for a screen reader
  // ("Captures, carousel") and each slide by its capture; from md up the
  // same markup is the strip and the room, where the description is a
  // little more than the truth but nothing is wrong or unreachable - the
  // layouts are one set of markup styled three ways, so the markup has to
  // serve the one that needs the most.
  return (
    <>
      <div
        className={styles.cards}
        data-float
        role="group"
        aria-roledescription="carousel"
        aria-label="Captures"
      >
        {cards.map((card, index) => (
          <div key={card.label} className={styles.slide}>
            <article
              className={styles.card}
              aria-label={card.label}
              style={{
                "--reveal-index": card.reveal,
                "--card-left": card.left,
                "--card-centre": card.centre,
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
               * figure is what the eye expects, and two would read as a puddle.
               *
               * The reveal is split: the body takes the sweep, but the sweep's
               * mask clips its element to its own box, and the shadow lies
               * entirely outside the card's - so the shadow arrives by plain
               * opacity on the same beat instead (hero-cards.module.css).
               *
               * The trail sits on the card for the same reason: its tail runs
               * out past the body's edge (the robot arm stands at the body's
               * very left, so a tail inside the body would be cut off whole),
               * and the body's overflow clip and sweep mask would take it. The
               * outer span is what the blur filter measures itself against and
               * what fades; the inner box keeps the card's own width for the
               * pieces, whatever the blur knob makes of the outer
               * (hero-cards.module.css explains the two).
               */}
              <span aria-hidden className={styles.shadow}>
                <Pieces pieces={card.pieces} scale={card.scale} />
              </span>

              <span aria-hidden className={styles.trail}>
                <span className={styles.trailBox}>
                  <Pieces
                    pieces={card.pieces}
                    scale={card.scale}
                    detail={0.5}
                  />
                </span>
              </span>

              <div className={`${styles.body} sweep-reveal`}>
                <span className={styles.subject}>
                  <Pieces
                    pieces={card.pieces}
                    scale={card.scale}
                    priority={index === 0}
                    eager
                    highQuality
                  />
                </span>
              </div>
            </article>
          </div>
        ))}
      </div>

      <HeroPager labels={cards.map((card) => card.label)} />
    </>
  );
}
