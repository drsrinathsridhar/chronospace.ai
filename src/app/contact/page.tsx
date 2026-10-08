import type { Metadata } from "next";
import { SiteFrame } from "@/components/site-frame";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";
// Restore the header and enquiry section once form delivery is connected.
// import { SiteHeader } from "@/components/site-header";
// import { Connect } from "./sections/connect";

export const metadata: Metadata = createMetadata({
  // The root template appends " — ChronoSpace".
  title: "Connect with us",
  description: "Contact ChronoSpace at contact@chronospace.ai.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      {/* <SiteHeader /> */}
      <SiteFrame>
        <main className="section-container flex min-h-svh items-center justify-center">
          <a
            href={siteConfig.links.email}
            className="type-body-lg focus-visible:outline-ink underline underline-offset-4 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            contact@chronospace.ai
          </a>
          {/* <Connect /> */}
        </main>
      </SiteFrame>
    </>
  );
}
