import Image from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import { LinkedinIcon } from "@/icons/generated";
import { media } from "@/media.config";

// The team: the claim behind the claims. The header stacks on the centre
// line like the viewer's, and under it the three founders sit in the
// capture grammar the rest of the page speaks - a square portrait filling
// its column, in colour, and under it a caption hung off a hairline the
// way the product claims hang off their transports: the name and a
// LinkedIn link on one line, the role beneath.
//
// Round 2 of client feedback (September 2026) tightened the row: the
// heading is just "Team", the LinkedIn entry is the network's own glyph
// beside the word rather than a rotated arrow, and the portraits are a
// step smaller with more air between them, on the page-wide panel gap
// (--spacing-panel, 40px) every three-column row now shares. Round 3 took
// the row down another fifth, to a 976px measure inside the content box,
// and dropped the grey-at-rest treatment the portraits had shared with the
// hero figures and the takes (grayscale, colour back on hover) - the
// client wants the founders in colour, full stop.
//
// This replaces the comp's 153px tiles in open columns (node 7802:8912) at
// the client's request, September 2026: the small tiles with their text
// stacked underneath read as a corporate-2000s staff page and, sitting on
// the left of a 457px column, skewed the whole row left.
//
// Two links per founder, one of them accessible: the portrait links out so
// the picture behaves like everyone expects it to, but it is hidden from
// assistive tech and out of the tab order; the caption's "LinkedIn" is the
// single entry a keyboard or screen reader meets per person.
//
// Portraits are the client's stills as sent, square and re-encoded to JPEG
// at up to 1000px - no crop, no upscale, so the 512px source stays 512.
// They live under public/media/team and are named in media.config.ts, so
// a new portrait is a file swap.
//
// Geometry is the comp's at the 1496px design width: the lede 20 under the
// heading on a 577px measure, the cards in a centred row of three on the
// panel gap (976px wide, so each portrait is ~299 rather than the comp's
// 457), and the caption set like the product claim (node 7802:8456): a
// full-width rule, title and copy on a 12px gap inside 24px of vertical
// padding.

type Founder = {
  name: string;
  role: string;
  /** Public path of the portrait - see media.config.ts. */
  photo: string;
  linkedin: string;
};

const founders: Founder[] = [
  {
    name: "Srinath Sridhar",
    role: "CEO",
    photo: media.team.srinathSridhar,
    linkedin: "https://www.linkedin.com/in/srinathsridhar",
  },
  {
    name: "Tamar Kreitman",
    role: "Head of Systems",
    photo: media.team.tamarKreitman,
    linkedin: "https://www.linkedin.com/in/tamar-kreitman",
  },
  {
    name: "Aashish Rai",
    role: "Head of Spatial AI",
    photo: media.team.aashishRai,
    linkedin: "https://www.linkedin.com/in/aashishrai3799",
  },
];

export function Team() {
  return (
    <section id="team" className="section-container py-section relative">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Team
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Years of frontier research on reconstructing the physical world, now
            building the infrastructure for it.
          </p>
        </div>

        <div className="mt-section-gap gap-panel mx-auto grid w-full max-w-244 grid-cols-1 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              {/* The portrait is a link too, but the caption's link is the
                  accessible one - one LinkedIn entry per person for the
                  keyboard and screen readers. */}
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noreferrer"
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-square overflow-clip"
              >
                <Image
                  src={founder.photo}
                  alt=""
                  fill
                  sizes="(min-width: 48rem) 22vw, 100vw"
                  className="object-cover"
                />
              </a>
              <div className="border-line flex flex-col gap-3 border-t py-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="type-title-lg">{founder.name}</h3>
                  <a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${founder.name} on LinkedIn`}
                    className="type-nav text-muted hover:text-ink focus-visible:text-ink flex items-center gap-2 transition-colors duration-150 ease-out"
                  >
                    <LinkedinIcon
                      width={14}
                      height={14}
                      className="text-accent shrink-0"
                    />
                    LinkedIn
                  </a>
                </div>
                <p className="type-body-lg leading-tight font-light">
                  {founder.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
