# Lighthouse, feedback round 3

Production build of `claude/feedback-round-3-2026-09-15`, served with
`next start` on localhost, Lighthouse 13 with the default mobile emulation
(Moto G Power class, simulated slow 4G) and the desktop preset. Mobile is
the median of six runs (scores were within one point), desktop of three.

| Build                           | Perf | A11y | Best practices | SEO |
| ------------------------------- | ---- | ---- | -------------- | --- |
| Baseline, staging 15 Sep (mob)  | 78   | 96   | 100            | 100 |
| Baseline, staging 15 Sep (desk) | 100  | 96   | 100            | 100 |
| Round 3 (mobile)                | 82   | 97   | 100            | 100 |
| Round 3 (desktop)               | 100  | 97   | 100            | 100 |

Mobile: FCP 1.2 s, Speed Index 1.3 s, TBT 10 ms, CLS 0, LCP 4.9 s. The
LCP element is the first hero figure (robot arm), which is preloaded with
`fetchpriority=high`; the time is the simulated network delivering the hero
imagery, which the client's own higher-resolution renders will make heavier,
not lighter. The three remaining accessibility flags are deliberate
contrasts: the white label on the accent CTA (3.47:1), the decorative
timecode caption under the hero (hidden from assistive tech) and the About
paragraph's words as they fade in (the full text is present for screen
readers).

The baseline reports are in `../baseline-2026-09-15/`.
