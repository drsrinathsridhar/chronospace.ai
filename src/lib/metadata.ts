import type { Metadata } from "next";
import { siteConfig } from "@/site.config";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
}

export function createMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  path = "",
}: CreateMetadataOptions = {}): Metadata {
  const url = new URL(path, siteConfig.url);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
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
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
