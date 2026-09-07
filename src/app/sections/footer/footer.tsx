import Image from "next/image";
import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";
import { ScrambleLabel } from "@/components/scramble-label.client";
import { ChronospaceLogoIcon, TimelineTickIcon } from "@/icons/generated";
import { FooterParallax } from "./footer-parallax.client";
import echoRepeater from "./echo-repeater.png";

// The close of the page: the partnership ask over the echo-repeater - a
// capture's colour smeared into a cascade of fins that falls from the top
// rule down behind the footer - and under it the sign-off band, where the
// wordmark is laid out at full measure and annotated like a figure in a
// spec sheet, with the utility links filed as ruled cells on the right.
//
// Geometry is the comp's at the 1496px design width: the CTA copy 194 under
// the section rule on 40px gaps, the 339-wide action, then the 325-tall band
// with the logo on 40px padding and the five 65px link cells flush to the
// page edge. The figure brackets under the wordmark measure its parts - the
// mark, "Chrono", "Space" - so their widths are percentages of the logo's
// own width and travel with it across breakpoints.
//
// Both halves reveal on their own scroll beats: the ask shimmers in line by
// line, then the band sweeps in mark-first, cells following in file order.

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
    <footer className="relative overflow-clip">
      {/*
       * The echo-repeater. The comp stretches the plate to the section's
       * full box - the fins widen with the page - so it fills rather than
       * covers, and the alpha plate leaves the paper showing through. The
       * plate drifts against the pointer (footer-parallax.client.tsx).
       */}
      <FooterParallax>
        <Image
          src={echoRepeater}
          alt=""
          fill
          sizes="100vw"
          className="object-fill"
        />
      </FooterParallax>

      <section className="border-line section-container relative border-t pt-28 pb-10 lg:pt-48.5">
        <RevealScope className="flex flex-col items-start gap-10">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-lg shimmer-in"
            style={{ "--beat": 0 }}
          >
            Bring the studio
            <br />
            to your world.
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-117.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            We&apos;re looking for partners - teams with a physical process
            worth recording, and teams training models that need real-world 4D
            data. Tell us where you sit and we&apos;ll come back with a capture
            proposal.
          </p>
          <CtaLink
            href={siteConfig.links.contact}
            className="sweep-in w-full max-w-84.75"
            style={{ "--beat": 2 }}
          >
            Connect with us
          </CtaLink>
        </RevealScope>
      </section>

      <RevealScope className="border-line relative flex flex-col border-t border-b lg:flex-row">
        <div className="px-gutter flex min-w-0 flex-1 flex-col gap-6 py-10">
          {/*
           * The generated icon ships width/height="1em", which gives the svg
           * a 1:1 intrinsic ratio - `h-auto` alone would render it square,
           * and the ratio also feeds the flex item's automatic minimum, so
           * the lockup's real viewBox ratio is restated and the minimum
           * released.
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

        <ul className="border-line divide-line flex flex-col divide-y border-t lg:w-99.75 lg:flex-none lg:border-x lg:border-t-0">
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
                  <ScrambleLabel>{row.label}</ScrambleLabel>
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
