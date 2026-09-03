import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { A16zSpeedrunIcon } from "@/icons/generated";
import { HeroRoom } from "./hero-room";
import { HeroTimeline } from "./hero-timeline";

// The first screen, and the whole argument in one view: a dark room with the
// claim standing in the middle of it, and the evidence laid out below on a
// timecode ruler - three captures parked at even beats along one timeline.
//
// The vertical rhythm is the comp's, to the pixel, at the 1496px design
// width: 160 below the navbar to the eyebrow, 20 to the headline, 40 to the
// action, 160 to the backing line, 80 to the strip, and 92 from the strip to
// the foot of the section.
//
// Everything arrives on the same band of light, in reading order - see
// `shimmer-reveal` / `sweep-reveal` in globals.css. `--reveal-index` is that
// order; index 0 belongs to the navbar, which leads.

// Two spans rather than one string with a break: each line is picked up by
// the shimmer on its own beat, and the break stays where the comp puts it
// instead of wherever the measure happens to fall.
const headline = [
  "ChronoSpace is building AI",
  "to digitize the physical world.",
];

export function Hero() {
  return (
    <section className="pt-navbar relative flex min-h-svh flex-col overflow-clip">
      <HeroRoom />

      <div className="section-container relative flex flex-col items-center pt-24 text-center md:pt-40">
        <p
          className="type-nav text-muted shimmer-reveal"
          style={{ "--reveal-index": 1, "--shimmer-ink": "var(--muted)" }}
        >
          4D capture infrastructure
        </p>

        <h1 className="type-display-xs sm:type-display-sm lg:type-display-md mt-4 flex max-w-174.5 flex-col md:mt-5">
          {/*
           * `text-balance` only has anything to do below the design width,
           * where a line has to break again: it splits the remainder evenly
           * instead of leaving a single word stranded.
           */}
          {headline.map((line, index) => (
            <span
              key={line}
              className="shimmer-reveal text-balance"
              style={{ "--reveal-index": index + 2 }}
            >
              {line}
            </span>
          ))}
        </h1>

        <CtaLink
          href={siteConfig.links.contact}
          className="sweep-reveal mt-8 md:mt-10"
          style={{ "--reveal-index": 4 }}
        >
          Connect with us
        </CtaLink>

        <div
          className="sweep-reveal mt-20 flex flex-col items-center gap-4 md:mt-40"
          style={{ "--reveal-index": 5 }}
        >
          <p className="type-nav text-muted">Backed by</p>
          <A16zSpeedrunIcon width={170} height={24} className="text-ink" />
        </div>
      </div>

      {/*
       * The strip runs its own choreography - the ruler wipe and the card
       * slides in hero-timeline.module.css - timed off the same reveal clock,
       * so no sweep is layered on top of it here.
       */}
      <div className="section-container relative mt-auto pt-10 pb-10 md:pb-23">
        <HeroTimeline />
      </div>
    </section>
  );
}
