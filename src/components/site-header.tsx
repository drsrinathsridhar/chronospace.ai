import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ChronospaceLogoIcon } from "@/icons/generated";
import { CtaLink } from "./cta-link";
import { SiteHeaderScroll } from "./site-header-scroll.client";
import styles from "./site-header.module.css";

// The navbar floats over the hero rather than sitting above it: a 60px bar
// with nothing but a blur behind it, so the room keeps its light. It carries
// no rule of its own - the links are bare labels centred on the bar's
// midline, and the CTA's accent fill is the only block in the bar.
//
// The bar is on screen from the first frame; its contents lead the page
// reveal at index 0. On hover a cell fills with the page ground, nothing
// else: the glyph shuffle that used to ride the hover is gone (client
// feedback, September 2026 - it read as distraction).
//
// On scroll the bar tightens (site-header-scroll.client.tsx flips
// `data-scrolled` on the root, which shrinks --navbar-height). Hovering the
// logo sends an orange band of light across the mark - the hero copy's
// reveal, played as a flare (site-header.module.css).

const navCell = "flex h-full items-center";
// The plain links fill with the page ground on hover; the orange cell keeps
// its own darker-orange hover from cta-link.tsx.
const navLinkCell = `${navCell} hover:bg-paper focus-visible:bg-paper transition-colors duration-150 ease-out`;

export function SiteHeader() {
  return (
    <header className="h-navbar fixed inset-x-0 top-0 z-50 backdrop-blur-[8px] transition-[height] duration-300 ease-out">
      <SiteHeaderScroll />
      {/* The bar runs full-bleed; its contents stop at the site frame's width
          (max-w-site) and centre, in step with the page under it. */}
      <div className="section-container sweep-reveal max-w-site mx-auto flex h-full items-center">
        <Link
          href="/"
          className="focus-visible:outline-ink relative flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2"
          aria-label={`${siteConfig.name} home`}
        >
          <ChronospaceLogoIcon
            width={168}
            height={32}
            className="text-ink shrink-0"
          />
          <span aria-hidden className={`${styles.flare} absolute inset-0`}>
            <ChronospaceLogoIcon
              width={168}
              height={32}
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
              className={`${navLinkCell} type-nav text-ink hidden px-6 lg:flex`}
            >
              {item.label}
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
