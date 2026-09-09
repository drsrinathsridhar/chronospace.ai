import Image from "next/image";
import type { StaticImageData } from "next/image";
import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { ReadProgress } from "@/components/read-progress.client";
import { RevealScope } from "@/components/reveal-scope.client";
import { VisionParallax } from "./vision-parallax.client";
import arm from "./arm.png";
import dancer1 from "./dancer-1.png";
import dancer2 from "./dancer-2.png";
import dancer3 from "./dancer-3.png";
import dancerMain from "./dancer-main.png";
import echoRepeater from "./echo-repeater.png";
import styles from "./vision.module.css";

// The vision, and the close: the claim in the middle - a world where every
// physical process can be replayed, measured and learned from - with the
// call to action under it and a capture's trail standing on either side,
// the dancer and the robot arm each smeared into their own history.
//
// The comp freezes the claim mid-read ("...can be r|eplayed"), the same
// state the intro carries, so it takes the same treatment: the copy is
// split into words on the server and the shared read-progress island
// brightens them in reading order as the block travels the viewport.
//
// The trails are the reveal - see vision.module.css: the subjects arrive in
// place, then their echoes fan out copy by copy. The dancer's echoes are
// genuinely different frames of the take, so the fan reads as motion; the
// arm's are the comp's repeated plate. Both mirror the comp's flip.
//
// Behind all of it, the echo-repeater: a capture's colour smeared into a
// cascade of fins, inherited from the footer when its duplicate ask was
// removed - this is the page's one connect moment, so the artwork closes
// it. It stretches to the section's box, and its alpha plate leaves the
// paper showing through.

const heading =
  "A world where every physical process can be replayed, measured and learned from";
const words = heading.split(" ");

type Echo = {
  image: StaticImageData;
  /** Resting position, as a fraction of the cluster. */
  left: string;
  /** Resting opacity - the trail's falloff. */
  opacity: number;
  /** Signed travel back to the subject, in the copy's own width. */
  shift: string;
  /** 0 is the subject; higher is further back along the trail. */
  index: number;
};

const dancerTrail: Echo[] = [
  { image: dancer3, left: "1.55%", opacity: 0.2, shift: "77.1%", index: 3 },
  { image: dancer2, left: "15.81%", opacity: 0.3, shift: "51.4%", index: 2 },
  { image: dancer1, left: "30.07%", opacity: 0.6, shift: "25.7%", index: 1 },
  { image: dancerMain, left: "44.33%", opacity: 1, shift: "0%", index: 0 },
];

const armTrail: Echo[] = [
  { image: arm, left: "0%", opacity: 1, shift: "0%", index: 0 },
  { image: arm, left: "11.18%", opacity: 0.7, shift: "-18.1%", index: 1 },
  { image: arm, left: "25.15%", opacity: 0.5, shift: "-40.8%", index: 2 },
  { image: arm, left: "38.32%", opacity: 0.2, shift: "-62.1%", index: 3 },
];

function Trail({ echoes, className }: { echoes: Echo[]; className: string }) {
  return (
    <div aria-hidden className={`${styles.trail} ${className}`}>
      {echoes.map((echo) => (
        <span
          key={echo.index}
          className={styles.echo}
          style={{
            "--echo-left": echo.left,
            "--echo-opacity": echo.opacity,
            "--echo-shift": echo.shift,
            "--echo-index": echo.index,
            "--echo-aspect": `${echo.image.width} / ${echo.image.height}`,
          }}
        >
          <Image
            src={echo.image}
            alt=""
            fill
            sizes="30vw"
            className="-scale-x-100 object-cover"
          />
        </span>
      ))}
    </div>
  );
}

export function Vision() {
  return (
    <section
      id="vision"
      className="section-container relative overflow-clip py-30"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <Image
          src={echoRepeater}
          alt=""
          fill
          sizes="100vw"
          className="object-fill"
        />
      </div>

      <RevealScope className="relative flex flex-col items-center justify-center xl:min-h-110">
        <VisionParallax>
          <Trail echoes={dancerTrail} className={styles.dancer} />
          <Trail echoes={armTrail} className={styles.arm} />
        </VisionParallax>

        <div className="relative flex flex-col items-center gap-6 text-center">
          <h2
            className={`${styles.copy} type-display-xs sm:type-display-sm lg:type-display-md max-w-152.75 text-balance`}
            data-read-copy
            style={{ "--word-count": words.length }}
          >
            <span className="sr-only">{heading}</span>
            <span aria-hidden>
              {words.map((word, index) => (
                <span
                  key={index}
                  className={styles.word}
                  style={{ "--word-index": index }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
          </h2>

          <CtaLink
            href={siteConfig.links.contact}
            className="sweep-in"
            style={{ "--beat": 0 }}
          >
            Connect with us
          </CtaLink>

          <ReadProgress />
        </div>
      </RevealScope>
    </section>
  );
}
