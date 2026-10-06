import Image from "next/image";
import { MeasureBracketIcon } from "@/icons/generated";
import { PointerDrift } from "@/components/pointer-drift.client";
import { ReadProgress } from "@/components/read-progress.client";
import { RevealScope } from "@/components/reveal-scope.client";
import { media } from "@/media.config";
import styles from "./problem.module.css";

// The intro: after the hero's claim, the argument - in two columns now, not
// a lone block of copy (client feedback: text-dense, no visual break). On
// the left a picture: for now the split-circle placeholder the owner
// supplied (a robot half in photograph, half in voxels), standing in until
// the client settles what this section shows (feedback round 2, slide 4:
// "the 4D movement we bring vs the 2Ds in the market"). The manufacturing
// take that ran here in the shared timeline player is out for the moment;
// its slot stays in media.config.ts for when the rebuilt scene lands. On
// the right the lede in two short paragraphs, then the three questions a
// finished capture answers, each rehearsed with the reading the viewer
// below will land on.
//
// The read sweep stays: the comp freezes the lede mid-read - white up to
// "...a machine can u", muted from there on - which is a scroll state, not
// a style. The copy is split into words on the server, each carrying its
// index; the shared read-progress island writes one number,
// --read-progress, and every word's colour falls out of a calc in
// problem.module.css. Without JavaScript, or under reduced motion, the
// progress rests at 1 and the copy reads as settled ink.
//
// The picture hangs at its own depth: the shared pointer drift eases it a
// few pixels against the pointer while the copy holds still.
//
// Geometry on the 12-column grid: the picture takes 5 columns (5/12, which
// is the comp's 42% offset turned into a column), the copy the remaining 7,
// filled to the right gutter - the hero headline's 698px measure used to
// cap it, which left the copy and its rules stopping ~119px short of the
// gutter while the picture sat flush left (feedback round 3, slide 6). At
// the 1496 design width that is the picture across x 40-616 and the copy
// from x 638 to 1456. The reading rules align with the paragraph, with
// brackets inside each row and values beneath the labels on narrow columns.
// The picture is a true square (placeholder.png
// is 862x862, so the circle sits on its box centre) and top-aligns with the
// copy - the owner nudges it onto the first cap line with --visual-nudge in
// the module. Under the md breakpoint it stacks above the copy at full
// width.

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
            className={`${styles.visual} sweep-in relative aspect-square md:col-span-5 md:self-start`}
            style={{ "--beat": 0 }}
          >
            {/* TODO(client): the final intro visual - swap the file in
                public/media/intro (media.config.ts, `intro.picture`). */}
            <Image
              src={media.intro.picture}
              alt=""
              fill
              sizes="(min-width: 48rem) 42vw, 100vw"
              className="object-contain"
            />
          </div>
        </PointerDrift>

        <div className="flex flex-col gap-10 md:col-span-7">
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
                className="border-line sweep-in grid grid-cols-1 gap-2 border-t py-4 last:border-b lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-6"
                style={{ "--beat": 1 + index }}
              >
                <dt className="type-body-lg grid grid-cols-[0.875rem_minmax(0,1fr)] items-center gap-3 font-light">
                  <MeasureBracketIcon
                    aria-hidden
                    width={13.5}
                    height={13.5}
                    className="text-accent"
                  />
                  <span>{term}</span>
                </dt>
                <dd className="type-nav text-ink pl-6.5 whitespace-nowrap lg:pl-0 lg:text-right">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <ReadProgress />
        </div>
      </RevealScope>
    </section>
  );
}
