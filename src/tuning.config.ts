// The knobs the client asked to keep turning after handoff (feedback round
// 2, slide 10): one file, plain numbers, no code elsewhere to touch. Every
// value here becomes a CSS custom property on <html> (app/layout.tsx), and
// the styles that move read the property - so a change here is a change
// everywhere the effect appears, and nothing else re-renders.
//
// See docs/asset-swap-guide.md for what each knob does on the page.

export const tuning = {
  /**
   * How far the hero room and its figures move with the pointer, as a
   * multiplier on the designed travel. 1 is the shipped amount, 0 parks the
   * room, 2 doubles the wiggle. Reduced-motion users never see it at all.
   */
  heroWiggle: 1,

  /**
   * How bright the resting (desaturated) hero figures are. 1 is the source
   * cutout's own luminance; the room's "pristine white" look wants more,
   * but not much more: the shipped 2 pushed every highlight past white and
   * the renders lost their detail (client feedback, round 3, slide 2). The
   * lift is gentle now and the contrast below puts the light back. The
   * owner sets the exact pair in the browser. Hover and the load-time echo
   * show the figure in its true colour.
   */
  heroFigureBrightness: 1.25,

  /**
   * How much the resting figures' tones are stretched after the lift. 1
   * leaves them as the cutout has them; a little over 1 gives the grey
   * figure back the edge the colour one has, without clipping.
   */
  heroFigureContrast: 1.08,

  /**
   * The colour treatment on every video plate. "colour" shows the take as
   * shot; "mono" desaturates it into the page's grey and lets the paper
   * tint it (the original comp). Client feedback round 2: colour for now.
   */
  videoTone: "colour" as "colour" | "mono",
} as const;

/**
 * The video treatment as the two CSS values the plate reads
 * (components/timeline-player.module.css): the grayscale amount and the
 * blend mode. app/layout.tsx writes them on the root next to the other
 * knobs.
 */
export const videoTone =
  tuning.videoTone === "mono"
    ? { grayscale: 1, blend: "luminosity" }
    : { grayscale: 0, blend: "normal" };
