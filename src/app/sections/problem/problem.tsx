import { ReadProgress } from "@/components/read-progress.client";
import styles from "./problem.module.css";

// The intro: after the hero's claim, the argument in two paragraphs. The
// comp freezes it mid-read - the copy white up to "...a machine can u", and
// muted from there on - which is a scroll state, not a style: the text
// starts muted and brightens in reading order as it travels up the screen,
// the boundary of the read sweeping through the words like the hero's
// playhead swept the timeline.
//
// The copy is split into words on the server, each one carrying its index;
// a client island (read-progress.client.tsx, shared with the vision
// section) writes a single number, --read-progress, and the colour
// of every word falls out of a calc in problem.module.css. Without
// JavaScript, or under reduced motion, the progress rests at 1 and the
// copy simply reads as settled ink.
//
// Geometry is the comp's at the 1496px design width: 120 of padding above
// and below, and the copy 598/1416 into the content box at the hero
// headline's 698px measure.

const paragraphs = [
  "Frontier models have consumed everything that was already digital. The physical world - where the work actually happens - was never recorded in a form a machine can use.",
  "ChronoSpace records it: full geometry over time, from any viewpoint, at any moment. A finished capture streams like ordinary video and stays measurable inside it - where a part travelled, how long a cycle took, whether a foot crossed the line.",
];

const words = paragraphs.map((paragraph) => paragraph.split(" "));
const wordCount = words.flat().length;

export function Problem() {
  let wordIndex = 0;

  return (
    <section id="problem" className="section-container py-section relative">
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

      <ReadProgress />
    </section>
  );
}
