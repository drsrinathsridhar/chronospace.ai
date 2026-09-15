"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { CloseIcon, MenuIcon } from "@/icons/generated";
import { cn } from "@/lib/utils";
import { CtaLink } from "./cta-link";
import styles from "./site-header.module.css";

// The phone navigation. Below `lg` the bar has no room for its four links,
// and until round 3 it simply had none - a visitor on a phone could reach
// the contact page and nothing else (client feedback, round 3, slide 8: a
// full mobile pass). Now a 44px "Menu" button sits between the logo and the
// CTA and opens a sheet directly under the bar: paper ground, the four
// anchors as 56px rows ruled with hairlines, "Connect with us" as a solid
// block at the foot.
//
// Three pieces from one file, because the button lives inside the bar's
// clipped, mask-revealed row and the sheet cannot: the row's `overflow-clip`
// would cut the sheet off and its reveal mask would hide anything hanging
// below the bar. So the provider holds the state, the button toggles it from
// inside the row, and the sheet is the header's own child, anchored to the
// bar's bottom edge. The server renders the sheet in place with `hidden`,
// so it is in the DOM before hydration and never flashes.
//
// It closes on any of: a link chosen, Escape, a press outside it, a hash
// change, or the page scrolling more than the bar's height from where it
// opened (an anchor's own smooth scroll included). While it is open the
// root carries `data-menu-open` and globals.css locks the page scroll under
// it. Focus moves to the first link on opening and back to the button on
// closing, so a keyboard never loses its place.

interface SiteMenuState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
  sheetRef: RefObject<HTMLDivElement | null>;
}

const SiteMenuContext = createContext<SiteMenuState | null>(null);

// One header per page, so the sheet's id can be a plain word rather than a
// generated one, and stays readable in the accessibility tree.
const SHEET_ID = "site-menu";

// A scroll of this much from where the sheet opened counts as the page
// moving on: the bar's own resting height, so a nudge never closes it but
// an anchor's travel always does.
const SCROLL_CLOSE_AT = 60;

function useSiteMenu() {
  const state = useContext(SiteMenuContext);
  if (!state) {
    throw new Error(
      "Site menu pieces must be rendered inside SiteMenuProvider.",
    );
  }
  return state;
}

export function SiteMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const button = buttonRef.current;
    const openedAt = window.scrollY;

    root.dataset.menuOpen = "";
    sheetRef.current?.querySelector<HTMLElement>("a")?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    function onPointerDown(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (sheetRef.current?.contains(target) || button?.contains(target)) {
        return;
      }
      close();
    }

    function onScroll() {
      if (Math.abs(window.scrollY - openedAt) > SCROLL_CLOSE_AT) close();
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("hashchange", close);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("hashchange", close);
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.menuOpen;
      button?.focus();
    };
  }, [open, close]);

  return (
    <SiteMenuContext.Provider
      value={{ open, toggle, close, buttonRef, sheetRef }}
    >
      {children}
    </SiteMenuContext.Provider>
  );
}

// The toggle: an icon-only cell the full height of the bar and 44 wide, so
// the tap target clears the platform minimum on every side. It takes the
// same tenth-of-ink hover fill as the link cells, and its glyph swaps to the
// cross while the sheet is out. Ink at every scroll state - the bar sits on
// the dark ground throughout.
export function SiteMenuButton({ className }: { className?: string }) {
  const { open, toggle, buttonRef } = useSiteMenu();

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      aria-controls={SHEET_ID}
      onClick={toggle}
      className={cn(
        "text-ink focus-visible:outline-ink hover:bg-ink/10 focus-visible:bg-ink/10 flex h-full w-11 shrink-0 items-center justify-center transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-4 lg:hidden",
        className,
      )}
    >
      {open ? (
        <CloseIcon width={18} height={18} className="shrink-0" />
      ) : (
        <MenuIcon width={18} height={18} className="shrink-0" />
      )}
    </button>
  );
}

interface SiteMenuSheetProps {
  nav: ReadonlyArray<{ readonly href: string; readonly label: string }>;
  contactHref: string;
}

// The sheet itself. `hidden` while closed (the server always renders it
// closed); `lg:hidden` too, so a window widened past the breakpoint with
// the sheet out does not leave it hanging under the desktop links. The
// links are the display titles at their phone size, 56px rows so a thumb
// lands with room to spare, and the CTA is the hero block stretched to the
// content width.
export function SiteMenuSheet({ nav, contactHref }: SiteMenuSheetProps) {
  const { open, close, sheetRef } = useSiteMenu();

  return (
    <div
      ref={sheetRef}
      id={SHEET_ID}
      hidden={!open}
      className={`${styles.sheet} bg-paper border-line absolute inset-x-0 top-full border-y lg:hidden`}
    >
      <nav
        aria-label="Menu"
        className="section-container max-w-site mx-auto pb-6"
      >
        <ul className="divide-line divide-y">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={close}
                className="type-title-md text-ink focus-visible:outline-ink hover:bg-ink/10 focus-visible:bg-ink/10 flex h-14 items-center transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:-outline-offset-2"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <CtaLink href={contactHref} onClick={close} className="mt-4 w-full">
          Connect with us
        </CtaLink>
      </nav>
    </div>
  );
}
