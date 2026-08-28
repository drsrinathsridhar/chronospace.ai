import Image from "next/image";

import chronospaceLogo from "@/app/(home)/assets/chronospace-logo.svg";

/**
 * ChronoSpace lockup — hexagonal "S" monogram + wordmark, top-left of the content
 * container. 293 × 56 on desktop, the same artwork at 167 × 32 on mobile. It is not a
 * link in this design and carries no hover state.
 */
export function BrandMark() {
  return (
    <div
      data-section="brand-mark"
      data-figma-id="7434:4454"
      className="enter w-fit"
    >
      <Image
        src={chronospaceLogo}
        alt="ChronoSpace"
        priority
        className="h-[32px] w-auto md:h-[56px]"
      />
    </div>
  );
}
