import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { MeasureOverlay } from "@/components/measure-overlay.client";
import { RevealScope } from "@/components/reveal-scope.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import { measurableChips, measurableMarks } from "./measurable-marks";
import measurablePoster from "./measurable-poster.jpg";
import navigablePoster from "./navigable-poster.jpg";
import styles from "./product.module.css";
import wildPoster from "./wild-poster.jpg";

// The product: the intro's argument split into the three properties a
// capture actually ships with - taken in the wild, navigable in 4D,
// measurable afterwards - one column each, all built the same way: the
// evidence take on top, the claim directly under it.
//
// The evidence plates are takes, not stills (client feedback): each column
// runs a short capture in the compact build of the shared timeline player -
// the same instrument as the viewer below, same luminosity blend over the
// same paper. The takes wait for the scroll: preload="none" and
// play-on-arrival, so three videos in a row cost nothing until the section
// shows.
//
// The third take proves its claim on the picture (client feedback, item
// 10): the measurement overlay shared with the viewer stands a height
// bracket on the dancer, lays a floor line that turns accent the moment a
// foot crosses it, and tokenises the frame once per loop. Its export also
// carries two burned-in tool graphics - a mode label and a heat-map strip -
// which sit under two chips of page ground holding our own HUD.
// TODO(client): a clean export of measurable.mp4 without the burned-in
// graphics removes the need for the chips.
//
// No chrome around the column (client feedback again): no label strip, no
// border, no padding - the take and its transport stand on the page, and
// the claim hangs straight under them on the plate's own left edge, set to
// comp node 7802:8456: a full-width rule off the transport, the title and
// copy on a 12px gap inside 24px of vertical padding. The label survives in
// the data: it keys the list and names the take in the player's control
// labels.
//
// Geometry is the comp's at the 1496px design width: the heading and lede
// 598/1416 into the content box on the section's shared 698px measure, and
// the cards in a full-width row of three on a 22px gap, each plate held at
// the comp's 577/310.

type Card = {
  label: string;
  title: string;
  copy: string;
  /** The take, encoded to 960px/30fps H.264 from the client's masters. */
  video: string;
  poster: StaticImageData;
  /** The take's length, for seeking before the metadata arrives. */
  duration: number;
  /** Readings drawn over the take, inside the player's frame. */
  overlay?: ReactNode;
};

// The static HUD on the queryable take: what a long-duration capture at
// 30x keeps, and the two readings its loop stands for.
const queryableReadings: [string, string][] = [
  ["Frames kept", "540"],
  ["Cycle", "00:00:18:00"],
  ["Timebase", "Any t"],
];

const cards: Card[] = [
  {
    label: "Captured in the wild",
    title: "No stage required",
    copy: "Real environments, indoors and out, over long durations. No controlled lighting, no bringing the subject to a studio. Everyone else needs one.",
    video: "/videos/wild.mp4",
    poster: wildPoster,
    duration: 27.04,
  },
  {
    label: "Navigable in 4D",
    title: "Any viewpoint, any moment",
    copy: "Geometry you can move through at full environment scale, at whatever instant you need - not a fixed camera you have to accept.",
    video: "/videos/navigable.mp4",
    poster: navigablePoster,
    duration: 18.78,
  },
  {
    label: "Measurable afterwards",
    title: "The scene stays queryable",
    copy: "A finished capture streams like ordinary video and answers questions inside it - distance travelled, cycle duration, whether a line was crossed.",
    video: "/videos/measurable.mp4",
    poster: measurablePoster,
    duration: 18,
    overlay: (
      <MeasureOverlay
        tokenise
        marks={[
          ...measurableMarks,
          {
            kind: "chip",
            id: "mode",
            ...measurableChips.mode,
            children: (
              <p className="type-caption text-muted flex h-full items-center px-2">
                Long duration · 30×
              </p>
            ),
          },
          {
            kind: "chip",
            id: "readings",
            ...measurableChips.readings,
            children: (
              <dl className="type-caption flex h-full flex-col justify-center gap-1 px-2">
                {queryableReadings.map(([term, value]) => (
                  <div
                    key={term}
                    className="flex items-center justify-between gap-2"
                  >
                    <dt className="text-muted">{term}</dt>
                    <dd className="text-ink text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            ),
          },
        ]}
      />
    ),
  },
];

export function Product() {
  return (
    <section id="product" className="section-container relative pt-27 pb-30">
      <RevealScope>
        <div className={styles.column}>
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in text-balance"
            style={{ "--beat": 0 }}
          >
            One capture, three things nobody else can hand you
          </h2>
          <p
            className="type-body-xl shimmer-in mt-6 max-w-115 opacity-60"
            style={{ "--beat": 1 }}
          >
            For anyone training models on the physical world, the capture itself
            is the asset.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-5.5 md:mt-38 md:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.label}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              <TimelinePlayer
                src={card.video}
                poster={card.poster.src}
                fallbackDuration={card.duration}
                aspect="577 / 310"
                name={`the ${card.label.toLowerCase()} take`}
                compact
                preload="none"
              >
                {card.overlay}
              </TimelinePlayer>

              <div className="border-line flex flex-col gap-3 border-t py-6">
                <h3 className="type-title-lg">{card.title}</h3>
                <p className="type-body-lg leading-tight font-light">
                  {card.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
