import { SiteFrame } from "@/components/site-frame";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "./sections/hero";
import { Backers } from "./sections/backers";
import { Problem } from "./sections/problem";
import { Product } from "./sections/product";
import { Capture } from "./sections/capture";
import { Team } from "./sections/team";
import { Science } from "./sections/science";
import { Closing, ClosingBar } from "./sections/closing";

// The closing block and the bar are revealed rather than scrolled to
// (owner's request, 14 Sep 2026): they sit pinned to the foot of the
// viewport under the page - `sticky bottom-0` on their wrapper, the last
// child of the frame, so the pinning never leaves the document's flow and
// the page keeps its true height - and <main>, on the page ground one
// layer up, scrolls off them like a sheet lifted from a table. The
// sentinel at the end of <main> marks where the sheet ends: the closing
// block's video and reveal watch it, not themselves, because a pinned
// block is "in view" to an observer from the first scroll, hidden under
// the sheet or not.

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <SiteFrame>
        <main className="bg-paper relative z-10">
          <Hero />
          <Backers />
          <Problem />
          <Product />
          <Capture />
          <Team />
          <Science />
          <div aria-hidden data-closing-sentinel className="h-px" />
        </main>
        <div className="sticky bottom-0 z-0">
          <Closing />
          <ClosingBar />
        </div>
      </SiteFrame>
    </>
  );
}
