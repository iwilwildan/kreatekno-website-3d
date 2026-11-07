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
  throw new Error("No Edge or Chrome found for Playwright");
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
export const KEYS = ["K0", "K1", "K2", "K2.1", "K2.2", "K3", "K4", "K4.1", "K5a.1", "K5a.2", "K5a.3", "K5a.4", "K5a.6"];
/**
 * Stills of beats 5a–5b on 9:16 taken where the camera stops on a panel (screens into the take), not at the
 * hold's middle (between two panels there); "b" keys are the second panel of a hold (9:16 only).
 */
export const HP_AT = { "K5a.2": 15.25, "K5a.2b": 15.63, "K5a.3": 16.35, "K5a.3b": 16.73, "K5a.4": 17.45, "K5a.4b": 17.83 };
/** The journey copy recorded on each still (stills fallback), per format. */
export const JOURNEY = {
  pc: { "K5a.2": ["intro", "talk"], "K5a.3": ["map", "build"], "K5a.4": ["launch", "cta"] },
  hp: { "K5a.2": ["intro"], "K5a.2b": ["talk"], "K5a.3": ["map"], "K5a.3b": ["build"], "K5a.4": ["launch"], "K5a.4b": ["cta"] },
};
