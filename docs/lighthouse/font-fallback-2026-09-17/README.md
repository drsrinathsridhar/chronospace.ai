# Lighthouse, the client's desktop run of 17 September 2026

The client ran Lighthouse 13.4 from Chrome DevTools against staging on
17 Sep at 13:10 (desktop emulation, their own throttling) and sent the
PDF. Performance 77, accessibility 97, best practices 100, SEO 100.

The 77 is one metric. FCP 0.3 s, LCP 0.6 s, Speed Index 0.4 s and TBT
10 ms are all at the top of their bands; Cumulative Layout Shift was
0.65 (the good band ends at 0.1), and Lighthouse's "layout shift
culprits" table named the web fonts: 0.519 on the body when Nippo
arrived, 0.131 on the hero's timeline row when Supreme and its italic
arrived. Nothing else in the report moves the score.

## What was happening

Text is drawn in a stand-in face until the brand fonts download
(`font-display: swap`). Next generates that stand-in from each font
file's declared average character width, and both files overstate it:
Next sized its Arial at 115% for Nippo and 109% for Supreme, where the
glyphs actually run at 102% and 98.5% of Arial for the site's copy. So
every line set in the stand-in was about a tenth longer than the line
the real font would draw, and the swap reflowed the headline, the nav,
every caption and every paragraph. How much of the page that moves
depends on the viewport, the network and what wraps, which is why our
headless run against the same deployment scored 100 with CLS 0, and
only showed the reflow (CLS 0.011-0.016, all horizontal) once the fonts
were held back 1.5 s so the swap landed after first paint. The client's
0.65 could not be reproduced in full; the fix removes the reflow that
Lighthouse attributed it to.

## The fix

`src/app/fonts.ts` turns Next's automatic fallbacks off and
`src/app/globals.css` declares three hand-tuned ones, Arial with
`size-adjust` set from the measured width ratios and the vertical
metrics rescaled to match: "Nippo Fallback" at 102% for the mixed-case
display and titles, "Nippo Caps Fallback" at 92% for the uppercase
chrome (Nippo's capitals run narrower against Arial's than its lowercase
does, so `type-button`, `type-nav`, `type-caption` and `type-micro` take
a second Nippo declaration with its own stand-in), and "Supreme Fallback"
at 98.5% for body copy. Every text style on the page now measures within
2% of its stand-in (digits within 6%).

Measured on the production build served with `next start`, headless
Chrome 153:

| Run                                       | Perf | CLS   | LCP   |
| ----------------------------------------- | ---- | ----- | ----- |
| Client, staging, DevTools desktop (their) | 77   | 0.65  | 0.6 s |
| Staging before, headless desktop          | 100  | 0     | 0.7 s |
| Staging before, fonts delayed 1.5 s       | -    | 0.016 | -     |
| Local build after, headless desktop       | 100  | 0     | 0.7 s |
| Local build after, fonts delayed 1.5 s    | -    | 0.000 | -     |
| Local build after, mobile preset          | 84   | 0     | 4.6 s |

Mobile is unchanged from round 3 (its LCP is the hero imagery on the
simulated slow connection, see `../round-3-2026-09-15/`).

## What the report also lists, and why it was left

These are "insights", unscored; the metrics they feed are already at
the top of their bands on desktop.

- Image delivery, 122 KiB: the three product posters are 960px JPEGs
  shown at 551px. They are `<video poster>` files, so `next/image`
  cannot resize them; re-encoding them as WebP at ~700px would save the
  bytes and is a swap in `public/media/product/` plus `media.config.ts`
  (see `docs/asset-swap-guide.md`).
- Legacy JavaScript, 14 KiB: Next's own polyfills for older browsers.
- Unused JavaScript, 25 KiB, in the main chunk.
- Non-composited animations: the sweep and shimmer reveals animate
  `mask-position` and `background-position`, which run on the main
  thread. They do not shift layout; they are flagged for jank risk only.
