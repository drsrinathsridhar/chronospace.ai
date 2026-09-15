import Link from "next/link";
import { siteConfig } from "@/site.config";
import { ChronospaceLogoIcon } from "@/icons/generated";
import { CtaLink } from "./cta-link";
import { SiteHeaderScroll } from "./site-header-scroll.client";
import {
  SiteMenuButton,
  SiteMenuProvider,
  SiteMenuSheet,
} from "./site-menu.client";
import styles from "./site-header.module.css";

// The navbar floats over the hero rather than sitting above it: a 60px bar
// (56 on phones, globals.css) with nothing but a blur behind it, so the
// room keeps its light. A hairline closes it underneath - the same 1px of
// --line the timecode ruler draws above the backing band, so the first
// screen is ruled top and bottom alike (owner's request, 11 Sep 2026);
// otherwise the links are bare labels centred on the bar's midline, and the
// CTA's accent fill is the only block in the bar.
//
// The bar is on screen from the first frame; its contents lead the page
// reveal at index 0. On hover a cell fills with a tenth of ink, nothing
// else: the glyph shuffle that used to ride the hover is gone (client
// feedback, September 2026 - it read as distraction).
//
// On scroll the bar tightens (site-header-scroll.client.tsx flips
// `data-scrolled` on the root, which shrinks --navbar-height) and the
// orange cell turns to ink with paper type: the accent belongs to the hero,
// and carried down the page it read as a distraction (client feedback,
// round 2 - site-header.module.css). Hovering the logo sends an orange band
// of light across the mark - the hero copy's reveal, played as a flare.
//
// On phones the bar has 280px to work with at its narrowest (320 less the
// gutters), and the 168px logo next to the 169px "Connect with us" block
// used to overlap below 375 and push the page wider than the screen (client
// feedback, round 3, slide 8). Below `sm` the mark drops to 24px tall (about
// 126 wide - the SVG keeps its ratio, the width attribute is only a hint),
// the block tightens to an 87px "Connect" (the full label stays as its
// accessible name), and the row clips whatever could still overflow so
// nothing ever reaches past the gutter. Below `lg`, where the links are
// not shown, a Menu button stands between the logo and the block and opens
// the four anchors in a sheet under the bar (site-menu.client.tsx) - the
// sheet is the header's own child, outside the clipped row.

const navCell = "flex h-full items-center";
// The plain links fill with a tenth of ink on hover - the page ground they
// used to take was all but invisible over the blurred room (owner's
// request, 11 Sep 2026); the orange cell keeps its own darker-orange hover
// from cta-link.tsx.
const navLinkCell = `${navCell} hover:bg-ink/10 focus-visible:bg-ink/10 transition-colors duration-150 ease-out`;

export function SiteHeader() {
  return (
    <header className="h-navbar border-line fixed inset-x-0 top-0 z-50 border-b backdrop-blur-[8px] transition-[height] duration-300 ease-out">
      <SiteHeaderScroll />
      <SiteMenuProvider>
        {/* The bar runs full-bleed; its contents stop at the site frame's
            width (max-w-site) and centre, in step with the page under it. */}
        <div className="section-container sweep-reveal max-w-site mx-auto flex h-full min-w-0 items-center overflow-clip">
          <Link
            href="/"
            className="focus-visible:outline-ink relative flex shrink-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label={`${siteConfig.name} home`}
          >
            <ChronospaceLogoIcon
              width={168}
              height={32}
              className="text-ink h-6 w-auto shrink-0 sm:h-8"
            />
            <span aria-hidden className={`${styles.flare} absolute inset-0`}>
              <ChronospaceLogoIcon
                width={168}
                height={32}
                className="text-accent h-6 w-auto shrink-0 sm:h-8"
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

            <SiteMenuButton />

            {/* Sixteen pixels of ground before the orange block, on top of the
              last link's own padding, so "Team" is not read as part of it
              (client feedback, round 3, slide 2). Only from `lg`, where the
              links are shown; the block itself stays flush to the frame's
              right edge. */}
            <CtaLink
              size="nav"
              href={siteConfig.links.contact}
              className={`${navCell} ${styles.cta} lg:ml-4`}
              aria-label="Connect with us"
            >
              <span className="sm:hidden">Connect</span>
              <span className="hidden sm:inline">Connect with us</span>
            </CtaLink>
          </nav>
        </div>

        <SiteMenuSheet
          nav={siteConfig.nav}
          contactHref={siteConfig.links.contact}
        />
      </SiteMenuProvider>
    </header>
  );
}
