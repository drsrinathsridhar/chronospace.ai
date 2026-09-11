import { siteConfig } from "@/site.config";
import { CtaLink } from "@/components/cta-link";
import { RevealScope } from "@/components/reveal-scope.client";
import { ChronospaceLogoIcon } from "@/icons/generated";
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
// after <main> so it keeps its landmark role: the mark and the copyright
// on the left, the links on the right, on the page ground - the reference
// screenshot's light bar would break the page's one-ground rule. The
// legal links are still "#" in site.config: they render, inert, so the bar
// has its final shape, and they come alive on their own the moment the
// config carries real URLs.

const { poster, sources } = media.closing.woodworking;

export function Closing() {
  return (
    <section id="closing" className={styles.stage}>
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
  // TODO(client): terms and privacy are "#" until the documents are
  // published; they render inert (aria-disabled, out of the tab order) and
  // become live links as soon as site.config carries the real URLs.
  { label: "Terms and conditions", href: siteConfig.links.terms },
  { label: "Privacy Policy", href: siteConfig.links.privacy },
];

export function ClosingBar() {
  return (
    <footer className="section-container border-line border-t">
      <RevealScope className="flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
        <div
          className="sweep-in flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
          style={{ "--beat": 0 }}
        >
          <ChronospaceLogoIcon
            role="img"
            aria-label="ChronoSpace"
            width={120}
            height={23}
            className="text-ink shrink-0"
          />
          <p className="type-caption text-muted">© 2026 ChronoSpace AI</p>
        </div>

        <div
          className="sweep-in flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8"
          style={{ "--beat": 1 }}
        >
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {links.map((link) => {
                const placeholder = link.href === "#";
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className={
                        placeholder
                          ? "type-nav text-muted pointer-events-none"
                          : "type-nav text-ink hover:text-accent focus-visible:text-accent transition-colors duration-150 ease-out"
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
            className="type-caption text-muted hover:text-ink transition-colors duration-150 ease-out"
          >
            Made by tonik
          </a>
        </div>
      </RevealScope>
    </footer>
  );
}
