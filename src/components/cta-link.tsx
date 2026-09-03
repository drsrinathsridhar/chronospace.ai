import type { ComponentPropsWithoutRef } from "react";
import { CtaArrowIcon } from "@/icons/generated";
import { cn } from "@/lib/utils";
import { ScrambleLabel } from "./scramble-label.client";

// The ChronoSpace call to action: a square orange block with an uppercase
// label pinned low in the box and the play-head arrow at the far edge. It
// appears twice on the page at two scales - as the last cell of the navbar
// and as the hero's primary action - so the two sizes live here rather than
// being re-derived at each call site.
//
// The nav cell centres its pair on a tight 10px gap and fills the bar; the
// hero block is a fixed 208x60 with the arrow pushed to the opposite edge.

// The arrow is sized in attributes rather than classes: SVGR emits every icon
// at 1em square with no intrinsic ratio, so `w-auto` would render it square.
const sizes = {
  nav: {
    root: "h-full items-end justify-center gap-2.5 px-6 pb-4",
    label: "type-nav",
    arrow: { width: 6.4, height: 8 },
  },
  hero: {
    root: "h-15 w-52 items-center justify-between px-4 pt-8 pb-4",
    label: "type-button",
    arrow: { width: 8, height: 10 },
  },
} as const;

const variants = {
  solid: "bg-accent text-accent-foreground",
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
      <span className={style.label}>
        {typeof children === "string" ? (
          <ScrambleLabel>{children}</ScrambleLabel>
        ) : (
          children
        )}
      </span>
      <CtaArrowIcon
        width={style.arrow.width}
        height={style.arrow.height}
        className="shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-1"
      />
    </a>
  );
}
