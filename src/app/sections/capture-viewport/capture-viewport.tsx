import Image from "next/image";

import subjectManufacturing from "@/app/(home)/assets/subject-manufacturing.webp";
import subjectRobotics from "@/app/(home)/assets/subject-robotics.webp";
import subjectSports from "@/app/(home)/assets/subject-sports.webp";

/**
 * The signature component: a bordered instrument window holding the captured subject.
 * Opaque c-black fill (it masks the backdrop), a 1px c-blue-300 border, two barely-there
 * c-grid-line crosshairs and four orange reticle brackets on a UI layer inset 20px from
 * the frame. Every inner measurement is a percentage of the 578 × 443 frame, so the
 * mobile instance — a uniform 0.5934 scale — falls out of the same rules.
 *
 * The three subjects change on the same 10s timeline as the headline's word roll:
 * milling machine → robot arm → sprinter → milling machine. It is the word roll's own
 * movement, not a separate dissolve — the outgoing subject rises `--subject-rise` out
 * of frame as it fades, the incoming one rises into place as it fades up, on the same
 * steps and the same curve. The thermal tint is baked into the exports; do not
 * re-apply the gradient here.
 *
 * Each subject keeps the size its Figma node was exported at but is centred in the
 * frame rather than pinned to that node's offset: the three artworks have different
 * proportions, and centring is what makes the instrument read as re-aiming at one
 * fixed point rather than at three slightly different ones.
 *
 * The four reticle brackets ride that same clock: at the midpoint of each crossfade
 * they open outward by 2px along their own diagonal and settle back, so the instrument
 * reads as re-acquiring focus on the new subject. One keyframe drives all four — each
 * bracket only carries its own --lock-x / --lock-y.
 *
 * The frame is the one part of the splash that gives ground when the window is short:
 * from `md` it shrinks out of its 578 × 443 aspect so the page never needs a scrollbar
 * (see page.tsx). Nothing inside has to be told about that — every inner measurement is
 * a percentage of the frame, and each subject is `object-contain` inside its box, so a
 * flatter frame simply holds a smaller subject, still centred. It stops giving at
 * 200px, well under any laptop; a window shorter than that gets a scrollbar rather
 * than a letterbox slit.
 */
export function CaptureViewport() {
  return (
    <div
      data-section="capture-viewport"
      data-figma-id="7235:886"
      role="img"
      aria-label="ChronoSpace capture viewport: a milling machine scanned in 4D, cycling with a robot arm and a sprinter"
      className="enter enter-d4 border-c-blue-300 bg-c-black md:mt-lg relative mt-[46px] aspect-[578/443] w-full overflow-hidden border md:min-h-[200px]"
    >
      {/* UI layer — inset 20px on all four sides, holding the crosshairs and the four
          13 × 13 reticle brackets (two SPACE_BETWEEN rows, top and bottom). */}
      <div className="pointer-events-none absolute top-[4.5147%] right-[3.4602%] bottom-[4.5147%] left-[3.4602%] flex flex-col justify-between">
        <span className="bg-c-grid-line absolute inset-x-0 top-1/2 h-px" />
        <span className="bg-c-grid-line absolute inset-y-0 left-1/2 w-px" />
        <div className="flex justify-between">
          <span className="border-c-orange-500 animate-reticle-lock aspect-square w-[2.4164%] border-t border-l [--lock-x:-2px] [--lock-y:-2px] motion-reduce:animate-none" />
          <span className="border-c-orange-500 animate-reticle-lock aspect-square w-[2.4164%] border-t border-r [--lock-x:2px] [--lock-y:-2px] motion-reduce:animate-none" />
        </div>
        <div className="flex justify-between">
          <span className="border-c-orange-500 animate-reticle-lock aspect-square w-[2.4164%] border-b border-l [--lock-x:-2px] [--lock-y:2px] motion-reduce:animate-none" />
          <span className="border-c-orange-500 animate-reticle-lock aspect-square w-[2.4164%] border-r border-b [--lock-x:2px] [--lock-y:2px] motion-reduce:animate-none" />
        </div>
      </div>

      {/* Subjects — absolute overlays above the crosshairs, one visible at a time. */}
      <div className="animate-subject-a absolute top-[7.7878%] left-[22.0718%] h-[84.4244%] w-[55.8564%] motion-reduce:animate-none">
        <Image
          src={subjectManufacturing}
          alt=""
          fill
          priority
          sizes="(min-width: 992px) 320px, 200px"
          className="object-contain"
        />
      </div>
      <div className="animate-subject-b absolute top-[5.6433%] left-[30.1038%] h-[88.7133%] w-[39.7924%] opacity-0 motion-reduce:animate-none">
        <Image
          src={subjectRobotics}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 992px) 230px, 145px"
          className="object-contain"
        />
      </div>
      <div className="animate-subject-c absolute top-[8.1264%] left-[20.5882%] h-[83.7472%] w-[58.8235%] opacity-0 motion-reduce:animate-none">
        <Image
          src={subjectSports}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 992px) 340px, 210px"
          className="object-contain"
        />
      </div>
    </div>
  );
}
