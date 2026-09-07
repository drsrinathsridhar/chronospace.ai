import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { HeroCards } from "./hero-cards";
import { HeroRoom } from "./hero-room";
import { HeroTimeline } from "./hero-timeline";

// The first screen, and the whole argument in one view: a dark room with the
// claim standing in the middle of it and the evidence standing inside it -
// three framed captures on the room's own floor, each figure open to the
// room behind it (hero-cards.tsx) - and the timecode ruler underlining the
// whole screen at its foot.
//
// The vertical rhythm is the comp's, to the pixel, at the 1496px design
// width: 104 below the navbar to the eyebrow, 20 to the headline, 40 to the
// action - the whole stack pulled up so the manufacturing capture can stand
// clear of it - and the ruler flush with the foot. The backing marks left
// the hero for the band directly under it (sections/backers), so the stack
// ends at the call to action.
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
  // Padded by the navbar's resting height, not its live one: the bar
  // tightens on scroll, and tracking that here would shift the whole hero
  // 12px the moment the page moves.
  return (
    <section className="pt-navbar-rest relative flex min-h-svh flex-col overflow-clip">
      <HeroRoom />

      <div className="section-container relative flex flex-col items-center pt-24 text-center md:pt-26">
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
      </div>

      {/*
       * The captures. At xl they stand on the room's floor at the comp's
       * positions and drift with the pointer; below that they fall into a
       * strip here, between the copy and the ruler.
       */}
      <HeroCards />

      <div className="section-container relative mt-auto pt-10 pb-2">
        <HeroTimeline />
      </div>
    </section>
  );
}
