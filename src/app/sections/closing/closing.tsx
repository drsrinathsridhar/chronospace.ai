import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";
// import { ChronospaceLogoIcon } from "@/icons/generated";
import { ClosingVideo } from "./closing-video.client";
import { media } from "@/media.config";
import styles from "./closing.module.css";

// The close of the page: the vision and the sign-off, merged into one
// block (client feedback, round 2, slide 8). The claim - a world where
// every physical process can be replayed, measured and learned from - now
// stands left over a full-bleed take of a woodworker at the bench, the
// kind of process the company records, with one line under it saying what
// to do about it and the two actions on a row: connect, or follow. The
// dancer and robot-arm trails that used to flank the claim are gone with
// the tableau; the take is the whole backdrop.
//
// The take runs the width of the site frame, not the content box, so the
// section carries no gutter of its own; the copy inside sits back in the
// section-container. The scrim over it and the block's height live in
// closing.module.css; the video element and its autoplay-on-arrival are
// closing-video.client.tsx.
//
// The copy reveals like every other section - shimmer on the type, sweep
// on the blocks - one beat apart.
//
// Under the block the bar (ClosingBar) is the page's <footer>, rendered
// after <main> so it keeps its landmark role. The initial release uses a
// single row for copyright, LinkedIn, and credit. Legal links
// stay commented out until the documents are ready. The bar does not join
// the scroll reveal: RevealScope fires once a
// block has climbed 15% above the fold, and the last thing on the page
// never can - it sat masked and invisible at the foot of the page - so
// the bar is simply there, settled, like the navbar at the other end.

const { poster, sources } = media.closing.woodworking;

export function Closing() {
  // Sections meet across two paddings, 120px above and 120px below; the
  // stage has none of its own (the take runs to its hairline), so it takes
  // a section's worth of margin above and the gap after Team is the gap
  // everywhere else (client feedback round 3, slide 2).
  return (
    <section id="closing" className={`${styles.stage} mt-section`}>
      <ClosingVideo
        poster={poster}
        sources={sources}
        className={styles.video}
      />
      <div aria-hidden className={styles.scrim} />

      <div className="section-container">
        <RevealScope className="py-section flex flex-col items-start gap-6">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-160 text-pretty"
            style={{ "--beat": 0 }}
          >
            A world where every physical process can be replayed, measured and
            learned from
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-136 text-pretty opacity-80"
            style={{ "--beat": 1 }}
          >
            Tell us what you need to capture. We will tell you whether we can
            record it today.
          </p>
          <div
            className="sweep-in mt-2 flex flex-wrap gap-4"
            style={{ "--beat": 2 }}
          >
            <CtaLink
              variant="inverse"
              size="hero"
              href={siteConfig.links.contact}
            >
              Connect with us
            </CtaLink>
            <CtaLink
              variant="outline"
              size="hero"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="border-line-soft"
            >
              Follow on LinkedIn
            </CtaLink>
          </div>
        </RevealScope>
      </div>
    </section>
  );
}

const links: { label: string; href: string; external?: boolean }[] = [
  { label: "LinkedIn", href: siteConfig.links.linkedin, external: true },
  // Restore these links once the legal documents are published.
  // { label: "Terms and conditions", href: siteConfig.links.terms },
  // { label: "Privacy Policy", href: siteConfig.links.privacy },
];

export function ClosingBar() {
  return (
    <footer className="section-container border-line shrink-0 border-t">
      <div className="flex items-center gap-3 py-4 sm:gap-6">
        {/*
        <ChronospaceLogoIcon
          role="img"
          aria-label="ChronoSpace"
          width={120}
          height={23}
          className="text-ink h-auto w-20 shrink-0 sm:w-30"
        />
        */}

        <p className="type-caption sm:type-nav text-muted shrink-0 whitespace-nowrap">
          © 2026 ChronoSpace AI
        </p>

        <nav aria-label="Footer" className="ml-auto shrink-0">
          <ul className="flex items-center gap-6">
            {links.map((link) => {
              const placeholder = link.href === "#";
              return (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={
                      placeholder
                        ? "type-caption sm:type-nav text-muted pointer-events-none"
                        : "type-caption sm:type-nav text-ink hover:text-accent focus-visible:text-accent inline-flex min-h-11 items-center transition-colors duration-150 ease-out"
                    }
                    {...(placeholder && {
                      "aria-disabled": true,
                      tabIndex: -1,
                    })}
                    {...(link.external && {
                      target: "_blank",
                      rel: "noreferrer",
                    })}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <a
          href={siteConfig.links.madeBy}
          target="_blank"
          rel="noreferrer"
          className="type-caption sm:type-nav text-muted hover:text-ink inline-flex min-h-11 shrink-0 items-center whitespace-nowrap transition-colors duration-150 ease-out"
        >
          Made by tonik
        </a>
      </div>
    </footer>
  );
}
