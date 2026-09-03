import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { A16zSpeedrunIcon } from "@/icons/generated";
import { HeroBackingShine } from "./hero-backing-shine.client";
import { HeroCards } from "./hero-cards";
import backing from "./hero-backing.module.css";
import { HeroRoom } from "./hero-room";
import { HeroTimeline } from "./hero-timeline";

// The first screen, and the whole argument in one view: a dark room with the
// claim standing in the middle of it, the evidence hung around it - three
// captures floating in front of the room, each subject printed back in
// colour with its motion trail - and the timecode ruler underlining the
// whole screen at its foot.
//
// The vertical rhythm is the comp's, to the pixel, at the 1496px design
// width: 160 below the navbar to the eyebrow, 20 to the headline, 40 to the
// action, 160 to the backing line, and the ruler flush with the foot.
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
          {/*
           * The mark shines once on the way down - the navbar logotype's
           * hover flare, fired by scroll instead of the pointer when the
           * logo crosses the middle of the viewport.
           */}
          <span className={`${backing.mark} relative`}>
            <A16zSpeedrunIcon width={170} height={24} className="text-ink" />
            <span aria-hidden className={`${backing.flare} absolute inset-0`}>
              <A16zSpeedrunIcon
                width={170}
                height={24}
                className="text-accent"
              />
            </span>
            <HeroBackingShine />
          </span>
        </div>
      </div>

      {/*
       * The captures. At xl they hang at the comp's scatter positions over
       * the whole section and drift with the pointer; below that they fall
       * into a strip here, between the copy and the ruler.
       */}
      <HeroCards />

      <div className="section-container relative mt-auto pt-10 pb-2">
        <HeroTimeline />
      </div>
    </section>
  );
}
