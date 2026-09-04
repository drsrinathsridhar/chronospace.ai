import { RevealScope } from "@/components/reveal-scope.client";
import { CapturePlayer } from "./capture-player.client";

// The viewer: one real take from the capture rig, played back in the site's
// own instrument. The claim sits above it - every frame is a measurement -
// and the player demonstrates it: a HUD of live readings rides the picture
// and moves with the take, and the scrubber puts any t under the pointer.
//
// The plate is a colour video; the comp runs it through a luminosity blend
// so only its light survives and the page's blue does the colouring. The
// same blend, in CSS, on the same background - see .video in
// capture.module.css.
//
// Geometry is the comp's at the 1496px design width: the label, heading and
// lede stacked on the centre line - the label 24 above the heading, the
// lede 20 under it on a 651px measure - and the player centred below on an
// 826px measure.

export function Capture() {
  return (
    <section id="viewer" className="section-container relative pt-20 pb-34">
      <RevealScope>
        <div className="flex flex-col items-center gap-6 text-center">
          <p
            className="type-nav shimmer-in"
            style={{ "--beat": 0, "--shimmer-ink": "var(--muted)" }}
          >
            (Viewer)
          </p>

          <div className="flex flex-col items-center gap-5">
            <h2
              className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
              style={{ "--beat": 1 }}
            >
              Every frame is a measurement.
            </h2>
            <p
              className="type-body-xl shimmer-in max-w-162.75 text-pretty opacity-60"
              style={{ "--beat": 2 }}
            >
              Our capture, self-hosted and running in your browser. Drag the
              timeline. See the echo.
            </p>
          </div>
        </div>

        <div
          className="sweep-in mx-auto mt-16 max-w-206.5 md:mt-28"
          style={{ "--beat": 3 }}
        >
          <CapturePlayer />
        </div>
      </RevealScope>
    </section>
  );
}
