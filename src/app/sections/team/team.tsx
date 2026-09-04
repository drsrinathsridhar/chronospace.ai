import Image from "next/image";
import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";
import { RevealScope } from "@/components/reveal-scope.client";
import { GithubIcon, LinkedinIcon } from "@/icons/generated";
import aashishRai from "./aashish-rai.png";
import srinathSridhar from "./srinath-sridhar.png";
import tamarKreitman from "./tamar-kreitman.png";

// The team: the claim behind the claims. The header stacks on the centre
// line like the viewer's, and under it the three founders sit in the same
// card grammar as the product section - a bordered column per person, the
// portrait and credentials above a rule, and the links below it as bordered
// tiles, one per profile.
//
// Geometry is the comp's at the 1496px design width: the label 24 above the
// heading, the lede 20 under it on a 577px measure, and the cards in a
// full-width row of three on a 22px gap with the comp's 153px portraits.

type Founder = {
  name: string;
  role: string;
  org: string;
  photo: StaticImageData;
  links: { label: string; href: string; icon: ReactNode }[];
};

const founders: Founder[] = [
  {
    name: "Srinath Sridhar",
    role: "John E. Savage Assistant Professor",
    org: "Brown IVL",
    photo: srinathSridhar,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/drsrinathsridhar",
        icon: <GithubIcon width={24.666} height={24} />,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/srinathsridhar",
        icon: <LinkedinIcon width={24} height={24} />,
      },
    ],
  },
  {
    name: "Tamar Kreitman",
    role: "Lead Hardware Design Engineer",
    org: "Brown IVL",
    photo: tamarKreitman,
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/tamar-kreitman",
        icon: <LinkedinIcon width={24} height={24} />,
      },
    ],
  },
  {
    name: "Aashish Rai",
    role: "Computer Science Ph.D.",
    org: "Brown IVL",
    photo: aashishRai,
    links: [
      {
        label: "GitHub",
        href: "https://github.com/aashishrai3799",
        icon: <GithubIcon width={24.666} height={24} />,
      },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/aashishrai3799",
        icon: <LinkedinIcon width={24} height={24} />,
      },
    ],
  },
];

export function Team() {
  return (
    <section id="team" className="section-container relative pt-20 pb-30">
      <RevealScope>
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className="type-nav shimmer-in"
            style={{ "--beat": 0, "--shimmer-ink": "var(--muted)" }}
          >
            (Our team)
          </p>

          <div className="flex flex-col items-center gap-5">
            <h2
              className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
              style={{ "--beat": 1 }}
            >
              Meet the founders.
            </h2>
            <p
              className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
              style={{ "--beat": 2 }}
            >
              Years of frontier research on reconstructing the physical world,
              now building the infrastructure for it.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {founders.map((founder, index) => (
            <article
              key={founder.name}
              className="border-line sweep-in flex flex-col border"
              style={{ "--beat": 3 + index }}
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
                  <p className="type-nav text-muted">{founder.org}</p>
                </div>
              </div>

              <div className="border-line flex border-t">
                {founder.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-line hover:bg-ink/10 flex flex-col items-center gap-2.5 border-r px-8.75 py-8 transition-colors"
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
