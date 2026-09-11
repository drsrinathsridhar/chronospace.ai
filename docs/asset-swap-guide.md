# Swapping assets and settings

How to replace any picture or video on the landing page, and how to turn
the few knobs that were left exposed, without touching layout or code
structure. Written for whoever holds the site after handoff.

## The one rule

Every media slot is a file under `public/media/<section>/` with a fixed
name, listed in `src/media.config.ts`. To swap an asset, either:

1. **Overwrite the file** - same folder, same name - and redeploy. Nothing
   else changes. (Browsers may cache the old file for a while; a hard
   refresh shows the new one.)
2. Or **change the path in `src/media.config.ts`** to point at a new file
   name. That is the only line of code a swap ever needs.

The layout crops every picture and take to its slot (`object-fit: cover`),
so a new file may have a different size or ratio; only what is listed as
"tight" below has to match exactly.

## Slots

| Slot                    | File(s)                                                                                                       | Format and size                                                                                     | Notes                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero figures            | `hero/robotics-arm.png`, `hero/robotics-man.png`, `hero/manufacturing-subject.png`, `hero/sports-subject.png` | PNG, transparent background, figure only, feet at the bottom edge. 1000-1600px tall.                | **Tight.** Each cutout's place in its card (left, width, aspect) is in `src/app/sections/hero/hero-cards.tsx`; a cutout with different proportions needs those three numbers updated. |
| Backing band, NVIDIA    | `backers/nvidia-inception.png`                                                                                | PNG, black on transparent (the page turns it white).                                                | The other marks are SVG icons (`src/icons/source/`).                                                                                                                                  |
| Intro take              | `intro/manufacturing.mp4` + `intro/manufacturing-poster.jpg`                                                  | MP4 H.264, portrait, 768x1024, 30fps, muted. Poster = first frame, JPEG.                            | Update `duration` in `media.config.ts` with the clip.                                                                                                                                 |
| Product takes (3)       | `product/wild.mp4`, `product/navigable.mp4`, `product/queryable.mp4` + `*-poster.jpg`                         | MP4 H.264, landscape, 960px wide (960x540 today), 30fps, muted, 3-20 s. Poster = first frame, JPEG. | Plate is 577/310; a 16:9 clip is cropped ~2% top and bottom. Update `duration`.                                                                                                       |
| Viewer take             | `viewer/echo.mp4` + `viewer/echo-poster.jpg`                                                                  | MP4 H.264, 640x368, 30fps, muted.                                                                   | The measurement overlay (`src/app/sections/capture/capture-player.client.tsx`) is keyframed to this clip. A new clip needs the marks re-timed, or the overlay removed.                |
| Team portraits (3)      | `team/srinath-sridhar.jpg`, `team/tamar-kreitman.jpg`, `team/aashish-rai.jpg`                                 | JPEG, square, 800-1200px.                                                                           | Displayed square and desaturated at rest; colour on hover.                                                                                                                            |
| Research card pictures  | `science/paper.jpg`, `science/press.jpg`, `science/post.jpg`                                                  | JPEG, landscape, 1154x650 or larger.                                                                | Plate is 577/310. Current files are stills from the site's own captures - placeholders.                                                                                               |
| Closing background loop | `closing/woodworking-1080.mp4`, `closing/woodworking-720.mp4`, `closing/woodworking-poster.jpg`               | MP4 H.264, 1920x1080 and 1280x720, 30fps, muted, ~20 s loop. Keep each under ~12 MB / ~8 MB.        | The browser loads the 1080 file on screens 1536px and wider, the 720 file otherwise. Both should be the same cut.                                                                     |

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

- Length, for `duration` in `media.config.ts`:

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/media/product/wild.mp4
```

Grainy footage (the woodworking master) compresses badly; a light denoise
(`-vf "hqdn3d=3:2:4:4,scale=1920:-2,fps=30"`) with `-crf 31` brought it from
385 MB to 11 MB.

## Settings (`src/tuning.config.ts`)

Plain values, commented in the file. They become CSS custom properties on
the page root, so a change applies everywhere the effect appears.

| Knob                   | Default    | What it does                                                                                          |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| `heroWiggle`           | `1`        | How far the hero room and its figures move with the pointer. `0` parks them, `2` doubles the move.    |
| `heroFigureBrightness` | `2`        | How bright the resting (desaturated) hero figures are. `1` is the cutout's own luminance.             |
| `videoTone`            | `"colour"` | `"colour"` shows every take as shot. `"mono"` desaturates the plates into the page's grey (the comp). |

## The arc scrubber

The dial on every video plate (`src/components/arc-scrubber.client.tsx`)
reads only the take's progress (0-1), so it works unchanged with any clip
of any length. Its geometry lives at the top of `arc-scrubber.module.css`
(radius, sweep angle). The frame counter assumes 30 fps.

## Things that are still placeholders

- Research card pictures (`science/*.jpg`) and the three card links (all
  point at the Brown lab site; `src/app/sections/science/science.tsx`).
- Terms and Privacy links in the footer bar render inert until
  `src/site.config.ts` carries real URLs.
- `product/wild.mp4` is a trimmed reconstruction pass standing in for
  in-the-wild footage.
- The NVIDIA lockup is a PNG turned white by a CSS filter; an SVG or white
  export from NVIDIA would replace it cleanly.
