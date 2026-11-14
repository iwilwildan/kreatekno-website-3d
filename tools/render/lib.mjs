// Shared helpers for the render tools: a local Edge/Chrome driven by Playwright (no browser download), with
// SwiftShader so renders are the same on every machine (the prototype's review renders used the same setup).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SITE = join(ROOT, "site");
export const BASE = process.env.BASE || "http://localhost:3000";

const FFMPEG_FALLBACK =
  "C:/Users/wilda/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-9.0.2-full_build/bin/ffmpeg.exe";
export const FFMPEG = process.env.FFMPEG || (existsSync(FFMPEG_FALLBACK) ? FFMPEG_FALLBACK : "ffmpeg");

export async function launch({ gpu = false } = {}) {
  const args = gpu ? [] : ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel, args });
    } catch {
      /* try the next installed browser */
    }
  }
  // (no Edge or Chrome installed, e.g. a cloud container: Playwright's own Chromium)
  return chromium.launch({ args });
}

/** Opens a page and collects console errors and page errors. */
export async function open(browser, url, viewport, { dpr = 1 } = {}) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: dpr });
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror " + e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console " + m.text());
  });
  await page.goto(url, { waitUntil: "load" });
  return { page, errors };
}

/** Waits until the world has crossfaded in and its AO is on. */
export async function waitWorld(page, timeout = 600000) {
  await page.waitForFunction(() => window.__world?.ready() && window.__world.aoDone(), null, { timeout, polling: 500 });
  // two more frames so the last AO upload is on screen
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
}

export function writeDataUrl(file, dataUrl) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(dataUrl.split(",")[1], "base64"));
}

export function toWebp(png, webp, quality = 80) {
  mkdirSync(dirname(webp), { recursive: true });
  execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-i", png, "-c:v", "libwebp", "-quality", String(quality), "-compression_level", "6", webp]);
}

export const FORMATS = { pc: { width: 1600, height: 900 }, hp: { width: 720, height: 1280 } };
export const KEYS = ["K0", "K1", "K2", "K2.1", "K2.2", "K3", "K4", "K4.1", "K5a.1", "K5a.2", "K5a.3", "K5a.4", "K5a.6", "K6", "K7", "K8", "K9.1", "K9b", "K11", "K12", "K13", "K15.1", "K16"];
/**
 * Stills of beats 5a–5b on 9:16 taken where the camera stops on a panel (screens into the take), not at the
 * hold's middle (between two panels there); "b" keys are the second panel of a hold (9:16 only).
 */
export const HP_AT = { "K5a.2": 11.75, "K5a.2b": 12.13, "K5a.3": 12.85, "K5a.3b": 13.23, "K5a.4": 13.95, "K5a.4b": 14.33 };
/** The journey copy recorded on each still (stills fallback), per format. */
export const JOURNEY = {
  pc: { "K5a.2": ["intro", "talk"], "K5a.3": ["map", "build"], "K5a.4": ["launch", "cta"] },
  hp: { "K5a.2": ["intro"], "K5a.2b": ["talk"], "K5a.3": ["map"], "K5a.3b": ["build"], "K5a.4": ["launch"], "K5a.4b": ["cta"] },
};
/**
 * The lobby (tahap 7): on 9:16 a still per stop of a hold (site/world/takes/home/timing.ts STOP, LOBBY_STOPS): K6 the
 * strip then the 3 polaroids left to right (issue #17), K7 the sign, the books right to left and the button, K8 the left then the right columns.
 * Hold length (screens) and the stops' keys.
 */
export const LOBBY_HP = {
  K6: { len: 1.1, keys: ["K6", "K6b", "K6c", "K6d"] },
  K7: { len: 1.4, keys: ["K7", "K7b", "K7c", "K7d", "K7e"] },
  K8: { len: 0.75, keys: ["K8", "K8b"] },
  // tahap 8: the plaque, its left then its right column (timing.ts PLAQUE_STOPS)
  K9b: { len: 0.6, keys: ["K9b", "K9b-2"] },
};
/** Screens from the hold's start to the middle of the camera's rest on stop i of n (stopSpan in timing.ts). */
export function stopMid(len, n, i) {
  const unit = len / (n * 0.17 + (n - 1) * 0.13);
  return (i * 0.3 + 0.085) * unit;
}
/** The lobby's copy recorded on each still (stills fallback), per format. */
const notes = (...i) => i.map((n) => `faq-${n}`);
export const LOBBY_COPY = {
  pc: {
    K6: ["board-strip", "testi-0", "testi-1", "testi-2"],
    K7: ["rack-sign", "article-0", "article-1", "article-2", "rack-all"],
    K8: ["faq-title", "faq-help", ...notes(0, 1, 2, 3, 4, 5, 6, 7)],
    K9b: ["about-0", "about-1"],
    // tahap 9: the slide on the classroom's TV
    K12: ["practice"],
    // tahap 10: the CTA on the lit billboard (its title above, its paragraph and buttons below)
    "K15.1": ["cta-top", "cta-bottom"],
  },
  hp: {
    K6: ["board-strip"],
    K6b: ["testi-0"], K6c: ["testi-1"], K6d: ["testi-2"],
    K7: ["rack-sign"], K7b: ["article-2"], K7c: ["article-1"], K7d: ["article-0"], K7e: ["rack-all"],
    K8: ["faq-title", ...notes(0, 1, 4, 5)],
    K8b: ["faq-help", ...notes(2, 3, 6, 7)],
    K9b: ["about-0"],
    "K9b-2": ["about-1"],
    K12: ["practice"],
    // (9:16: the title on the face; the paragraph and the buttons are a card the page places)
    "K15.1": ["cta-face"],
  },
};
