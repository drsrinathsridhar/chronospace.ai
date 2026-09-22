import type { Metadata, Viewport } from "next";
import { createMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";
import { tuning } from "@/tuning.config";
import { fontClassNames } from "./fonts";
import "./globals.css";

export const metadata: Metadata = createMetadata();

// theme-color belongs to the viewport export in Next 16, not to metadata.
// It is the page ground, so a phone browser's own chrome takes the colour
// of the paper it frames and Android's task switcher tints the card to
// match (client feedback, round 3, slide 9b).
export const viewport: Viewport = {
  themeColor: "#090b19",
};

// Structured data for the company, so a search result can show the mark and
// the LinkedIn profile next to the name (round 3, slide 9c). React writes a
// <script>'s string child out as script text - it escapes only `<script`,
// `</script` and `<!--` - so the JSON goes in as children rather than
// through dangerouslySetInnerHTML, which the house lint forbids; every `<`
// is spelled \u003c all the same, so no value could ever close the tag.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: new URL("/icons/icon-512.png", siteConfig.url).toString(),
  sameAs: [siteConfig.links.linkedin],
};
const organizationJsonLd = JSON.stringify(organization).replace(
  /</g,
  "\\u003c",
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The tuning knobs (tuning.config.ts) ride the root as custom properties,
  // so every effect they drive reads one source: --hero-wiggle scales the
  // room's eye travel (sections/hero/hero-room.module.css),
  // --figure-brightness and --figure-contrast are the resting figures'
  // filter (hero-cards.module.css), --trail-length / --trail-blur /
  // --trail-opacity size the figures' motion smear (same file; the trail's
  // mode and colour are data attributes on the hero root, sections/hero).
  // Video tone is a data attribute so the default colour mode does not pay
  // for identity filter and blend compositor layers.
  return (
    <html
      lang="en"
      className={fontClassNames}
      data-video-tone={tuning.videoTone}
      style={{
        "--hero-wiggle": tuning.heroWiggle,
        "--figure-brightness": tuning.heroFigureBrightness,
        "--figure-contrast": tuning.heroFigureContrast,
        "--trail-length": tuning.heroTrail.length,
        "--trail-blur": tuning.heroTrail.blur,
        "--trail-opacity": tuning.heroTrail.opacity,
      }}
    >
      <body className="bg-paper text-ink min-h-screen antialiased">
        <script type="application/ld+json">{organizationJsonLd}</script>
        {children}
      </body>
    </html>
  );
}
