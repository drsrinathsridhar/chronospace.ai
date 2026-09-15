import type { ComponentPropsWithoutRef } from "react";
import { CtaArrowIcon } from "@/icons/generated";
import { cn } from "@/lib/utils";

// The ChronoSpace call to action: a square block with an uppercase label and
// the play-head arrow at the far edge, both centred on the box's midline. It
// appears across the page at three scales - the last cell of the navbar, the
// hero's primary action, and the science section's row buttons - so the
// sizes live here rather than being re-derived at each call site.
//
// The comp pins the label low in the box; the client read that as the label
// off-centre in its container (feedback, September 2026), so every size
// centres its pair vertically instead. The nav cell centres its pair on a
// tight 10px gap and fills the bar - below `sm` it closes to 8px on 12px
// sides, since the phone bar has to hold the logo, the menu button and this
// block inside 280px (feedback round 3, slide 8); the hero block is 208x54 -
// the comp's 60 trimmed a touch at the client's request - with the arrow
// pushed to the opposite edge; the list block is the comp's 239x54 on the
// smaller nav label. The solid block darkens by 5% black under the pointer
// (--accent-hover), a quieter answer than the cells' fill.

// The arrow is sized in attributes rather than classes: SVGR emits every icon
// at 1em square with no intrinsic ratio, so `w-auto` would render it square.
const sizes = {
  nav: {
    root: "h-full items-center justify-center gap-2 px-3 sm:gap-2.5 sm:px-6",
    label: "type-nav",
    arrow: { width: 6.4, height: 8 },
  },
  hero: {
    root: "h-13.5 w-52 items-center justify-between px-4",
    label: "type-button",
    arrow: { width: 8, height: 10 },
  },
  list: {
    root: "h-13.5 w-59.75 items-center justify-between px-4",
    label: "type-nav",
    arrow: { width: 8, height: 10 },
  },
} as const;

// `inverse` is the block in the page's ink with paper type - the navbar's
// action once the page has scrolled (site-header.module.css switches it
// there by scroll state) and the closing block's primary action over its
// video (client feedback, round 2: white where orange would distract).
const variants = {
  solid:
    "bg-accent text-accent-foreground hover:bg-accent-hover focus-visible:bg-accent-hover transition-colors duration-150 ease-out",
  inverse:
    "bg-ink text-paper hover:bg-ink-hover focus-visible:bg-ink-hover transition-colors duration-150 ease-out",
  outline: "border-line text-ink hover:bg-surface border transition-colors",
} as const;

interface CtaLinkProps extends ComponentPropsWithoutRef<"a"> {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
}

export function CtaLink({
  size = "hero",
  variant = "solid",
  className,
  children,
  ...props
}: CtaLinkProps) {
  const style = sizes[size];

  return (
    <a
      className={cn(
        "focus-visible:outline-ink group flex overflow-clip focus-visible:outline-2 focus-visible:-outline-offset-4",
        variants[variant],
        style.root,
        className,
      )}
      {...props}
    >
      <span className={style.label}>{children}</span>
      <CtaArrowIcon
        width={style.arrow.width}
        height={style.arrow.height}
        className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
      />
    </a>
  );
}
