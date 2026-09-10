import { SiteFrame } from "@/components/site-frame";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "./sections/hero";
import { Backers } from "./sections/backers";
import { Problem } from "./sections/problem";
import { Product } from "./sections/product";
import { Capture } from "./sections/capture";
import { Team } from "./sections/team";
import { Science } from "./sections/science";
import { Vision } from "./sections/vision";
import { Footer } from "./sections/footer";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <SiteFrame>
        <main>
          <Hero />
          <Backers />
          <Problem />
          <Product />
          <Capture />
          <Team />
          <Science />
          <Vision />
        </main>
        <Footer />
      </SiteFrame>
    </>
  );
}
