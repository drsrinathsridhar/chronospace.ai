import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { SiteHeader } from "@/components/site-header";
import { createMetadata } from "@/lib/metadata";
import { Connect } from "./sections/connect";

export const metadata: Metadata = createMetadata({
  // The root template appends " — ChronoSpace".
  title: "Connect with us",
  description:
    "Leave your email and sector and we'll come back with a capture proposal.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <SiteFrame>
        <main>
          <Connect />
        </main>
      </SiteFrame>
    </>
  );
}
