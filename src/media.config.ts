// Every picture and take on the landing page, in one place. The client
// will keep replacing media as the product evolves (feedback round 2,
// slide 10), so a swap must never mean touching a section: drop the new
// file over the old one under public/media/<section>/ - same name - or
// change the path here, and every layout, player and overlay carries on
// unchanged. Sections import their slots from this file and nothing else
// knows where a file lives.
//
// Paths are public URLs: `/media/...` is served from `public/media/...`.
// Rasters go through next/image with `fill`, so a swapped picture may be
// any size; it is cropped to the slot with object-fit: cover. Takes are
// H.264 MP4, muted, encoded for the web (see docs/asset-swap-guide.md for
// the ffmpeg lines and the sizes each slot was cut at). Every take names
// its poster (the first frame, JPEG) and its length in seconds - the player
// seeks against that before the file's own metadata arrives, so update it
// with the clip - and the frame rate used by the view counter. The arc
// follows playback time directly, so replacing a clip needs no sidecar data.

/** A video slot: the take, its still, its length, and its frame rate. */
export type Take = {
  src: string;
  poster: string;
  /** Seconds. Used for seeking before the metadata arrives. */
  duration: number;
  /** Frames per second the file is encoded at; the scrubber's "View n / N"
   *  counts in it. 30 when left out. */
  fps?: number;
};

export const media = {
  /**
   * The hero's three standing figures: coloured cutouts on transparent
   * PNG, the figure only, feet at the bottom edge. Their placement inside
   * each card (left, width, aspect) lives in sections/hero/hero-cards.tsx
   * and belongs to the picture - a new cutout with different proportions
   * needs those numbers checked.
   */
  hero: {
    roboticsArm: "/media/hero/robotics-arm.png",
    roboticsMan: "/media/hero/robotics-man.png",
    manufacturing: "/media/hero/manufacturing-subject.png",
    sports: "/media/hero/sports-subject.png",
  },

  /** The backing band's one raster mark (the rest are SVG icons). */
  backers: {
    nvidiaInception: "/media/backers/nvidia-inception.png",
  },

  /**
   * The intro spread's visual. For now a still - the split-circle
   * placeholder (photo half, voxel half) standing in until the client
   * decides what the section shows (feedback round 2, slide 4). The
   * manufacturing take stays listed for when the owner's rebuilt scene is
   * ready; sections/problem reads `picture` today.
   */
  intro: {
    picture: "/media/intro/placeholder.png",
    manufacturing: {
      src: "/media/intro/manufacturing.mp4",
      poster: "/media/intro/manufacturing-poster.jpg",
      duration: 8,
    } satisfies Take,
  },

  /** The three product takes: landscape, 577/310 plates, 960px wide, 30fps. */
  product: {
    // TODO(client): in-the-wild footage (outdoor / factory / field). The
    // current file is trimmed to the reconstruction pass; it is a stand-in.
    // The synthesised camera starts in front of the table, facing the two
    // figures, swings around the scene and rises, and ends behind the man
    // in blue.
    wild: {
      src: "/media/product/wild.mp4",
      poster: "/media/product/wild-poster.jpg",
      duration: 9.47,
    } satisfies Take,
    // The first seven seconds are the real footage from a fixed wide shot;
    // then the point cloud takes over and the camera drifts around the
    // seated man and the robot, ending front-right and closer.
    navigable: {
      src: "/media/product/navigable.mp4",
      poster: "/media/product/navigable-poster.jpg",
      duration: 18.73,
    } satisfies Take,
    // A fixed camera on the tracked dancer.
    queryable: {
      src: "/media/product/queryable.mp4",
      poster: "/media/product/queryable-poster.jpg",
      duration: 3.2,
    } satisfies Take,
  },

  /** The viewer's take: 640/368 plate. The measurement overlay drawn on it
   *  (sections/capture) is timed to this clip; a new clip needs its marks
   *  re-timed or removed. Encoded at 90fps (445 frames); the take plays
   *  forward to its middle and back. */
  viewer: {
    echo: {
      src: "/media/viewer/echo.mp4",
      poster: "/media/viewer/echo-poster.jpg",
      duration: 4.944,
      fps: 90,
    } satisfies Take,
  },

  /** Founder portraits: square, up to 1000px. */
  team: {
    srinathSridhar: "/media/team/srinath-sridhar.jpg",
    tamarKreitman: "/media/team/tamar-kreitman.jpg",
    aashishRai: "/media/team/aashish-rai.jpg",
  },

  /** Research card pictures: landscape, 577/310 plates.
   *  TODO(client): the final artwork per entry - these are stills from our
   *  own captures. */
  science: {
    paper: "/media/science/paper.jpg",
    press: "/media/science/press.jpg",
    post: "/media/science/post.jpg",
  },

  /** The closing block's background loop: two renditions of one take, the
   *  browser picks by viewport width; plus its poster. */
  closing: {
    woodworking: {
      poster: "/media/closing/woodworking-poster.jpg",
      sources: [
        {
          src: "/media/closing/woodworking-1080.mp4",
          media: "(min-width: 96rem)",
        },
        { src: "/media/closing/woodworking-720.mp4" },
      ],
    },
  },
} as const;
