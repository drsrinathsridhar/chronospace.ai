import { SiteHeader } from "@/components/site-header";
import { Hero } from "./sections/hero";
import { Problem } from "./sections/problem";
import { Capture } from "./sections/capture";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Capture />
      </main>
    </>
  );
}
