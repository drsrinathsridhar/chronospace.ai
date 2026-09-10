import { siteConfig } from "@/site.config";
import { RevealScope } from "@/components/reveal-scope.client";
import { ChronospaceLogoIcon, TimelineTickIcon } from "@/icons/generated";

// The close of the page: the sign-off band alone. The partnership ask that
// used to sit above it duplicated the vision section's connect action, so
// the ask is gone and the echo-repeater artwork moved up to back the vision
// section (sections/vision) - one connect moment, one backdrop.
//
// Two rows on the same three-column grid the cards above stand on (client
// feedback, September 2026: the old stack of five 64px cells read as loose,
// ungrouped and detached from the layout). The first row is the wordmark
// across two columns - drawn at half that width, so a third of the page -
// annotated like a figure in a spec sheet, with the links filed as small
// captioned groups in column three, where the third card sits. The second
// row is the small print: the copyright at one end, the credit at the other,
// on a rule of their own.
//
// The figure brackets under the wordmark measure its parts - the mark,
// "Chrono", "Space" - so their widths are percentages of the logo's own
// width and travel with it across breakpoints; the logo itself is a
// percentage of its column, so the whole lockup scales with the screen
// instead of sitting at a fixed size.
//
// Links whose href is still the "#" placeholder (the legal documents, until
// site.config carries real URLs) are filtered out, and a group with nothing
// left in it disappears with them.
//
// The band sweeps in mark-first, groups following, the small print last.

// Figure widths from the comp: 164 / 427 / 368 of the 1017px wordmark,
// with 42 and 16 gaps. The last figure pins to the logo's right edge.
const figures = [
  { label: "logo", width: "16.13%", gap: "0%" },
  { label: "type 01", width: "41.99%", gap: "4.13%" },
  { label: "type 02", width: "36.18%", last: true },
];

const groups: {
  label: string;
  links: { label: string; href: string; external?: boolean }[];
}[] = [
  {
    label: "Company",
    links: [
      { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
      { label: "Contact", href: siteConfig.links.contact },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Terms and conditions", href: siteConfig.links.terms },
      { label: "Privacy Policy", href: siteConfig.links.privacy },
    ],
  },
]
  // Placeholder links stay out of the page until site.config has real ones.
  .map((group) => ({
    ...group,
    links: group.links.filter((link) => link.href !== "#"),
  }))
  .filter((group) => group.links.length > 0);

// One measuring bracket from the comp: the caption riding over a rule that
// ends in the ruler's accent corner ticks - the hero timeline's grammar,
// reused as a figure annotation.
function Measure({
  label,
  className,
  width,
  gap,
}: {
  label: string;
  className?: string;
  width: string;
  gap?: string;
}) {
  return (
    <span
      className={`flex w-(--fig-w) flex-col gap-2 ${className ?? ""}`}
      style={{ "--fig-w": width, "--fig-gap": gap }}
    >
      <span className="type-caption text-line flex items-center gap-2">
        <span>fig.</span>
        <span>{label}</span>
      </span>
      <span className="flex items-end">
        <TimelineTickIcon
          width={5.5}
          height={5.5}
          className="text-accent shrink-0"
        />
        <span className="bg-line h-px flex-1" />
        <TimelineTickIcon
          width={5.5}
          height={5.5}
          className="text-accent shrink-0 -scale-x-100"
        />
      </span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="section-container relative">
      <RevealScope className="border-line flex flex-col gap-10 border-t pt-10 pb-8">
        <div className="grid gap-10 md:grid-cols-3 md:gap-5.5">
          <div className="flex flex-col gap-6 md:col-span-2">
            {/* Half of a two-thirds column: a third of the page. */}
            <div className="flex w-2/3 flex-col gap-6 md:w-1/2">
              {/*
               * The generated icon ships width/height="1em", which gives the
               * svg a 1:1 intrinsic ratio - `h-auto` alone would render it
               * square, and the ratio also feeds the flex item's automatic
               * minimum, so the lockup's real viewBox ratio is restated and
               * the minimum released.
               */}
              <ChronospaceLogoIcon
                role="img"
                aria-label="ChronoSpace"
                className="text-ink sweep-in aspect-(--logo-aspect) h-auto min-h-0 w-full"
                style={{ "--logo-aspect": "167.381 / 32", "--beat": 0 }}
              />
              <div
                aria-hidden
                className="sweep-in hidden sm:flex"
                style={{ "--beat": 1 }}
              >
                {figures.map((figure) => (
                  <Measure
                    key={figure.label}
                    label={figure.label}
                    width={figure.width}
                    gap={figure.gap}
                    className={figure.last ? "ml-auto" : "ml-(--fig-gap)"}
                  />
                ))}
              </div>
            </div>
          </div>

          <nav aria-label="Footer" className="flex gap-16 md:gap-20">
            {groups.map((group, index) => (
              <div
                key={group.label}
                className="sweep-in flex flex-col gap-4"
                style={{ "--beat": 2 + index }}
              >
                <p className="type-caption text-muted">{group.label}</p>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="type-nav text-ink hover:text-accent focus-visible:text-accent transition-colors duration-150 ease-out"
                        {...(link.external && {
                          target: "_blank",
                          rel: "noreferrer",
                        })}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div
          className="border-line sweep-in flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ "--beat": 4 }}
        >
          <p className="type-caption text-muted">© 2026 ChronoSpace AI</p>
          <a
            href={siteConfig.links.madeBy}
            target="_blank"
            rel="noreferrer"
            className="type-caption text-muted hover:text-ink transition-colors duration-150 ease-out"
          >
            Made by tonik
          </a>
        </div>
      </RevealScope>
    </footer>
  );
}
