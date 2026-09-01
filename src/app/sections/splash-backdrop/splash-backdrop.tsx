import echoRepeater from "@/app/(home)/assets/echo-repeater-bg.webp";
import echoRepeaterMobile from "@/app/(home)/assets/echo-repeater-bg-mobile.webp";

/**
 * Full-bleed "echo repeater" backdrop — the page's one true overlay: pinned to the
 * frame at inset 0 behind every other section. No scrim, no gradient wash, no border:
 * the headline stays legible because the source image is near-black at the upper right.
 *
 * The two crops are art direction, not resolution variants, so this is a <picture>
 * rather than a next/image: `hidden`/`md:hidden` on two <Image>s still downloads both
 * files on every device, and the preload next/image emits cannot carry a media query.
 * A <picture> fetches only the matching <source>, and the two hand-written preloads
 * below are the only way to keep the LCP hint viewport-scoped. Static imports keep the
 * hashed URLs and intrinsic dimensions.
 */
export function SplashBackdrop() {
  return (
    <div
      data-section="splash-backdrop"
      data-figma-id="7235:883"
      aria-hidden="true"
      className="enter-scene bg-c-black pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* React hoists these into <head>. One matches, one is ignored — so a phone never
          pays for the desktop crop, and a desktop never pays for the mobile one. */}
      <link
        rel="preload"
        as="image"
        href={echoRepeaterMobile.src}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={echoRepeater.src}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <picture>
        {/* Tablet is a portrait frame (768 × 1024) while the source is 1.82:1 landscape, so
            `cover` scales to height and only ~41% of the image width stays in frame. Centred,
            that window starts past the orange/magenta bloom, which lives in the leftmost ~13%
            of the source — the design's defining note vanishes. Anchoring the crop to the left
            edge keeps the bloom lower-left, exactly as the desktop mock reads. From `lg` the
            frame is landscape again and the centred crop of the mock is correct. */}
        <source
          media="(min-width: 768px)"
          srcSet={echoRepeater.src}
          width={echoRepeater.width}
          height={echoRepeater.height}
        />
        {/* Below `md` the design re-crops the source rather than scaling the desktop crop:
            it places the 2068 × 1049 image at left: -1498px inside the 375px frame, which
            is 551.47vw wide at -399.47vw — the slice between 72% and 91% of its width.
            The `md:` half of this class list is the desktop crop's own geometry. */}
        <img
          src={echoRepeaterMobile.src}
          width={echoRepeaterMobile.width}
          height={echoRepeaterMobile.height}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute top-0 left-[-399.47vw] h-auto w-[551.47vw] max-w-none md:static md:h-full md:w-full md:object-cover md:object-left lg:object-center"
        />
      </picture>
    </div>
  );
}
