import Image from "next/image";
import type { ReactNode } from "react";
import {
  A16zSpeedrunIcon,
  BrownAngelGroupIcon,
  TekVenturesIcon,
  VelaIcon,
} from "@/icons/generated";
// The marks borrow the navbar logo's hover flare - one gesture, one source
// (see the note atop site-header.module.css). CSS modules make the import
// safe: the same class composes to the same generated name.
import flare from "@/components/site-header.module.css";
import { media } from "@/media.config";
import styles from "./backers.module.css";

// The backing band: the last row of the first screen. The hero gives up
// exactly `--spacing-backing-band` of the viewport (hero.tsx), so the band
// closes the fold with the timecode ruler as its top border - the strip
// shares the ruler's section-container width, and a plain hairline closes
// it underneath. The label rides inside the strip the way "Timecode" rides
// the ruler; the marks travel past it as a conveyor, left along the
// timeline like everything else on this screen.
//
// The conveyor (backers.module.css) is several identical tracks laid end to
// end, each translating its own width, enough copies that the band never
// runs dry on wide screens. Only the first track is exposed to assistive
// tech; the copies are scenery. The band is on screen at load, so it joins
// the page's own reveal clock (--reveal-index) after the ruler instead of
// waiting on a scroll trigger.
//
// NVIDIA Inception ships the program's own lockup (client feedback round
// 2): a raster the client supplied, black on transparent, served from
// public/media/backers so it can be swapped like any other asset. The band
// is monochrome ink, so the raster is reduced to a white silhouette by
// filter (backers.module.css) and the flare copy to an orange one - the
// closest a bitmap gets to the SVG marks' currentColor.
// TODO(client): an SVG or white version of the lockup removes the filters.
// TekVentures pairs their V mark (tek.ventures) with the name - the mark's
// three reds translated into three tones of the band's own ink in the icon
// source.
//
// Every mark is a link to the backer's site, opening in a new tab; hover
// hands the mark the navbar logo's orange flare and lifts it to full ink.

const backers: { name: string; href: string; mark: ReactNode }[] = [
  {
    name: "NVIDIA Inception",
    href: "https://www.nvidia.com/en-us/startups/",
    mark: (
      <Image
        src={media.backers.nvidiaInception}
        alt=""
        width={104}
        height={40}
        className={styles.raster}
      />
    ),
  },
  {
    name: "a16z speedrun",
    href: "https://speedrun.a16z.com/",
    mark: <A16zSpeedrunIcon width={156} height={22} />,
  },
  {
    name: "TekVentures",
    href: "https://www.tek.ventures/",
    mark: (
      <span className="flex items-center gap-3">
        <TekVenturesIcon width={26} height={26} />
        <span className="type-nav">TekVentures</span>
      </span>
    ),
  },
  {
    name: "Brown Angel Group",
    href: "https://www.brownangelgroup.org/",
    mark: <BrownAngelGroupIcon width={88} height={36} />,
  },
  {
    name: "Vela Partners",
    href: "https://vela.partners/",
    mark: (
      <span className="flex items-center gap-3">
        <VelaIcon width={74} height={28} />
        <span className="type-nav">Partners</span>
      </span>
    ),
  },
];

// Enough tracks that (copies - 1) x track width clears an ultra-wide
// viewport while the band scrolls.
const trackCopies = 4;

export function Backers() {
  return (
    <section aria-label="Backed by" className="section-container">
      <div
        className="sweep-reveal h-backing-band flex items-center"
        style={{ "--reveal-index": 7 }}
      >
        <p className="type-nav text-muted flex-none pr-6 md:pr-10">Backed by</p>

        <div
          className={`${styles.band} flex h-full items-center overflow-hidden`}
        >
          {Array.from({ length: trackCopies }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 || undefined}
              className={`${styles.track} flex flex-none items-center gap-16 pl-16 md:gap-24 md:pl-24`}
            >
              {backers.map((backer) => (
                <li key={backer.name} className="flex flex-none items-center">
                  {/*
                   * Duplicate tracks are aria-hidden scenery, but hidden
                   * links would still catch the keyboard - so only the
                   * first track's links are tabbable.
                   */}
                  <a
                    href={backer.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={copy > 0 ? -1 : undefined}
                    className="text-ink focus-visible:outline-ink relative flex items-center opacity-60 transition-opacity duration-150 ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {copy === 0 && (
                      <span className="sr-only">{backer.name}</span>
                    )}
                    <span aria-hidden>{backer.mark}</span>
                    <span
                      aria-hidden
                      className={`${flare.flare} text-accent absolute inset-0 flex items-center`}
                    >
                      {backer.mark}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
