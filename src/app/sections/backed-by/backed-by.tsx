import Image from "next/image";

import a16zSpeedrunLogo from "@/app/(home)/assets/a16z-speedrun-logo.svg";

/**
 * Investor credit, bottom-left of the frame and bottom-aligned with the capture
 * viewport, directly under `contact-email`, which it is built to match. A 16px-gap vertical stack on desktop; on mobile it flips to a single
 * space-between row with the a16z / speedrun lockup flush right at its full 170 × 24.
 */
export function BackedBy() {
  return (
    <div
      data-section="backed-by"
      data-figma-id="7434:3608"
      className="enter enter-d6 gap-sm flex w-full items-center justify-between md:w-fit md:flex-col md:items-start"
    >
      <p className="font-nippo text-label-3 text-c-white-32p uppercase md:w-full">
        Backed by
      </p>
      <Image
        src={a16zSpeedrunLogo}
        alt="a16z speedrun"
        className="h-[24px] w-[170px] shrink-0"
      />
    </div>
  );
}
