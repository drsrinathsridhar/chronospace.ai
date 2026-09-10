import type { ReactNode } from "react";

// The page's frame. Everything but the fixed navbar renders inside it: it
// caps the layout at 2560px and centres it on wider screens (client
// feedback, September 2026 - the site kept scaling up past the width its
// raster assets were made for), and it is the query container the hero's
// room, figures and copy measure themselves against in cqw, so the hero
// stops growing with the frame instead of with the viewport.
//
// The navbar stays outside on purpose: the frame's inline-size containment
// would make it the navbar's containing block and un-fix it from the
// viewport. The bar caps its own contents to the same width instead.

export function SiteFrame({ children }: { children: ReactNode }) {
  return <div className="max-w-site @container mx-auto">{children}</div>;
}
