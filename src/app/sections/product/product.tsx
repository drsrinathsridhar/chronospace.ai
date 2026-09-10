import type { StaticImageData } from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import measurablePoster from "./measurable-poster.jpg";
import navigablePoster from "./navigable-poster.jpg";
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
// No chrome around the column (client feedback again): no label strip, no
// border, no padding - the take and its transport stand on the page, and
// the claim hangs straight under them on the plate's own left edge, set to
// comp node 7802:8456: a full-width rule off the transport, the title and
// copy on a 12px gap inside 24px of vertical padding. The label survives in
// the data: it keys the list and names the take in the player's control
// labels.
//
// The header stacks on the centre line like the viewer's and the team's -
// heading and lede on the page's 698px measure, the lede 20 under. The comp
// offsets this one 598/1416 into the content box; the client read that as
// the heading skewed right (feedback, September 2026), so the offset is
// gone and every section header sits the same way. Under it the cards run
// in a full-width row of three on a 22px gap, each plate held at the comp's
// 577/310, on the site-wide 80px header-to-content gap.

type Card = {
  label: string;
  title: string;
  copy: string;
  /** The take, encoded to 960px/30fps H.264 from the client's masters. */
  video: string;
  poster: StaticImageData;
  /** The take's length, for seeking before the metadata arrives. */
  duration: number;
};

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
    duration: 60.06,
  },
];

export function Product() {
  return (
    <section id="product" className="section-container py-section relative">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            One capture, three things nobody else can hand you
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-115 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            For anyone training models on the physical world, the capture itself
            is the asset.
          </p>
        </div>

        <div className="mt-section-gap grid grid-cols-1 gap-5.5 md:grid-cols-3">
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
              />

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
