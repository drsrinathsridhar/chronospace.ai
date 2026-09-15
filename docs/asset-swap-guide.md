# Swapping assets and settings

How to replace any picture or video on the landing page, and how to turn
the few knobs that were left exposed, without touching layout or code
structure. Written for whoever holds the site after handoff.

## The one rule

Every media slot is a file under `public/media/<section>/` with a fixed
name, listed in `src/media.config.ts`. To swap an asset, either:

1. **Overwrite the file** - same folder, same name - and redeploy. Nothing
   else changes. (Browsers may cache the old file for a while; a hard
   refresh shows the new one. While `next dev` is running, the optimizer
   also caches resized copies in `.next/dev/cache/images` - delete that
   folder and restart the dev server if a swapped picture does not show.)
2. Or **change the path in `src/media.config.ts`** to point at a new file
   name. That is the only line of code a swap ever needs.

The layout crops every picture and take to its slot (`object-fit: cover`),
so a new file may have a different size or ratio; only what is listed as
"tight" below has to match exactly.

## Slots

| Slot                    | File(s)                                                                                                       | Format and size                                                                                     | Notes                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero figures            | `hero/robotics-arm.png`, `hero/robotics-man.png`, `hero/manufacturing-subject.png`, `hero/sports-subject.png` | PNG, transparent background, figure only, feet at the bottom edge. 1000-1600px tall.                | **Tight.** Each cutout's place in its card (left, width, aspect) is in `src/app/sections/hero/hero-cards.tsx`; a cutout with different proportions needs those three numbers updated.   |
| Backing band, NVIDIA    | `backers/nvidia-inception.png`                                                                                | PNG, black on transparent (the page turns it white).                                                | The other marks are SVG icons (`src/icons/source/`).                                                                                                                                    |
| Intro picture           | `intro/placeholder.png`                                                                                       | PNG or JPEG, roughly square; transparent background welcome. 900px or larger.                       | The placeholder split circle. Shown in a square box with `object-fit: contain`. To go back to a video here, `sections/problem/problem.tsx` needs the player again (see git history).    |
| Intro take (parked)     | `intro/manufacturing.mp4` + `intro/manufacturing-poster.jpg`                                                  | MP4 H.264, portrait, 768x1024, 30fps, muted. Poster = first frame, JPEG.                            | Not rendered at the moment; kept for the rebuilt manufacturing scene. Update `duration` in `media.config.ts` with the clip.                                                             |
| Product takes (3)       | `product/wild.mp4`, `product/navigable.mp4`, `product/queryable.mp4` + `*-poster.jpg`                         | MP4 H.264, landscape, 960px wide (960x540 today), 30fps, muted, 3-20 s. Poster = first frame, JPEG. | Plate is 577/310; a 16:9 clip is cropped ~2% top and bottom. Update `duration`, `fps` and `camera` (see "The camera path dial").                                                        |
| Viewer take             | `viewer/echo.mp4` + `viewer/echo-poster.jpg`                                                                  | MP4 H.264, 640x368, 90fps today (any rate; set `fps`), muted.                                       | The measurement overlay (`src/app/sections/capture/capture-player.client.tsx`) is keyframed to this clip. A new clip needs the marks re-timed, or the overlay removed; update `camera`. |
| Team portraits (3)      | `team/srinath-sridhar.jpg`, `team/tamar-kreitman.jpg`, `team/aashish-rai.jpg`                                 | JPEG, square, 800-1200px.                                                                           | Displayed square and desaturated at rest; colour on hover.                                                                                                                              |
| Research card pictures  | `science/paper.jpg`, `science/press.jpg`, `science/post.jpg`                                                  | JPEG, landscape, 1154x650 or larger.                                                                | Plate is 577/310. Current files are stills from the site's own captures - placeholders.                                                                                                 |
| Closing background loop | `closing/woodworking-1080.mp4`, `closing/woodworking-720.mp4`, `closing/woodworking-poster.jpg`               | MP4 H.264, 1920x1080 and 1280x720, 30fps, muted, ~20 s loop. Keep each under ~12 MB / ~8 MB.        | The browser loads the 1080 file on screens 1536px and wider, the 720 file otherwise. Both should be the same cut.                                                                       |

Copy and links are not media: headlines and blurbs live in each section's
file under `src/app/sections/`, URLs in `src/site.config.ts`.

## Encoding a video for a slot

With ffmpeg (`brew install ffmpeg`), from the master:

```bash
ffmpeg -i master.mov -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -vf "scale=960:-2,fps=30" -movflags +faststart public/media/product/wild.mp4
```

- `scale=960:-2` sets the width (use 1920 / 1280 for the closing loop,
  768 for the intro); `-an` drops audio (every take is muted); `-crf`
  23-29 trades size for quality (higher = smaller).
- Poster, the first frame:

```bash
ffmpeg -i public/media/product/wild.mp4 -frames:v 1 -q:v 4 public/media/product/wild-poster.jpg
```

- Length and frame rate, for `duration` and `fps` in `media.config.ts`:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate:format=duration -of default=nw=1 public/media/product/wild.mp4
```

Grainy footage (the woodworking master) compresses badly; a light denoise
(`-vf "hqdn3d=3:2:4:4,scale=1920:-2,fps=30"`) with `-crf 31` brought it from
385 MB to 11 MB.

## The icons

These are not media slots - they sit where the browser and Next look for
them - but each is a plain file that can be overwritten in place.

| File                                                                 | Size and format                                                                                                                               | What reads it                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/app/icon.svg`                                                   | Square viewBox, transparent, one `<style>` with a `prefers-color-scheme: dark` rule so the mark is dark ink on light tab bars, white on dark. | Modern browsers' tab icon.                                                               |
| `src/app/favicon.ico`                                                | 16 + 32 + 48 (PNG-in-ICO), transparent, mark in the accent with a thin ink outline (half a pixel at 16, one at 32 and 48).                    | Browsers without SVG favicons, bookmarks, Windows.                                       |
| `src/app/icon.png`                                                   | 64x64, transparent, same drawing as the `.ico`.                                                                                               | The PNG fallback Next emits next to the `.ico`.                                          |
| `src/app/apple-icon.png`                                             | 180x180, **opaque** page ground (`#090b19`), white mark at 60%, square corners (iOS rounds them and paints transparency black).               | iOS home screen.                                                                         |
| `public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | Opaque page ground, white mark at 60% (the maskable one at 50%, inside the 80% safe zone).                                                    | Android home screen via `src/app/manifest.ts`; the 512 is also the JSON-LD `logo`.       |
| `public/safari-pinned-tab.svg`                                       | Single colour, 100% black on transparent, 16-unit viewBox.                                                                                    | Safari pinned tabs; painted in the accent set on the `mask-icon` entry in `metadata.ts`. |

To redraw the icon set from a new mark: put the mark's paths on a square
viewBox in `icon.svg` and `safari-pinned-tab.svg` by hand, then render the
rasters from the same paths at the sizes above with any headless browser
(`chrome --headless --screenshot=out.png --window-size=64,64 --default-background-color=00000000 file:///…/tile.html`
gives a transparent PNG; the same page with an opaque `<rect>` gives the
Apple and manifest tiles). The `.ico` is three PNGs behind a 6-byte header
and one 16-byte entry per image; any icon packer writes it. Keep every
transparent tile's corner pixels at alpha 0 (`sips -g hasAlpha` says whether
the alpha channel survived).

## Settings (`src/tuning.config.ts`)

Plain values, commented in the file. They become CSS custom properties on
the page root, so a change applies everywhere the effect appears.

| Knob                   | Default    | What it does                                                                                                                                                              |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heroWiggle`           | `1`        | How far the hero room and its figures move with the pointer. `0` parks them, `2` doubles the move.                                                                        |
| `heroFigureBrightness` | `1.25`     | How bright the resting (desaturated) hero figures are. `1` is the cutout's own luminance. Above about `1.5` the highlights clip to white and the figure loses its detail. |
| `heroFigureContrast`   | `1.08`     | How much the resting figures' tones are stretched after the lift. `1` leaves them as the cutout has them.                                                                 |
| `videoTone`            | `"colour"` | `"colour"` shows every take as shot. `"mono"` desaturates the plates into the page's grey (the comp).                                                                     |

## The camera path dial

The dial on every video plate (`src/components/camera-path-dial.client.tsx`)
is a plan of the capture seen from above: the subject at the centre, the
camera's path as an arc around it, the camera as the dot travelling that
arc in step with the take, a view ray from the camera to the subject, and
the counter "View n / N" (a view per frame). It works with any clip of any
length as long as the clip's slot in `media.config.ts` carries two fields:

- `fps` - the frame rate the file is encoded at (from `ffprobe`, above;
  `30/1` is 30). Left out, the counter counts at 30.
- `camera` - where the camera went, one of:
  - `{ kind: "orbit", from: 30, to: -60 }` - the camera moves around the
    subject from one bearing to the other over the length of the take.
  - `{ kind: "fixed", at: 0 }` - the camera stands still; the dial then
    shows playback on the ring around the subject and never moves the
    camera.

Bearings are degrees around the subject, seen from above: `0` is straight
in front of the subject (the bottom of the plan, nearest you), and they
grow clockwise - `90` looks at the subject's right side, `180` from behind,
`-90` (or `270`) at its left side. `to` below `from` is a camera moving
counter-clockwise; a full turn is `0` to `360`. Read the numbers off the
footage: step through it and see which way the scene turns - if the scene
appears to turn to the right, the camera is moving to its left, which is
clockwise (`to` above `from`). The exact angles are a judgement of the eye;
tune them in the browser.

The plan's size is `--arc-radius` in `timeline-player.module.css` (cards
and, from 640px, the viewer); the drawing is `camera-path-dial.module.css`.

## Things that are still placeholders

- Research card pictures (`science/*.jpg`) and the three card links (all
  point at the Brown lab site; `src/app/sections/science/science.tsx`).
- Terms and Privacy links in the footer bar render inert until
  `src/site.config.ts` carries real URLs.
- `product/wild.mp4` is a trimmed reconstruction pass standing in for
  in-the-wild footage.
- The NVIDIA lockup is a PNG turned white by a CSS filter; an SVG or white
  export from NVIDIA would replace it cleanly.
