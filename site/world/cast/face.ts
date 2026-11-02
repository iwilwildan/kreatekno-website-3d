// Painted face features (brows, mouth, blush, beard) on the front of the head, so expressions change by
// redrawing one atlas cell. The cell maps the head's front planar projection: x0..x1 left to right, y1 (top)
// to y0, in head space metres. Eyes and nose are geometry (see body.ts).
import type { Draw } from "./atlas";

export type Brow = { y: number; x: number; w: number; thick: number; tilt?: number; arch?: number };
export type Expression = {
  /** Inner ends of the brows up (+, worried) or down (−, cross), radians. */
  browTilt?: number;
  /** Brows raised (+) or lowered (−), metres. */
  browLift?: number;
  /** −1 frown … 0 flat … 1 smile. */
  smile?: number;
  /** 0 closed … 1 open. */
  open?: number;
  /** Mouth shifted sideways (metres), for a lopsided worry. */
  mouthShift?: number;
};
export type FaceSpec = {
  box: { x0: number; x1: number; y0: number; y1: number };
  skin: string;
  blush?: string;
  brow: Brow & { color: string };
  mouth: { y: number; w: number; color: string; lip?: string };
  beard?: { color: string; mustache?: boolean; chin?: { y: number; w: number; h: number }; stubble?: number };
  /** Extra painting on top (freckles, a mole), in face px. */
  extra?: Draw;
};

export function drawFace(f: FaceSpec, e: Expression = {}): Draw {
  return (g, w, h) => {
    const { x0, x1, y0, y1 } = f.box,
      px = (x: number) => ((x - x0) / (x1 - x0)) * w,
      py = (y: number) => ((y1 - y) / (y1 - y0)) * h,
      m = w / (x1 - x0); // px per metre
    g.fillStyle = f.skin;
    g.fillRect(0, 0, w, h);
    // cheeks
    if (f.blush)
      for (const s of [-1, 1]) {
        const cx = px(s * f.brow.x * 1.05),
          cy = py(f.mouth.y + 0.035),
          r = 0.042 * m;
        const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
        gr.addColorStop(0, f.blush);
        gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr;
        g.fillRect(cx - r, cy - r, r * 2, r * 2);
      }
    // beard: stubble dots, denser in the core of each patch
    if (f.beard) {
      const b = f.beard,
        dots = (cx: number, cy: number, rx: number, ry: number, n: number) => {
          let s = Math.round(cx * 7 + cy * 13);
          const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
          const base = g.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
          base.addColorStop(0, b.color);
          base.addColorStop(1, "rgba(0,0,0,0)");
          g.save();
          g.globalAlpha = (b.stubble ?? 0.5) * 0.55;
          g.translate(cx, cy);
          g.scale(rx / Math.max(rx, ry), ry / Math.max(rx, ry));
          g.translate(-cx, -cy);
          g.fillStyle = base;
          g.fillRect(cx - Math.max(rx, ry), cy - Math.max(rx, ry), Math.max(rx, ry) * 2, Math.max(rx, ry) * 2);
          g.restore();
          g.fillStyle = b.color;
          for (let i = 0; i < n * 2; i++) {
            const a = r() * Math.PI * 2,
              d = Math.sqrt(r());
            g.globalAlpha = (b.stubble ?? 0.5) * (1 - d * 0.75) * 0.8;
            g.fillRect(cx + Math.cos(a) * d * rx, cy + Math.sin(a) * d * ry, 0.0011 * m, 0.0016 * m);
          }
          g.globalAlpha = 1;
        };
      if (b.mustache) {
        const my = f.mouth.y + 0.017;
        for (const s of [-1, 1]) dots(px(s * f.mouth.w * 0.3), py(my), f.mouth.w * 0.3 * m, 0.0065 * m, 260);
      }
      if (b.chin) dots(px(0), py(b.chin.y), b.chin.w * 0.5 * m, b.chin.h * 0.5 * m, 700);
    }
    // mouth: a soft crescent that bends with the smile
    {
      const s = e.smile ?? 0.35,
        open = e.open ?? 0,
        mw = f.mouth.w * (1 - 0.15 * Math.max(0, -s)),
        cx = px(e.mouthShift ?? 0),
        cy = py(f.mouth.y),
        hw = (mw / 2) * m,
        bend = s * 0.012 * m,
        thick = (0.0075 + open * 0.02) * m;
      g.fillStyle = f.mouth.color;
      g.beginPath();
      g.moveTo(cx - hw, cy - bend * 0.6);
      g.quadraticCurveTo(cx, cy + bend - thick * 0.3, cx + hw, cy - bend * 0.6);
      g.quadraticCurveTo(cx, cy + bend + thick, cx - hw, cy - bend * 0.6);
      g.fill();
      if (f.mouth.lip && open < 0.3) {
        g.strokeStyle = f.mouth.lip;
        g.globalAlpha = 0.5;
        g.lineWidth = 0.004 * m;
        g.lineCap = "round";
        g.beginPath();
        g.moveTo(cx - hw * 0.5, cy + bend * 0.8 + thick * 1.1);
        g.quadraticCurveTo(cx, cy + bend * 1.1 + thick * 1.7, cx + hw * 0.5, cy + bend * 0.8 + thick * 1.1);
        g.stroke();
        g.globalAlpha = 1;
      }
    }
    // brows: thick rounded strokes; tilt lifts the inner ends
    {
      const b = f.brow,
        tilt = (b.tilt ?? 0) + (e.browTilt ?? 0),
        lift = e.browLift ?? 0;
      g.strokeStyle = b.color;
      g.lineCap = "round";
      g.lineWidth = b.thick * m;
      for (const s of [-1, 1]) {
        const cx = px(s * b.x),
          cy = py(b.y + lift),
          hw = (b.w / 2) * m,
          dy = Math.sin(tilt) * hw,
          arch = (b.arch ?? 0.004) * m;
        // inner end (towards the nose) is at -s
        const ix = cx - s * hw,
          ox = cx + s * hw;
        g.beginPath();
        g.moveTo(ix, cy - dy);
        g.quadraticCurveTo(cx, cy - arch * 2, ox, cy + dy * 0.6);
        g.stroke();
      }
    }
    f.extra?.(g, w, h);
  };
}
