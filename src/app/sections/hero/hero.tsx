import { Fragment } from "react";
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
// The vertical rhythm is the comp's at the 1496px design width - 40 from the
// headline to the action, the whole stack pulled up so the manufacturing
// capture can stand clear of it - and the ruler flush with the foot. The
// headline's own offset scales with the room rather than sitting at a fixed
// 104 below the navbar: at xl+ the copy is centred on the back wall's
// midline instead (client feedback, September 2026 - it read as too high),
// measured in the site frame's cqw so it stays put past the 2560 cap
// on any display (client feedback, September 2026: the headline escaped the
// room on wide screens). The backing marks left
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
  // the first screen together - floored by what the room needs: the deepest
  // capture stands at 109.17% of the 48.4cqw plate (hero-cards.module.css),
  // 52.84cqw, plus clearance for the ruler at the foot. On viewports too
  // short for both, the hero keeps the room whole and the band starts just
  // under the fold instead. The viewport term is capped at 87rem, which is
  // the room's own height at the site frame's 2560 cap: past that the room
  // stops growing (cqw), and a hero still chasing a taller viewport would
  // open a band of bare paper under the figures.
  return (
    <section className="pt-navbar-rest relative flex min-h-[max(min(calc(100svh-var(--backing-band-height)),87rem),calc(52.84cqw+2.5rem))] flex-col overflow-clip">
      <HeroRoom />

      {/*
       * At xl the copy leaves the flow and centres itself on the back wall:
       * the wall runs from 20.68% to 86.9% of the plate, so its midline is
       * 53.8% of the plate's 48.4cqw - 26.04cqw from the frame's top - and
       * the block is translated up by half its own height onto it. The CTA
       * then ends around 66% of the plate, above the manufacturing line's
       * top pixel (~85%) and between the two flanking figures. Below xl the
       * cards fall into a strip under the copy, so the copy keeps the comp's
       * padding and the flow.
       */}
      <div
        className="section-container relative flex flex-col items-center pt-24 text-center md:pt-26 xl:absolute xl:inset-x-0 xl:top-(--copy-centre) xl:z-10 xl:-translate-y-1/2 xl:pt-0"
        style={{ "--copy-centre": "26.04cqw" }}
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
