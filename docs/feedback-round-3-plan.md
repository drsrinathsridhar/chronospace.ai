# Client feedback round 3 - implementation plan (15 Sep 2026)

Working plan for the third feedback round, "stylistic & formatting". Source:
the client deck `public/feedback-15:09/Chronospace_landing_page_feedback_15th_sep_2026.pptx`,
**slides 1-9 only** (slides 10-29 are the two previous rounds and are
ignored). Baseline: `main` at `a7dd404`, live on
https://chronospace-v2.vercel.app (Vercel deploys `main`). The deck folder
is already covered by `.gitignore` (`public/feedback-*/`).

Status legend: **DO** = in scope now · **ASK** = needs an answer from the
owner or the client, work proceeds under the stated assumption · **CLIENT**
= blocked on material only the client can supply · **NO-TOUCH** = the
owner's own work, nothing here may make it harder.

**Status (2026-09-15):** green light from the owner. Answers to §6: smear
(A) is the default trail with the flare behind `heroTrail.mode` (D5); the
mobile Menu sheet is in scope (D12); About stays heading-less (D16); VIEW
counts frames (D7); the vanishing point moves with the centre figure (D3);
the URL fallback chain covers the Vercel domain until a custom domain exists
(D15); Lighthouse reports are committed under `docs/lighthouse/` (D17).
Work happens on `claude/feedback-round-3-2026-09-15`; the reviewed state is
tagged `backup/pre-feedback-3-2026-09-15` (= `a7dd404`).

The client's own priority order (slide 9): (1) hero image quality and a
revised motion-trail effect, (2) video scrubber sync, (3) mobile version
and format check, (4) metadata fixes. The task list below is ordered so the
first PRs land those four.

---

## 1. The feedback, slide by slide

### Slide 1 - cover

"Thank you for incorporating the round-2 feedback", anchored on staging as
of 15 Sep. Nothing to do.

### Slide 2 - Hero: visual quality + effects

| #   | Request (client wording paraphrased)                                                                                                                               | Status         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| 2a  | The **grey versions of the assets are less clear than the colour ones**; hero images must be extremely high quality - "replace with sharp renders"                 | DO T2 + CLIENT |
| 2b  | **Align the centre asset exactly to the centre of the page**                                                                                                       | DO T3          |
| 2c  | Proportions: the **dancer looks tiny** next to the other two - make the other assets slightly smaller so the three feel matched                                    | DO T3          |
| 2d  | Functional: the **3D mouse-move effect isn't working on some of our machines**, and **doesn't respond to touch on smartphones** - it should; check device coverage | DO T4          |
| 2e  | **Remove the orange highlight of the text across all headers**                                                                                                     | DO T1          |
| 2f  | **Spacing issue between "Team" and "Connect"** (annotated on the navbar screenshot)                                                                                | DO T1          |

### Slide 3 - Hero echo: performance + look

| #   | Request                                                                                                                                                                                                                                                                                                                                             | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 3a  | Echo stacks **load the full 3840px image per clone** (= 8 full-size loads?). Serve small variants for clones, only the front image needs full resolution, or fix preload attributes so first paint does not wait on everything                                                                                                                      | DO T5  |
| 3b  | The echo "looks very extra" and needs **smoothing**. It was cool initially but isn't working in this composition. **Abstract it further: a lighter, smoother fading gradient** (reference: "Fading Motion Effect" astronaut - a directional motion smear) **OR the same treatment as the logo, top-left** (the orange flare that fades in on hover) | DO T5  |

### Slide 4 - Backers strip

| #   | Request                                                                                                                                                                                               | Status |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 4a  | **Add a grey line below the logos**                                                                                                                                                                   | DO T6  |
| 4b  | Marquee: **label clones inconsistently show raw URLs / doubled names** (screenshot: a bare "…NERS" next to "Backed by", "Brown Angel Group" at both ends) - every repeat should carry the clean label | DO T6  |

### Slide 5 - Features: the circular scrubber

| #   | Request                                                                                                                                                                                                                                                                                                               | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 5a  | The circular scrubber is **fully disconnected from the videos**. It was meant to read as a **CAMERA TRAJECTORY around the scene**; a curved timeline conveys nothing new. **Rework toward the trajectory idea, synced with playback**, like the "baby video" example (`public/feedback-11:09/scrubber-reference.mov`) | DO T7  |
| 5b  | **No orange text highlights**                                                                                                                                                                                                                                                                                         | DO T1  |

### Slide 6 - About ("Frontier models…")

| #   | Request                                                  | Status |
| --- | -------------------------------------------------------- | ------ |
| 6a  | **Alignment is off - give this block an alignment pass** | DO T8  |

### Slide 7 - Team, Research & Insights, Closing

| #   | Request                                                                                                    | Status |
| --- | ---------------------------------------------------------------------------------------------------------- | ------ |
| 7a  | Team photos: **remove the grayscale treatment - colour only**                                              | DO T9  |
| 7b  | Team photos **20% smaller**                                                                                | DO T9  |
| 7c  | Research & Insights: **clicking the card image should open the link too** (only the text link works today) | DO T9  |
| 7d  | Closing section: all good - **no changes**                                                                 | -      |

### Slide 8 - Mobile

| #   | Request                                                                                                                   | Status |
| --- | ------------------------------------------------------------------------------------------------------------------------- | ------ |
| 8a  | Hero on phone: the three assets together look **too tiny**. Suggestion: **ONE asset centred, swipe to move between them** | DO T10 |
| 8b  | **Proportions off throughout on mobile** - e.g. the logo and body font render at nearly the same size                     | DO T11 |
| 8c  | The **ChronoSpace logo and "Connect with us" overlap** on smaller screens                                                 | DO T11 |
| 8d  | A **full mobile pass** - a large share of AI-fair traffic will open this on a phone                                       | DO T12 |

### Slide 9 - Housekeeping

| #   | Request                                                                                                                                       | Status |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 9a  | One final **sweep for alignment, spacing and proportions sitewide** - consistent margins, imbalanced sections, matched asset sizes            | DO T15 |
| 9b  | **Favicon**: transparent background, legible on dark and light browser themes; check pinned tabs and mobile home-screen icons too             | DO T13 |
| 9c  | **Metadata**: canonical / og:url off localhost, og:image restored, title tag with tagline ("ChronoSpace — AI to digitize the physical world") | DO T14 |
| 9d  | A quick **Lighthouse run on mobile + desktop**, shared with the client                                                                        | DO T16 |

---

## 2. What is actually going on in the code (root causes)

Everything below was verified against the source and the prerendered build
on 15 Sep; line numbers are for `main` at `a7dd404`.

### Hero (slides 2-3)

- **Grey is a CSS filter, not a second asset.** There is one coloured cutout
  per subject (`src/media.config.ts:34-39`); the resting look is
  `filter: grayscale(1) brightness(var(--figure-brightness))` with
  `heroFigureBrightness: 2` in `src/tuning.config.ts:22`
  (`hero-cards.module.css:186-205`). `brightness(2)` on an already light
  cutout clips every highlight to white, which is exactly "less clear than
  the colour ones": the grey copy is the same pixels with half the tonal
  range thrown away. → 2a.
- **Source resolution is modest** and one aspect is wrong:
  `robotics-arm.png` 613x854, `robotics-man.png` 161x579,
  `manufacturing-subject.png` 1232x923, `sports-subject.png` 864x1152 (the
  dancer piece is declared `97/135` = 0.7185 while the file is 0.750, and
  `object-cover` side-crops her ~4%, `hero-cards.tsx:159-177`). At 2560px on a
  2x display the arm draws at ~870 device pixels from a 613px file. → 2a.
- **The middle figure is not centred.** Cards scale from `transform-origin:
0 100%`, so `left` is the unscaled box edge. Visible centres at the design
  width: robotics ≈ 8.3-32.9%, manufacturing ≈ 44.0-70.8% (centre **≈ 57.4%**),
  dancer ≈ 81.9-91.7%. The comment at `hero-cards.tsx:56-60` records the
  right-of-centre nudge as deliberate; the client now wants it dead centre.
  Room vanishing point is `perspective-origin: 49.82% 73.09%`
  (`hero-room.module.css:117`). → 2b.
- **Scales**: robotics `1.75`, manufacturing `1.73`, dancer `1.08`
  (`hero-cards.tsx:102-178`). → 2c.
- **Why the 3D effect dies on some desktops and on every phone**
  (`src/app/sections/hero/hero-room-eye.client.tsx`):
  1. `prefers-reduced-motion: reduce` returns before anything is wired
     (`:95`). Windows "Show animations in Windows" = off and macOS "Reduce
     motion" both set this - the hero is then fully static. Very likely the
     "some of our machines".
  2. Pointer listeners are attached only when
     `(hover: hover) and (pointer: fine)` matches (`:98-100`, `:243-247`).
     Touch-screen laptops and some Windows/Chrome setups report a coarse
     primary pointer and get no pointer tracking at all, only the slow idle
     drift.
  3. Touch: there is no `touchmove`, no `deviceorientation`, and below
     `80rem` the cards are a static 3-column strip (`hero-cards.module.css:79`)
     that reads none of the eye variables - only the room walls drift.
  4. `src/components/pointer-drift.client.tsx` (the About visual) has the
     same fine-pointer gate (`:33-34`). → 2d.
- **The "orange highlight" is `::selection`**
  (`src/app/globals.css:126-129`: `background: var(--accent)`). No component
  draws an accent box behind type anywhere; the client is seeing selected
  text in their screenshots (drag-select while capturing). → 2e, 5b.
- **Team ↔ Connect**: the last nav cell (`px-6`) butts straight against the
  CTA (`px-6`) with no margin between (`site-header.tsx:61-74`,
  `cta-link.tsx:24`). → 2f. (Alternative reading - the gap between the Team
  section and the closing block - is covered by the T15 sweep.)
- **Echo = five full copies of every piece.** Subject + shadow + three
  echoes each re-render `<Pieces>` as Next `<Image fill>`
  (`hero-cards.tsx:240-262`): 20 hero `<img>` tags, all
  `sizes="(min-width: 80rem) 30vw, 180px"` while the pieces actually render at
  ~5-16vw, `loading="lazy"`, no `priority`, fallback `src` at `w=3840`. The
  browser dedupes the network fetch per URL, but every clone is a separate
  decode + composite layer, and the LCP image is lazy. Echo geometry is
  hard-coded (`-6.5%` offsets, opacities 0.6/0.35/0.2, 90ms stagger,
  `hero-cards.module.css:255-276`, `hero-cards.tsx:181-185`); nothing in
  `tuning.config.ts` governs it. → 3a, 3b.

### Backers (slide 4)

- The band has **no bottom rule** (`backers.tsx:97-101`); the file comment
  claiming one is stale (it was stripped in `efbd75f`). → 4a.
- Two marks are **icon + live HTML text**: Vela = pixel-wordmark SVG "VELA" +
  `<span class="type-nav">Partners</span>`; TekVentures = V-mark +
  `<span>TekVentures</span>` (`backers.tsx:64-88`). The band's 64px edge
  mask (`backers.module.css:13-29`) fades the SVG out first and leaves the
  bare uppercase word ("PARTNERS" → "…NERS") standing mid-strip, right after
  the "Backed by" label. Every mark is also rendered twice inside its anchor
  (base + accent flare copy at `opacity: 0`, `backers.tsx:130-136`) - on
  hover the word is genuinely painted twice. Four track copies × five marks
  put the same name on screen several times at once on wide viewports. No
  code path ever renders a URL as text; "raw URLs" most plausibly means the
  browser status bar on hover, or the partial word read as a domain. → 4b.

### Features scrubber (slide 5)

- The dial **is** driven by `video.currentTime` through a rAF loop
  (`timeline-player.client.tsx:101-126`) - it is not on its own clock. What
  makes it read as disconnected:
  1. Semantics: it is drawn as a **150° arc across the top with a handle**
     (`arc-scrubber.client.tsx:33-35`) - a timeline in disguise - while the
     client's reference is a plan-view **camera path** whose dot is the camera
     orbiting the subject, captioned "FREE VIEWPOINT · VIEW 22 / 60".
  2. Perceptibility: `--arc-radius: 2rem` and 150° over an 18.7s clip is
     ~8°/s; the counter ("FRAME 267 / 284") updates at 10Hz on a hard-coded
     `FRAME_RATE = 30` (`:44`) - wrong by 3x for the 90fps viewer clip.
  3. Autoplay is the only way the video starts (`preload="none"`,
     IntersectionObserver at 0.35 that disconnects after the first hit,
     `play().catch(() => {})`, `:143-156`); under reduced-motion, Low Power
     Mode or a refused autoplay the poster stands and the dial sits at 0
     with **no control to start it** (the play glyph was removed in round 2).
  4. `navigable` is configured `18.78s` vs a real `18.733s` (denominator
     flips 563 → 562 once metadata lands).
- Camera motion per clip (checked frame by frame): **`wild.mp4` and
  `navigable.mp4` orbit the scene**; **`queryable.mp4` (tracked dancer) and
  the viewer's `echo.mp4` are fixed-camera takes**. A universal orbit dial
  would lie on those two. → 5a.

### About (slide 6)

- `problem.tsx:59-123`: 12-col grid, image `md:col-span-5 md:self-center`,
  copy `md:col-span-7` but **capped at `max-w-174.5` (698px)**, so the text
  and the three measurement rules stop ~119px short of the right gutter while
  the circle sits flush to the left gutter. The `<dt>` label text is indented
  ~29.5px by the accent bracket icon + `gap-4`, so rules align with the
  paragraph but the labels do not. `placeholder.png` is **876x862** inside an
  `aspect-square` box with `object-contain` → the circle is ~1.6% shorter than
  its box and not on its visual centre. No `<h2>` - the only section without
  a heading. → 6a.

### Team / Research (slide 7)

- Grayscale is `team.module.css:9-16` (`filter: grayscale(1)`, colour on
  hover); the JPGs are colour, 512 / 800 / 1000px square
  (`public/media/team/`). Row is `mx-auto max-w-300` (1200px) → 373px
  portraits (`team.tsx:94`). → 7a, 7b.
- Science card: the only anchor is the `CtaLink` at the foot; the image
  `<div>` at `science.tsx:97-105` is not wrapped in a link (Team's portrait
  is, decoratively, at `team.tsx:104`). All three hrefs are still the
  placeholder `https://ivl.cs.brown.edu/`. → 7c.

### Mobile (slide 8)

- **No fluid type.** Every `type-*` utility is a fixed rem
  (`globals.css:267-431`); `cqw` is used only by the hero room geometry.
  Section padding (120px), section gap (80px), panel gap (40px) and every
  lede (`type-body-xl` 20px) are identical at 390px and 1496px. The logo is a
  hard-coded 168x32 SVG (`site-header.tsx:47-57`) whose wordmark cap-height
  (~16.5px) sits within ~2px of the 20px body lede's - the client's "nearly
  the same size". → 8b.
- **Header**: nav links are `hidden lg:flex` (`site-header.tsx:69`) with no
  mobile menu of any kind; logo `shrink-0`, nav `flex-none`, CTA
  `px-6` + 12px uppercase label ≈ 169px. Content box at 390px = 350px vs
  ≈337px needed (13px slack); at 375px it overflows by ~2px, at 360px by
  ~17px. → 8c.
- **Hero below `xl`** is a 3-column grid, `gap 0.5rem`, cards capped at
  `11.1875rem` → ~111px per figure at 390px (`hero-cards.module.css:55-76`).
  No carousel / scroll-snap / swipe code exists anywhere in `src/`. → 8a.
- Only three width media queries exist in all CSS modules (hero strip at
  80rem, closing stage at 64rem, player dial at 40rem); every section's
  mobile behaviour is "3 columns → 1" plus the 32/40/48px heading ramp. → 8d.

### Metadata / favicon (slide 9)

- The one env var the app reads, `NEXT_PUBLIC_SITE_URL`, is **not set on
  Vercel**, and `src/lib/env.ts:4` defaults it to `http://localhost:3000`;
  `siteConfig.url` → `metadataBase`, canonical, `og:url`, sitemap `<loc>` and
  `robots.txt` all inherit it. Confirmed live: `<link rel="canonical"
href="http://localhost:3000">`. → 9c.
- **No `og:image` / `twitter:image` at all** (`src/lib/metadata.ts:24-35`
  has no `images`; no `opengraph-image.*` route; `twitter:card =
summary_large_image` declared with nothing to show). Git history has no
  earlier OG image either - "restored" means "add one". `<title>` is the
  bare `ChronoSpace`. No `theme-color`, no manifest. → 9c.
- Favicons: `src/app/favicon.ico` 48px, `icon.png` 64px, `apple-icon.png`
  180px - all **opaque `#020413` squares** (0 transparent pixels) with a white
  mark; that colour is `--room-floor`, not `--paper`. No SVG icon, no
  `manifest.webmanifest`, no maskable Android icon, no Safari pinned-tab
  mask. → 9b.

### Tooling

- No test runner, Playwright, Puppeteer or Lighthouse in `node_modules`;
  node `v26.8.2`; a cached Playwright `chrome-headless-shell` exists (path in
  `docs/handoff.md:34-42`). `next build` must run outside the sandbox.

---

## 3. Decisions (confirm or overrule before the build starts)

- **D1 Selection colour (2e, 5b).** `::selection` becomes neutral:
  `rgb(255 255 255 / 24%)` on the dark ground with the ink unchanged. No
  accent block anywhere behind type. One line in `globals.css`.
- **D2 Hero grey treatment (2a).** Stop clipping. The resting filter becomes
  `grayscale(1) brightness(B) contrast(C)` with B ≈ 1.15-1.3 and a small
  contrast lift so the "pristine white" comes from the room's light, not
  from blowing out the render; `heroFigureBrightness` keeps its knob but the
  default drops from 2 to the verified value. Fix the dancer's declared
  aspect to the file's 0.750 so nothing is cropped. Add `priority` +
  correct per-piece `sizes` so the browser picks a variant at or above the
  drawn size on 2x screens (and stops guessing from `30vw`). **CLIENT:** the
  cutouts themselves cannot be made sharper than their source; request
  masters at ≥ 2x the largest drawn size (arm ≥ 1300px tall, manufacturing
  ≥ 1900px wide, dancer ≥ 1200px tall, on transparent, same camera). Until
  they arrive we ship the filter and sizing fixes.
- **D3 Hero composition (2b, 2c).** The manufacturing piece's visible centre
  moves to 50.0% of the frame (the room's vanishing point moves with it, to
  `50% 73.09%`); the flanks re-space so the two gaps read equal. Scales:
  robotics 1.75 → **1.50**, manufacturing 1.73 → **1.45**, dancer 1.08 →
  **1.20** - "make the others slightly smaller" plus a touch for the dancer so
  the eye-line heights match (a person, a 2m arm, a 3m cell). Feet stay on
  one line. All numbers are verified in the browser at 1496 / 1920 / 2560 and
  adjusted there; the hero `min-h` recomputes from the new deepest card.
- **D4 3D effect coverage (2d).**
  1. **Reduced motion**: keep pointer-driven parallax (the user moves it, it
     stops when they stop), drop only the autonomous idle drift and the
     auto-firing echo. That is what the setting protects against, and it
     stops the hero being a still image on every Windows machine with
     animations off.
  2. **Any pointer**: attach `pointermove` regardless of `(pointer: fine)`;
     use `(hover: hover)` only to decide whether idle drift takes over.
  3. **Touch**: on coarse pointers, (a) follow the finger while it is down
     on the hero (pointer events with `touch-action: pan-y` so vertical
     scroll still wins), (b) use `deviceorientation` tilt where the browser
     exposes it without a permission prompt (Android Chrome); on iOS the
     permission needs a gesture, so we bind the first tap on the hero to
     `requestPermission()` and fall back to (a) if denied. Both feed the same
     eye target with a clamped amplitude.
  4. Same three fixes applied to `pointer-drift.client.tsx` (About visual).
  5. Document the coverage matrix in the handoff (desktop mouse, trackpad,
     touch laptop, Android, iOS, reduced motion).
- **D5 Echo → motion smear (3a, 3b).** Take the client's option A (the
  astronaut reference). The three stepped clones go. One **smear layer** per
  card sits behind the subject: the same pieces, stretched along the travel
  axis from the figure's leading edge (`scaleX`, origin at the trailing
  side), horizontally blurred through an inline SVG filter
  (`feGaussianBlur stdDeviation="N 0"`), and faded to nothing with a
  horizontal `mask-image` gradient. It carries the cutout's true colour (so
  the load-time "wow" still lands in colour) and it breathes: length and
  opacity follow the eye velocity (fast pointer = longer smear, still = a
  faint halo), which is what a motion trail is. Round-robin and hover keep
  their timings. Cost: 3 image layers per card instead of 5 (subject,
  shadow, smear), all sharing one URL; the smear layer is `loading="lazy"`
  and gets a small `sizes` since it is blurred anyway; the subject is
  `priority`. Knobs in `tuning.config.ts`: `heroTrail: { length, blur,
opacity, colour: "true" | "accent" | "ink" }`. Option B (logo-style accent
  flare, no trail) is kept reachable as `heroTrail.mode: "smear" | "flare"`
  so the client can flip it after seeing both. **ASK** if you would rather
  ship B by default.
- **D6 Backers (4a, 4b).** Restore `border-b border-line` on the band. Make
  every mark a **single SVG lockup**: rebuild `vela.svg` and
  `tek-ventures.svg` in `src/icons/source/` to include their wordmarks
  (traced from the current HTML type: Nippo uppercase converted to paths) and
  drop the two `<span>` text nodes, so a mark fading at the edge is always a
  logo being clipped, never a bare word. Shorten the edge fade to a hard clip
  with a 1.5rem soft edge; the flare copy stays (it is the site's hover
  grammar) but on `[data-reduced-motion]`/no-hover it is not rendered at all.
  With five marks and four copies, the same name showing twice on 1920+ is
  unavoidable unless the gaps widen; widen the gap to `gap-32` above `xl`
  so one copy fits the band at 1496 and repeats sit ≥ 1 mark apart. **ASK**
  the client what "raw URLs" referred to (browser? screenshot?).
- **D7 Camera-trajectory dial (5a).** `ArcScrubber` becomes
  `CameraPathDial`: a small plan-view diagram in the plate's corner. A
  subject marker at the centre, the recorded **camera path** as an arc around
  it (elliptical to suggest the plan is seen from a raised angle), the camera
  as the handle dot travelling that path **in sync with `currentTime`**, an
  accent sweep for the path already travelled, and a thin **view ray** from
  the camera to the subject. Caption "CAMERA PATH", counter **"VIEW n / N"**
  as in the reference (n from `currentTime`, N from the clip's real frame
  count, both from `media.config.ts`, which gains `fps` and `camera`). Per
  clip: `camera: { kind: "orbit", from: deg, to: deg }` for `wild` and
  `navigable` (angles read off the footage), `camera: { kind: "fixed", at:
deg }` for `queryable` and the viewer's `echo`, where the camera dot holds
  its bearing and playback is shown as the view ray's progress tick around
  the subject marker instead - the diagram never claims motion the footage
  does not have. Dragging the camera along the path scrubs the clip (the
  existing pointer code, kept); keyboard via the hidden range input, kept.
  The surface grows (radius 2rem → 2.75rem in cards, 3.5rem in the viewer)
  so the dot's motion is legible on an 18s clip. **Playback robustness**:
  tapping the plate toggles play/pause; if autoplay is refused the plate
  shows a quiet "▶ play" affordance on the dial surface instead of a frozen
  poster; the observer re-arms on every intersection instead of once;
  `navigable` duration corrected to 18.73; fps per clip (90 for `echo`).
- **D8 About alignment (6a).** Copy column fills its 7 columns to the right
  gutter (drop `max-w-174.5`); the readings' rules therefore run the full
  copy width. Bracket icons hang in a fixed 1.75rem column so label text
  aligns with the paragraph's left edge and values right-align to the gutter.
  Crop `placeholder.png` to a true square (862x862) so the circle sits on its
  box centre; the visual top-aligns with the copy's first cap line
  (`self-start` + a small optical offset) rather than floating on
  `self-center`, and its diameter is set so its bottom lands on the last
  rule at the design width. Verified with the measurement overlay at 1496 / 1920.
- **D9 Team + Science (7a-7c).** Delete the grayscale rule (colour at rest,
  colour on hover; drop the transition). Team row `max-w-300` → `max-w-244`
  (976px), which is 20% smaller portraits (373 → 299px) at the same
  `gap-panel`; captions follow. Science: the image plate becomes an `<a>` to
  the entry's href (`target="_blank" rel="noreferrer"`, `aria-hidden
tabIndex={-1}` like Team's portrait so the tab order still has one link per
  card), with the same hover treatment as the CTA. **CLIENT** (carry-over):
  real URLs for the three cards and a ≥ 1000px portrait of Srinath Sridhar
  (512px today).
- **D10 Mobile hero (8a).** Below `md` (768px) the three figures become a
  **scroll-snap carousel**: one figure per slide, centred on the room floor
  at ~70% of the viewport width, swipe to move, no autoplay of the slides.
  A pager under the floor reuses the timeline's tick glyphs (three ticks,
  the active one in accent) and the headline stays above the floor. The
  active slide gets the colour echo/smear on entry; touch drag inside the
  slide also drives the tilt (D4). 768-1279 keeps the current 3-up strip.
  The carousel is plain CSS (`overflow-x: auto; scroll-snap-type: x
mandatory`) plus one tiny client island for the pager state and the
  smear trigger - no library.
- **D11 Mobile type and rhythm (8b, 8c).** Introduce one mobile scale in
  `globals.css`, tokenised (the lint rules forbid arbitrary values): under
  `@media (max-width: 40rem)` the `type-*` utilities read `--type-*` variables
  that step down (display-md 48 → 36, display-sm 40 → 32, display-xs 32 → 28,
  body-xl 20 → 17, body-lg 18 → 16, title-lg 24 → 20, lede 32 → 24),
  `--spacing-section` 120 → 64px, `--spacing-section-gap` 80 → 48px,
  `--spacing-panel` 40 → 24px, `--backing-band-height` 92 → 72px, navbar
  rest 60 → 56px. The header logo scales `168x32 → 136x26` below `sm` and the
  CTA tightens to `px-4`, `gap-2`; the row gets `min-w-0` and `overflow-clip`
  so nothing can ever push past the gutter (360px: 320px available vs ≈ 289px
  needed). The logo's hover flare copy follows the same size.
- **D12 Mobile navigation (8d, ASK).** The site has no navigation at all
  below 1024px - only the CTA. For a fair audience arriving on phones I
  recommend a compact **"Menu" toggle** that opens a full-width sheet under
  the bar with the four anchors and the CTA, closing on selection. It is not
  literally asked for; it is the biggest hole a "full mobile pass" would
  otherwise leave. **ASK:** include it (recommended) or leave the phone bar
  as logo + CTA.
- **D13 Mobile pass scope (8d).** Every section verified at 360 / 390 / 430
  portrait and 768 / 1024 tablet, plus 390 landscape: hero (D10), backers
  band (label + marquee at 360), About (stack order image → copy, readings
  rows at 14px value type), Features (single column, dial legible at the
  335px plate, tap-to-play), Capture viewer, Team, Science (button width
  `w-59.75` → full width on mobile), Closing block and bar (video crop,
  stacked actions, bar wraps cleanly), Contact page and form. Includes
  `100svh` sanity for the hero and no horizontal overflow anywhere
  (`document.documentElement.scrollWidth === innerWidth` at every width).
- **D14 Favicon set (9b).** From `src/icons/source/chronospace-logo.svg`
  extract the hexagon-S mark and ship: `src/app/icon.svg` (transparent, with
  an embedded `@media (prefers-color-scheme: dark)` rule: dark-ink mark on
  light UI, white mark on dark UI - the only way one file reads on both tab
  themes), `favicon.ico` 16/32/48 and `icon.png` 64 on **transparent** with
  the mark in the brand accent `#f25324` outlined in ink, which reads on both
  themes where SVG icons are not supported; `apple-icon.png` 180 stays
  opaque (iOS paints transparency black) on `--paper` `#090b19` with the
  white mark, corners left square for iOS to round; `manifest.webmanifest`
  with 192 / 512 and a maskable 512 (mark at 60% in the safe zone) for
  Android home screens; `safari-pinned-tab.svg` (single colour) with
  `mask-icon color`. `theme-color` set to `--paper`. Checked in Chrome,
  Safari and Firefox light/dark, Safari pinned tab, iOS "Add to Home Screen"
  (simulator), Android Chrome.
- **D15 Metadata (9c).** `src/lib/env.ts`: `NEXT_PUBLIC_SITE_URL` falls back
  to `https://${VERCEL_PROJECT_PRODUCTION_URL}` then
  `https://${VERCEL_URL}` before localhost, so a Vercel build can never emit
  localhost again even with the var unset. Title: `ChronoSpace — AI to
digitize the physical world` (the client's wording, dash included);
  `title.template: "%s — ChronoSpace"` for `/contact`. `og:image` +
  `twitter:image`: a 1200x630 `src/app/opengraph-image.tsx` (Next
  `ImageResponse`) - the paper ground, the wordmark, the headline, and the
  three figures in colour as a static composition; also written to
  `public/og.png` for tools that ignore dynamic routes. `og:locale`,
  `alternates.canonical` per page, `theme-color`, and JSON-LD `Organization`
  with the LinkedIn `sameAs`. **ASK (owner):** set `NEXT_PUBLIC_SITE_URL` in
  the Vercel project to the final domain when it exists (I cannot reach the
  Vercel dashboard); the code fallback covers `chronospace-v2.vercel.app`
  meanwhile.
- **D16 Sitewide sweep (9a).** Unify what the audit turned up: one
  content-row width rule for every 3-panel row (Product and Science are
  full width, Team is 1200px - Team's D9 width becomes the shared
  `--container-panels` token and Product/Science adopt it), one lede measure
  (Science has none, Product 460px, Team 577px → all 577px), the hero
  headline and every `<h2>` on the same ramp, the About section either gets
  the shared heading pattern (a short `<h2>`, **ASK** for copy - proposal:
  "What was never recorded") or is explicitly the one heading-less block,
  matched asset sizes (Team 976 row vs Science plates vs Product plates
  all landing on the same three-column grid), and the Team→Closing gap
  checked against the other section gaps. Measured with the existing
  measurement overlay at 1496 / 1920 / 2560 and the mobile widths.
- **D17 Lighthouse (9d).** Install `lighthouse` as a dev dependency, run it
  against `next start` with the cached Playwright `chrome-headless-shell`
  (mobile and desktop presets, 3 runs each, median reported), fix what is
  cheap (image `sizes`, `priority` on the LCP image, preconnect, unused
  preloads, contrast flags, tap-target sizes from D11, a11y names), and
  commit the HTML + JSON reports under `docs/lighthouse/2026-09-XX/` with a
  one-page summary the owner can forward. Target: ≥ 90 on every category on
  desktop, ≥ 85 performance on mobile (the hero is heavy by design).
- **D18 Branching and delivery.** Tag `main` as
  `backup/pre-feedback-3-2026-09-15`; work on
  `claude/feedback-round-3-2026-09-15`; one commit per task in the repo's
  message style, ending `Feedback 3 item <slide-letter>`; nothing pushed to
  `main` without the owner's say. Independent tasks run as parallel
  subagents in isolated worktrees (node_modules symlinked, branch reset to
  the round-3 branch tip first); tasks that touch the same files run in
  sequence.
- **D19 NO-TOUCH.** The manufacturing animation rework is the owner's; the
  `intro.manufacturing` / `hero.manufacturing` slots in `media.config.ts`
  keep their shape. D3 changes the manufacturing card's `left`/`scale`
  only, never the slot. The top fade on the closing video and the sticky
  footer reveal are not proposed again (dropped in round 2). The closing
  section is untouched except for the mobile pass (D13) and the sweep.

---

## 4. Task list (execution order)

Each task ends with `npm run format:fix && npm run lint && npm run typecheck`
and `next build` outside the sandbox, then a browser check at 1496 / 1920 /
2560 / 390 (mobile tasks add 360 / 430 / 768 / 1024) with the measurement
approach from `docs/client-feedback-plan.md` §9 (measure with
`javascript_tool`; motion checks through the visible browser pane).

| #   | Task                                                                                                                                                                                                                                                            | Items      | Primary files                                                                                                                                                                                             | Depends on      | Parallel?  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------- |
| T0  | Branch + backup tag; confirm deck folder ignored; note baseline Lighthouse before any change (for the before/after)                                                                                                                                             | -          | git, `docs/lighthouse/`                                                                                                                                                                                   | -               | -          |
| T1  | Neutral `::selection`; margin between the nav list and the CTA (`mr-4` on the list at `lg`, verified 24-32px optical gap)                                                                                                                                       | 2e, 2f, 5b | `globals.css`, `site-header.tsx`                                                                                                                                                                          | T0              | yes        |
| T2  | Hero grey treatment: new resting filter + verified `heroFigureBrightness`, dancer aspect 0.750, per-piece `sizes`, `priority` on subject images, lazy on the rest                                                                                               | 2a         | `hero-cards.tsx`, `hero-cards.module.css`, `tuning.config.ts`                                                                                                                                             | T0              | with T1    |
| T3  | Hero composition: centre the manufacturing piece at 50%, vanishing point to 50%, re-space flanks, new scales 1.50 / 1.45 / 1.20, recompute hero `min-h`                                                                                                         | 2b, 2c     | `hero-cards.tsx`, `hero-room.module.css`, `hero.tsx`                                                                                                                                                      | T2              | no         |
| T4  | Eye coverage: reduced-motion keeps pointer parallax, any-pointer tracking, touch follow + device tilt (iOS permission on first tap), same for About's `PointerDrift`, coverage matrix in handoff                                                                | 2d         | `hero-room-eye.client.tsx`, `hero-room.module.css`, `hero-cards.module.css`, `pointer-drift.client.tsx`, `docs/handoff.md`                                                                                | T3              | with T6-T9 |
| T5  | Motion smear replaces the clone stack; velocity-coupled length; `heroTrail` knobs incl. `mode: smear \| flare`; inline SVG filter; layer count 5 → 3                                                                                                            | 3a, 3b     | `hero-cards.tsx`, `hero-cards.module.css`, `hero-room-eye.client.tsx`, `tuning.config.ts`, `layout.tsx`, `docs/asset-swap-guide.md`                                                                       | T4              | no         |
| T6  | Backers: bottom hairline; Vela + TekVentures as single SVG lockups (icons pipeline); tighter edge clip; wider gaps above `xl`; flare not rendered where it cannot show                                                                                          | 4a, 4b     | `backers.tsx`, `backers.module.css`, `src/icons/source/vela.svg`, `tek-ventures.svg`, `npm run icons:generate`                                                                                            | T0              | yes        |
| T7  | `CameraPathDial`: plan-view path, camera dot synced to `currentTime`, view ray, VIEW n/N, per-clip `camera` + `fps` in `media.config.ts`, orbit vs fixed modes, larger surface, tap-to-play + refused-autoplay affordance, observer re-arm, durations corrected | 5a         | `arc-scrubber.client.tsx` → `camera-path-dial.client.tsx` (+css), `timeline-player.client.tsx`, `timeline-player.module.css`, `media.config.ts`, `product.tsx`, `capture.tsx`, `docs/asset-swap-guide.md` | T0              | yes        |
| T8  | About alignment: full-width copy column, hanging brackets, square placeholder, top-aligned visual sized to the last rule                                                                                                                                        | 6a         | `problem.tsx`, `problem.module.css`, `public/media/intro/placeholder.png`                                                                                                                                 | T0              | yes        |
| T9  | Team colour + 976px row; Science image plate is a link                                                                                                                                                                                                          | 7a-7c      | `team.module.css`, `team.tsx`, `science.tsx`                                                                                                                                                              | T0              | yes        |
| T10 | Mobile hero carousel below `md`: scroll-snap slides, tick pager, active-slide smear, touch tilt hook into T4                                                                                                                                                    | 8a         | `hero-cards.tsx`, `hero-cards.module.css`, new `hero-pager.client.tsx`, `hero.tsx`                                                                                                                        | T3, T4, T5      | no         |
| T11 | Mobile type scale + rhythm tokens; header logo 136x26 + tight CTA + `overflow-clip` below `sm`; (D12) Menu sheet if approved                                                                                                                                    | 8b, 8c     | `globals.css`, `site-header.tsx`, `site-header.module.css`, `cta-link.tsx`, new `site-menu.client.tsx` (D12)                                                                                              | T1              | with T6-T9 |
| T12 | Full mobile pass per D13, every section + contact, no horizontal overflow, landscape                                                                                                                                                                            | 8d         | every section `.tsx` / `.module.css` as needed                                                                                                                                                            | T10, T11        | no         |
| T13 | Favicon set + manifest + theme-color + pinned-tab mask                                                                                                                                                                                                          | 9b         | `src/app/icon.svg`, `favicon.ico`, `icon.png`, `apple-icon.png`, `manifest.webmanifest`, `public/safari-pinned-tab.svg`, `layout.tsx`, `metadata.ts`                                                      | T0              | yes        |
| T14 | Metadata: URL fallback chain, title + template, OG image route + static copy, twitter image, canonical per page, JSON-LD; sitemap/robots inherit                                                                                                                | 9c         | `src/lib/env.ts`, `src/lib/metadata.ts`, `src/app/opengraph-image.tsx`, `layout.tsx`, `contact/page.tsx`, `.env.example`, `docs/handoff.md`                                                               | T13             | with T13   |
| T15 | Sitewide sweep per D16: shared panel-row width, lede measure, heading ramp, About heading (if approved), Team→Closing gap, matched asset sizes                                                                                                                  | 9a         | `globals.css`, `product.tsx`, `team.tsx`, `science.tsx`, `problem.tsx`, `capture.tsx`                                                                                                                     | T3, T8, T9, T12 | no         |
| T16 | Lighthouse mobile + desktop (3 runs, median), cheap fixes, reports + summary under `docs/lighthouse/`; update `docs/handoff.md`, `docs/asset-swap-guide.md` (new knobs, dial config, favicon/OG swap), memory                                                   | 9d         | `package.json`, `docs/lighthouse/`, `docs/*.md`                                                                                                                                                           | all             | no         |

Rough sizing: T1, T9, T13 are small (under an hour). T2, T3, T6, T8, T11,
T14 are medium (1-3 hours). T4, T5, T7, T10, T12 are the substantial ones
(half a day each). T15-T16 half a day together.

Subagent plan: after T0, wave 1 runs T1+T2 (one agent, hero/header), T6,
T7, T8, T9, T13+T14 in parallel worktrees (six agents, disjoint files).
Wave 2 runs T3 → T4 → T5 in sequence (hero, one agent) alongside T11 (one
agent). Wave 3: T10, then T12. Wave 4: T15, T16, on the merged branch. I
review every agent's diff before it merges to the round-3 branch.

Suggested PR grouping (all against the round-3 branch, merged to `main` on
the owner's word): PR-A quick wins (T1, T6, T8, T9, T13, T14), PR-B hero
(T2-T5), PR-C camera dial (T7), PR-D mobile (T10-T12), PR-E sweep +
Lighthouse + docs (T15-T16).

---

## 5. Verification checklist (what "done" means per slide)

- **Slide 2**: at 1496 / 1920 / 2560 the manufacturing piece's visible
  bounding-box centre is 50.0% ± 0.2% of the frame; the three figures' eye
  lines sit within 5% of each other; grey figures show visible internal
  detail (no clipped whites; histogram check on a screenshot); the parallax
  moves with a mouse, a trackpad, a touch-laptop finger, an Android tilt
  and an iOS drag, and under reduced-motion with the pointer only; the text
  can be selected without any orange appearing; TEAM → CONNECT gap is ≥ 24px
  visible ground.
- **Slide 3**: at most 3 `<img>` per hero piece in the DOM; the subject
  `<img>` has `fetchpriority="high"`; the chosen srcset variant is ≤ 1.25x
  the drawn CSS width × DPR; the trail is a single smooth fade with no
  visible steps at rest, on hover, on round-robin and at load.
- **Slide 4**: a 1px `--line` rule under the band; no bare word without its
  mark anywhere along the marquee at 1496 / 1920 / 2560 at any moment of the
  loop (checked by pausing the animation at 10 offsets).
- **Slide 5**: the camera dot's bearing equals `from + progress × (to -
from)` for orbit clips within 1° at any paused frame; fixed clips show a
  stationary camera and a moving progress tick; VIEW n/N matches
  `floor(currentTime × fps)` / real frame count; tapping the plate toggles
  playback; with autoplay blocked the play affordance is visible.
- **Slide 6**: copy block, readings rules and the CTA column share one right
  edge at the gutter; label text and paragraph share one left edge; the
  circle's bounding box is centred on its grid cell and its bottom lands on
  the last rule at 1496.
- **Slide 7**: no `filter` on team portraits; portrait width 299px ± 2 at
  1496; clicking a Science image opens the entry's href in a new tab; one
  focusable link per card.
- **Slide 8**: at 360 / 390 / 430 the hero shows one figure ≥ 60% of the
  viewport width, swipe snaps between three; `scrollWidth === innerWidth`
  at every width on every page; logo and CTA have ≥ 16px between them at
  360; body lede ≤ 17px and logo wordmark cap ≥ 1.3x the lede's x-height;
  every tap target ≥ 44px.
- **Slide 9**: `curl` of production shows `canonical`/`og:url` on the site
  domain, `og:image` 1200x630 reachable, the new `<title>`; favicon visible
  on light and dark tab bars in Chrome/Safari/Firefox; Lighthouse reports
  committed.

---

## 6. Open items and questions for the owner (answer before or during the build)

1. **D5** - ship the motion smear (A) by default with the flare (B) behind a
   knob, as proposed? Or B by default?
2. **D12** - add the mobile Menu sheet (recommended), or keep the phone bar
   as logo + CTA only?
3. **D16** - give the About block a short `<h2>` like every other section
   (proposed copy: "What was never recorded"), or keep it heading-less on
   purpose?
4. **D15** - set `NEXT_PUBLIC_SITE_URL` in Vercel when the final domain is
   known; until then the code falls back to the Vercel production URL. Is
   `chronospace-v2.vercel.app` the launch domain, or is a custom domain
   coming? (Affects canonical and the OG image URL.)
5. **D7** - VIEW n/N counted in frames (a view per synthesised frame, as in
   the reference's 60 views), or would you prefer time-based "VIEW 12 / 60"
   with N fixed per clip?
6. **D3** - the room's vanishing point moves to 50% with the figure. Fine, or
   keep the walls where they are and move only the figure?
7. **Lighthouse** - commit reports into the repo (`docs/lighthouse/`) or
   deliver them outside the repo?

## 7. Waiting on the client (new this round, plus carry-over)

- **Hero masters at ≥ 2x drawn size** on transparent, same camera: arm
  ≥ 1300px tall, manufacturing cell ≥ 1900px wide, dancer ≥ 1200px tall,
  worker ≥ 900px tall. Without them "extremely high quality" tops out at the
  current 613-1232px sources.
- What "raw URLs" in the marquee referred to (browser status bar, or the
  clipped word).
- Confirmation of the trajectory reading per clip: `wild` and `navigable`
  orbit; `queryable` and the viewer clip are fixed cameras and will show a
  stationary camera.
- Carry-over: in-the-wild footage for "No stage required"; clean exports
  of the product takes without burned-in graphics; real URLs for the three
  Research cards, Calendly, LinkedIn, Terms, Privacy; a ≥ 1000px portrait of
  Srinath Sridhar; the final domain.
