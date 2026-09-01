import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { nippo, supreme } from "./fonts";

import "./globals.css";

/** Absolute base for the share-card URLs. Set NEXT_PUBLIC_SITE_URL per environment;
 *  without it Next falls back to localhost and every crawler gets an unreachable image. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chronospace.ai";

/** GA4 measurement ID. */
const GA_MEASUREMENT_ID = "G-9P2J929L7B";

/**
 * Icons and share cards come from the file conventions alongside this file, so they are
 * inherited by every route and need no entry here.
 *
 * `icon.svg` is the real favicon: the hexagonal monogram on a transparent ground, drawn
 * in c-black and flipped to white by a `prefers-color-scheme` query inside the SVG, so
 * it follows the browser's theme rather than the page's. Every current browser prefers
 * it over the `.ico` because Next emits it with `sizes="any"`.
 *
 * `favicon.ico` is the fallback for browsers with no SVG-favicon support. ICO cannot
 * carry a media query, so it ships the c-black mark only — the light-theme variant.
 * `apple-icon.png` stays an opaque c-black tile on purpose: iOS composites home-screen
 * icons over whatever is behind them, and a transparent one renders badly.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ChronoSpace - Digitizing the Physical World",
    template: "%s · ChronoSpace",
  },
  description:
    "ChronoSpace builds AI to digitize the physical world in 4D for manufacturing, robotics, and entertainment.",
  applicationName: "ChronoSpace",
  twitter: { card: "summary_large_image" },
};

/** The splash is a single dark screen — the browser chrome should not fight it. */
export const viewport: Viewport = {
  themeColor: "#090b19",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nippo.variable} ${supreme.variable} bg-c-black h-full antialiased`}
    >
      <body className="font-supreme text-c-white flex min-h-full flex-col">
        {children}

        {/* Google Analytics. `lazyOnload` rather than `afterInteractive`: the latter makes
            Next emit an eager <link rel="preload" as="script">, which on a phone competes
            for bandwidth with the backdrop the splash is waiting on. Waiting for the load
            event costs a few hundred ms of reporting latency on a one-screen page with
            nothing to instrument before then. The inline half has to be a `next/script`
            too — a bare <script> in a Server Component is not executed — and it needs an
            `id` so Next can dedupe it. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
}
