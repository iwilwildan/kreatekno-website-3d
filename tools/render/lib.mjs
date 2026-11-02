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
export const KEYS = ["K0", "K1", "K2", "K2.1", "K2.2"];
