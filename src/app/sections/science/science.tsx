import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";

// The science: the papers behind the product, filed like records rather
// than promoted like features. The header stacks on the centre line like
// the viewer's and the team's, and under it the publications run as a
// ledger - full-bleed rules top and bottom, one bordered row per paper
// with its date on the gutter label style, and the row's action in the
// call-to-action grammar at the list scale.
//
// Geometry is the comp's at the 1496px design width: the lede 20 under
// the heading, 80 from the header to the ledger, and 92-tall rows on 32
// padding with the date and title on an 80 gap.
//
// The rows sweep in on the section's reveal, one beat after the header's
// shimmer, top to bottom - the ledger filling in entry order.

type Paper = {
  date: string;
  title: string;
  href: string;
};

const papers: Paper[] = [
  {
    date: "2026 · 04",
    title: "Long-duration 4D reconstruction from uncalibrated capture",
    href: "https://ivl.cs.brown.edu/",
  },
  {
    date: "2026 · 02",
    title: "Streaming a scene: compression that stays measurable",
    href: "https://ivl.cs.brown.edu/",
  },
  {
    date: "2026 · 04",
    title: "Capture in the wild: results across six industrial sites",
    href: "https://ivl.cs.brown.edu/",
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
            The work behind the capture.
          </h2>
          <p
            className="type-body-xl shimmer-in text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Papers, technical notes and results from the team.
          </p>
        </div>

        {/* The rules run full-bleed; the rows step back into the content box. */}
        <div className="border-line -mx-gutter mt-20 border-t border-b">
          <ul className="mx-gutter">
            {papers.map((paper, index) => (
              <li
                key={paper.title}
                className="border-line sweep-in flex flex-col gap-6 border-r border-b border-l p-6 last:border-b-0 md:flex-row md:items-center md:p-8"
                style={{ "--beat": 2 + index }}
              >
                <span className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-20">
                  <span className="type-nav text-muted shrink-0">
                    ({paper.date})
                  </span>
                  <h3 className="type-title-lg text-balance">{paper.title}</h3>
                </span>

                <CtaLink
                  href={paper.href}
                  target="_blank"
                  rel="noreferrer"
                  size="list"
                  variant="outline"
                  className="shrink-0 md:ml-auto"
                >
                  Read the paper
                </CtaLink>
              </li>
            ))}
          </ul>
        </div>
      </RevealScope>
    </section>
  );
}
