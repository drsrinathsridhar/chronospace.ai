import type { ReactNode } from "react";
import {
  A16zSpeedrunIcon,
  BrownAngelGroupIcon,
  NvidiaIcon,
  VelaIcon,
} from "@/icons/generated";
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
// NVIDIA Inception has no single wordmark lockup we can ship, so the cell
// pairs the NVIDIA mark with the program's name set in the band's own
// chrome type. Tech Ventures is typeset outright until the client sends
// the mark.

const backers: { name: string; mark: ReactNode }[] = [
  {
    name: "NVIDIA Inception",
    mark: (
      <span className="flex items-center gap-3">
        <NvidiaIcon width={85} height={16} />
        <span className="type-nav">Inception</span>
      </span>
    ),
  },
  {
    name: "a16z speedrun",
    mark: <A16zSpeedrunIcon width={156} height={22} />,
  },
  {
    name: "Tech Ventures",
    mark: <span className="type-title-sm uppercase">Tech Ventures</span>,
  },
  {
    name: "Brown Angel Group",
    mark: <BrownAngelGroupIcon width={88} height={36} />,
  },
  {
    name: "Vela Partners",
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
        className="border-line sweep-reveal h-backing-band flex items-center border-b"
        style={{ "--reveal-index": 7 }}
      >
        <p className="type-nav text-muted flex-none pr-6 md:pr-10">
          (Backed by)
        </p>

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
                <li
                  key={backer.name}
                  className="text-ink flex flex-none items-center opacity-60"
                >
                  {copy === 0 && <span className="sr-only">{backer.name}</span>}
                  <span aria-hidden>{backer.mark}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
