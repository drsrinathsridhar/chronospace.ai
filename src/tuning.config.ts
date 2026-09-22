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
  heroFigureBrightness: 1.12,

  /**
   * How much the resting figures' tones are stretched after the lift. 1
   * leaves them as the cutout has them; a little over 1 gives the grey
   * figure back the edge the colour one has, without clipping.
   */
  heroFigureContrast: 1,

  /**
   * The captures' motion trail - what a figure carries when it is hovered,
   * when it takes its turn in the round robin, and once on arrival. The
   * three stepped copies of the first build read as "very extra" (client
   * feedback, round 3, slide 3), so the trail is now one layer behind the
   * figure, and this is its whole vocabulary:
   *
   *   mode: "smear" is the client's option A - the figure stretched back
   *   along its travel, blurred along that axis and fading to nothing, the
   *   length breathing with how fast the eye is moving (the "Fading Motion
   *   Effect" reference). "flare" is option B - the header logo's
   *   treatment: no trail at all, a band of colour flying once across the
   *   figure, which stays grey under it.
   *
   *   colour: "true" paints the trail in the cutout's own colour (so the
   *   arrival still lands in colour); "accent" floods it with the brand
   *   orange, "ink" with the page's ink. The flare is the logo's when it is
   *   "accent".
   *
   *   length and blur multiply the designed smear - 1 is as shipped, 0.5
   *   halves the tail or the softness, 2 doubles them (blur below ~0.45
   *   starts clipping the tail; nothing else is bounded). opacity is the
   *   trail's own, 0..1, at the fastest sweep; a still figure shows 70% of
   *   it. The flare uses length and blur for nothing.
   */
  heroTrail: {
    mode: "smear" as "smear" | "flare",
    colour: "true" as "true" | "accent" | "ink",
    length: 1,
    blur: 1,
    opacity: 0.6,
  },

  /**
   * The colour treatment on every video plate. "colour" shows the take as
   * shot; "mono" desaturates it into the page's grey and lets the paper
   * tint it (the original comp). Client feedback round 2: colour for now.
   */
  videoTone: "colour" as "colour" | "mono",
} as const;
