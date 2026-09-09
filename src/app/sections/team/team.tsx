import Image from "next/image";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import { LinkedinIcon } from "@/icons/generated";
import aashishRai from "./aashish-rai.png";
import srinathSridhar from "./srinath-sridhar.png";
import tamarKreitman from "./tamar-kreitman.png";

// The team: the claim behind the claims. The header stacks on the centre
// line like the viewer's, and under it the three founders sit in open
// columns - no frame around the person, no rule; the portrait and
// credentials stack, and the profile link closes the column as one compact
// bordered tile (comp node 7802:8912).
//
// Each person leads with their company role and carries their credential
// under it - the company first, the research pedigree as the support.
//
// Geometry is the comp's at the 1496px design width: the lede 20 under the
// heading on a 577px measure, and the cards in a full-width row of three on
// a 22px gap with the comp's 153px portraits.

type Founder = {
  name: string;
  /** The company role, leading. */
  role: string;
  /** The research credential, supporting. */
  credential: string;
  org: string;
  photo: StaticImageData;
  links: { label: string; href: string; icon: ReactNode }[];
};

const founders: Founder[] = [
  {
    name: "Srinath Sridhar",
    role: "CEO",
    credential: "Assoc Professor at Brown Uni",
    org: "Brown IVL",
    photo: srinathSridhar,
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/srinathsridhar",
        icon: <LinkedinIcon width={20} height={20} />,
      },
    ],
  },
  {
    name: "Tamar Kreitman",
    role: "Head of Systems",
    credential: "Lead Hardware Design Engineer",
    org: "Brown IVL",
    photo: tamarKreitman,
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/tamar-kreitman",
        icon: <LinkedinIcon width={20} height={20} />,
      },
    ],
  },
  {
    name: "Aashish Rai",
    role: "Head of Spatial AI",
    credential: "Computer Science Ph.D.",
    org: "Brown IVL",
    photo: aashishRai,
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aashishrai3799",
        icon: <LinkedinIcon width={20} height={20} />,
      },
    ],
  },
];

export function Team() {
  return (
    <section id="team" className="section-container relative pt-20 pb-30">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Meet Team
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Years of frontier research on reconstructing the physical world, now
            building the infrastructure for it.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              <div className="flex flex-1 flex-col gap-6 px-8 py-6">
                <Image
                  src={founder.photo}
                  alt={`Portrait of ${founder.name}`}
                  className="size-38.25 object-cover"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="type-title-lg">{founder.name}</h3>
                  <p className="type-body-md leading-tight font-light">
                    {founder.role}
                  </p>
                  <p className="type-body-md leading-tight font-light opacity-60">
                    {founder.credential}
                  </p>
                  <p className="type-nav text-muted">{founder.org}</p>
                </div>
              </div>

              {/* The profile tile: a compact bordered square under the
                  credentials - the comp's 12px padding on a 10px gap with
                  the mark at 20. */}
              <div className="flex gap-3 px-8">
                {founder.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line hover:bg-ink/10 flex flex-col items-center justify-center gap-2.5 border p-3 transition-colors"
                  >
                    {link.icon}
                    <span className="type-nav">{link.label}</span>
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
