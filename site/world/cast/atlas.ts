// Two textures per character, sharing one layout: colour, and roughness (grey, at half resolution) used as the
// material's roughnessMap. Cells are packed in rows; both canvases are uploaded as they are (no read-back, which
// is slow on phones). Cells can be redrawn later (the face, for expressions).
import * as THREE from "three";

export type Draw = (g: CanvasRenderingContext2D, w: number, h: number) => void;
export type Cell = { x: number; y: number; w: number; h: number; draw: Draw; rough: number | Draw };
/** Maps a part's own uv (0..1) into its cell. */
export type UvMap = (u: number, v: number) => [number, number];

const PAD = 4;
/** Roughness varies slowly: its canvas is drawn at this fraction of the colour canvas. */
const ROUGH_SCALE = 0.5;

export class Atlas {
  readonly texture: THREE.CanvasTexture;
  readonly roughness: THREE.CanvasTexture;
  private cx = PAD;
  private cy = PAD;
  private rowH = 0;
  private cells: Cell[] = [];
  private cg: CanvasRenderingContext2D;
  private rg: CanvasRenderingContext2D;

  /** `scale` shrinks every cell (saver mode uses half-size atlases); draw functions get the scaled size. */
  constructor(
    readonly W: number,
    readonly H: number,
    readonly scale = 1,
  ) {
    this.W = W = Math.round(W * scale);
    this.H = H = Math.round(H * scale);
    const color = document.createElement("canvas"),
      rough = document.createElement("canvas");
    color.width = W;
    color.height = H;
    rough.width = Math.round(W * ROUGH_SCALE);
    rough.height = Math.round(H * ROUGH_SCALE);
    this.cg = color.getContext("2d")!;
    this.rg = rough.getContext("2d")!;
    this.texture = new THREE.CanvasTexture(color);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
    this.roughness = new THREE.CanvasTexture(rough);
  }

  /** Reserves a w × h px cell drawn by `draw`; roughness is a constant or its own drawing (grey = roughness). */
  cell(w: number, h: number, draw: Draw, rough: number | Draw = 0.8): Cell {
    w = Math.max(4, Math.round(w * this.scale));
    h = Math.max(4, Math.round(h * this.scale));
    if (this.cx + w + PAD > this.W) {
      this.cx = PAD;
      this.cy += this.rowH + PAD * 2;
      this.rowH = 0;
    }
    if (this.cy + h + PAD > this.H) throw new Error("atlas full");
    const c = { x: this.cx, y: this.cy, w, h, draw, rough };
    this.cx += w + PAD * 2;
    this.rowH = Math.max(this.rowH, h);
    this.cells.push(c);
    return c;
  }

  /** A flat colour (and roughness). */
  swatch(hex: string, rough = 0.8) {
    return this.cell(
      8 / this.scale,
      8 / this.scale,
      (g, w, h) => {
        g.fillStyle = hex;
        g.fillRect(0, 0, w, h);
      },
      rough,
    );
  }

  /** uv of a part mapped into the cell (v = 1 at the top of the cell); `flat` puts every vertex in its centre. */
  uv(c: Cell, flat = false): UvMap {
    const { W, H } = this;
    if (flat) {
      const u = (c.x + c.w / 2) / W,
        v = 1 - (c.y + c.h / 2) / H;
      return () => [u, v];
    }
    return (u, v) => [(c.x + 0.5 + u * (c.w - 1)) / W, 1 - (c.y + 0.5 + (1 - v) * (c.h - 1)) / H];
  }

  private paint(c: Cell, color = true, rough = true) {
    const jobs: [CanvasRenderingContext2D, Draw, number][] = [];
    if (color) jobs.push([this.cg, c.draw, 1]);
    if (rough) jobs.push([this.rg, typeof c.rough === "number" ? grey(c.rough) : c.rough, ROUGH_SCALE]);
    for (const [g, fn, k] of jobs) {
      g.save();
      g.scale(k, k);
      // bleed the cell's edge colours into the padding so mipmaps do not pick up neighbours
      g.translate(c.x, c.y);
      g.beginPath();
      g.rect(-PAD, -PAD, c.w + PAD * 2, c.h + PAD * 2);
      g.clip();
      g.save();
      g.translate(-PAD, -PAD);
      g.scale((c.w + PAD * 2) / c.w, (c.h + PAD * 2) / c.h);
      fn(g, c.w, c.h);
      g.restore();
      g.beginPath();
      g.rect(0, 0, c.w, c.h);
      g.clip();
      g.clearRect(0, 0, c.w, c.h);
      fn(g, c.w, c.h);
      g.restore();
    }
  }

  build() {
    for (const c of this.cells) this.paint(c);
    this.texture.needsUpdate = this.roughness.needsUpdate = true;
  }

  /** Redraws one cell's colour (e.g. a new expression) and uploads the texture again. */
  redraw(c: Cell, draw?: Draw) {
    if (draw) c.draw = draw;
    this.paint(c, true, false);
    this.texture.needsUpdate = true;
  }

  dispose() {
    this.texture.dispose();
    this.roughness.dispose();
  }
}

const grey =
  (r: number): Draw =>
  (g, w, h) => {
    const v = Math.round(Math.max(0, Math.min(1, r)) * 255);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(0, 0, w, h);
  };

/** Speckle tile shared by every weave: light and dark flecks on transparent, drawn once. */
let tile: HTMLCanvasElement | null = null;
function speckle() {
  if (tile) return tile;
  tile = document.createElement("canvas");
  tile.width = tile.height = 64;
  const g = tile.getContext("2d")!,
    img = g.createImageData(64, 64);
  let s = 12345;
  const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  for (let i = 0; i < 64 * 64; i++) {
    const v = r(),
      light = v < 0.5;
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = light ? 255 : 0;
    img.data[i * 4 + 3] = Math.round(r() * r() * 255);
  }
  g.putImageData(img, 0, 0);
  return tile;
}

/** Soft woven noise over a fill, so cloth does not read as flat plastic. */
export function weave(g: CanvasRenderingContext2D, w: number, h: number, hex: string, amount = 0.06, seed = 1) {
  g.fillStyle = hex;
  g.fillRect(0, 0, w, h);
  g.save();
  g.globalAlpha = Math.min(1, amount * 1.2);
  g.translate(-seed * 17, -seed * 29);
  g.fillStyle = g.createPattern(speckle(), "repeat")!;
  g.fillRect(seed * 17, seed * 29, w, h);
  g.restore();
}
