import localFont from "next/font/local";

// ── Brand fonts ──────────────────────────────────────────────────────────────
// Self-hosted variable files from src/assets/fonts/ (Fontshare ITF Free Font Licence:
// https://www.fontshare.com/licenses/itf-ffl). Both files default to their HEAVIEST
// named instance — Nippo 700, Supreme 800 — so the axis range is declared here and
// every rule states its own weight. Nippo's "Regular" is 378, not 400.
//
// Loading these through next/font rather than a raw @font-face is what keeps the page
// stable across platforms: the loader measures each file and emits size-adjust /
// ascent-override / descent-override on a generated fallback face, so the fallback
// occupies the same em-box as the real font. Without that, the hero word ticker — whose
// clipping window and roll step are in `em` — lands on a different sub-pixel row on
// every OS while the font is still swapping.

export const nippo = localFont({
  src: "../assets/fonts/Nippo-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  // The loader's variable is deliberately not named --font-nippo: that is the Tailwind
  // theme token, and a token defined as var(itself) is circular. globals.css maps one to
  // the other.
  variable: "--font-nippo-loaded",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

// Not preloaded: Supreme sets the body copy elsewhere on the site, but no Supreme glyph
// renders on the splash (see docs/pages/page.md), so preloading it would cost the
// critical path ~31KB for nothing. Routes that do use it fetch it on first paint.
export const supreme = localFont({
  src: "../assets/fonts/Supreme-Variable.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-supreme-loaded",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
