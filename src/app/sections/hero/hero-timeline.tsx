import type { StaticImageData } from "next/image";
import { TimelineTickIcon } from "@/icons/generated";
import { HeroTimelineVideo } from "./hero-timeline-video.client";
import manufacturingPoster from "./manufacturing-poster.jpg";
import roboticsPoster from "./robotics-poster.jpg";
import sportsPoster from "./sports-poster.jpg";
import styles from "./hero-timeline.module.css";

// The evidence, laid out on a timecode ruler: three captures - a stage, a
// line, a cell - parked at even beats along one timeline, the way frames sit
// on a scrubber. The ruler is drawn left to right like a playhead sweeping
// through the take, and each card slides in from the ruler's origin to its
// beat - see hero-timeline.module.css for the choreography.
//
// Geometry is the comp's at the 1496px design width: a 1416px track with
// 178.826x180 cards whose centres land on 25/50/75% of it. Every plate is
// placed as fractions of the card body, so the whole strip scales off one
// width.

type TimelineCard = {
  label: string;
  count: string;
  // The looping capture, served from /public, and its poster - the first
  // frame of the same take, so reduced motion holds a true still of it.
  video: string;
  poster: StaticImageData;
  // The comp crops each plate differently; offsets and widths are fractions
  // of the card body, heights follow from the plate's own aspect ratio.
  plate: { left: string; top: string; width: string; aspect: string };
  // How far the card rides along the track, in container (track) widths -
  // exactly its final centre, so every card sets off from the origin.
  travel: string;
  // Staggered so arrivals read left to right, the last card landing as the
  // ruler finishes drawing.
  duration: string;
};

const cards: TimelineCard[] = [
  {
    label: "Entertainment",
    count: "(01)",
    video: "/videos/sports.mp4",
    poster: sportsPoster,
    plate: {
      left: "0.25%",
      top: "-50%",
      width: "100.2%",
      aspect: "768 / 1024",
    },
    travel: "25cqw",
    duration: "0.7s",
  },
  {
    label: "Manufacturing",
    count: "(01)",
    video: "/videos/manufacturing.mp4",
    poster: manufacturingPoster,
    plate: {
      left: "-0.4%",
      top: "-50%",
      width: "101.5%",
      aspect: "768 / 1024",
    },
    travel: "50cqw",
    duration: "0.95s",
  },
  {
    label: "Robotics",
    count: "(01)",
    video: "/videos/robotics.mp4",
    poster: roboticsPoster,
    // The robotics take is 3:4 where the comp's still was wider, so the crop
    // is retuned to hold the same band - arm and observer, floor and
    // skylight trimmed alike.
    plate: {
      left: "-1.35%",
      top: "-52%",
      width: "109.2%",
      aspect: "768 / 1024",
    },
    travel: "75cqw",
    duration: "1.2s",
  },
];

export function HeroTimeline() {
  return (
    <div className={styles.strip}>
      {/* The ruler is decorative HUD chrome; the cards carry the content. */}
      <div aria-hidden className={styles.timecode}>
        <div
          className="type-caption sweep-reveal flex items-center justify-between"
          style={{ "--reveal-index": 6 }}
        >
          <p className="text-line flex items-center gap-4">
            <span>Timecode</span>
            <span>00:00:14:07</span>
          </p>
          <p className="bg-paper text-ink flex items-center gap-4 px-2">
            <span className="bg-ink size-0.5" />
            <span>Scrub</span>
          </p>
        </div>

        {/*
         * The track: accent corner ticks marking the origin, one measured
         * unit 111px in, and the far end; hairline rules between. The whole
         * row is revealed by a left-to-right clip wipe - the playhead pass.
         */}
        <div className={styles.track}>
          <TimelineTickIcon
            width={5.5}
            height={5.5}
            className="text-accent shrink-0"
          />
          <span className={`${styles.rule} ${styles.ruleShort}`} />
          <TimelineTickIcon
            width={5.5}
            height={5.5}
            className="text-accent shrink-0 -scale-x-100"
          />
          <span className={`${styles.rule} ${styles.ruleLong}`} />
          <TimelineTickIcon
            width={5.5}
            height={5.5}
            className="text-accent shrink-0 -scale-x-100"
          />
        </div>
      </div>

      <ul className={styles.cards}>
        {cards.map((card) => (
          <li
            key={card.label}
            className={styles.card}
            style={{
              "--card-travel": card.travel,
              "--card-duration": card.duration,
            }}
          >
            <header className="bg-paper border-line type-label text-ink flex items-baseline justify-between gap-2 border-b p-3">
              <span>{card.label}</span>
              <span className="type-micro text-muted">{card.count}</span>
            </header>

            <div className={styles.body}>
              <div
                className={styles.plate}
                style={{
                  "--plate-left": card.plate.left,
                  "--plate-top": card.plate.top,
                  "--plate-width": card.plate.width,
                  "--plate-aspect": card.plate.aspect,
                }}
              >
                <HeroTimelineVideo
                  src={card.video}
                  poster={card.poster.src}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
