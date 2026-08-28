/**
 * Direct contact address, bottom-left, stacked above the investor credit and built to
 * pair with it: the same uppercase `label-3` caption in `c-white-32p` over its payload,
 * on the same 16px gap. The CTA above still goes to the booking calendar — this is the
 * way in for people who would rather write than book a slot.
 *
 * Not a Figma node. It is a client addition, recorded in `docs/pages/page.md` under
 * "Copy as shipped" alongside the other deviations from the design file.
 *
 * Hover and focus draw the underline in, on the standard 400ms fluid pairing — the text
 * itself does not change colour. The address is the only text on the splash that is a
 * link rather than a button, and the underline alone is the cue; `focus-visible` adds
 * the 2px white ring on top, so keyboard users still get something colour-independent.
 */
export function ContactEmail() {
  return (
    <div
      data-section="contact-email"
      className="enter enter-d5 gap-sm flex w-full items-center justify-between md:w-fit md:flex-col md:items-start"
    >
      <p className="font-nippo text-label-3 text-c-white-32p uppercase md:w-full">
        Contact
      </p>
      <a
        href="mailto:contact@chronospace.ai"
        className="font-nippo text-label-1 text-c-white focus-visible:outline-c-white ease-fluid underline decoration-transparent underline-offset-4 transition-colors duration-400 hover:decoration-current focus-visible:decoration-current focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
      >
        contact@chronospace.ai
      </a>
    </div>
  );
}
