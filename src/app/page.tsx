import { SiteFrame } from "@/components/site-frame";
import { Hero } from "./sections/hero";
// Restore these imports and sections for the full launch.
/*
import { SiteHeader } from "@/components/site-header";
import { Backers } from "./sections/backers";
import { Problem } from "./sections/problem";
import { Product } from "./sections/product";
import { Capture } from "./sections/capture";
import { Team } from "./sections/team";
import { Science } from "./sections/science";
import { Closing, ClosingBar } from "./sections/closing";
*/

export default function HomePage() {
  return (
    <>
      {/* <SiteHeader /> */}
      <SiteFrame>
        <main>
          <Hero />
          {/*
          <Backers />
          <Problem />
          <Product />
          <Capture />
          <Team />
          <Science />
          <Closing />
          */}
        </main>
        {/* <ClosingBar /> */}
      </SiteFrame>
    </>
  );
}
