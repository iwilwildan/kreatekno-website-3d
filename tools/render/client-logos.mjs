/**
 * Extract the flat client logos supplied for issue #34 from their JPEG backgrounds without redrawing them.
 * Riau Home Cleaning has a photographic gradient and is handled by the reviewed transparent cutout instead.
 */
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "../../site/node_modules/sharp/dist/index.cjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DIR = resolve(ROOT, "site/public/brand/clients");

const LOGOS = [
  ["kringmie", "global", 10, 42],
  ["jafa-indo-corpora", "global", 10, 42],
  ["bertuai-komunitas-ai-riau", "global", 10, 42],
  ["pt-pamor-sapta-dharma", "global", 10, 42],
  ["threadmation", "global", 6, 40],
  ["public-speaking-indonesia", "global", 8, 36],
  ["nextive-ai", "global", 8, 38],
  ["nexman-kopi-ginseng", "connected", 8, 48],
  ["nextgam-nextive-gaming", "global", 8, 38],
  ["item-kingdom", "global", 10, 42],
  ["dance-school", "connected", 10, 55],
  ["ragamuda-bertuah-logistik", "global", 10, 42],
];

const distance = (data, i, bg) =>
  Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);

function background(data, width, height) {
  const sample = [];
  const inset = Math.max(
    2,
    Math.min(16, Math.floor(Math.min(width, height) / 16)),
  );
  for (let y = 0; y < inset; y++) {
    for (let x = 0; x < inset; x++) {
      for (const [sx, sy] of [
        [x, y],
        [width - 1 - x, y],
        [x, height - 1 - y],
        [width - 1 - x, height - 1 - y],
      ]) {
        const i = (sy * width + sx) * 4;
        sample.push([data[i], data[i + 1], data[i + 2]]);
      }
    }
  }
  return [0, 1, 2].map((channel) => {
    const values = sample.map((pixel) => pixel[channel]).sort((a, b) => a - b);
    return values[Math.floor(values.length / 2)];
  });
}

function connectedBackground(data, width, height, bg, feather) {
  const count = width * height;
  const seen = new Uint8Array(count);
  const queue = new Int32Array(count);
  let head = 0;
  let tail = 0;

  const add = (pixel) => {
    if (seen[pixel] || distance(data, pixel * 4, bg) >= feather) return;
    seen[pixel] = 1;
    queue[tail++] = pixel;
  };
  for (let x = 0; x < width; x++) {
    add(x);
    add((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    add(y * width);
    add(y * width + width - 1);
  }
  while (head < tail) {
    const pixel = queue[head++];
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    if (x > 0) add(pixel - 1);
    if (x + 1 < width) add(pixel + 1);
    if (y > 0) add(pixel - width);
    if (y + 1 < height) add(pixel + width);
  }
  return seen;
}

async function extract(name, mode, cutoff, feather) {
  const input = resolve(DIR, `${name}.jpg`);
  const output = resolve(DIR, `${name}-transparent.png`);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bg = background(data, info.width, info.height);
  const connected =
    mode === "connected"
      ? connectedBackground(data, info.width, info.height, bg, feather)
      : null;

  for (let pixel = 0; pixel < info.width * info.height; pixel++) {
    if (connected && !connected[pixel]) continue;
    const i = pixel * 4;
    const d = distance(data, i, bg);
    if (d >= feather) continue;
    const coverage = Math.max(
      0,
      Math.min(1, (d - cutoff) / (feather - cutoff)),
    );
    data[i + 3] = Math.round(data[i + 3] * coverage);
  }

  await mkdir(DIR, { recursive: true });
  await sharp(data, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
    .extend({
      top: 16,
      right: 16,
      bottom: 16,
      left: 16,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: true,
      quality: 100,
    })
    .toFile(output);
  const meta = await sharp(output).metadata();
  console.log(
    `${name}: ${meta.width}x${meta.height}, background rgb(${bg.join(", ")})`,
  );
}

for (const logo of LOGOS) await extract(...logo);
