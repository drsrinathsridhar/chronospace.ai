import { SiteFrame } from "@/components/site-frame";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "./sections/hero";
import { Backers } from "./sections/backers";
import { ClosingBar } from "./sections/closing";
// Restore these imports and sections for the full launch.
/*
import { Problem } from "./sections/problem";
import { Product } from "./sections/product";
import { Capture } from "./sections/capture";
import { Team } from "./sections/team";
import { Science } from "./sections/science";
import { Closing } from "./sections/closing";
*/

export default function HomePage() {
  return (
    <>
      <SiteHeader showNavigation={false} />
      <SiteFrame>
        {/* Remove the viewport layout when restoring the full landing page. */}
        <div className="flex h-svh flex-col">
          <main className="flex flex-1 flex-col">
            <Hero />
            <Backers />
            {/*
          <Problem />
          <Product />
          <Capture />
          <Team />
          <Science />
          <Closing />
          */}
          </main>
          <ClosingBar />
        </div>
      </SiteFrame>
    </>
  );
}
