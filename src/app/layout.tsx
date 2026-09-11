import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";
import { tuning, videoTone } from "@/tuning.config";
import { fontClassNames } from "./fonts";
import "./globals.css";

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The tuning knobs (tuning.config.ts) ride the root as custom properties,
  // so every effect they drive reads one source: --hero-wiggle scales the
  // room's eye travel (sections/hero/hero-room.module.css),
  // --figure-brightness is the resting figures' filter
  // (hero-cards.module.css), --video-grayscale and --video-blend are the
  // video plates' treatment (components/timeline-player.module.css).
  return (
    <html
      lang="en"
      className={fontClassNames}
      style={{
        "--hero-wiggle": tuning.heroWiggle,
        "--figure-brightness": tuning.heroFigureBrightness,
        "--video-grayscale": videoTone.grayscale,
        "--video-blend": videoTone.blend,
      }}
    >
      <body className="bg-paper text-ink min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
