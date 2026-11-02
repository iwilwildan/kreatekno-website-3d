// Shared cuts and fabrics for the cast, in modelling space (the 1.8 m reference body, see member.ts).
import type { Body } from "./body";
import { HERU } from "./heru";

/** Slimmer shoulders and hands for the women of the cast. */
export const WOMAN: Body = {
  ...HERU,
  headRx: 0.15,
  shoulder: [0.172, 1.228, 0],
  elbow: [0.235, 0.99, -0.01],
  wrist: [0.27, 0.74, 0.01],
  hand: { len: 0.165, w: 0.088 },
};

/** Shirt or top from `hem` to the neck: [y, half width, half depth]; `w` widens it. */
export function shirtRings(
  hem: number,
  { w = 1, flare = 0 }: { w?: number; flare?: number } = {},
): [number, number, number][] {
  const rows: [number, number, number][] = [
    [hem, 0.182 + flare, 0.124 + flare * 0.6],
    [Math.max(hem + 0.04, 0.8), 0.178, 0.12],
    [0.95, 0.176, 0.118],
    [1.06, 0.184, 0.123],
    [1.15, 0.188, 0.125],
    [1.2, 0.19, 0.123],
    [1.25, 0.19, 0.118],
    [1.28, 0.172, 0.108],
    [1.305, 0.135, 0.095],
    [1.325, 0.095, 0.08],
    [1.335, 0.072, 0.068],
  ];
  return rows.filter((r, i) => i === 0 || r[0] > hem).map(([y, rx, rz]) => [y, rx * w, rz * w]);
}

/** Long sleeve from shoulder to wrist ([t, rx, rz]), `cuffAt` 1 for full length. */
export function sleeveRings(
  r = 0.058,
  { bell = 0, end = 1 }: { bell?: number; end?: number } = {},
): [number, number, number][] {
  return (
    [
      [-0.04, 0.001, 0.001],
      [-0.035, r * 0.5, r * 0.48],
      [-0.018, r * 0.85, r * 0.83],
      [0, r, r * 0.97],
      [0.3, r * 0.96, r * 0.94],
      [0.55, r * 0.92 + bell * 0.3, r * 0.9 + bell * 0.3],
      [0.85, r * 0.9 + bell * 0.8, r * 0.88 + bell * 0.8],
      [1.0, r * 0.93 + bell, r * 0.92 + bell],
    ] as [number, number, number][]
  )
    .filter(([t]) => t <= end + 1e-6)
    .concat(end < 1 ? [[end, r * 0.96 + 0.006, r * 0.94 + 0.006]] : []);
}

/** Canvas helpers for a torso cell painted by height. */
export const axesY = (h: number, y0: number, y1: number) => (y: number) => ((y1 - y) / (y1 - y0)) * h;

export function checker(
  g: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  w: number,
  h: number,
  size: number,
  a: string,
  b: string,
) {
  g.fillStyle = a;
  g.fillRect(x0, y0, w, h);
  g.fillStyle = b;
  for (let y = 0; y < h; y += size)
    for (let x = ((y / size) % 2) * size; x < w; x += size * 2)
      g.fillRect(x0 + x, y0 + y, Math.min(size, w - x), Math.min(size, h - y));
}

/** Woven check (sarong): stripes of `line` over `base` in both directions, with darker crossings. */
export function plaid(g: CanvasRenderingContext2D, w: number, h: number, size: number, base: string, line: string) {
  g.fillStyle = base;
  g.fillRect(0, 0, w, h);
  g.fillStyle = line;
  g.globalAlpha = 0.55;
  for (let x = 0; x < w; x += size) g.fillRect(x, 0, size * 0.35, h);
  for (let y = 0; y < h; y += size) g.fillRect(0, y, w, size * 0.35);
  g.globalAlpha = 1;
}

/** Horizontal zigzag bands of two colours (chevron trousers). */
export function zigzag(
  g: CanvasRenderingContext2D,
  w: number,
  h: number,
  n: number,
  rows: number,
  a: string,
  b: string,
) {
  g.fillStyle = a;
  g.fillRect(0, 0, w, h);
  g.fillStyle = b;
  const step = w / n,
    band = h / rows;
  for (let r = 0; r < rows; r++) {
    const y = r * band;
    g.beginPath();
    g.moveTo(0, y + band * 0.5);
    for (let i = 0; i <= n; i++) {
      g.lineTo(i * step + step / 2, y);
      g.lineTo((i + 1) * step, y + band * 0.5);
    }
    g.lineTo(w, y + band);
    for (let i = n; i >= 0; i--) {
      g.lineTo(i * step + step / 2, y + band * 0.5);
      g.lineTo(i * step, y + band);
    }
    g.closePath();
    g.fill();
  }
}
