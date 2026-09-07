import { HeroRoomEye } from "./hero-room-eye.client";
import styles from "./hero-room.module.css";

// The hero's backdrop: a room, lit only along its seams, that the copy
// stands inside. It is built as real geometry rather than laid in as a
// plate, so the eye can move through the section and the back wall slides
// against the near walls the way it would if you leaned - see the note at
// the top of hero-room.module.css for where every number comes from.
//
// The whole cube shows, floor included - the sink at the bottom of
// hero-room.module.css stays translucent until its last stop - and the
// standing capture cards (hero-cards.tsx) anchor their feet to this plate's
// height, so they read as standing on the floor it draws.
//
// Decorative throughout, and never interactive.

export function HeroRoom() {
  return (
    <div aria-hidden className={styles.room}>
      <div className={styles.plate}>
        <div data-stage className={styles.stage}>
          <span className={styles.ceiling} />
          <span className={styles.floor} />
          <span className={styles.left} />
          <span className={styles.right} />
          <span className={styles.back} />
        </div>
        <span className={styles.sink} />
      </div>
      <HeroRoomEye />
    </div>
  );
}
