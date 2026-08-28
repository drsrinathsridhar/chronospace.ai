import Image from "next/image";

import echoRepeater from "@/app/(home)/assets/echo-repeater-bg.webp";
import echoRepeaterMobile from "@/app/(home)/assets/echo-repeater-bg-mobile.webp";

/**
 * Full-bleed "echo repeater" backdrop — the page's one true overlay: pinned to the
 * frame at inset 0 behind every other section. No scrim, no gradient wash, no border:
 * the headline stays legible because the source image is near-black at the upper right.
 */
export function SplashBackdrop() {
  return (
    <div
      data-section="splash-backdrop"
      data-figma-id="7235:883"
      aria-hidden="true"
      className="enter-scene bg-c-black pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Mobile re-crops the source rather than scaling the desktop crop: the design
          places the 2068 × 1049 image at left: -1498px inside the 375px frame, which
          is 551.47vw wide at -399.47vw — the slice between 72% and 91% of its width. */}
      <Image
        src={echoRepeaterMobile}
        alt=""
        priority
        className="absolute top-0 left-[-399.47vw] h-auto w-[551.47vw] max-w-none md:hidden"
      />
      {/* Tablet is a portrait frame (768 × 1024) while the source is 1.82:1 landscape, so
          `cover` scales to height and only ~41% of the image width stays in frame. Centred,
          that window starts past the orange/magenta bloom, which lives in the leftmost ~13%
          of the source — the design's defining note vanishes. Anchoring the crop to the left
          edge keeps the bloom lower-left, exactly as the desktop mock reads. From `lg` the
          frame is landscape again and the centred crop of the mock is correct. */}
      <Image
        src={echoRepeater}
        alt=""
        priority
        sizes="100vw"
        className="hidden h-full w-full object-cover md:block md:object-left lg:object-center"
      />
    </div>
  );
}
