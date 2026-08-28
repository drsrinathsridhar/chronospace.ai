import type { Metadata } from "next";

import { BackedBy } from "@/app/sections/backed-by";
import { BrandMark } from "@/app/sections/brand-mark";
import { CaptureViewport } from "@/app/sections/capture-viewport";
import { ContactEmail } from "@/app/sections/contact-email";
import { HeroCta } from "@/app/sections/hero-cta";
import { HeroHeadline } from "@/app/sections/hero-headline";
import { HeroWordTicker } from "@/app/sections/hero-word-ticker";
import { SplashBackdrop } from "@/app/sections/splash-backdrop";

const TITLE = "ChronoSpace - Digitizing the Physical World";
const DESCRIPTION =
  "ChronoSpace builds AI to digitize the physical world in 4D for manufacturing, robotics, and entertainment. Backed by a16z speedrun.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "ChronoSpace",
    type: "website",
  },
};

/**
 * Single-screen splash. One 12-column grid: the brand mark pinned to the top of the
 * left region and the investor credit to its bottom (bottom-aligned with the capture
 * viewport, because the right column spans both rows), with the headline → word ticker
 * → CTA → capture viewport stack in columns 8–12. Below 768px the whole thing collapses
 * to one stacked column in this same source order.
 *
 * **Single-screen is a hard requirement, not a description.** At the design's own
 * 1496 × 820 the composition fits exactly; on any shorter window it did not, and a
 * splash with a scrollbar is a different thing from a splash. So from `md` the page is
 * `h-svh` and the chain from here down to the capture viewport is a flex column of
 * `min-h-0` boxes: the headline, word and CTA are `shrink-0` and keep their design
 * sizes, and the frame — the one element whose proportions can give without losing
 * information — absorbs whatever height is left over. On a window at least as tall as
 * the design's it never shrinks, so nothing here changes at 1496 × 820.
 *
 * Mobile stays in normal flow: at 375px the stack is taller than a phone and shrinking
 * the frame there would cost more than the scroll does.
 *
 * There is no scroll here, so the reveal is a one-shot load entrance rather than an
 * IntersectionObserver: each section root carries `.enter` (see globals.css) and the
 * `.enter-d*` delays stagger it 40ms apart in that same source order.
 */
export default function HomePage() {
  return (
    <main className="bg-c-black relative flex min-h-svh w-full flex-col md:h-svh">
      <SplashBackdrop />

      {/* page margins outside the container, so the readable width really is
          min(1416px, 100vw - 80px) — the design's 12-column content area */}
      <div className="px-sm pt-xl pb-md md:px-xl md:pt-3xl relative z-10 md:flex md:min-h-0 md:flex-1 md:flex-col md:pb-[25px]">
        <div className="max-w-page gap-x-gutter mx-auto grid w-full grid-cols-1 md:min-h-0 md:flex-1 md:grid-cols-12 md:grid-rows-[auto_1fr]">
          <div className="md:col-start-1 md:col-end-7 md:row-start-1 lg:col-end-8">
            <BrandMark />
          </div>

          <div className="mt-2xl flex flex-col items-start md:col-start-7 md:col-end-13 md:row-span-2 md:row-start-1 md:mt-0 md:min-h-0 lg:col-start-8">
            <HeroHeadline />
            <HeroWordTicker />
            <HeroCta />
            <CaptureViewport />
          </div>

          {/* bottom-left corner: contact over investor credit, the pair bottom-aligned
              with the capture viewport because the right column sets the row height */}
          <div className="gap-lg mt-[27px] flex flex-col md:col-start-1 md:col-end-7 md:row-start-2 md:mt-0 md:justify-end lg:col-end-8">
            <ContactEmail />
            <BackedBy />
          </div>
        </div>
      </div>
    </main>
  );
}
