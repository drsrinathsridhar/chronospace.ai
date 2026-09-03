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

const nippo = localFont({
  src: "../assets/fonts/Nippo-Variable.woff2",
  weight: "200 700",
  style: "normal",
  display: "swap",
  variable: "--font-brand-display",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
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
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fontClassNames = `${nippo.variable} ${supreme.variable}`;
