import { RevealScope } from "@/components/reveal-scope.client";
import { CapturePlayer } from "./capture-player.client";

// The viewer: one real take from the capture rig, played back in the site's
// own instrument. The claim sits above it - every frame is a measurement -
// and the player demonstrates it: a HUD of live readings rides the picture
// and moves with the take, and the scrubber puts any t under the pointer.
//
// The plate is a colour video; the comp runs it through a luminosity blend
// so only its light survives and the page's blue does the colouring. The
// same blend, in CSS, on the same background - see .video in the shared
// timeline-player.module.css, which the product cards run too.
//
// Geometry is the comp's at the 1496px design width: the heading and lede
// stacked on the centre line - the lede 20 under the heading on a 651px
// measure - and the player centred below on an 826px measure, on the
// site-wide 80px header-to-content gap.

export function Capture() {
  return (
    <section id="viewer" className="section-container py-section relative">
      <RevealScope>
        <div className="flex flex-col items-center gap-5 text-center">
          <h2
            className="type-display-xs sm:type-display-sm lg:type-display-md shimmer-in max-w-174.5 text-balance"
            style={{ "--beat": 0 }}
          >
            Everything is measurable
          </h2>
          <p
            className="type-body-xl shimmer-in max-w-144.25 text-pretty opacity-60"
            style={{ "--beat": 1 }}
          >
            Our capture, self-hosted and running in your browser. Drag the
            timeline. See the echo.
          </p>
        </div>

        <div
          className="sweep-in mt-section-gap mx-auto max-w-206.5"
          style={{ "--beat": 2 }}
        >
          <CapturePlayer />
        </div>
      </RevealScope>
    </section>
  );
}
