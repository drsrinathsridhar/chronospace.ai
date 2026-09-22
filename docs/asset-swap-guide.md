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

| Slot                    | File(s)                                                                                                       | Format and size                                                                                     | Notes                                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero figures            | `hero/robotics-arm.png`, `hero/robotics-man.png`, `hero/manufacturing-subject.png`, `hero/sports-subject.png` | PNG, transparent background, figure only, feet at the bottom edge. 1000-1600px tall.                | **Tight.** Each cutout's place in its card (left, width, aspect) is in `src/app/sections/hero/hero-cards.tsx`; a cutout with different proportions needs those three numbers updated.                 |
| Backing band, NVIDIA    | `backers/nvidia-inception.png`                                                                                | PNG, black on transparent (the page turns it white).                                                | The other marks are SVG icons (`src/icons/source/`).                                                                                                                                                  |
| Intro picture           | `intro/placeholder.png`                                                                                       | PNG or JPEG, roughly square; transparent background welcome. 900px or larger.                       | The placeholder split circle. Shown in a square box with `object-fit: contain`. To go back to a video here, `sections/problem/problem.tsx` needs the player again (see git history).                  |
| Intro take (parked)     | `intro/manufacturing.mp4` + `intro/manufacturing-poster.jpg`                                                  | MP4 H.264, portrait, 768x1024, 30fps, muted. Poster = first frame, JPEG.                            | Not rendered at the moment; kept for the rebuilt manufacturing scene. Update `duration` in `media.config.ts` with the clip.                                                                           |
| Product takes (3)       | `product/wild.mp4`, `product/navigable.mp4`, `product/queryable.mp4` + `*-poster.jpg`                         | MP4 H.264, landscape, 960px wide (960x540 today), 30fps, muted, 3-20 s. Poster = first frame, JPEG. | Plate is 577/310; a 16:9 clip is cropped ~2% top and bottom. Update `duration` and `fps`. The scrubber follows playback directly and needs no sidecar file.                                             |
| Viewer take             | `viewer/echo.mp4` + `viewer/echo-poster.jpg`                                                                  | MP4 H.264, 640x368, 90fps today (any rate; set `fps`), muted.                                       | The measurement overlay (`src/app/sections/capture/capture-player.client.tsx`) is keyframed to this clip. A new clip needs the marks re-timed, or the overlay removed.                                |
| Team portraits (3)      | `team/srinath-sridhar.jpg`, `team/tamar-kreitman.jpg`, `team/aashish-rai.jpg`                                 | JPEG, square, 800-1200px.                                                                           | Displayed square, in colour (round 3: no grayscale).                                                                                                                                                  |
| Research card pictures  | `science/paper.jpg`, `science/press.jpg`, `science/post.jpg`                                                  | JPEG, landscape, 1154x650 or larger.                                                                | Plate is 577/310. Current files are stills from the site's own captures - placeholders.                                                                                                               |
| Closing background loop | `closing/woodworking-1080.mp4`, `closing/woodworking-720.mp4`, `closing/woodworking-poster.jpg`               | MP4 H.264, 1920x1080 and 1280x720, 30fps, muted, ~20 s loop. Keep each under ~12 MB / ~8 MB.        | The browser loads the 1080 file on screens 1536px and wider, the 720 file otherwise. Both should be the same cut.                                                                                     |

Copy and links are not media: headlines and blurbs live in each section's
file under `src/app/sections/`, URLs in `src/site.config.ts`.

## Encoding a video for a slot

With ffmpeg (`brew install ffmpeg`), from the master:

```bash
ffmpeg -i master.mov -an -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -vf "scale=960:-2,fps=30" -g 15 -keyint_min 15 -sc_threshold 0 -movflags +faststart public/media/product/wild.mp4
```

- `scale=960:-2` sets the width (use 1920 / 1280 for the closing loop,
  768 for the intro); `-an` drops audio (every take is muted); `-crf`
  23-29 trades size for quality (higher = smaller).
- `-g 15 -keyint_min 15 -sc_threshold 0` puts a keyframe every 0.5 seconds
  at 30fps, so dragging the scrubber does not wait for a distant keyframe.
  Use `45` for a 90fps source.
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

## The share card and the icons

These are not media slots - they sit where the browser and Next look for
them - but each is a plain file that can be overwritten in place.

| File                                                                 | Size and format                                                                                                                               | What reads it                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `public/og.png`                                                      | 1200x630, PNG or JPEG, opaque, under 500 KB.                                                                                                  | Every link unfurler (`og:image`, `twitter:image`; declared in `src/lib/metadata.ts`).    |
| `src/app/icon.svg`                                                   | Square viewBox, transparent, the mark in the client's favicon grey (`#939393`) at 90% of the tile, centred; the mid grey reads on light and dark tab bars alike. | Modern browsers' tab icon.                                                               |
| `src/app/favicon.ico`                                                | 16 + 32 + 48 (PNG-in-ICO), transparent, the grey mark at 90%, no outline.                                                                     | Browsers without SVG favicons, bookmarks, Windows.                                       |
| `src/app/icon.png`                                                   | 64x64, transparent, same drawing as the `.ico`.                                                                                                | The PNG fallback Next emits next to the `.ico`.                                          |
| `src/app/apple-icon.png`                                             | 180x180, **opaque** page ground (`#090b19`), grey mark at 60%, square corners (iOS rounds them and paints transparency black).                | iOS home screen.                                                                         |
| `public/icons/icon-192.png`, `icon-512.png`, `icon-512-maskable.png` | Opaque page ground, grey mark at 60% (the maskable one at 50%, inside the 80% safe zone).                                                     | Android home screen via `src/app/manifest.ts`; the 512 is also the JSON-LD `logo`.       |
| `public/safari-pinned-tab.svg`                                       | Single colour, 100% black on transparent, 16-unit viewBox.                                                                                    | Safari pinned tabs; painted in the grey set on the `mask-icon` entry in `metadata.ts`.   |

To redraw the icon set from a new mark: put the mark's paths on a square
viewBox in `icon.svg` and `safari-pinned-tab.svg` by hand, then render the
rasters from the same paths at the sizes above with any headless browser
(`chrome --headless --screenshot=out.png --window-size=64,64 --default-background-color=00000000 file:///…/tile.html`
gives a transparent PNG; the same page with an opaque `<rect>` gives the
Apple and manifest tiles). The current set was rendered with `sharp`
(already in `node_modules` under Next) straight from the SVG string, which
gives the same result without a browser. The `.ico` is three PNGs behind a 6-byte header
and one 16-byte entry per image; any icon packer writes it. Keep every
transparent tile's corner pixels at alpha 0 (`sips -g hasAlpha` says whether
the alpha channel survived).

To redraw the share card: it is an HTML composition - the wordmark
(`src/icons/source/chronospace-logo.svg`), the hero headline in Nippo at
weight 378 / -2% tracking, the three hero cutouts in colour standing on a
hairline over the room floor (`#020413`) - screenshotted at exactly 1200x630.
Any tool that exports a 1200x630 PNG under 300 KB will do; the file name and
the `alt` text in `src/lib/metadata.ts` are the only references.

## Settings (`src/tuning.config.ts`)

Plain values, commented in the file. They become CSS custom properties on
the page root, so a change applies everywhere the effect appears.

| Knob                   | Default    | What it does                                                                                                                                                               |
| ---------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heroWiggle`           | `1`        | How far the hero room and its figures move with the pointer. `0` parks them, `2` doubles the move.                                                                         |
| `heroFigureBrightness` | `1.25`     | How bright the resting (desaturated) hero figures are. `1` is the cutout's own luminance. Above about `1.5` the highlights clip to white and the figure loses its detail.  |
| `heroFigureContrast`   | `1.08`     | How much the resting figures' tones are stretched after the lift. `1` leaves them as the cutout has them.                                                                  |
| `heroTrail.mode`       | `"smear"`  | The figures' trail on hover, on their turn and on arrival. `"smear"` is the motion smear (below); `"flare"` is the header logo's band of colour instead, no trail.         |
| `heroTrail.colour`     | `"true"`   | `"true"` paints the trail in the cutout's own colour; `"accent"` floods it with the brand orange; `"ink"` with the page's ink. The logo's flare is `"flare"` + `"accent"`. |
| `heroTrail.length`     | `1`        | Multiplies the smear's stretch: `0.5` halves the tail, `2` doubles it. Nothing for the flare.                                                                              |
| `heroTrail.blur`       | `1`        | Multiplies the smear's softness along its length. Below about `0.45` the tail starts to clip. Nothing for the flare.                                                       |
| `heroTrail.opacity`    | `0.6`      | The trail's strength at a full-speed sweep, `0`..`1`; a still figure shows 70% of it. The flare's band uses it as is.                                                      |
| `videoTone`            | `"colour"` | `"colour"` shows every take as shot. `"mono"` desaturates the plates into the page's grey (the comp).                                                                      |

### The motion trail

One layer behind each hero figure, a copy of the same cutout: stretched back
along the figure's travel from its leading edge, blurred along that axis
(an SVG filter, `src/icons/source/hero-trail-filters.svg`, mounted once in
the hero), and faded to nothing along the tail. Its length follows how fast
the pointer is moving the room - a flick pulls a long smear, a still hand
leaves a short soft one. It shows on hover, on each figure's turn in the
round robin, and once on arrival; at rest it is invisible. The designed
numbers live in `src/app/sections/hero/hero-cards.module.css` (`.trail`):
stretch `0.18 + speed × 0.55` of the piece width, blur deviation `0.012` of
the card width, mask solid over the figure then `38%` at 40% of the tail
and gone at its end. The knobs above multiply them; the numbers themselves
are the designer's. `mode: "flare"` swaps the whole thing for the logo's
treatment: the figure stays grey and a band of colour flies across it once.

## The video scrubber

The arc scrubber on every video plate (`src/components/arc-scrubber.client.tsx`)
shows linear playback progress. Its handle is synchronized from the browser's
presented video frames, and dragging it seeks to the same fraction of the clip.
This works for any replacement video without generated camera data. Set `fps`
in `media.config.ts` so the "View n / N" counter matches the new file; it
defaults to 30.

The arc's size is `--arc-radius` in `timeline-player.module.css` (cards
and, from 640px, the viewer); the drawing is `arc-scrubber.module.css`.

## Things that are still placeholders

- Research card pictures (`science/*.jpg`) and the three card links (all
  point at the Brown lab site; `src/app/sections/science/science.tsx`).
- Terms and Privacy links in the footer bar render inert until
  `src/site.config.ts` carries real URLs.
- `product/wild.mp4` is a trimmed reconstruction pass standing in for
  in-the-wild footage.
- The NVIDIA lockup is a PNG turned white by a CSS filter; an SVG or white
  export from NVIDIA would replace it cleanly.
