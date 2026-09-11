import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";
import { media } from "@/media.config";

// Research & Insights: the work behind the product, one entry per kind -
// the paper, the coverage, the post. The header stacks on the centre line
// like the viewer's and the team's, and under it the entries sit in the
// product section's card grammar: a plate on top, a hairline, and the
// record under it. No box around the card and no header strip - the
// bordered "wireframe" build read as unfinished (client feedback, round
// 2), so the entries now stand on the page like the takes and the
// portraits do, on the page-wide panel gap.
//
// Each card is its picture, its label, the entry's title, a one-line blurb,
// and the row's action in the call-to-action grammar at the list scale,
// pinned to the card's foot so the three actions land on one line whatever
// the titles wrap to.
//
// The pictures are placeholders the client swaps (feedback, round 2): one
// JPEG per entry under public/media/science (media.config.ts), drawn in
// the product plate's 577/310 frame with object-fit: cover so any size or
// ratio dropped in fills it. Until the real artwork arrives they are stills
// from the site's own captures. TODO(client): the final image per entry.
//
// The cards sweep in on the section's reveal, one beat after the header's
// shimmer, left to right.

type Entry = {
  label: string;
  title: string;
  blurb: string;
  href: string;
  action: string;
  /** Public path of the plate's picture - swap the file, keep the name. */
  image: string;
};

// TODO: point each entry at the real publication once the client sends
// the links - the lab site stands in for all three meanwhile.
const entries: Entry[] = [
  {
    label: "Research paper",
    title: "Long-duration 4D reconstruction from uncalibrated capture",
    blurb:
      "Full-scene geometry recovered over minutes, not seconds, from cameras that were never calibrated.",
    href: "https://ivl.cs.brown.edu/",
    action: "Read the paper",
    image: media.science.paper,
  },
  {
    label: "Media coverage",
    title: "ChronoSpace sets out to digitize the physical world",
    blurb:
      "Press coverage of the capture rig and the team behind the technology.",
    href: "https://ivl.cs.brown.edu/",
    action: "Read the story",
    image: media.science.press,
  },
  {
    label: "Blog post",
    title: "Why everything has to be measurable",
    blurb:
      "Notes from the team on building capture you can still query after the fact.",
    href: "https://ivl.cs.brown.edu/",
    action: "Read the post",
    image: media.science.post,
  },
];

export function Science() {
  return (
    <section id="science" className="section-container py-section relative">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Research &amp; Insights
          </h2>
          <p
            className="type-body-xl shimmer-in text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Papers, technical notes and results from the team.
          </p>
        </div>

        <div className="mt-section-gap gap-panel grid grid-cols-1 md:grid-cols-3">
          {entries.map((entry, index) => (
            <article
              key={entry.title}
              className="sweep-in flex flex-col"
              style={{ "--beat": 2 + index }}
            >
              <div className="bg-surface relative aspect-577/310 overflow-clip">
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(min-width: 48rem) 33vw, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="border-line flex flex-1 flex-col gap-3 border-t py-6">
                <p className="type-nav text-muted">{entry.label}</p>
                <h3 className="type-title-lg text-balance">{entry.title}</h3>
                <p className="type-body-lg leading-tight font-light">
                  {entry.blurb}
                </p>

                <CtaLink
                  href={entry.href}
                  target="_blank"
                  rel="noreferrer"
                  size="list"
                  variant="outline"
                  className="mt-3 md:mt-auto"
                >
                  {entry.action}
                </CtaLink>
              </div>
            </article>
          ))}
        </div>
      </RevealScope>
    </section>
  );
}
