import type { ReactNode } from "react";
import { RevealScope } from "@/components/reveal-scope.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import { media } from "@/media.config";
import type { Take } from "@/media.config";

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
// The third take is the client's own pick for the queryable claim
// (feedback round 2, slide 5: `girls-dancing.mp4`, encoded to 960x540 at
// 30 fps as /media/product/queryable.mp4 - the first slot under the new
// media root, the rest move later). It carries only a static HUD in the
// plate's bottom-left corner, with readings true for this take: the frames
// it keeps and the length of its loop as a timecode. The measurement
// overlay the previous take ran - a bracket and a floor line keyed to that
// 18 s clip's frames - would fire on the wrong frames over a 3.2 s loop, so
// it is off this card until the client confirms the clip and the marks can
// be re-timed against it (plan decision D6).
//
// No chrome around the column (client feedback again): no label strip, no
// border, no padding - the take stands on the page with its controls on
// the picture, and the claim hangs straight under it on the plate's own
// left edge, set to comp node 7802:8456: a full-width rule off the plate,
// the title and copy on a 12px gap inside 24px of vertical padding. The
// label survives in the data: it keys the list and names the take in the
// player's control labels.
//
// The header stacks on the centre line like the viewer's and the team's -
// heading and lede on the page's 698px measure, the lede 20 under. The comp
// offsets this one 598/1416 into the content box; the client read that as
// the heading skewed right (feedback, September 2026), so the offset is
// gone and every section header sits the same way. Under it the cards run
// in a full-width row of three on the page-wide 40px panel gap, each plate held at the comp's
// 577/310, on the site-wide 80px header-to-content gap.

type Card = {
  label: string;
  title: string;
  copy: string;
  /** The take, its poster and its length - a slot in media.config.ts. */
  take: Take;
  /** Readings drawn over the take, inside the player's frame. */
  overlay?: ReactNode;
};

// The static HUD on the queryable take: what this 3.2 s loop at 30 fps
// keeps, its cycle as a timecode, and the claim - any t.
const queryableReadings: [string, string][] = [
  ["Frames kept", "96"],
  ["Cycle", "00:00:03:06"],
  ["Timebase", "Any t"],
];

const cards: Card[] = [
  {
    label: "Captured in the wild",
    title: "No stage required",
    copy: "Real environments, indoors and out, over long durations. No controlled lighting, no bringing the subject to a studio. Everyone else needs one.",
    take: media.product.wild,
  },
  {
    label: "Navigable in 4D",
    title: "Any viewpoint, any moment",
    copy: "Geometry you can move through at full environment scale, at whatever instant you need - not a fixed camera you have to accept.",
    take: media.product.navigable,
  },
  {
    label: "Measurable afterwards",
    title: "The scene stays queryable",
    copy: "A finished capture streams like ordinary video and answers questions inside it - distance travelled, cycle duration, whether a line was crossed.",
    take: media.product.queryable,
    overlay: (
      <dl className="type-caption absolute bottom-2.5 left-2.5 flex w-42.75 max-w-[calc(50%-1rem)] flex-col gap-1">
        {queryableReadings.map(([term, value]) => (
          <div key={term} className="flex items-center justify-between gap-4">
            <dt className="text-muted">{term}</dt>
            <dd className="text-ink text-right">{value}</dd>
          </div>
        ))}
      </dl>
    ),
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
            className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            For anyone training models on the physical world, the capture itself
            is the asset.
          </p>
        </div>

        <div className="mt-section-gap gap-panel grid grid-cols-1 md:grid-cols-3">
          {cards.map((card, index) => (
            <article
              key={card.label}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              <TimelinePlayer
                src={card.take.src}
                poster={card.take.poster}
                fallbackDuration={card.take.duration}
                fps={card.take.fps}
                camera={card.take.camera}
                cameraFlip={card.take.cameraFlip}
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
