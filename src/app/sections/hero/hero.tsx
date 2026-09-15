import { Fragment } from "react";
import { HeroTrailFiltersIcon } from "@/icons/generated";
import { tuning } from "@/tuning.config";
import { HeroCards } from "./hero-cards";
import { HeroRoom } from "./hero-room";
import { HeroTimeline } from "./hero-timeline";

// The first screen, and the whole argument in one view: a dark room with the
// claim standing in the middle of it and the evidence standing inside it -
// three framed captures on the room's own floor, each figure open to the
// room behind it (hero-cards.tsx) - and the timecode ruler underlining the
// whole screen at its foot.
//
// The headline stands alone in the room. The comp put a "Connect with us"
// under it, 40 below; the client asked for one such call in the first
// screen, and the navbar's is the one that stays (feedback round 2), so the
// captures now have the whole floor between the copy and the ruler. The
// headline's offset scales with the room rather than sitting at a fixed 104
// below the navbar: at xl+ the copy is centred in the band of back wall
// above the figures (client feedback, September 2026 - it read as too
// high), measured in the site frame's cqw so it stays put past the 2560 cap
// on any display (the headline once escaped the room on wide screens). The
// backing marks left
// the hero for the band directly under it (sections/backers): the hero
// yields exactly the band's height of the viewport, so hero + band close
// the first screen together, with the ruler as the band's top border.
//
// Everything arrives on the same band of light, in reading order - see
// `shimmer-reveal` / `sweep-reveal` in globals.css. `--reveal-index` is that
// order; index 0 belongs to the navbar, which leads.

// Two spans rather than one string with a break: each line is picked up by
// the shimmer on its own beat, and the break stays where the comp puts it
// instead of wherever the measure happens to fall. A plain space separates
// the spans in the markup: the flex column never renders it, but without it
// the text content - what search engines, readers and copy-paste see - ran
// the lines together ("builds AIto digitize"; client feedback, round 2).
const headline = ["ChronoSpace builds AI", "to digitize the physical world"];

export function Hero() {
  // Padded by the navbar's resting height, not its live one: the bar
  // tightens on scroll, and tracking that here would shift the whole hero
  // 12px the moment the page moves.
  //
  // The height is the viewport minus the backing band, so hero + band close
  // the first screen together - floored by what the room needs: the three
  // captures stand on one line at 109.17% of the 48.4cqw plate
  // (hero-cards.module.css), 52.84cqw, plus clearance for the ruler at the
  // foot. On viewports too short for both, the hero keeps the room whole and
  // the band starts just under the fold instead. The viewport term is capped
  // at 87rem, which is the room's own height at the site frame's 2560 cap:
  // past that the room stops growing (cqw), and a hero still chasing a
  // taller viewport would open a band of bare paper under the figures.
  //
  // `touch-pan-y`: a finger on the hero steers the room while it is down
  // (hero-room-eye.client.tsx). The browser keeps vertical swipes for the
  // scroll and hands us the sideways ones as pointer moves; without the
  // declaration it would take every touch for a scroll and cancel our
  // pointer the moment it moved.
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
      className="pt-navbar-rest relative flex min-h-[max(min(calc(100svh-var(--backing-band-height)),87rem),calc(52.84cqw+2.5rem))] touch-pan-y flex-col overflow-clip"
      data-trail-mode={tuning.heroTrail.mode}
      data-trail-colour={tuning.heroTrail.colour}
    >
      <HeroTrailFiltersIcon
        aria-hidden
        focusable="false"
        className="absolute size-0 overflow-hidden"
      />
      <HeroRoom />

      {/*
       * At xl the copy leaves the flow and centres itself on the back wall,
       * translated up by half its own height onto --copy-centre. The centre
       * is the middle of the band the headline has to itself: from the
       * wall's top edge, the cove line at 20.68% of the 48.4cqw plate
       * (10.01cqw), down to the figures' heads on the one-line row, ~35.4cqw
       * (hero-cards.tsx) - 22.7cqw. That is also, within a few pixels, where
       * the headline stood while it shared a block centred on the wall's
       * midline with the call to action - the height the client signed off -
       * so losing the action moved the figures, not the words. Below xl the
       * cards fall into a strip under the copy, so the copy keeps the comp's
       * padding and the flow.
       */}
      <div
        className="section-container relative flex flex-col items-center pt-24 text-center md:pt-26 xl:absolute xl:inset-x-0 xl:top-(--copy-centre) xl:z-10 xl:-translate-y-1/2 xl:pt-0"
        style={{ "--copy-centre": "22.7cqw" }}
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
