"use client";

import { useEffect, useRef } from "react";

// The closing block's backdrop: the woodworking loop, muted, behind the
// claim. It is an arrival, not a page load - the same discipline as the
// timeline player: nothing is fetched (preload="none") until the block
// comes into view, then the take starts, and it pauses again whenever it
// leaves so an eleven-megabyte loop is never decoding under the rest of
// the page. The block is pinned under the page and revealed as <main>
// scrolls off it (app/page.tsx), so "in view" cannot be read off the
// video itself - a pinned element intersects the viewport from the first
// scroll, covered or not. The island watches the sentinel at the end of
// <main> instead: when that reaches the viewport the sheet is lifting and
// the take is about to show. Under prefers-reduced-motion the take never
// starts: the poster stands in for it.
//
// Two renditions, one element. The browser picks the 1080p source from
// 96rem up (the site frame's widest run), the 720p source everywhere else.
// The island owns nothing but the element and its observer; the scrim,
// sizing and stacking live in closing.module.css.

type ClosingVideoProps = {
  poster: string;
  sources: readonly { src: string; media?: string }[];
  className?: string;
};

export function ClosingVideo({
  poster,
  sources,
  className,
}: ClosingVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sentinel = document.querySelector("[data-closing-sentinel]");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // The sentinel is a point: any intersection means the sheet's edge
      // is on screen. Without one (the block rendered on its own) the
      // video watches itself, a fifth of it showing.
      sentinel ? { rootMargin: "0px 0px 15% 0px" } : { threshold: 0.2 },
    );
    observer.observe(sentinel ?? video);

    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster={poster}
      aria-hidden
      className={className}
    >
      {sources.map((source) => (
        <source
          key={source.src}
          src={source.src}
          media={source.media}
          type="video/mp4"
        />
      ))}
    </video>
  );
}
