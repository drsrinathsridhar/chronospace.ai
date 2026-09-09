import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";

// Research & Insights: the work behind the product, one entry per kind -
// the paper, the coverage, the post. The header stacks on the centre line
// like the viewer's and the team's, and under it the entries sit in the
// same card grammar as the product section: a labelled header strip and
// the claim under it - no plate; the entries are records, not evidence,
// so they carry no thumbnails.
//
// Each card is its label, the entry's title, a one-line blurb, and the
// row's action in the call-to-action grammar at the list scale, pinned to
// the card's foot so the three actions land on one line whatever the
// titles wrap to.
//
// The cards sweep in on the section's reveal, one beat after the header's
// shimmer, left to right.

type Entry = {
  label: string;
  title: string;
  blurb: string;
  href: string;
  action: string;
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
  },
  {
    label: "Media coverage",
    title: "ChronoSpace sets out to digitize the physical world",
    blurb:
      "Press coverage of the capture rig and the team behind the technology.",
    href: "https://ivl.cs.brown.edu/",
    action: "Read the story",
  },
  {
    label: "Blog post",
    title: "Why everything has to be measurable",
    blurb:
      "Notes from the team on building capture you can still query after the fact.",
    href: "https://ivl.cs.brown.edu/",
    action: "Read the post",
  },
];

export function Science() {
  return (
    <section id="science" className="section-container relative pt-18 pb-30">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Research &amp; Insights.
          </h2>
          <p
            className="type-body-xl shimmer-in text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Papers, technical notes and results from the team.
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {entries.map((entry, index) => (
            <article
              key={entry.title}
              className="border-line sweep-in flex flex-col border"
              style={{ "--beat": 2 + index }}
            >
              <header className="bg-paper border-line border-b p-8">
                <p className="type-nav text-muted">{entry.label}</p>
              </header>

              <div className="flex flex-1 flex-col gap-6 px-8 py-10">
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
                  className="mt-auto"
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
