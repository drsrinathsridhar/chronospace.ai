import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ChronospaceLogoIcon } from "@/icons/generated";
import { CtaLink } from "./cta-link";
import { ScrambleLabel } from "./scramble-label.client";
import { SiteHeaderScroll } from "./site-header-scroll.client";
import styles from "./site-header.module.css";

// The navbar floats over the hero rather than sitting above it: a 60px bar
// with nothing but a blur behind it, so the room keeps its light. It carries
// no rule of its own - the ruled cells in its right half are the only lines
// in the bar, and `-mr-px` collapses each pair of touching borders into one.
//
// The bar is on screen from the first frame; its contents lead the page
// reveal at index 0. On hover a cell fills with the page ground and its
// label shuffles its glyphs (scramble-label.client.tsx).
//
// On scroll the bar tightens (site-header-scroll.client.tsx flips
// `data-scrolled` on the root, which shrinks --navbar-height). Hovering the
// logo sends an orange band of light across the mark - the hero copy's
// reveal, played as a flare (site-header.module.css).

const navCell =
  "border-line hover:bg-paper focus-visible:bg-paper -mr-px flex h-full items-end border-r border-b border-l transition-colors duration-150 ease-out last:mr-0";

export function SiteHeader() {
  return (
    <header className="h-navbar section-container fixed inset-x-0 top-0 z-50 backdrop-blur-[8px] transition-[height] duration-300 ease-out">
      <SiteHeaderScroll />
      <div className="sweep-reveal flex h-full items-center">
        <Link
          href="/"
          className="focus-visible:outline-ink relative flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label={`${siteConfig.name} home`}
        >
          <ChronospaceLogoIcon
            width={126}
            height={24}
            className="text-ink shrink-0"
          />
          <span aria-hidden className={`${styles.flare} absolute inset-0`}>
            <ChronospaceLogoIcon
              width={126}
              height={24}
              className="text-accent shrink-0"
            />
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto flex h-full min-w-0 flex-none"
        >
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`${navCell} type-nav text-ink hidden px-6 pb-4 lg:flex`}
            >
              <ScrambleLabel>{item.label}</ScrambleLabel>
            </a>
          ))}

          <CtaLink
            size="nav"
            href={siteConfig.links.contact}
            className={navCell}
          >
            Connect with us
          </CtaLink>
        </nav>
      </div>
    </header>
  );
}
