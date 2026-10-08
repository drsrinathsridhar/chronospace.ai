import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export const dynamic = "force-static";

// The web app manifest is what Android Chrome reads for "Add to Home
// Screen" - a plain PNG favicon gets no say there. The tiles under
// public/icons are the grey mark (#939393, the client's favicon grey) on the
// page ground (--paper, opaque: launchers paint transparency black), and the
// maskable one keeps the mark
// inside the 80% safe zone so a round or squircle launcher mask cannot clip
// it. Rendered from src/icons/source/chronospace-logo.svg; how to regenerate
// them is in docs/asset-swap-guide.md (client feedback, round 3, slide 9b).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090b19",
    theme_color: "#090b19",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
