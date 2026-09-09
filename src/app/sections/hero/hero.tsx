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
// width: 104 below the navbar to the headline, 40 to the action - the whole
// stack pulled up so the manufacturing capture can stand clear of it - and
// the ruler flush with the foot. The backing marks left
// the hero for the band directly under it (sections/backers): the hero
// yields exactly the band's height of the viewport, so hero + band close
// the first screen together, with the ruler as the band's top border.
//
// Everything arrives on the same band of light, in reading order - see
// `shimmer-reveal` / `sweep-reveal` in globals.css. `--reveal-index` is that
// order; index 0 belongs to the navbar, which leads.

// Two spans rather than one string with a break: each line is picked up by
// the shimmer on its own beat, and the break stays where the comp puts it
// instead of wherever the measure happens to fall.
const headline = ["ChronoSpace builds AI", "to digitize the physical world."];

export function Hero() {
  // Padded by the navbar's resting height, not its live one: the bar
  // tightens on scroll, and tracking that here would shift the whole hero
  // 12px the moment the page moves.
  //
  // The height is the viewport minus the backing band, so hero + band close
  // the first screen together - floored by what the room needs: the deepest
  // capture stands at 109.17% of the 48.4vw plate (hero-cards.module.css),
  // 52.84vw, plus clearance for the ruler at the foot. On viewports too
  // short for both, the hero keeps the room whole and the band starts just
  // under the fold instead.
  return (
    <section className="pt-navbar-rest relative flex min-h-[max(calc(100svh-var(--backing-band-height)),calc(52.84vw+2.5rem))] flex-col overflow-clip">
      <HeroRoom />

      <div className="section-container relative flex flex-col items-center pt-24 text-center md:pt-26">
        <h1 className="type-display-xs sm:type-display-sm lg:type-display-md flex max-w-174.5 flex-col">
          {/*
           * `text-balance` only has anything to do below the design width,
           * where a line has to break again: it splits the remainder evenly
           * instead of leaving a single word stranded.
           */}
          {headline.map((line, index) => (
            <span
              key={line}
              className="shimmer-reveal text-balance"
              style={{ "--reveal-index": index + 1 }}
            >
              {line}
            </span>
          ))}
        </h1>

        <CtaLink
          href={siteConfig.links.contact}
          className="sweep-reveal mt-8 md:mt-10"
          style={{ "--reveal-index": 3 }}
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

      {/*
       * No padding under the ruler: its track is the hero's last pixel, and
       * the backing band (sections/backers) starts flush against it, using
       * the ruler as its top border.
       */}
      <div className="section-container relative mt-auto pt-10">
        <HeroTimeline />
      </div>
    </section>
  );
}
