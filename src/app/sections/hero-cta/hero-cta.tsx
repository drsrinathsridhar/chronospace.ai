import Image from "next/image";

import arrowRight from "@/app/(home)/assets/arrow-right.svg";

/**
 * Primary call to action — the Google Calendar booking page, opened in a new tab so the
 * splash survives the round trip. Square-cornered, full-width in its column, 66px tall, with
 * the label anchored to the bottom-left (16px in, 16px up — deliberately not centred)
 * and the chevron pinned 14px from the right (the spec measures 13px; the reference render
 * places the white glyph one pixel further in).
 *
 * Hover is a wipe, not a fade: a full-size c-orange-600 rectangle parked below the
 * button slides up to cover it, while two identical chevrons both slide +30px inside a
 * 14px clipping box, so one leaves as its twin arrives. The arrow is clipped away below
 * 768px, exactly as it is on the mobile artboard.
 *
 * Keyboard gets the identical treatment — :focus-visible drives the wipe and the arrow
 * slide, plus a 2px white ring, because the wipe alone is a colour-only cue.
 */
export function HeroCta() {
  return (
    <a
      href="https://calendar.app.google/JKqjSzst8t1QSRfZA"
      target="_blank"
      rel="noopener noreferrer"
      data-section="hero-cta"
      data-figma-id="7434:3623"
      className="enter enter-d3 group mt-lg bg-c-orange-500 pb-sm pl-sm focus-visible:outline-c-white relative flex h-[66px] w-full shrink-0 cursor-pointer items-end justify-between overflow-hidden pr-[14px] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <span
        aria-hidden="true"
        className="bg-c-orange-600 ease-fluid absolute inset-0 translate-y-full transition-transform duration-400 group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
      />
      <span className="font-nippo text-label-1 text-c-white relative z-10 uppercase">
        Book a meeting
      </span>
      <span
        aria-hidden="true"
        className="relative z-10 mb-[3px] hidden h-[14px] w-[14px] shrink-0 overflow-hidden md:block"
      >
        <Image
          src={arrowRight}
          alt=""
          loading="eager"
          className="ease-fluid absolute top-0 left-0 h-[14px] w-[14px] transition-transform duration-400 group-hover:translate-x-[30px] group-focus-visible:translate-x-[30px] motion-reduce:transition-none"
        />
        <Image
          src={arrowRight}
          alt=""
          loading="eager"
          className="ease-fluid absolute top-0 left-[-30px] h-[14px] w-[14px] transition-transform duration-400 group-hover:translate-x-[30px] group-focus-visible:translate-x-[30px] motion-reduce:transition-none"
        />
      </span>
    </a>
  );
}
