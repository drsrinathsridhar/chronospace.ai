import { Fragment } from "react";
import { CtaArrowIcon, HeroTrailFiltersIcon } from "@/icons/generated";
import { tuning } from "@/tuning.config";
import { siteConfig } from "@/site.config";
import { HeroCards } from "./hero-cards";
import { HeroRoom } from "./hero-room";
import { HeroTimeline } from "./hero-timeline";
import styles from "./hero.module.css";

// The first screen, and the whole argument in one view: a dark room with the
// claim standing in the middle of it and the evidence standing inside it -
// three framed captures on the room's own floor, each figure open to the
// room behind it (hero-cards.tsx) - and the timecode ruler underlining the
// whole screen at its foot.
//
// The compact release reserves space for the backers and footer. The figures
// scale to the space below the copy, including on wide, short windows.
//
// Everything arrives on the same band of light, in reading order - see
// `shimmer-reveal` / `sweep-reveal` in globals.css. `--reveal-index` is that
// order.

// Two spans rather than one string with a break: each line is picked up by
// the shimmer on its own beat, and the break stays where the comp puts it
// instead of wherever the measure happens to fall. A plain space separates
// the spans in the markup: the flex column never renders it, but without it
// the text content - what search engines, readers and copy-paste see - ran
// the lines together ("builds AIto digitize"; client feedback, round 2).
const headline = ["World Models", "for the Physical World"];

export function Hero() {
  // Keep a readable minimum on very short windows and at increased text sizes.
  //
  // `touch-pan-y`: a finger on the hero steers the room while it is down
  // (hero-room-eye.client.tsx). The browser keeps vertical swipes for the
  // scroll and hands us the sideways ones as pointer moves; without the
  // declaration it would take every touch for a scroll and cancel our
  // pointer the moment it moved. The carousel below md is its own scroll
  // container and declares pan-x pan-y itself (hero-cards.module.css), and
  // touch-action stops walking up at a scroll container, so a sideways
  // swipe over the figures moves the slides rather than the eye.
  //
  // The trail's mode and colour (tuning.config.ts, `heroTrail`) ride the
  // root as data attributes, which hero-cards.module.css selects on - set
  // on the server, so the first paint already has the right treatment and
  // nothing flashes. The SVG filters the trail draws with (the horizontal
  // blur and the two colour floods) are defined once here, in a zero-size
  // svg the CSS references by id; it must not be display:none, which some
  // engines take as "no filter", so it is sized away rather than hidden.
  return (
    <section
      className={`${styles.hero} relative flex touch-pan-y flex-col overflow-clip`}
      data-trail-mode={tuning.heroTrail.mode}
      data-trail-colour={tuning.heroTrail.colour}
    >
      <HeroTrailFiltersIcon
        aria-hidden
        focusable="false"
        className="absolute size-0 overflow-hidden"
      />
      <HeroRoom />

      <div
        className={`${styles.copy} section-container relative z-10 flex shrink-0 flex-col items-center gap-4 text-center`}
      >
        <h1 className="type-display-xs sm:type-display-sm lg:type-display-md flex max-w-174.5 flex-col">
          {/*
           * `text-balance` only has anything to do below the design width,
           * where a line has to break again: it splits the remainder evenly
           * instead of leaving a single word stranded.
           */}
          {headline.map((line, index) => (
            <Fragment key={line}>
              {index > 0 && " "}
              <span
                className="shimmer-reveal text-balance"
                style={{ "--reveal-index": index + 1 }}
              >
                {line}
              </span>
            </Fragment>
          ))}
        </h1>
        <a
          href={siteConfig.links.email}
          className="type-body-sm border-line text-ink sweep-reveal hover:border-accent focus-visible:border-accent focus-visible:outline-accent group inline-flex min-h-10 items-center gap-3 border px-4 py-2 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 max-sm:min-h-11"
          style={{ "--reveal-index": 3 }}
        >
          contact@chronospace.ai
          <CtaArrowIcon
            width={6.4}
            height={8}
            aria-hidden
            className="text-accent shrink-0 motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5"
          />
        </a>
      </div>

      {/*
       * The captures, and the pager that goes with them on a phone. At xl
       * they stand on the room's floor at the comp's positions and drift
       * with the pointer; from md to xl they fall into a strip here,
       * between the copy and the ruler; below md they are a carousel
       * standing on the floor line, one figure a screen, with three of the
       * ruler's ticks under it to swipe or tap between (hero-cards.tsx).
       */}
      <div className={styles.scene}>
        <HeroCards />
      </div>

      {/* The ruler meets the backers band so the logos sit between its two rules. */}
      <div className="section-container relative shrink-0">
        <HeroTimeline showLabels={false} />
      </div>
    </section>
  );
}
