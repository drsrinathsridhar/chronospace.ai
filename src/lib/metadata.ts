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
