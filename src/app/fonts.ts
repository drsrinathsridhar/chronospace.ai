import localFont from "next/font/local";

// ChronoSpace runs on two Fontshare variable families:
//
//   Nippo    the display voice - headlines, nav, buttons, HUD labels.
//            Every piece of chrome in the design is set in it.
//   Supreme  the reading voice - body copy and long-form paragraphs.
//
// Both ship as single variable files, so a weight range replaces the usual
// per-weight face list. Licences sit next to the binaries in
// `src/assets/fonts`.
//
// The fallback faces are hand-tuned in globals.css ("Nippo Fallback",
// "Supreme Fallback": Arial with size-adjust and metric overrides), so
// Next's automatic ones are switched off. Next sizes its fallback from the
// font's declared average character width, and both files overstate it:
// its Arial came out 115% for Nippo and 109% for Supreme where the glyphs
// actually run at 102% and 98.5% (measured against Arial in Chrome at the
// weights the site uses). Every line set in the fallback was a tenth wider
// than the line the real font drew, so the swap reflowed the headline, the
// nav and every caption and Lighthouse booked the reflow as layout shift
// (client's run of 17 Sep 2026: CLS 0.65 attributed to the web fonts, on
// a page that is otherwise at 100). With the widths matched the swap moves
// nothing.

const nippo = localFont({
  src: "../assets/fonts/Nippo-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-brand-display",
  adjustFontFallback: false,
  fallback: ["Nippo Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
});

const supreme = localFont({
  src: [
    {
      path: "../assets/fonts/Supreme-Variable.woff2",
      weight: "100 800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Supreme-VariableItalic.woff2",
      weight: "100 800",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-brand-sans",
  adjustFontFallback: false,
  fallback: ["Supreme Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
});

// Nippo a second time, for the uppercase chrome (type-button, type-nav,
// type-caption, type-micro in globals.css). Capitals in Nippo run about a
// tenth narrower against Arial's capitals than the mixed-case display runs
// against Arial's lowercase (nav and captions measured at 89-93%, the
// headline at 102%), so one stand-in cannot fit both and the caps get their
// own ("Nippo Caps Fallback"). Same file: Next names the emitted asset by
// its hash and a preload flag, so with both declarations preloaded they
// share one URL and one preload tag, and the browser downloads it once.
const nippoCaps = localFont({
  src: "../assets/fonts/Nippo-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-brand-display-caps",
  adjustFontFallback: false,
  fallback: ["Nippo Caps Fallback", "ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontClassNames = `${nippo.variable} ${supreme.variable} ${nippoCaps.variable}`;
