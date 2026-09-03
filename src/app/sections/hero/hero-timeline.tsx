import { TimelineTickIcon } from "@/icons/generated";
import styles from "./hero-timeline.module.css";

// The timecode ruler at the hero's foot. The captures used to sit on it;
// they hang in the room now (hero-cards.tsx), and the ruler stays as the
// instrument line under the whole first screen - drawn left to right like a
// playhead sweeping through the take.
//
// Geometry is the comp's at the 1496px design width: a full-bleed track
// with accent corner ticks at the origin, one measured 111px unit in, and
// the far end; the labels ride 8px above the line.

export function HeroTimeline() {
  return (
    <div aria-hidden className={styles.timeline}>
      <div
        className="type-caption sweep-reveal flex items-center justify-between"
        style={{ "--reveal-index": 6 }}
      >
        <p className="text-line flex items-center gap-4">
          <span>Timecode</span>
          <span>00:00:14:07</span>
        </p>
        <p className="bg-paper text-ink flex items-center gap-4 px-2">
          <span className="bg-ink size-0.5" />
          <span>Scrub</span>
        </p>
      </div>

      {/*
       * The track is revealed by a left-to-right clip wipe - the playhead
       * pass - so the ticks appear as it reaches them rather than stretching.
       */}
      <div className={styles.track}>
        <TimelineTickIcon
          width={5.5}
          height={5.5}
          className="text-accent shrink-0"
        />
        <span className={`${styles.rule} ${styles.ruleShort}`} />
        <TimelineTickIcon
          width={5.5}
          height={5.5}
          className="text-accent shrink-0 -scale-x-100"
        />
        <span className={`${styles.rule} ${styles.ruleLong}`} />
        <TimelineTickIcon
          width={5.5}
          height={5.5}
          className="text-accent shrink-0 -scale-x-100"
        />
      </div>
    </div>
  );
}
