"use client";

import { useEffect, useRef } from "react";

// Plays one card's capture. The markup ships without `autoplay` on purpose:
// whether the loop runs is a motion preference, so the decision is made here,
// once, against `prefers-reduced-motion` - and revisited if the preference
// changes while the page is open. Without JavaScript, or with reduced motion
// on, the card simply holds its poster: the first frame of the same take.
//
// Muted, looping, inline playback only; the play() promise is swallowed
// because a browser that refuses autoplay has effectively answered the same
// question, and the poster is the correct fallback either way.

export function HeroTimelineVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const query = window.matchMedia("(prefers-reduced-motion: reduce)");

    function sync() {
      if (!video) return;
      if (query.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      className={className}
    />
  );
}
