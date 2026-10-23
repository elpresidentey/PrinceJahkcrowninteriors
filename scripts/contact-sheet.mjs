// Builds a labelled contact sheet of public/images for a quick visual audit.
// Run with: node scripts/contact-sheet.mjs
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import sharp from "sharp";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dir = resolve(root, "public/images");
const out = resolve(process.env.TEMP ?? "/tmp", "popdecor-contact-sheet.jpg");

const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();

const CELL = 360;
const COLS = 4;
const rows = Math.ceil(files.length / COLS);

const composites = [];
const meta = [];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const input = join(dir, file);
  const info = await sharp(input).metadata();
  meta.push({
    i,
    file,
    w: info.width,
    h: info.height,
    orientation: info.width >= info.height ? "landscape" : "portrait",
  });

  const buf = await sharp(input)
    .rotate()
    .resize(CELL - 20, CELL - 20, { fit: "contain", background: "#efeada" })
    .jpeg({ quality: 80 })
    .toBuffer();

  const x = (i % COLS) * CELL + 10;
  const y = Math.floor(i / COLS) * CELL + 10;

  composites.push({ input: buf, left: x, top: y });
  composites.push({
    input: Buffer.from(
      `<svg width="${CELL - 20}" height="34"><rect width="100%" height="34" fill="#343434"/><text x="8" y="24" font-family="monospace" font-size="20" fill="#f8f6e8">[${i}] ${file.slice(0, 20)}</text></svg>`
    ),
    left: x,
    top: y + CELL - 44,
  });
}

await sharp({
  create: {
    width: COLS * CELL,
    height: rows * CELL,
    channels: 3,
    background: "#f8f6e8",
  },
})
  .composite(composites)
  .jpeg({ quality: 85 })
  .toFile(out);

console.log("Contact sheet:", out);
console.table(meta);
