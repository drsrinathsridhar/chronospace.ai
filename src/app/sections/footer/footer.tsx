import { siteConfig } from "@/site.config";
import { RevealScope } from "@/components/reveal-scope.client";
import { ChronospaceLogoIcon, TimelineTickIcon } from "@/icons/generated";

// The close of the page: the sign-off band alone. The partnership ask that
// used to sit above it duplicated the vision section's connect action, so
// the ask is gone and the echo-repeater artwork moved up to back the vision
// section (sections/vision) - one connect moment, one backdrop.
//
// The band carries no rules: the wordmark is laid out at two thirds of its
// column and annotated like a figure in a spec sheet, with the utility
// links filed as plain cells on the right. The figure brackets under the
// wordmark measure its parts - the mark, "Chrono", "Space" - so their
// widths are percentages of the logo's own width and travel with it across
// breakpoints; the logo itself is a percentage of its column, so the whole
// lockup scales with the screen instead of sitting at a fixed size.
//
// The band sweeps in mark-first, cells following in file order.

// Figure widths from the comp: 164 / 427 / 368 of the 1017px wordmark,
// with 42 and 16 gaps. The last figure pins to the logo's right edge.
const figures = [
  { label: "logo", width: "16.13%", gap: "0%" },
  { label: "type 01", width: "41.99%", gap: "4.13%" },
  { label: "type 02", width: "36.18%", last: true },
];

const rows: { label: string; href?: string; external?: boolean }[] = [
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  { label: "Terms and conditions", href: siteConfig.links.terms },
  { label: "Privacy Policy", href: siteConfig.links.privacy },
  { label: "© 2026 ChronoSpace AI" },
  { label: "Made by tonik", href: siteConfig.links.madeBy, external: true },
];

const cell = "type-nav flex min-h-16 w-full items-end px-6 pb-4";
const cellLink =
  "hover:bg-paper focus-visible:bg-paper transition-colors duration-150 ease-out";

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
    <footer className="relative">
      <RevealScope className="relative flex flex-col pt-10 lg:flex-row">
        <div className="px-gutter flex min-w-0 flex-1 flex-col py-10">
          {/* Two thirds of the column, so the closing wordmark reads as a
              sign-off rather than a billboard - and still a percentage, so
              it keeps scaling with the screen. */}
          <div className="flex w-2/3 flex-col gap-6">
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

        <ul className="flex flex-col lg:w-99.75 lg:flex-none">
          {rows.map((row, index) => (
            <li
              key={row.label}
              className="sweep-in flex flex-1"
              style={{ "--beat": 1 + index }}
            >
              {row.href ? (
                <a
                  href={row.href}
                  className={`${cell} ${cellLink}`}
                  {...(row.external && {
                    target: "_blank",
                    rel: "noreferrer",
                  })}
                >
                  {row.label}
                </a>
              ) : (
                <span className={cell}>{row.label}</span>
              )}
            </li>
          ))}
        </ul>
      </RevealScope>
    </footer>
  );
}
