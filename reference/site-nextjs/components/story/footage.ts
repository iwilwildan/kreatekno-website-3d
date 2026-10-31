/*
 * The one-take footage, as WebP image sequences drawn on a <canvas> and scrubbed by the story timeline
 * (a <video> scrubs badly on Safari). One clip per camera move, keyed by the keyframe the move ends on,
 * in a 16:9 and a 9:16 version. Steps without a clip keep the placeholder scene.
 *
 * Frames are exported from Assets/footage/{desktop,mobile}/"kA - kB.mp4" with ffmpeg (WebP, quality 72,
 * 16:9 at 1280×720); the still frames at the start and end of each source clip are left out, since the
 * web holds the keyframe itself.
 */

import { FILM_QUERY } from "./beats";

/** Where a surface with HTML copy sits in a clip: [frame, dx, dy], offsets in % of the frame width and
 *  height from its place in frame 0. Measured on the footage; between two points the offset is linear. */
export type Track = [frame: number, dx: number, dy: number][];

export type Clip = {
  /** Folder under /public with 000.webp, 001.webp... */
  dir: string;
  frames: number;
  width: number;
  height: number;
  /** Surfaces the props ride on during the move (`data-track` on a Prop). */
  tracks?: Record<string, Track>;
};

export const FOOTAGE: Record<string, { land: Clip; port: Clip }> = {
  // Beat 1, K0 → K1: crane down from the billboard to the door ("k0 - k1.mp4": desktop frames 22–104,
  // mobile frames 19–94). The billboard face leaves the top of the frame on the way down.
  K1: {
    land: {
      dir: "/footage/b1/desk",
      frames: 83,
      width: 1280,
      height: 720,
      tracks: {
        billboard: [
          [0, 0, 0],
          [2, -0.1, 0],
          [4, -0.2, -0.5],
          [6, -0.5, -1.6],
          [8, -0.9, -3.3],
          [10, -1.5, -5.7],
          [12, -2.2, -9],
          [14, -3.1, -12.9],
          [16, -4, -17.3],
          [18, -5.2, -22.9],
          [20, -6.3, -29.1],
          [22, -7.6, -35.7],
          [24, -8.9, -42.3],
          [26, -10.3, -50],
          [28, -11.4, -57.9],
          [30, -12.8, -66.5],
          [32, -14.2, -75],
        ],
      },
    },
    port: {
      dir: "/footage/b1/phone",
      frames: 76,
      width: 720,
      height: 1280,
      tracks: {
        billboard: [
          [0, 0, 0],
          [2, 0, -0.1],
          [4, -0.5, -0.4],
          [6, -1.1, -1],
          [8, -2.2, -1.8],
          [10, -3.5, -2.9],
          [12, -5.1, -4.4],
          [14, -6.6, -6.1],
          [16, -8.7, -8.4],
          [18, -10.9, -10.7],
          [20, -13.2, -13.4],
          [22, -16, -16.2],
          [24, -19, -19.3],
          [26, -21.8, -22.3],
          [28, -24.6, -25.5],
          [30, -27.8, -28.9],
          [32, -31, -32.2],
          [34, -33.6, -35.2],
          [36, -36.7, -38.2],
          [38, -39.5, -41.2],
          [40, -42.1, -43.9],
          [42, -44, -46.5],
          [47, -48.5, -55],
          [51, -51.5, -59.7],
          [55, -54.5, -64],
        ],
      },
    },
  },
  // Beat 2, K1 → K2: Heru opens the door and the camera follows him into the shop ("k1 - k2.mp4": desktop
  // frames 14–94, scaled down from 1920×1080; mobile frames 17–106). No copy rides on it.
  K2: {
    land: { dir: "/footage/b2/desk", frames: 81, width: 1280, height: 720 },
    port: { dir: "/footage/b2/phone", frames: 90, width: 720, height: 1280 },
  },
  // Beat 2, K2 → K2.1: closer and over to Sinta and Bayu on the left ("k2 - k2.1.mp4": desktop frames
  // 3–72, mobile frames 19–58).
  "K2.1": {
    land: { dir: "/footage/b2a/desk", frames: 70, width: 1280, height: 720 },
    port: { dir: "/footage/b2a/phone", frames: 40, width: 720, height: 1280 },
  },
  // Beat 2, K2.1 → K2.2: whip pan right past the counter to Nadia and Fajar ("k2.1 - k2.2.mp4": desktop
  // frames 18–59, mobile frames 16–57).
  "K2.2": {
    land: { dir: "/footage/b2b/desk", frames: 42, width: 1280, height: 720 },
    port: { dir: "/footage/b2b/phone", frames: 42, width: 720, height: 1280 },
  },
};

/** Frame 0 of the clip the page opens on (the K0 hold), per orientation, for a preload with the page. */
export const OPENING = (["land", "port"] as const).map((o) => ({
  href: `${FOOTAGE.K1[o].dir}/000.webp`,
  media: `${FILM_QUERY} and (orientation: ${o === "land" ? "landscape" : "portrait"})`,
}));

/** A step of the take as the reel needs it: when its camera move runs and how long its keyframe holds. */
type Step = { k: string; t0: number; t1: number; t2: number };

/** Share of a screen over which the footage fades into the placeholder where the next move has no clip. */
const FADE = 0.25;

/**
 * Draws the footage frame for a time of the take. Frame 0 shows from the moment the camera reaches the
 * clip's first keyframe, the last frame until the end of its own hold. Clips load one after another in the
 * order of the take, each in passes (first and last, then every 8th, 4th, 2nd, all), and the nearest
 * loaded frame stands in until the right one arrives.
 * `onShow` reports whether footage covers the frame, so the HTML can drop the parts the footage draws.
 */
export function createReel(canvas: HTMLCanvasElement, steps: Step[], port: boolean, onShow: (on: boolean) => void) {
  const ctx = canvas.getContext("2d");
  const spans = steps.flatMap((s, i) => {
    const clip = FOOTAGE[s.k]?.[port ? "port" : "land"];
    if (!clip || s.t1 <= s.t0) return [];
    const from = i ? steps[i - 1].t1 : s.t0;
    return [{ clip, from, t0: s.t0, t1: s.t1, t2: s.t2, frames: [] as (HTMLImageElement | null)[] }];
  });
  let alive = true;
  let time = 0;
  let drawn: HTMLImageElement | null = null;
  let shown = false;

  // one queue for the whole take, a few requests at a time
  const queue = spans.flatMap((sp) => {
    const n = sp.clip.frames;
    sp.frames = Array.from({ length: n }, () => null);
    const order = [...new Set([0, n - 1, ...[8, 4, 2, 1].flatMap((s) => range(0, n, s))])];
    return order.map((i) => ({ sp, i }));
  });
  let next = 0;
  const pump = () => {
    if (!alive || next >= queue.length) return;
    const { sp, i } = queue[next++];
    const img = new Image();
    if (next === 1) img.fetchPriority = "high";
    // `load`, not decode(): decode() waits for a rendering opportunity and can hang in some browsers
    img.onload = () => {
      if (alive) {
        sp.frames[i] = img;
        draw(time);
      }
      pump();
    };
    img.onerror = pump;
    img.src = `${sp.clip.dir}/${String(i).padStart(3, "0")}.webp`;
  };
  for (let k = 0; k < 4; k++) pump();

  function show(on: boolean) {
    if (on === shown) return;
    shown = on;
    onShow(on);
  }

  function draw(t: number) {
    time = t;
    // a clip that covers this moment wins; otherwise the one whose hold just ended fades out
    const sp =
      spans.find((s) => t >= s.from - 1e-6 && t <= s.t2 + 1e-6) ?? spans.find((s) => t > s.t2 && t <= s.t2 + FADE);
    if (!sp || !ctx) {
      canvas.style.opacity = "0";
      show(false);
      return;
    }
    const n = sp.clip.frames;
    const p = sp.t1 > sp.t0 ? (t - sp.t0) / (sp.t1 - sp.t0) : 0;
    const want = Math.round(Math.min(1, Math.max(0, p)) * (n - 1));
    let img: HTMLImageElement | null = null;
    for (let d = 0; d < n && !img; d++) img = sp.frames[want - d] ?? sp.frames[want + d] ?? null;
    if (!img && !drawn) {
      canvas.style.opacity = "0";
      show(false);
      return;
    }
    // a clip that hasn't loaded yet keeps the last frame drawn rather than flashing the placeholder
    if (img && img !== drawn) {
      if (canvas.width !== sp.clip.width) canvas.width = sp.clip.width;
      if (canvas.height !== sp.clip.height) canvas.height = sp.clip.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawn = img;
    }
    const fade = t > sp.t2 ? 1 - (t - sp.t2) / FADE : 1;
    canvas.style.opacity = String(fade);
    show(fade >= 1);
  }

  return {
    draw,
    destroy() {
      alive = false;
      canvas.style.opacity = "0";
      show(false);
    },
  };
}

/** The track a prop rides on in this orientation, if the next camera move has one. */
export function trackFor(k: string, name: string | undefined, port: boolean) {
  if (!name) return null;
  const clip = FOOTAGE[k]?.[port ? "port" : "land"];
  const track = clip?.tracks?.[name];
  return clip && track ? { track, frames: clip.frames } : null;
}

function range(from: number, to: number, step: number) {
  const out: number[] = [];
  for (let i = from; i < to; i += step) out.push(i);
  return out;
}
