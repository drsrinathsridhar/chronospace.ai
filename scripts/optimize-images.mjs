// Re-compress the hand-exported Figma artwork in src/app/(home)/assets/figma/ into the
// files the sections import from src/app/(home)/assets/.
//   npm run images:generate  → (re)writes the shipped .webp files
//   npm run images:check     → fails if a shipped file is missing or out of date
// `--check` is deliberately NOT in CI the way icons:check is: libvips encodes slightly
// differently between versions and architectures, so a byte comparison would fail on the
// runner for images that are perfectly correct. Run it locally after touching figma/.
// Figma's own webp export is tuned for fidelity at 1:1, which is not what the splash needs:
// it is the whole critical path on a phone. Quality per job below, measured against the
// design — the backdrops are soft bloom gradients that tolerate hard compression, the
// subjects are the thing you actually look at and get a gentler setting.
import { promises as fs } from "node:fs";
import path from "node:path";

import sharp from "sharp";

const SRC = path.join(process.cwd(), "src/app/(home)/assets/figma");
const OUT = path.join(process.cwd(), "src/app/(home)/assets");

// `width: null` keeps the export's own dimensions. Do not downscale the subjects: they are
// exactly @2x of their desktop display size. Do not re-crop the mobile backdrop either —
// its 551.47vw / -399.47vw placement in splash-backdrop.tsx is measured off these pixels.
const JOBS = [
  { file: "echo-repeater-bg-mobile.webp", width: null, quality: 52 },
  { file: "echo-repeater-bg.webp", width: 2560, quality: 55 },
  { file: "subject-manufacturing.webp", width: null, quality: 68 },
  { file: "subject-robotics.webp", width: null, quality: 68 },
  { file: "subject-entertainment.webp", width: null, quality: 68 },
];

async function encode({ file, width, quality }) {
  let img = sharp(path.join(SRC, file));
  if (width) img = img.resize({ width, withoutEnlargement: true });
  return img.webp({ quality, effort: 6 }).toBuffer();
}

const check = process.argv.includes("--check");
let stale = 0;

for (const job of JOBS) {
  const target = path.join(OUT, job.file);
  const next = await encode(job);
  if (check) {
    const cur = await fs.readFile(target).catch(() => null);
    if (!cur || !cur.equals(next)) {
      console.error("Out of date: " + job.file);
      stale++;
    }
    continue;
  }
  const before = (await fs.stat(path.join(SRC, job.file))).size;
  await fs.writeFile(target, next);
  const pct = Math.round((1 - next.length / before) * 100);
  console.log(
    job.file +
      ": " +
      Math.round(before / 1024) +
      "KB -> " +
      Math.round(next.length / 1024) +
      "KB (-" +
      pct +
      "%)",
  );
}

if (check) {
  if (stale) {
    console.error(
      "Images are out of date - run: npm run images:generate (then commit the result).",
    );
    process.exit(1);
  }
  console.log("Images up to date.");
}
