/**
 * The headline. Capped at 9.5625em on desktop — 459px at the design's 48px, narrower
 * than the 578px column on purpose, because that cap is what breaks the line after
 * "digitize":
 *
 *   We build AI to digitize
 *   the physical world for
 *
 * The cap is stated in `em` rather than px so it tracks `.text-hero`, which scales the
 * sentence with the column it lives in — the break stays put at every width, and it is
 * this two-line break, not the rotating word, that sets the size (see globals.css).
 *
 * The sentence is completed by the rotating word in `hero-word-ticker` directly below,
 * which carries the same `.text-hero` size.
 */
export function HeroHeadline() {
  return (
    <h1
      data-section="hero-headline"
      data-figma-id="7235:903"
      className="enter enter-d1 font-nippo text-hero text-c-white w-full shrink-0 lg:max-w-[9.5625em]"
    >
      We build AI to digitize the physical world for
    </h1>
  );
}
