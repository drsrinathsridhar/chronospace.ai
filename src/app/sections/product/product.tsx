import Image from "next/image";
import type { StaticImageData } from "next/image";
import measurable from "./measurable.png";
import navigable from "./navigable.png";
import styles from "./product.module.css";
import wild from "./wild.png";

// The product: the intro's argument split into the three properties a
// capture actually ships with - taken in the wild, navigable in 4D,
// measurable afterwards - one card each, all built the same way: a labelled
// header strip, the evidence plate, and the claim under it.
//
// Geometry is the comp's at the 1496px design width: the label on the
// gutter, the heading and lede 598/1416 into the content box on the
// section's shared 698px measure, and the cards in a full-width row of
// three on a 22px gap, each plate held at the comp's 577/310.

type Card = {
  label: string;
  title: string;
  copy: string;
  image: StaticImageData;
  imageClassName: string;
};

const cards: Card[] = [
  {
    label: "Captured in the wild",
    title: "No stage required",
    copy: "Real environments, indoors and out, over long durations. No controlled lighting, no bringing the subject to a studio. Everyone else needs one.",
    image: wild,
    imageClassName: "object-cover",
  },
  {
    label: "Navigable in 4D",
    title: "Any viewpoint, any moment",
    copy: "Geometry you can move through at full environment scale, at whatever instant you need - not a fixed camera you have to accept.",
    image: navigable,
    imageClassName: "object-cover",
  },
  {
    label: "Measurable afterwards",
    title: "The scene stays queryable",
    copy: "A finished capture streams like ordinary video and answers questions inside it - distance travelled, cycle duration, whether a line was crossed.",
    image: measurable,
    imageClassName: "object-cover object-top",
  },
];

export function Product() {
  return (
    <section id="product" className="section-container relative pt-27 pb-30">
      <p className="type-nav text-muted pt-2 md:absolute">(Product)</p>

      <div className={styles.column}>
        <h2 className="type-display-xs sm:type-display-sm lg:type-display-md mt-6 text-balance md:mt-0">
          One capture, three things nobody else can hand you.
        </h2>
        <p className="type-body-xl text-ink/60 mt-6 max-w-115">
          For anyone training models on the physical world, the capture itself
          is the asset.
        </p>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-5.5 md:mt-38 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="border-line flex flex-col border"
          >
            <header className="bg-paper border-line border-b p-8">
              <p className="type-nav text-muted">{card.label}</p>
            </header>

            <div className={styles.plate}>
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 48rem) 33vw, 100vw"
                className={card.imageClassName}
              />
            </div>

            <div className="border-line flex flex-1 flex-col gap-6 border-t px-8 py-10">
              <h3 className="type-title-lg">{card.title}</h3>
              <p className="type-body-lg leading-tight font-light">
                {card.copy}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
