import { CapturePlayer } from "./capture-player.client";
import styles from "./capture.module.css";

// The proof: one real take from the capture rig, played back in the site's
// own instrument. The claim sits above it - every frame is a measurement -
// and the player demonstrates it: a HUD of live readings rides the picture
// and moves with the take, and the scrubber puts any t under the pointer.
//
// The plate is a colour video; the comp runs it through a luminosity blend
// so only its light survives and the page's blue does the colouring. The
// same blend, in CSS, on the same background - see .video in
// capture.module.css.
//
// Geometry is the comp's at the 1496px design width: the label on the
// gutter, the heading and player 598/1416 into the content box on the
// section's shared 698px measure, 80 from heading to picture.

export function Capture() {
  return (
    <section className="section-container relative pt-27 pb-34">
      <p className="type-nav text-muted pt-2 md:absolute">
        (ChronoSpace capture)
      </p>

      <div className={styles.column}>
        <h2 className="type-display-xs sm:type-display-sm lg:type-display-md mt-6 max-w-115 text-balance md:mt-0">
          Every frame is a measurement.
        </h2>

        <div className="mt-12 md:mt-20">
          <CapturePlayer />
        </div>
      </div>
    </section>
  );
}
