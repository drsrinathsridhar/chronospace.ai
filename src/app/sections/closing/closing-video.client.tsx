"use client";

import { useEffect, useRef } from "react";

// The closing block's backdrop: the woodworking loop, muted, behind the
// claim. It is an arrival, not a page load - the same discipline as the
// timeline player: nothing is fetched (preload="none") until the block
// scrolls into view, then the take starts, and it pauses again whenever
// the block leaves the viewport so an eleven-megabyte loop is never
// decoding under the rest of the page. Under prefers-reduced-motion the
// take never starts: the poster stands in for it.
//
// Two renditions, one element. The browser picks the 1080p source from
// 96rem up (the site frame's widest run), the 720p source everywhere else.
// The island owns nothing but the element and its observer; the scrim,
// sizing and stacking live in closing.module.css.

type ClosingVideoProps = {
  poster: string;
  sources: { src: string; media?: string }[];
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

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(video);

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
