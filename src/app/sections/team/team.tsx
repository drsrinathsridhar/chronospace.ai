import Image from "next/image";
import type { StaticImageData } from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import aashishRai from "./aashish-rai.png";
import srinathSridhar from "./srinath-sridhar.png";
import tamarKreitman from "./tamar-kreitman.png";

// The team: the claim behind the claims. The header stacks on the centre
// line like the viewer's, and under it the three founders sit in open
// columns - no frame around the person, no rule; the portrait and the
// name/role stack (comp node 7802:8912, trimmed on client feedback: the
// credential and org lines are gone, and the profile tile with it - the
// portrait itself is the LinkedIn link now).
//
// Geometry is the comp's at the 1496px design width: the lede 20 under the
// heading on a 577px measure, and the cards in a full-width row of three on
// a 22px gap with the comp's 153px portraits.

type Founder = {
  name: string;
  role: string;
  photo: StaticImageData;
  /** The portrait links here - no visible mark, the photo is the link. */
  linkedin: string;
};

const founders: Founder[] = [
  {
    name: "Srinath Sridhar",
    role: "CEO",
    photo: srinathSridhar,
    linkedin: "https://www.linkedin.com/in/srinathsridhar",
  },
  {
    name: "Tamar Kreitman",
    role: "Head of Systems",
    photo: tamarKreitman,
    linkedin: "https://www.linkedin.com/in/tamar-kreitman",
  },
  {
    name: "Aashish Rai",
    role: "Head of Spatial AI",
    photo: aashishRai,
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

        <div className="mt-section-gap grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              <div className="flex flex-1 flex-col gap-6 px-8 py-6">
                <a
                  href={founder.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${founder.name} on LinkedIn`}
                  className="w-fit transition-opacity hover:opacity-80"
                >
                  <Image
                    src={founder.photo}
                    alt={`Portrait of ${founder.name}`}
                    className="size-38.25 object-cover"
                  />
                </a>
                <div className="flex flex-col gap-1">
                  <h3 className="type-title-lg">{founder.name}</h3>
                  <p className="type-body-md leading-tight font-light">
                    {founder.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
