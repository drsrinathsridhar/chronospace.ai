/**
 * The rotating word that finishes the headline sentence. Structurally a one-line-tall
 * clipping window over a four-row vertical roll; the fourth row repeats the first so
 * the loop returns to the start without a visible jump. The roll steps by one row +
 * one gap — 54px on mobile (44 + 10) and 63px from `lg` (53 + 10) — and shares its 10s
 * timeline with the capture viewport's subject crossfade, so word and image always
 * change together: the subject rises and fades on the same steps the roll translates on.
 *
 * Every measurement here is in `em` because `.text-hero` scales the sentence with the
 * column (see globals.css): the row height, the gap and the step all have to follow the
 * font size or the window clips the wrong slice of the roll.
 *
 * The roll runs at every width. `manufacturing.`, the longest of the three at 6.71em,
 * fits its column from 375px up, so there is no width at which the window has to park
 * on a static word.
 */
const WORDS = [
  "manufacturing.",
  "robotics.",
  "entertainment.",
  "manufacturing.",
];

export function HeroWordTicker() {
  return (
    <div
      data-section="hero-word-ticker"
      data-figma-id="7235:904"
      className="enter enter-d2 text-hero mt-3xs h-[1.1em] w-full shrink-0 overflow-hidden [--roll-step:1.35em] lg:mt-[3px] lg:h-[1.10417em] lg:[--roll-step:1.3125em]"
    >
      {/* The roll is decorative repetition — assistive tech reads the resting word once.
          `font-nippo` is not cosmetic on a visually hidden span: it is the only string on
          the splash the body's Supreme would otherwise lay out, and laying out one glyph
          in Supreme costs the download of the whole family. */}
      <span className="font-nippo sr-only">manufacturing.</span>
      <div
        aria-hidden="true"
        className="animate-word-roll flex flex-col gap-[0.25em] motion-reduce:animate-none lg:gap-[0.208333em]"
      >
        {WORDS.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="font-nippo text-c-orange-500 block h-[1.1em] whitespace-nowrap lg:h-[1.10417em]"
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
