import { SiteHeader } from "@/components/site-header";
import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Product } from "./sections/product";
import { Capture } from "./sections/capture";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Product />
        <Capture />
      </main>
    </>
  );
}
