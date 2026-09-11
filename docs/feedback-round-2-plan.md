# Client feedback round 2 - implementation plan (11 Sep 2026)

Working plan for the second feedback round. Source: the client deck
`public/feedback-11:09/Chronospace_landing_page_feedback_10th_sep_2026.pptx`,
**slides 1-10 only** (slides 11-20 are the previous round and are ignored),
plus the media the client dropped in the same folder. Baseline: `main` at
`4e02ca6`, live on https://chronospace-v2.vercel.app (Vercel deploys `main`).

Status legend: **DO** = in scope now · **DEFER** = animation/asset work the
owner does later (explicitly out of scope for this round) · **ASK** = needs a
decision before or during the build.

---

## 0. What the client sent, and what each file is for

| File in `public/feedback-11:09/`           | What it is                                                                                | Used by task |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- | ------------ |
| `Chronospace_landing_page_feedback_10th_sep_2026.pptx` | The deck. Slides 1-10 are this round.                                            | all          |
| `nvidia-inception-black-transparent.png`   | NVIDIA Inception Program lockup, black on transparent, 782x300                            | T2           |
| `nvidia-inception-color-transparent.png`   | Same lockup, green eye + black type, transparent                                          | T2           |
| `nvidia-inception-cropped.png`             | Same lockup, cropped, opaque white ground                                                 | T2 (spare)   |
| `girls-dancing.mp4`                        | 1280x720, 3.2 s, H.264, 0.5 MB. Replaces the third product clip ("The scene stays queryable") | T6        |
| `footer-woodworking.mp4`                   | 1920x1080, 21.9 s, H.264+AAC, **385 MB at 140 Mbps** - must be re-encoded before it ships | T9           |
| `scrubber-reference.mov`                   | 2762x778, 8.3 s screen recording of the arc scrubber the client wants (a "free viewpoint" dial) | T5      |
| `scrubber-image.png`                       | Still of that dial: arc, handle dot, orange progress sweep, centre dot, "FREE VIEWPOINT", "VIEW 15 / 60" | T5 |
| `Screenshot 2026-09-11 002717.png`         | Footer style reference: full-bleed video, big headline left, two buttons, slim bottom bar | T9           |
| `Screenshot 2026-09-11 003928.png`         | 2D factory-scene reference for the manufacturing animation                                | DEFER        |

Also at repo root, untracked: `safari-issue.png` - a screenshot of an *older*
navbar design (Problem / How it works / Applications / Research). Not part of
this deck; **ASK** what it is for before doing anything with it.

**Do not commit `public/feedback-11:09/`.** It sits under `public/`, so a
commit would ship 430 MB of masters to Vercel. Add it to `.gitignore` in T0
(same pattern as `public/new-videos/`).

---

## 1. The feedback, slide by slide

### Slide 1 - cover
Anchored on staging. Nothing to do.

### Slide 2 - Hero
| # | Request (client wording paraphrased)                                                                                           | Status |
| - | ------------------------------------------------------------------------------------------------------------------------------ | ------ |
| 2a | "Firstly, the PROGRESS IS GREAT!"                                                                                             | -      |
| 2b | Remove **all** cameras from the hero scene                                                                                    | DO T3  |
| 2c | Remove the **centre** "Connect with us" button; keep only the navbar one                                                      | DO T3  |
| 2d | With the button gone, put the three capture figures **on one horizontal line** and **scale them up a bit**                    | DO T3  |
| 2e | "Land a WOW": the echo/trail effect on the three figures should fire **in colour once on page load** (today it plays in white) | DO T3  |
| 2f | Figures should rest as an **even brighter white** ("pristine look"), or expose brightness as a setting                        | DO T3 + T11 |
| 2g | Bug: headline reads "builds AIto digitize" in the text fallback (no space between the two spans)                              | DO T1  |
| 2h | Swap the NVIDIA mark for the final NVIDIA Inception lockup (files supplied)                                                   | DO T2  |

### Slide 3 - Manufacturing animation
Replace the conveyor scene with two workers interacting with a machine, in
brand style, per the 2D reference. **DEFER** - owner builds the asset later
and swaps it in. Nothing in this round should make that swap harder (see T10).

### Slide 4 - Intro spread ("Frontier models have consumed...") visual
The conveyor take is fine, but can the visual show "the 4D movement we bring
vs the 2D in the market" (split-circle reference: photo half / voxel half)?
"Don't spend too much time." **DEFER** - this is asset/animation work on the
same clip as slide 3. Noted in "Open items" so it is not lost.

### Slides 5-6 - Product videos ("One capture, three things") and the viewer ("Everything is measurable")
| # | Request                                                                                                          | Status |
| - | ---------------------------------------------------------------------------------------------------------------- | ------ |
| 5a | **Restore colour** on the videos for now (they render desaturated)                                              | DO T4  |
| 5b | Replace the **linear scrub timeline with a circular / arc timeline** - an interactive scrub you can drag to pan the video. Same arc treatment on all three product videos and (slide 6) on the viewer | DO T5 |
| 5c | Keep current clips as placeholders; **crop/cut them well - no white bands** at the sides; do not edit content     | DO T6  |
| 5d | **Replace the third video** (callout sits over "The scene stays queryable") with `girls-dancing.mp4`             | DO T6  |
| 5e | **Increase spacing** between the three product videos - the section reads dense                                  | DO T7  |

### Slide 7 - Team
| # | Request                                                                                                                       | Status |
| - | ----------------------------------------------------------------------------------------------------------------------------- | ------ |
| 7a | Navbar "Connect with us" turns **white with black text once scrolled away from the hero**; orange is distracting down the page | DO T8 |
| 7b | Increase spacing between the three portraits, portraits **a bit smaller**; keep that spacing **consistent across every 3-panel section** | DO T7 |
| 7c | A **clean LinkedIn logo** (reference: the "in" glyph + "LinkedIn" in accent)                                                  | DO T7  |
| 7d | Heading is just **"Team"**, not "Meet the team"                                                                               | DO T7  |

### Slide 8 - Closing block + footer
| # | Request                                                                                                               | Status |
| - | --------------------------------------------------------------------------------------------------------------------- | ------ |
| 8a | Footer background video = the **woodworking clip**; **remove the dancer and robot-arm** trail assets                  | DO T9  |
| 8b | Style it like the reference screenshot: full-bleed video, headline left, one-line sub-copy, "Connect with us" + "Follow on LinkedIn" buttons, slim bottom bar with logo · copyright · LinkedIn · Terms · Privacy | DO T9 |

The annotated screenshot covers both the Vision section and the Footer, so
the two merge into one closing block (see decision D5).

### Slide 9 - Research & Insights
| # | Request                                                                                                                                  | Status |
| - | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 9a | Add a **media placeholder per card** (extract from the source if possible, else any representative image); placeholders must be **easy to replace** | DO T10 |
| 9b | **Drop the wireframe-style card** (bordered box with header strip); use the **minimalist card style** of the other sections, same gap as the other 3-panel sections | DO T7 + T10 |

### Slide 10 - General housekeeping
| # | Request                                                                                                                                             | Status |
| - | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 10a | This build is the long-term template; **every video and image slot must be swappable without touching layout or code structure**                  | DO T11 |
| 10b | The **circular scrubber must work independently of whichever clip sits in it**                                                                     | DO T5  |
| 10c | The hero **wiggle is great - expose a single config knob** for how much it wiggles                                                                 | DO T11 |
| 10d | A **short note in the handoff on how to swap assets and settings** (file locations, formats, dimensions)                                           | DO T12 |
| 10e | Minor alignment and spacing issues across the page - not itemised, trusted to the final pass                                                       | DO T13 |

---

## 2. Where each item lands in the code (current state)

- **Hero** `src/app/sections/hero/`
  - `hero.tsx:33` - headline as two `<span>`s in a flex column with no separator → 2g.
  - `hero.tsx` - `<CtaLink>` under the h1 → 2c. The copy block centres on the back wall at `--copy-centre: 26.04cqw`; with the CTA gone the h1 alone should re-centre (check).
  - `hero-room.tsx:32` renders `<HeroRoomCameras />` (`hero-room-cameras.tsx`, 16 billboards; CSS at `hero-room.module.css:245+`) → 2b.
  - `hero-cards.tsx` - three cards with per-card `feet` 95.77% / 109.17% / 95.93% and `scale` 1.153 / 1.386 / 1.153, `left` 17.38% / 39.71% / 68.85% → 2d.
  - `hero-cards.module.css:145` - `.piece img { filter: grayscale(1) brightness(1.75) }`, hover → `filter: none`; load-time trail = `echo-intro` keyframes on `.echo`, `--echo-hold: 2.4s` → 2e, 2f.
  - `hero-room-eye.client.tsx:51-68` - `TAU`, `TAU_DRIFT`, `DRIFT_PERIOD_X/Y`, `ECHO_*`; travel amplitude lives in CSS `hero-room.module.css:101-102` (`8cqw`, `5.1cqh`) → 10c.
  - `hero.tsx` `min-h-[...52.84cqw+2.5rem]` - the floor is derived from the deepest card's feet (109.17%); changes with 2d.
- **Backers** `src/app/sections/backers/backers.tsx:39-80` - NVIDIA = generated `NvidiaIcon` (85x16) + the word "Inception" in `type-nav`; marks rest at `opacity-60`, ink on hover → 2h.
- **Shared player** `src/components/timeline-player.client.tsx` + `.module.css` - the only scrubber (native `<input type="range">` over a tick track; `--player-progress` from one rAF loop). `.video { filter: grayscale(1); mix-blend-mode: luminosity }` at `.module.css:40-46` → 5a, 5b. Used by Problem, Product x3, Capture (5 slots).
- **Product** `src/app/sections/product/product.tsx` - cards array with `video`, `poster` (imported JPG), `duration`, optional `overlay`; third card carries `MeasureOverlay` with marks timed to `measurable.mp4` (18 s) and two `bg-paper` chips hiding burned-in graphics → 5c, 5d. Grid `grid-cols-3 gap-5.5` → 5e.
- **Team** `src/app/sections/team/team.tsx:75` "Meet the team"; portraits `aspect-square`, `gap-5.5`; text "LinkedIn" + rotated arrow → 7b-7d. `src/icons/source/linkedin.svg` already exists (generated icon available) → 7c.
- **Navbar** `src/components/site-header.tsx:68-74` `<CtaLink size="nav">`; `site-header-scroll.client.tsx` sets `data-scrolled` on `<html>` (hysteresis 24/8 px) → 7a: pure CSS on `[data-scrolled]`.
- **Vision** `src/app/sections/vision/` (dancer + arm PNGs, headline, CTA) and **Footer** `src/app/sections/footer/footer.tsx` (wordmark, fig. brackets, link groups, small print; Terms/Privacy filtered out because hrefs are `#`) → 8a, 8b.
- **Science** `src/app/sections/science/science.tsx` - bordered article + `bg-paper` header strip, no media → 9a, 9b.
- **Config** `src/site.config.ts` - nav, links (contact, linkedin, terms `#`, privacy `#`) → T9, T11.
- **Media on disk** - videos in `public/videos/*.mp4` (string paths), posters imported from `src/app/sections/**` (static imports), hero/vision/team rasters imported → 10a.

---

## 3. Decisions proposed (confirm or overrule before the build starts)

- **D1 Hero figures on one line.** All three cards take the same `feet` value and the same scale. Proposal: feet at the manufacturing line's current 109.17% (the floor line the viewer reads), scale 1.30 for all three (up from 1.153 on the flanks, slightly down from 1.386 on the centre so the row fits between the walls), lefts re-spaced to ~14% / 39.7% / 66% so the gaps read even. Numbers are verified in the browser at 1496 / 1920 / 2560 and adjusted there.
- **D2 Load-time echo in colour.** The intro trail runs with `filter: none` (colour) and desaturates as it collapses into the resting figure; hover keeps handing colour back. Resting brightness goes up from `brightness(1.75)` to ~`2.0` and becomes a CSS variable (`--figure-brightness`) surfaced in the tuning config (T11).
- **D3 Video colour.** `grayscale(1)` and the luminosity blend on `.video` are switched off behind one flag (`videoTone: "colour" | "mono"` in the tuning config) rather than deleted, so the client can go back to mono later.
- **D4 Arc scrubber.** New component `arc-scrubber.client.tsx` inside the existing `TimelinePlayer`, replacing the tick track in both builds. It draws a ~150° arc with a handle dot, an accent sweep from arc start to handle, a centre dot, a small caption ("Timecode") and a counter (`00:00:03:12` timecode, or `frame n / N` - **ASK** which). Overlaid bottom-right inside the plate on a translucent rounded surface, as in the reference; the play/pause glyph sits in the same surface. Drag anywhere on the arc, keyboard via the (kept, visually hidden) native range input. It only ever reads `currentTime / duration`, so any clip works (10b). One config: arc sweep angle and radius.
- **D5 Closing block.** Vision + Footer merge into one `Closing` section: full-bleed muted looping woodworking video with a dark scrim, headline "A world where every physical process can be replayed, measured and learned from" left-aligned, sub-copy "Tell us what you need to capture. We will tell you whether we can record it today." (from the reference - **ASK** if this line is approved copy or placeholder), two actions: "Connect with us" (white block, black text - same white variant as the scrolled navbar CTA) and "Follow on LinkedIn" (outline). Bottom bar: logo mark + wordmark, "© 2026 ChronoSpace AI", LinkedIn, Terms, Privacy (Terms/Privacy shown as placeholders since URLs are still `#` - **ASK**). Buttons stay the site's square CTA blocks, not pills; the bottom bar stays on the dark paper ground (the reference's light bar breaks the page's one-ground rule) - **ASK** if the client meant the light bar literally. Dancer and arm PNGs and the fig. brackets are deleted.
- **D6 Third product clip.** `girls-dancing.mp4` becomes `/videos/queryable.mp4`; the `MeasureOverlay` marks timed to the old 18 s clip are dropped from this card (they would fire on wrong frames on a 3.2 s loop), the two cover chips go, and the card keeps only the static HUD readings. If the overlay is wanted on the new clip it needs re-timing against the new frames (a small follow-up once the client confirms the clip is final).
- **D7 Panel gap.** One token `--spacing-panel-gap` for every 3-column row (Product, Team, Science, and the strip fallback in the hero). Proposal: 40px (= the gutter), up from 22px; Team portraits shrink from square to 4:5 to give the gap room. Verified against the client's "dense" complaint at 1496.
- **D8 Science placeholders.** Each card gets a 577/310 plate above the text (same plate as Product) fed from `public/images/science/*.jpg`. Stand-ins: frames pulled from the site's own captures (`navigable`, `echo`, `wild`) so they look on-brand; marked `TODO(client)` and listed in the swap guide. Card chrome becomes the Product grammar: plate, hairline rule, label, title, blurb, action - no border box.
- **D9 NVIDIA lockup.** The band's marks are monochrome ink at `opacity-60`. Ship `nvidia-inception-black-transparent.png` through `next/image` with `filter: invert(1)` so it sits with the other marks, sized to the band's mark height. Ask the client for an SVG or white version to remove the filter later.
- **D10 Swappable media.** One module `src/media.config.ts` lists every slot (`hero.figures[]`, `intro.video`, `product[0..2].video`, `viewer.video`, `closing.video`, `science[0..2].image`, `team[0..2].portrait`, `backers[]`) with `src`, `poster`, `duration`, `aspect`, `alt`. Files move to `public/media/<section>/...` with fixed names; posters become `public/` paths (no static imports), so a swap is "overwrite the file" or "edit one line". Hero/vision/team rasters currently imported via `next/image` static imports move to `public/` string paths + explicit `width/height` from the config.
- **D11 Tuning knobs.** `src/tuning.config.ts` with commented values: `heroWiggle` (0-2 multiplier on eye travel), `heroFigureBrightness`, `videoTone`, `arcScrubber.sweepDeg`. Consumed via CSS custom properties written on `<html>`/the section root so nothing else changes.
- **D12 Branching.** Tag current `main` as `backup/pre-feedback-2-2026-09-11`; work on `claude/feedback-round-2-2026-09-11`; one commit per task, message in repo style ending `Feedback 2 item <slide-letter>`; no push to `main` without the owner's say.

---

## 4. Task list (execution order)

Each task ends with `npm run format:fix && npm run lint && npm run typecheck && npm run build` and a browser check at 1496 / 1920 / 390 using the measurement approach from `docs/client-feedback-plan.md` §9 (screenshots may fail in the hidden pane; measure with `javascript_tool`).

| #   | Task                                                                  | Items          | Primary files                                                                                  | Depends on |
| --- | --------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------- | ---------- |
| T0  | Branch + backup tag; gitignore `public/feedback-11:09/`; install/confirm ffmpeg | -      | `.gitignore`                                                                                   | -          |
| T1  | Headline text fallback space                                          | 2g             | `hero.tsx`                                                                                     | -          |
| T2  | NVIDIA Inception lockup                                               | 2h             | `backers.tsx`, `public/media/backers/nvidia-inception.png`                                     | T0         |
| T3  | Hero: remove cameras + centre CTA, one-line figures scaled up, colour echo on load, brighter rest, re-centre copy, recompute hero min-height | 2b-2f | `hero.tsx`, `hero-room.tsx`, `hero-room-cameras.tsx` (delete), `hero-room.module.css`, `hero-cards.tsx`, `hero-cards.module.css`, `hero-room-eye.client.tsx` | T1 |
| T4  | Video colour flag                                                     | 5a             | `timeline-player.module.css`, `tuning.config.ts` (stub), `globals.css`                        | -          |
| T5  | Arc scrubber component in `TimelinePlayer` (both builds), a11y range kept, reduced-motion safe | 5b, 10b | `src/components/arc-scrubber.client.tsx` (+css), `timeline-player.client.tsx`, `.module.css`, `src/icons/source/` if new glyphs | T4 |
| T6  | Product clips: swap third clip, drop timed overlay + chips, poster regen, confirm no side bands (object-fit already `cover`; check each poster/clip aspect) | 5c, 5d | `product.tsx`, `measurable-marks.ts`, `public/media/product/` | T0 |
| T7  | 3-panel rhythm: `--spacing-panel-gap` token; Team heading "Team", smaller 4:5 portraits, LinkedIn glyph link; Science card chrome to minimalist grammar | 5e, 7b-7d, 9b | `globals.css`, `product.tsx`, `team.tsx`, `team.module.css`, `science.tsx`, `hero-cards.module.css` (strip) | - |
| T8  | Navbar CTA white/black after scroll                                   | 7a             | `site-header.tsx`, `site-header.module.css`, `cta-link.tsx` (new `inverse` variant, reused by T9) | -       |
| T9  | Closing block: re-encode woodworking (1080p + 720p H.264, ~6-10 MB, muted, poster), merge Vision + Footer into `sections/closing`, delete dancer/arm/brackets, bottom bar | 8a, 8b | `src/app/sections/closing/*`, `page.tsx`, `site.config.ts`, `public/media/closing/` | T0 (ffmpeg), T8 |
| T10 | Science media placeholders (plates from `public/media/science/`)      | 9a             | `science.tsx`, `public/media/science/`                                                         | T7         |
| T11 | `media.config.ts` + `tuning.config.ts`; move all slot files to `public/media/**`; wire hero wiggle, figure brightness, video tone, arc config | 10a, 10c, 2f | `src/media.config.ts`, `src/tuning.config.ts`, every section that owns media, `globals.css` | T3, T4, T5, T6, T9, T10 |
| T12 | Handoff: `docs/asset-swap-guide.md` (slots, paths, formats, dimensions, durations, knobs), update `docs/handoff.md`, "waiting on the client" list | 10d | `docs/`                                                                               | T11        |
| T13 | Final alignment/spacing sweep at 1496 / 1920 / 2560 / 390; nav anchors (Capture `#viewer` and Vision are not in the nav - decide whether to leave) | 10e | various                                                                             | all        |

Rough sizing: T0-T2, T4, T8 are small (under an hour each). T3, T5, T9, T11
are the substantial ones (half a day each). T7, T10 medium. T12-T13 a couple
of hours.

Suggested PR grouping: PR-A (T0-T2, T4, T8 - quick wins), PR-B (T3 hero),
PR-C (T5-T6 player + clips), PR-D (T7 + T10 rhythm and cards), PR-E (T9
closing block), PR-F (T11-T13 config, docs, sweep).

---

## 5. Media pipeline notes

- **ffmpeg is not installed** on this machine (`/opt/homebrew/bin/ffmpeg` referenced by the old plan is gone; `brew list ffmpeg` is empty). T9 (385 MB → web encode + poster), T6 (poster for the new clip) and T10 (frame grabs for placeholders) need it. Options: `brew install ffmpeg` (needs the owner's OK - system change), or the owner supplies encoded files. Everything else can proceed without it.
- Target encodes: H.264 `-crf 23 -preset slow -movflags +faststart`, muted (`-an`), 1920x1080 and 1280x720 renditions for the closing video; 960 px wide for product clips (matches the existing ones); posters as JPEG first frames at the clip's width.
- `girls-dancing.mp4` is 1280x720 and 16:9; the product plate is 577/310 (≈1.86:1) with `object-fit: cover`, so it will be cropped top/bottom slightly - acceptable per "keep as placeholder".
- All final files land in `public/media/<section>/` with stable names; nothing from `public/feedback-11:09/` is referenced directly.

---

## 6. Open items and questions for the owner / client

1. **ffmpeg** - may I install it with Homebrew, or will you supply encoded files? (Blocks T9 fully, T6/T10 partly.)
2. **Closing-block copy** - is "Tell us what you need to capture. We will tell you whether we can record it today." approved copy or a placeholder from the reference?
3. **Bottom bar tone** - keep the dark ground (recommended) or copy the reference's light bar literally?
4. **Terms / Privacy** - still `#`. Show them as inert placeholders in the new bottom bar, or keep hiding them until URLs arrive?
5. **Arc scrubber counter** - timecode (`00:00:03:12`) or frame counter (`frame 15 / 60`, like the reference)?
6. **Third product clip overlay** - the measurement overlay is dropped with the clip swap (D6); confirm, or ask for re-timing on the new clip.
7. **Panel gap value** - 40 px proposed; happy to tune live.
8. **`safari-issue.png`** at the repo root - what is it, is there a Safari bug to look at?
9. **NVIDIA** - request an SVG / white lockup from the client so the PNG + invert filter can go.
10. **DEFER (yours):** slide 3 manufacturing scene rebuild; slide 4 "4D vs 2D" treatment of the intro conveyor take. T11's media config keeps both as single-file swaps (`intro.video`, `hero.figures[1]`).

---

## 7. Carry-over "waiting on the client" (from round 1, still open)

In-the-wild footage for "No stage required"; clean exports of the product
takes without burned-in graphics; real URLs for the three Research cards,
Calendly, LinkedIn, Terms, Privacy; a ≥1000 px portrait of Srinath Sridhar.
