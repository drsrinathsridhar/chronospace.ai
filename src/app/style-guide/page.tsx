import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import arrowRight from "@/app/(home)/assets/arrow-right.svg";
import { cn } from "@/lib/utils";

const TITLE = "Style guide";
const DESCRIPTION =
  "The ChronoSpace design system, rendered live from the project's own tokens: colour, type, buttons, form controls, cards, spacing and motion.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Internal reference, not a marketing surface.
  robots: { index: false, follow: false },
};

/* ── Data ───────────────────────────────────────────────────────────────────────
   Every entry names a token that exists in `globals.css` / `DESIGN.md`. The class
   strings are literal so Tailwind can see them; the hex/px strings are captions —
   the only place a raw value is allowed to appear (docs/styling.md). */

type Swatch = {
  name: string;
  value: string;
  fill: string;
  use: string;
};

const PUBLISHED_COLOURS: Swatch[] = [
  {
    name: "c-black",
    value: "#090B19",
    fill: "bg-c-black",
    use: "Page canvas, viewport fill",
  },
  {
    name: "c-white",
    value: "#FFFFFF",
    fill: "bg-c-white",
    use: "Body and heading text",
  },
  { name: "grey", value: "#EDEDED", fill: "bg-grey", use: "Light surface" },
  {
    name: "c-orange-500",
    value: "#F25324",
    fill: "bg-c-orange-500",
    use: "The signal colour — CTA, rotating word, reticles",
  },
  {
    name: "c-orange-600",
    value: "#D13E13",
    fill: "bg-c-orange-600",
    use: "CTA hover wipe",
  },
  {
    name: "pink-500",
    value: "#E61876",
    fill: "bg-pink-500",
    use: "Accent, thermal range",
  },
  {
    name: "c-blue-900",
    value: "#30323E",
    fill: "bg-c-blue-900",
    use: "Hairline structure — borders, dividers, eyebrow fill",
  },
  {
    name: "c-blue-500",
    value: "#1C29A2",
    fill: "bg-c-blue-500",
    use: "Accent",
  },
  {
    name: "c-blue-300",
    value: "#777CAD",
    fill: "bg-c-blue-300",
    use: "Viewport-frame border",
  },
  {
    name: "c-blue-200",
    value: "#B7B9FF",
    fill: "bg-c-blue-200",
    use: "Accent",
  },
  {
    name: "c-black-18p",
    value: "#090B192E",
    fill: "bg-c-black-18p",
    use: "18% black scrim",
  },
  {
    name: "c-black-8p",
    value: "#090B1914",
    fill: "bg-c-black-8p",
    use: "8% black scrim",
  },
  {
    name: "c-white-16p",
    value: "#FFFFFF29",
    fill: "bg-c-white-16p",
    use: "16% white — navbar bottom edge",
  },
];

const DERIVED_COLOURS: Swatch[] = [
  {
    name: "c-white-32p",
    value: "#FFFFFF52",
    fill: "bg-c-white-32p",
    use: "32% white — secondary labels, never a grey",
  },
  {
    name: "c-grid-line",
    value: "#1B1C25",
    fill: "bg-c-grid-line",
    use: "Crosshairs — a ~4% step off the canvas",
  },
  {
    name: "gradient-thermal-from",
    value: "#FD7A39",
    fill: "bg-gradient-thermal-from",
    use: "Thermal ramp, top stop",
  },
  {
    name: "gradient-thermal-to",
    value: "#EC168F",
    fill: "bg-gradient-thermal-to",
    use: "Thermal ramp, bottom stop",
  },
];

type TypeStep = { name: string; meta: string; cls: string; sample: string };

const HEADINGS: TypeStep[] = [
  {
    name: "t-heading-1",
    meta: "Nippo · 56px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-1",
    sample: "Digitize the physical world",
  },
  {
    name: "t-heading-2",
    meta: "Nippo · 48px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-2",
    sample: "Digitize the physical world",
  },
  {
    name: "t-heading-3",
    meta: "Nippo · 40px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-3",
    sample: "Digitize the physical world",
  },
  {
    name: "t-heading-4",
    meta: "Nippo · 32px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-4",
    sample: "Digitize the physical world",
  },
  {
    name: "t-heading-5",
    meta: "Nippo · 24px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-5",
    sample: "Digitize the physical world",
  },
  {
    name: "t-heading-6",
    meta: "Nippo · 20px · 378 · 1.1 · -0.02em",
    cls: "font-nippo text-heading-6",
    sample: "Digitize the physical world",
  },
];

const PARAGRAPHS: TypeStep[] = [
  {
    name: "t-paragraph-lead",
    meta: "Supreme · 32px · 400 · 1.2",
    cls: "font-supreme text-paragraph-lead",
    sample: "Capture in four dimensions — space and time, together.",
  },
  {
    name: "t-paragraph-1",
    meta: "Supreme · 20px · 400 · 1.2",
    cls: "font-supreme text-paragraph-1",
    sample:
      "ChronoSpace builds AI that turns the physical world into data you can replay.",
  },
  {
    name: "t-paragraph-2",
    meta: "Supreme · 16px · 400 · 1.2",
    cls: "font-supreme text-paragraph-2",
    sample:
      "ChronoSpace builds AI that turns the physical world into data you can replay.",
  },
  {
    name: "t-paragraph-3",
    meta: "Supreme · 14px · 400 · 1.2",
    cls: "font-supreme text-paragraph-3",
    sample:
      "ChronoSpace builds AI that turns the physical world into data you can replay.",
  },
  {
    name: "t-paragraph-4",
    meta: "Supreme · 12px · 400 · 1.2",
    cls: "font-supreme text-paragraph-4",
    sample:
      "ChronoSpace builds AI that turns the physical world into data you can replay.",
  },
  {
    name: "t-paragraph-light",
    meta: "Supreme · 18px · 300 · 1.2",
    cls: "font-supreme text-paragraph-light",
    sample:
      "ChronoSpace builds AI that turns the physical world into data you can replay.",
  },
];

const LABELS: TypeStep[] = [
  {
    name: "t-label-1",
    meta: "Nippo · 16px · 378 · 1.1 · uppercase",
    cls: "font-nippo text-label-1 uppercase",
    sample: "Book a meeting",
  },
  {
    name: "t-label-2",
    meta: "Nippo · 14px · 378 · 1.1 · uppercase",
    cls: "font-nippo text-label-2 uppercase",
    sample: "Book a meeting",
  },
  {
    name: "t-label-3",
    meta: "Nippo · 12px · 378 · 1.1 · uppercase",
    cls: "font-nippo text-label-3 uppercase",
    sample: "Backed by",
  },
  {
    name: "t-label-4",
    meta: "Nippo · 10px · 378 · 1.1 · uppercase",
    cls: "font-nippo text-label-4 uppercase",
    sample: "Backed by",
  },
];

const SPACING: { name: string; value: string; bar: string }[] = [
  { name: "3xs", value: "2px", bar: "w-3xs" },
  { name: "2xs", value: "4px", bar: "w-2xs" },
  { name: "xs", value: "8px", bar: "w-xs" },
  { name: "sm", value: "16px", bar: "w-sm" },
  { name: "gutter", value: "20px", bar: "w-gutter" },
  { name: "md", value: "24px", bar: "w-md" },
  { name: "lg", value: "32px", bar: "w-lg" },
  { name: "xl", value: "40px", bar: "w-xl" },
  { name: "2xl", value: "48px", bar: "w-2xl" },
  { name: "3xl", value: "60px", bar: "w-3xl" },
  { name: "4xl", value: "80px", bar: "w-4xl" },
];

const HAIRLINES: { name: string; value: string; line: string; use: string }[] =
  [
    {
      name: "c-blue-900",
      value: "#30323E",
      line: "bg-c-blue-900",
      use: "Card borders, dividers, section rules",
    },
    {
      name: "c-blue-300",
      value: "#777CAD",
      line: "bg-c-blue-300",
      use: "Viewport-frame border",
    },
    {
      name: "c-white-16p",
      value: "#FFFFFF29",
      line: "bg-c-white-16p",
      use: "Navbar bottom edge",
    },
    {
      name: "c-grid-line",
      value: "#1B1C25",
      line: "bg-c-grid-line",
      use: "Viewport crosshairs",
    },
  ];

const CONTENTS: { id: string; label: string }[] = [
  { id: "colours", label: "Colours" },
  { id: "typography", label: "Typography" },
  { id: "buttons", label: "Buttons" },
  { id: "forms", label: "Form elements" },
  { id: "components", label: "Cards, tags, links & quotes" },
  { id: "spacing", label: "Spacing, radius & shadows" },
  { id: "layout", label: "Layout & motion" },
];

/* The exact field recipe used by every control in section 04. There is no form
   anywhere in `src/app/sections/`, so these are built from the tokens rather than
   copied: c-black fill, 1px c-blue-900 hairline, zero radius, Supreme 16px, and the
   CTA's own :focus-visible ring (2px c-white, 2px offset) so keyboard focus reads
   the same here as it does on the button. */
const FIELD =
  "bg-c-black border-c-blue-900 px-sm font-supreme text-paragraph-2 text-c-white placeholder:text-c-white-32p focus:border-c-blue-300 focus-visible:outline-c-white ease-fluid w-full rounded-none border transition-colors duration-400 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none";

/* Inline link — derived from the tokens; the site ships no inline link yet. */
const LINK =
  "text-c-orange-500 hover:text-c-orange-600 focus-visible:outline-c-white ease-fluid underline underline-offset-4 transition-colors duration-400 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none";

const FIELD_LABEL = "font-nippo text-label-3 text-c-white-32p uppercase";

/* The system button, verbatim from `src/app/sections/hero-cta`: 66px tall, square,
   label bottom-left 16px in, arrow 14px from the right. */
const BUTTON =
  "group bg-c-orange-500 pb-sm pl-sm focus-visible:outline-c-white relative flex h-[66px] w-full cursor-pointer items-end justify-between overflow-hidden pr-[14px] focus-visible:outline-2 focus-visible:outline-offset-2";

export default function StyleGuidePage() {
  return (
    <main className="bg-c-black text-c-white font-supreme min-h-svh w-full">
      <div className="px-sm pt-xl pb-4xl md:px-xl md:pt-3xl md:pb-[120px]">
        <div className="max-w-page mx-auto w-full">
          {/* ── Masthead ─────────────────────────────────────────────────── */}
          <header className="pb-2xl md:pb-4xl flex flex-col items-start">
            <Eyebrow glyph="00">ChronoSpace · alpha</Eyebrow>
            <h1 className="font-nippo text-heading-3 lg:text-heading-1 text-c-white mt-md max-w-[720px]">
              Style guide
            </h1>
            <p className="font-supreme text-paragraph-1 text-c-white-32p mt-md max-w-[578px]">
              Every colour, type step, control and measurement below is rendered
              by the same token that ships on the site. Nothing here is a copy —
              if a value changes in{" "}
              <code className="font-nippo text-label-2 text-c-white uppercase">
                globals.css
              </code>
              , it changes on this page.
            </p>

            <nav
              aria-label="Contents"
              className="border-c-blue-900 pt-lg mt-2xl gap-x-lg gap-y-sm flex w-full flex-wrap border-t"
            >
              {CONTENTS.map((item, index) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="font-nippo text-label-3 text-c-white-32p hover:text-c-orange-500 focus-visible:outline-c-white ease-fluid gap-xs flex items-baseline uppercase transition-colors duration-400 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                >
                  <span aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          {/* ── 01 · Colours ─────────────────────────────────────────────── */}
          <Section
            id="colours"
            glyph="01"
            kicker="Foundations"
            title="Colours"
            blurb="A near-black canvas, hairline structure in blue-grey, and one orange that carries every signal. Alpha tokens are shown over a black/grey split so the transparency reads."
          >
            <SubHead>Published Figma fill styles</SubHead>
            <div className="gap-gutter mt-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {PUBLISHED_COLOURS.map((swatch) => (
                <ColourSwatch key={swatch.name} swatch={swatch} />
              ))}
            </div>

            <SubHead className="mt-2xl">Derived from usage</SubHead>
            <div className="gap-gutter mt-md grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {DERIVED_COLOURS.map((swatch) => (
                <ColourSwatch key={swatch.name} swatch={swatch} />
              ))}
            </div>

            <SubHead className="mt-2xl">Thermal gradient</SubHead>
            <div className="border-c-blue-900 mt-md border">
              <div className="from-gradient-thermal-from to-gradient-thermal-to h-[120px] w-full bg-linear-to-b/srgb" />
              <div className="p-sm gap-3xs border-c-blue-900 flex flex-col border-t">
                <p className="font-nippo text-label-3 text-c-white uppercase">
                  gradient-thermal
                </p>
                <p className="font-supreme text-paragraph-4 text-c-white-32p">
                  linear-gradient(180deg, #FD7A39 0%, #EC168F 100%)
                </p>
                <p className="font-supreme text-paragraph-4 text-c-white-32p">
                  Subject photography only — never on text, buttons or panels.
                </p>
              </div>
            </div>
          </Section>

          {/* ── 02 · Typography ──────────────────────────────────────────── */}
          <Section
            id="typography"
            glyph="02"
            kicker="Foundations"
            title="Typography"
            blurb="Two families. Nippo sets every heading and label — its regular is 378, not 400 — and Supreme sets everything you read in a sentence."
          >
            <SubHead>Headings · Nippo</SubHead>
            <div className="mt-md flex flex-col">
              {HEADINGS.map((item) => (
                <Specimen key={item.name} item={item} />
              ))}
            </div>

            <SubHead className="mt-2xl">Paragraphs · Supreme</SubHead>
            <div className="mt-md flex flex-col">
              {PARAGRAPHS.map((item) => (
                <Specimen key={item.name} item={item} />
              ))}
            </div>

            <SubHead className="mt-2xl">Labels · Nippo, uppercase</SubHead>
            <div className="mt-md flex flex-col">
              {LABELS.map((item) => (
                <Specimen key={item.name} item={item} />
              ))}
            </div>

            <SubHead className="mt-2xl">Weights & styles</SubHead>
            <div className="mt-md flex flex-col">
              <SpecimenRow
                name="font-light"
                meta="Supreme 300 — t-paragraph-light"
              >
                <p className="font-supreme text-paragraph-1 font-light">
                  The lightest weight the system uses.
                </p>
              </SpecimenRow>
              <SpecimenRow name="font-normal" meta="Supreme 400 — body default">
                <p className="font-supreme text-paragraph-1">
                  The weight every paragraph token carries.
                </p>
              </SpecimenRow>
              <SpecimenRow
                name="font-nippo"
                meta="Nippo 378 — set by every heading & label token"
              >
                <p className="font-nippo text-heading-6">
                  The only weight Nippo is used at.
                </p>
              </SpecimenRow>
              <SpecimenRow
                name="uppercase"
                meta="Every label step is set in caps"
              >
                <p className="font-nippo text-label-1 uppercase">
                  Book a meeting
                </p>
              </SpecimenRow>
              <SpecimenRow
                name="italic"
                meta="Synthesised — both families ship upright only"
              >
                <p className="font-supreme text-paragraph-1 italic">
                  Slanted by the browser, not by a second font file.
                </p>
              </SpecimenRow>
              <SpecimenRow name="text-c-orange-500" meta="Inline emphasis">
                <p className="font-supreme text-paragraph-1">
                  We build AI to digitize the physical world for{" "}
                  <span className="text-c-orange-500">manufacturing.</span>
                </p>
              </SpecimenRow>
              <SpecimenRow name="link" meta="Derived — no published token">
                <p className="font-supreme text-paragraph-1">
                  Read the{" "}
                  <a href="#typography" className={LINK}>
                    type scale
                  </a>{" "}
                  in full.
                </p>
              </SpecimenRow>
            </div>
          </Section>

          {/* ── 03 · Buttons ─────────────────────────────────────────────── */}
          <Section
            id="buttons"
            glyph="03"
            kicker="Components"
            title="Buttons"
            blurb="One button, one colour, two states. There is no secondary, ghost or size variant in this system — the Figma component set carries exactly Default and its hover, and the class list below is the one shipping in hero-cta."
          >
            <div className="gap-gutter grid grid-cols-1 lg:grid-cols-3">
              <Panel
                label="Default"
                note="Hover or tab to it — the wipe is live"
              >
                <button type="button" className={BUTTON}>
                  <span
                    aria-hidden="true"
                    className="bg-c-orange-600 ease-fluid absolute inset-0 translate-y-full transition-transform duration-400 group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
                  />
                  <span className="font-nippo text-label-1 text-c-white relative z-10 uppercase">
                    Book a meeting
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 mb-[3px] hidden h-[14px] w-[14px] shrink-0 overflow-hidden md:block"
                  >
                    <Image
                      src={arrowRight}
                      alt=""
                      className="ease-fluid absolute top-0 left-0 h-[14px] w-[14px] transition-transform duration-400 group-hover:translate-x-[30px] group-focus-visible:translate-x-[30px] motion-reduce:transition-none"
                    />
                    <Image
                      src={arrowRight}
                      alt=""
                      className="ease-fluid absolute top-0 left-[-30px] h-[14px] w-[14px] transition-transform duration-400 group-hover:translate-x-[30px] group-focus-visible:translate-x-[30px] motion-reduce:transition-none"
                    />
                  </span>
                </button>
              </Panel>

              <Panel
                label="Hover · Variant2"
                note="The wipe parked at rest — c-orange-600 covering the fill"
              >
                <div className={cn(BUTTON, "cursor-default")}>
                  <span
                    aria-hidden="true"
                    className="bg-c-orange-600 absolute inset-0"
                  />
                  <span className="font-nippo text-label-1 text-c-white relative z-10 uppercase">
                    Book a meeting
                  </span>
                  <span
                    aria-hidden="true"
                    className="relative z-10 mb-[3px] hidden h-[14px] w-[14px] shrink-0 overflow-hidden md:block"
                  >
                    <Image
                      src={arrowRight}
                      alt=""
                      className="absolute top-0 left-0 h-[14px] w-[14px]"
                    />
                  </span>
                </div>
              </Panel>

              <Panel
                label="Below 768px"
                note="Same button, arrow clipped — as the mobile artboard"
              >
                <div className={cn(BUTTON, "cursor-default")}>
                  <span className="font-nippo text-label-1 text-c-white relative z-10 uppercase">
                    Book a meeting
                  </span>
                </div>
              </Panel>
            </div>

            <dl className="gap-gutter mt-2xl grid grid-cols-2 lg:grid-cols-4">
              <SpecItem term="Height" value="66px" />
              <SpecItem term="Padding" value="0 13px 16px 16px" />
              <SpecItem term="Radius" value="0 — rounded.none" />
              <SpecItem term="Transition" value="400ms ease-fluid" />
            </dl>
          </Section>

          {/* ── 04 · Form elements ───────────────────────────────────────── */}
          <Section
            id="forms"
            glyph="04"
            kicker="Components"
            title="Form elements"
            blurb="No page in this project ships a form yet, so these are built straight from the tokens rather than copied from a section: c-black fill, a 1px c-blue-900 hairline, zero radius, Supreme 16px, and the CTA's own focus ring so keyboard focus reads identically."
          >
            <Derived>
              Derived from tokens — not published in DESIGN.md. Promote to a
              component before a second form uses them.
            </Derived>

            <div className="gap-gutter gap-y-lg mt-lg grid grid-cols-1 scheme-dark md:grid-cols-2">
              <div className="gap-xs flex flex-col">
                <label htmlFor="sg-name" className={FIELD_LABEL}>
                  Full name
                </label>
                <input
                  id="sg-name"
                  name="sg-name"
                  type="text"
                  placeholder="Ada Lovelace"
                  className={cn(FIELD, "h-[52px]")}
                />
              </div>

              <div className="gap-xs flex flex-col">
                <label htmlFor="sg-email" className={FIELD_LABEL}>
                  Work email
                </label>
                <input
                  id="sg-email"
                  name="sg-email"
                  type="email"
                  placeholder="you@company.com"
                  className={cn(FIELD, "h-[52px]")}
                />
              </div>

              <div className="gap-xs flex flex-col">
                <label htmlFor="sg-domain" className={FIELD_LABEL}>
                  Select · domain
                </label>
                <div className="relative">
                  <select
                    id="sg-domain"
                    name="sg-domain"
                    defaultValue="manufacturing"
                    className={cn(FIELD, "h-[52px] appearance-none pr-[46px]")}
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="robotics">Robotics</option>
                    <option value="sports">Sports &amp; entertainment</option>
                  </select>
                  <Image
                    src={arrowRight}
                    alt=""
                    aria-hidden="true"
                    className="right-sm pointer-events-none absolute top-1/2 h-[14px] w-[14px] -translate-y-1/2 rotate-90"
                  />
                </div>
              </div>

              <div className="gap-xs flex flex-col">
                <label htmlFor="sg-disabled" className={FIELD_LABEL}>
                  Disabled
                </label>
                <input
                  id="sg-disabled"
                  name="sg-disabled"
                  type="text"
                  disabled
                  defaultValue="Not available"
                  className={cn(
                    FIELD,
                    "disabled:text-c-white-32p h-[52px] disabled:cursor-not-allowed",
                  )}
                />
              </div>

              <div className="gap-xs flex flex-col md:col-span-2">
                <label htmlFor="sg-message" className={FIELD_LABEL}>
                  Textarea · what are you capturing?
                </label>
                <textarea
                  id="sg-message"
                  name="sg-message"
                  rows={4}
                  placeholder="A production line, a robot cell, a 100m final…"
                  className={cn(FIELD, "py-sm resize-y")}
                />
              </div>

              <fieldset className="gap-sm flex flex-col">
                <legend className={cn(FIELD_LABEL, "mb-xs")}>
                  Checkbox · capture modes
                </legend>
                <CheckControl
                  type="checkbox"
                  id="sg-cb-1"
                  name="sg-modes"
                  label="4D volumetric"
                  defaultChecked
                />
                <CheckControl
                  type="checkbox"
                  id="sg-cb-2"
                  name="sg-modes"
                  label="Thermal overlay"
                />
                <CheckControl
                  type="checkbox"
                  id="sg-cb-3"
                  name="sg-modes"
                  label="Skeletal tracking"
                  disabled
                />
              </fieldset>

              <fieldset className="gap-sm flex flex-col">
                <legend className={cn(FIELD_LABEL, "mb-xs")}>
                  Radio · frame rate
                </legend>
                <CheckControl
                  type="radio"
                  id="sg-r-1"
                  name="sg-rate"
                  label="30 fps"
                  defaultChecked
                />
                <CheckControl
                  type="radio"
                  id="sg-r-2"
                  name="sg-rate"
                  label="60 fps"
                />
                <CheckControl
                  type="radio"
                  id="sg-r-3"
                  name="sg-rate"
                  label="120 fps"
                  disabled
                />
              </fieldset>
            </div>
          </Section>

          {/* ── 05 · Cards, tags, links & quotes ─────────────────────────── */}
          <Section
            id="components"
            glyph="05"
            kicker="Components"
            title="Cards, tags, links & quotes"
            blurb="The card and eyebrow are published in DESIGN.md and drawn to their exact padding here. The viewport frame is the system's signature panel. The link and blockquote are derived."
          >
            <div className="gap-gutter grid grid-cols-1 lg:grid-cols-2">
              {/* Card — DESIGN.md » components.card */}
              <article className="border-c-blue-900 bg-c-black flex flex-col border">
                <div className="p-lg gap-sm flex flex-col">
                  <Eyebrow glyph="01">Capture</Eyebrow>
                  <h3 className="font-nippo text-heading-5 text-c-white">
                    Card
                  </h3>
                  <p className="font-supreme text-paragraph-3 text-c-white-32p">
                    Header 32px · media 24px · footer 40/32px · 1px c-blue-900 ·
                    radius 0
                  </p>
                </div>
                <div className="border-c-blue-900 p-md border-t">
                  <ViewportFrame />
                </div>
                <div className="border-c-blue-900 py-xl px-lg gap-sm flex flex-wrap items-center border-t">
                  <Tag>Manufacturing</Tag>
                  <Tag>Robotics</Tag>
                  <Tag>Sports</Tag>
                </div>
              </article>

              <div className="gap-gutter flex flex-col">
                <Panel
                  label="Eyebrow / tag"
                  note="c-blue-900 fill · t-label-3 · 3px / 6px padding · 16px gap"
                >
                  <div className="gap-sm flex flex-wrap items-center">
                    <Eyebrow glyph="01">Foundations</Eyebrow>
                    <Eyebrow>No glyph</Eyebrow>
                    <Tag>Tag</Tag>
                  </div>
                </Panel>

                <Panel label="Links" note="Derived — no published token">
                  <div className="gap-sm flex flex-col">
                    <p className="font-supreme text-paragraph-2 text-c-white">
                      An{" "}
                      <a href="#components" className={LINK}>
                        inline link
                      </a>{" "}
                      inside a sentence.
                    </p>
                    <a
                      href="mailto:hello@chronospace.ai"
                      className="font-nippo text-label-2 text-c-white hover:text-c-orange-500 focus-visible:outline-c-white ease-fluid gap-xs inline-flex w-fit items-center uppercase transition-colors duration-400 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                    >
                      Standalone label link
                      <Image
                        src={arrowRight}
                        alt=""
                        aria-hidden="true"
                        className="h-[14px] w-[14px]"
                      />
                    </a>
                  </div>
                </Panel>

                <Panel label="Blockquote" note="Derived — no published token">
                  <blockquote className="border-c-orange-500 pl-md gap-sm flex flex-col border-l">
                    <p className="font-supreme text-paragraph-1 text-c-white">
                      The instrument does not interpret the scene. It records
                      it, in space and in time, and leaves the interpretation to
                      you.
                    </p>
                    <footer className="font-nippo text-label-3 text-c-white-32p uppercase">
                      ChronoSpace — capture principles
                    </footer>
                  </blockquote>
                </Panel>
              </div>
            </div>
          </Section>

          {/* ── 06 · Spacing, radius & shadows ───────────────────────────── */}
          <Section
            id="spacing"
            glyph="06"
            kicker="Foundations"
            title="Spacing, radius & shadows"
            blurb="Eleven spacing steps, one radius, and no shadows at all. Depth in this system is a 1px hairline, not a blur."
          >
            <div className="gap-gutter gap-y-2xl grid grid-cols-1 lg:grid-cols-2">
              <div>
                <SubHead>Spacing scale</SubHead>
                <div className="gap-md mt-md flex flex-col">
                  {SPACING.map((step) => (
                    <div key={step.name} className="gap-sm flex items-center">
                      <span className="font-nippo text-label-4 text-c-white-32p w-[64px] shrink-0 uppercase">
                        {step.name}
                      </span>
                      <span
                        className={cn(
                          "bg-c-orange-500 h-xs shrink-0",
                          step.bar,
                        )}
                      />
                      <span className="font-supreme text-paragraph-4 text-c-white-32p">
                        {step.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="gap-2xl flex flex-col">
                <div>
                  <SubHead>Radius</SubHead>
                  <div className="gap-sm mt-md flex items-center">
                    <span className="border-c-blue-900 bg-c-blue-900 size-[72px] shrink-0 rounded-none border" />
                    <div className="gap-3xs flex flex-col">
                      <p className="font-nippo text-label-3 text-c-white uppercase">
                        rounded.none
                      </p>
                      <p className="font-supreme text-paragraph-4 text-c-white-32p">
                        0px — every corner in the system, with no exceptions
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <SubHead>Shadows</SubHead>
                  <p className="font-supreme text-paragraph-3 text-c-white-32p mt-md max-w-[420px]">
                    There are none. No box-shadow, no blur, no glassmorphism —
                    every panel in the design file carries an empty effects
                    array. Separation is done with a hairline instead:
                  </p>
                  <div className="gap-md mt-md flex flex-col">
                    {HAIRLINES.map((line) => (
                      <div key={line.name} className="gap-3xs flex flex-col">
                        <span className={cn("h-px w-full", line.line)} />
                        <div className="gap-xs flex flex-wrap items-baseline">
                          <span className="font-nippo text-label-4 text-c-white uppercase">
                            {line.name}
                          </span>
                          <span className="font-supreme text-paragraph-4 text-c-white-32p">
                            {line.value} · {line.use}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ── 07 · Layout & motion ─────────────────────────────────────── */}
          <Section
            id="layout"
            glyph="07"
            kicker="Foundations"
            title="Layout & motion"
            blurb="A 1416px container on a 12-column grid with 20px gutters, and one easing curve for everything that moves."
          >
            <SubHead>Grid — 12 columns, 20px gutter</SubHead>
            <div className="gap-x-gutter mt-md grid grid-cols-4 md:grid-cols-12">
              {Array.from({ length: 12 }, (_, column) => (
                <span
                  key={column}
                  className={cn(
                    "bg-c-white-16p h-[80px]",
                    column >= 4 && "hidden md:block",
                  )}
                />
              ))}
            </div>
            <p className="font-supreme text-paragraph-4 text-c-white-32p mt-sm">
              4 columns below 768px, 12 from there up. Page margins sit outside
              the container: 16px on mobile, 40px from md.
            </p>

            <dl className="gap-gutter mt-2xl grid grid-cols-2 lg:grid-cols-4">
              <SpecItem term="Container" value="1416px — max-w-page" />
              <SpecItem term="Viewport" value="1496px design frame" />
              <SpecItem term="Breakpoints" value="md 768px · lg 992px" />
              <SpecItem term="Hairline" value="1px" />
            </dl>

            <SubHead className="mt-2xl">Motion</SubHead>
            <div className="gap-gutter mt-md grid grid-cols-1 md:grid-cols-2">
              <Panel
                label="ease-fluid · 400ms"
                note="Interactive duration — hover the tile"
              >
                <div className="bg-c-blue-900 group h-[72px] w-full overflow-hidden">
                  <span className="bg-c-orange-500 ease-fluid block h-full w-1/4 transition-all duration-400 group-hover:w-full motion-reduce:transition-none" />
                </div>
              </Panel>
              <Panel
                label="ease-fluid · 1000ms"
                note="Scene duration — backdrops and crossfades"
              >
                <div className="bg-c-blue-900 group h-[72px] w-full overflow-hidden">
                  <span className="bg-c-orange-500 ease-fluid block h-full w-1/4 transition-all duration-1000 group-hover:w-full motion-reduce:transition-none" />
                </div>
              </Panel>
            </div>
            <p className="font-supreme text-paragraph-4 text-c-white-32p mt-sm">
              cubic-bezier(0.61, 0, 0.2, 1) — one curve for the whole site.
              Everything that moves honours prefers-reduced-motion.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

/* ── Local building blocks ─────────────────────────────────────────────────── */

/** DESIGN.md » components.eyebrow — c-blue-900 fill, t-label-3, 3/6px padding, the
 *  optional leading glyph at 32% white and a 16px gap. */
function Eyebrow({ glyph, children }: { glyph?: string; children: ReactNode }) {
  return (
    <span className="bg-c-blue-900 gap-sm font-nippo text-label-3 text-c-white inline-flex w-fit items-center px-[6px] py-[3px] uppercase">
      {glyph ? (
        <span aria-hidden="true" className="text-c-white-32p">
          {glyph}
        </span>
      ) : null}
      {children}
    </span>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="border-c-blue-900 font-nippo text-label-4 text-c-white-32p inline-flex w-fit items-center border px-[6px] py-[3px] uppercase">
      {children}
    </span>
  );
}

function Section({
  id,
  glyph,
  kicker,
  title,
  blurb,
  children,
}: {
  id: string;
  glyph: string;
  kicker: string;
  title: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="border-c-blue-900 pt-2xl pb-2xl md:pt-4xl md:pb-4xl scroll-mt-lg border-t"
    >
      <header className="mb-xl md:mb-2xl flex flex-col items-start">
        <Eyebrow glyph={glyph}>{kicker}</Eyebrow>
        <h2 className="font-nippo text-heading-4 lg:text-heading-3 text-c-white mt-md">
          {title}
        </h2>
        <p className="font-supreme text-paragraph-2 text-c-white-32p mt-sm max-w-[578px]">
          {blurb}
        </p>
      </header>
      {children}
    </section>
  );
}

function SubHead({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3
      className={cn(
        "border-c-blue-900 pb-xs font-nippo text-label-3 text-c-white-32p border-b uppercase",
        className,
      )}
    >
      {children}
    </h3>
  );
}

function Specimen({ item }: { item: TypeStep }) {
  return (
    <SpecimenRow name={item.name} meta={item.meta}>
      <p className={cn(item.cls, "text-c-white")}>{item.sample}</p>
    </SpecimenRow>
  );
}

function SpecimenRow({
  name,
  meta,
  children,
}: {
  name: string;
  meta: string;
  children: ReactNode;
}) {
  return (
    <div className="border-c-blue-900 py-lg gap-x-gutter gap-y-sm grid grid-cols-1 border-b last:border-b-0 md:grid-cols-[180px_1fr]">
      <div className="gap-3xs flex flex-col">
        <span className="font-nippo text-label-3 text-c-white uppercase">
          {name}
        </span>
        <span className="font-supreme text-paragraph-4 text-c-white-32p">
          {meta}
        </span>
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function ColourSwatch({ swatch }: { swatch: Swatch }) {
  return (
    <div className="border-c-blue-900 flex flex-col border">
      {/* Alpha tokens sit over a black/grey split, so 8% and 18% read as transparency
          rather than as a flat near-black tile. Opaque tokens simply cover it. */}
      <div className="relative aspect-[4/3] w-full">
        <span className="bg-c-black absolute inset-y-0 left-0 w-1/2" />
        <span className="bg-grey absolute inset-y-0 right-0 w-1/2" />
        <span className={cn("absolute inset-0", swatch.fill)} />
      </div>
      <div className="border-c-blue-900 p-sm gap-3xs flex flex-1 flex-col border-t">
        <p className="font-nippo text-label-3 text-c-white uppercase">
          {swatch.name}
        </p>
        <p className="font-supreme text-paragraph-4 text-c-white">
          {swatch.value}
        </p>
        <p className="font-supreme text-paragraph-4 text-c-white-32p mt-auto">
          {swatch.use}
        </p>
      </div>
    </div>
  );
}

function Panel({
  label,
  note,
  children,
}: {
  label: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-c-blue-900 p-md gap-md flex flex-col border">
      <div className="gap-3xs flex flex-col">
        <span className="font-nippo text-label-3 text-c-white uppercase">
          {label}
        </span>
        {note ? (
          <span className="font-supreme text-paragraph-4 text-c-white-32p">
            {note}
          </span>
        ) : null}
      </div>
      <div className="mt-auto">{children}</div>
    </div>
  );
}

function SpecItem({ term, value }: { term: string; value: string }) {
  return (
    <div className="border-c-blue-900 pt-sm gap-3xs flex flex-col border-t">
      <dt className="font-nippo text-label-4 text-c-white-32p uppercase">
        {term}
      </dt>
      <dd className="font-supreme text-paragraph-3 text-c-white">{value}</dd>
    </div>
  );
}

function Derived({ children }: { children: ReactNode }) {
  return (
    <p className="border-c-orange-500 pl-sm font-supreme text-paragraph-3 text-c-white-32p max-w-[578px] border-l">
      {children}
    </p>
  );
}

function CheckControl({
  type,
  id,
  name,
  label,
  defaultChecked,
  disabled,
}: {
  type: "checkbox" | "radio";
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="gap-xs font-supreme text-paragraph-2 text-c-white flex w-fit cursor-pointer items-center has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-40"
    >
      <input
        id={id}
        name={name}
        type={type}
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="accent-c-orange-500 focus-visible:outline-c-white size-[18px] shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
      />
      {label}
    </label>
  );
}

/** The system's signature panel, static: c-black fill, 1px c-blue-300 border,
 *  c-grid-line crosshairs and four 13px c-orange-500 reticle brackets on a UI layer
 *  inset 20px (3.46% / 4.51% of the 578 × 443 frame). */
function ViewportFrame() {
  return (
    <div className="border-c-blue-300 bg-c-black relative aspect-[578/443] w-full overflow-hidden border">
      <div className="pointer-events-none absolute top-[4.5147%] right-[3.4602%] bottom-[4.5147%] left-[3.4602%] flex flex-col justify-between">
        <span className="bg-c-grid-line absolute inset-x-0 top-1/2 h-px" />
        <span className="bg-c-grid-line absolute inset-y-0 left-1/2 w-px" />
        <div className="flex justify-between">
          <span className="border-c-orange-500 aspect-square w-[2.4164%] border-t border-l" />
          <span className="border-c-orange-500 aspect-square w-[2.4164%] border-t border-r" />
        </div>
        <div className="flex justify-between">
          <span className="border-c-orange-500 aspect-square w-[2.4164%] border-b border-l" />
          <span className="border-c-orange-500 aspect-square w-[2.4164%] border-r border-b" />
        </div>
      </div>
    </div>
  );
}
