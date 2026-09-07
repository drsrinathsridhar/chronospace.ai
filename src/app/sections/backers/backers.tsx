import type { ReactNode } from "react";
import { RevealScope } from "@/components/reveal-scope.client";
import {
  A16zSpeedrunIcon,
  BrownAngelGroupIcon,
  NvidiaIcon,
  VelaIcon,
} from "@/icons/generated";
import styles from "./backers.module.css";

// The backing band: directly under the hero, before the page settles into
// reading copy - one full-bleed strip of the firms and programs behind the
// company, moving the way everything in the hero moved, left along the
// timeline. The strip is framed by the same hairlines as the section rows
// later on, so it reads as another instrument in the HUD rather than a
// gallery.
//
// The marks travel as a conveyor (backers.module.css): several identical
// tracks laid end to end, each translating its own width, enough copies that
// the band never runs dry on wide screens. Only the first track is exposed
// to assistive tech; the copies are scenery.
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
    <section aria-label="Backed by" className="relative py-14 md:py-16">
      <RevealScope>
        <p
          className="type-nav shimmer-in section-container"
          style={{ "--beat": 0, "--shimmer-ink": "var(--muted)" }}
        >
          (Backed by)
        </p>

        <div
          className={`${styles.band} border-line sweep-in mt-8 flex overflow-hidden border-y`}
          style={{ "--beat": 1 }}
        >
          {Array.from({ length: trackCopies }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 || undefined}
              className={`${styles.track} flex flex-none items-center gap-16 py-7 pl-16 md:gap-24 md:pl-24`}
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
      </RevealScope>
    </section>
  );
}
