import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

interface CreateMetadataOptions {
  /**
   * The page's own title, without the site name: the root template appends
   * " — ChronoSpace". Leave it out for the home page, which carries the
   * tagline instead.
   */
  title?: string;
  description?: string;
  path?: string;
}

// The document title is "ChronoSpace — AI to digitize the physical world" on
// the home page - the client's wording, em dash included (round 3, slide
// 9c) - and "<page> — ChronoSpace" everywhere else. The root layout calls
// this with no title and sets the template; a page passes its short title
// and Next fills the template in. Open Graph and Twitter get the full string
// spelled out, since crawlers read those tags as they are, template or not.
const homeTitle = `${siteConfig.name} — ${siteConfig.tagline}`;

// One static share card for every page: the wordmark, the headline and the
// three captures in colour on the page ground, 1200x630 (public/og.png; how
// to redraw it is in docs/asset-swap-guide.md). A static file rather than an
// image route so every unfurler gets the same bytes and nothing renders at
// request time.
const shareImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} builds ${siteConfig.tagline}`,
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
}: CreateMetadataOptions = {}): Metadata {
  const url = new URL(path, siteConfig.url);
  const fullTitle = title ? `${title} — ${siteConfig.name}` : homeTitle;

  return {
    metadataBase: new URL(siteConfig.url),
    title: title ?? {
      default: homeTitle,
      template: `%s — ${siteConfig.name}`,
    },
    description,
    alternates: {
      canonical: url,
    },
    // The icon files under src/app (icon.svg, icon.png, apple-icon.png) are
    // served by Next's file conventions, but Next only writes their <link>
    // tags when `icons` is left unset here - and the Safari pinned-tab mask
    // has no file convention, so it has to be declared. Hence the whole set
    // is spelled out: the theme-aware SVG first (the browsers that take it
    // prefer it), the PNG for the rest, the Apple tile, and the mask painted
    // in the accent. favicon.ico needs no entry - Next always puts it first.
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/icon.png", type: "image/png", sizes: "64x64" },
      ],
      apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
      other: [
        { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#f25324" },
      ],
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [shareImage],
    },
  };
}
