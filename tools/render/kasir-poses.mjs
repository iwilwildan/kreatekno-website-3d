// Seven cashier poses in one deterministic dev-lab strip for S3 review.
// Usage: node tools/render/kasir-poses.mjs <absolute output directory>
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { BASE, launch, open, writeDataUrl } from "./lib.mjs";

const out = process.argv[2];
if (!out) throw new Error("Pass an output directory");
mkdirSync(out, { recursive: true });
const browser = await launch();
const { page, errors } = await open(
  browser,
  `${BASE}/?lab=heruKasir&view=pose&pose=all&flat`,
  {
    width: 1800,
    height: 720,
  },
);
await page.waitForFunction(() => window.__lab?.ready, null, {
  timeout: 120000,
  polling: 200,
});
await page.waitForTimeout(250);
const info = await page.evaluate(() => {
  window.__lab.render();
  return window.__lab.info;
});
writeDataUrl(
  join(out, "heruKasir_poses.png"),
  await page.evaluate(() => window.__lab.png()),
);
console.log({
  order: ["idle", "ready", "lift", "offer", "wave", "shrug", "nod"],
  info,
  errors,
});
await page.close();
await browser.close();
