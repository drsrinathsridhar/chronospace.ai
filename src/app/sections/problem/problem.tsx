import { MeasureBracketIcon } from "@/icons/generated";
import { PointerDrift } from "@/components/pointer-drift.client";
import { ReadProgress } from "@/components/read-progress.client";
import { RevealScope } from "@/components/reveal-scope.client";
import { TimelinePlayer } from "@/components/timeline-player.client";
import { media } from "@/media.config";
import styles from "./problem.module.css";

// The intro: after the hero's claim, the argument - in two columns now, not
// a lone block of copy (client feedback: text-dense, no visual break). On
// the left the manufacturing take runs in the compact build of the shared
// timeline player, the same instrument as the product cards and the
// viewer, playing on arrival and loading nothing before it. On the right
// the lede in two short paragraphs, then the three questions a finished
// capture answers, each rehearsed with the reading the viewer below will
// land on.
//
// The read sweep stays: the comp freezes the lede mid-read - white up to
// "...a machine can u", muted from there on - which is a scroll state, not
// a style. The copy is split into words on the server, each carrying its
// index; the shared read-progress island writes one number,
// --read-progress, and every word's colour falls out of a calc in
// problem.module.css. Without JavaScript, or under reduced motion, the
// progress rests at 1 and the copy reads as settled ink.
//
// The take hangs at its own depth: the shared pointer drift eases it a few
// pixels against the pointer while the copy holds still.
//
// Geometry on the 12-column grid: the take takes 5 columns (5/12, which is
// the comp's 42% offset turned into a column), the copy the remaining 7 at
// the hero headline's 698px measure. At the 1496 design width that is the
// take across x 40-616 and the copy from x 638. Under the md breakpoint
// the take stacks above the copy at full width.

const paragraphs = [
  "Frontier models have consumed everything that was already digital. The physical world - where the work actually happens - was never recorded in a form a machine can use.",
  "ChronoSpace records it: full geometry over time, from any viewpoint, at any moment. A finished capture streams like ordinary video and stays measurable inside it.",
];

const words = paragraphs.map((paragraph) => paragraph.split(" "));
const wordCount = words.flat().length;

// The three questions a finished capture answers, each with the reading
// the viewer below will land on - the claim rehearsed before it is proved.
const readings: [string, string][] = [
  ["Where a part travelled", "1.04 m"],
  ["How long a cycle took", "00:00:14:07"],
  ["Whether a foot crossed the line", "Yes · 00:00:09:12"],
];

export function Problem() {
  let wordIndex = 0;

  return (
    <section id="problem" className="section-container py-section relative">
      <RevealScope className="grid gap-12 md:grid-cols-12 md:gap-5.5">
        <PointerDrift>
          <div
            className={`${styles.visual} sweep-in md:col-span-5`}
            style={{ "--beat": 0 }}
          >
            <TimelinePlayer
              src={media.intro.manufacturing.src}
              poster={media.intro.manufacturing.poster}
              fallbackDuration={media.intro.manufacturing.duration}
              aspect="4 / 5"
              name="the manufacturing take"
              compact
              preload="none"
            />
          </div>
        </PointerDrift>

        <div className="flex flex-col gap-10 md:col-span-7 md:max-w-174.5">
          <div
            className={styles.copy}
            data-read-copy
            style={{ "--word-count": wordCount }}
          >
            {words.map((paragraphWords, paragraphIndex) => (
              <p
                key={paragraphs[paragraphIndex]}
                className="type-body-xl lg:type-lede"
              >
                <span className="sr-only">{paragraphs[paragraphIndex]}</span>
                <span aria-hidden>
                  {paragraphWords.map((word) => (
                    <span
                      key={wordIndex}
                      className={styles.word}
                      style={{ "--word-index": wordIndex++ }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </span>
              </p>
            ))}
          </div>

          <dl className="flex flex-col">
            {readings.map(([term, value], index) => (
              <div
                key={term}
                className="border-line sweep-in flex items-center justify-between gap-6 border-t py-4 last:border-b"
                style={{ "--beat": 1 + index }}
              >
                <dt className="type-body-lg flex items-center gap-4 font-light">
                  <MeasureBracketIcon
                    width={13.5}
                    height={13.5}
                    className="text-accent shrink-0"
                  />
                  {term}
                </dt>
                <dd className="type-nav text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <ReadProgress />
        </div>
      </RevealScope>
    </section>
  );
}
