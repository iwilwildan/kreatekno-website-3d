// Fajar (staff): 1.70 m to the top of his head wrap, olive wrapped headcloth with a gold band and a pointed
// knot on top, short black hair below it, olive short-sleeved shirt with a collar, cream joggers cuffed at the
// ankle, olive shoes. Measured on refs/KARKATER/FAJAR.png.
import { weave } from "./atlas";
import { HERU } from "./heru";
import { loft } from "./loft";
import { buildMember, frontU, type MemberSpec } from "./member";
import { intersect, sd, subtract, union, type Sdf } from "./sdf";
import { axesY, shirtRings, sleeveRings } from "./wardrobe";

const P = {
  skin: "#b77758",
  hair: "#29272c",
  wrap: "#7d7a5a",
  wrapDark: "#5e5c42",
  gold: "#cfa94a",
  shirt: "#787a58",
  shirtDark: "#5a5c40",
  joggers: "#e8dccd",
  shoe: "#7f7d58",
  sole: "#6a6849",
  brow: "#26201f",
  lip: "#97503f",
};

/** Head wrap: a rounded drum from the brow up, folds running round it, and a pointed knot on top. */
function wrapSdf(): Sdf {
  const drum = intersect(0.02, sd.ellipsoid([0, 1.7, -0.012], [0.198, 0.15, 0.203]), (_x, y) => 1.63 - y);
  // the knot: a short twisted point, leaning back
  const knot = union(
    0.02,
    sd.ellipsoid([0, 1.815, -0.01], [0.06, 0.035, 0.06]),
    sd.capsule([0, 1.83, -0.01], [0.005, 1.875, -0.035], 0.018),
  );
  const f = union(0.035, drum, knot);
  // folds crossing diagonally over the front, as the cloth was wound
  return (x, y, z) => {
    const a = Math.atan2(x, z);
    return (
      f(x, y, z) + 0.006 * Math.abs(Math.sin(a * 1.5 + (y - 1.63) * 28)) * Math.max(0, Math.min(1, (1.82 - y) / 0.05))
    );
  };
}

/** Short hair showing below the wrap at the sides and the nape. */
function hairSdf(): Sdf {
  let f: Sdf = sd.ellipsoid([0, 1.6, -0.018], [0.18, 0.2, 0.188]);
  f = subtract(0.02, f, sd.roundBox([0, 1.5, 0.2], [0.14, 0.17, 0.16], 0.07));
  f = intersect(0.02, f, (_x, y, z) => 1.5 + Math.max(0, z) * 0.6 - y);
  return f;
}

export const FAJAR: MemberSpec = {
  name: "fajar",
  height: 1.7,
  body: { ...HERU, shoulder: [0.178, 1.235, 0] },
  skin: P.skin,
  face: {
    skin: P.skin,
    blush: "rgba(200,100,84,0.22)",
    brow: { y: 1.61, x: 0.077, w: 0.07, thick: 0.016, tilt: -0.03, arch: 0.004, color: P.brow },
    mouth: { y: 1.452, w: 0.09, color: P.lip, lip: "#c07a64" },
  },
  dress(c) {
    const { fig } = c;
    c.soft(hairSdf(), [-0.22, 1.42, -0.23], [0.22, 1.7, 0.2], [20, 16], c.swatch(P.hair, 0.55));
    c.soft(
      wrapSdf(),
      [-0.24, 1.6, -0.25],
      [0.24, 1.92, 0.25],
      [24, 18],
      c.cell(
        128,
        128,
        (g, w, h) => {
          weave(g, w, h, P.wrap, 0.05, 51);
          // fold shadows
          g.fillStyle = "rgba(40,40,20,0.25)";
          for (let k = 0; k < 6; k++) g.fillRect(0, (h * (k + 0.5)) / 6, w, 2);
        },
        0.85,
      ),
    );
    // gold band round the brow of the wrap
    fig.add(
      loft(
        [
          { y: 1.632, rx: 0.2, rz: 0.205, z: -0.012 },
          { y: 1.648, rx: 0.202, rz: 0.207, z: -0.012 },
          { y: 1.662, rx: 0.2, rz: 0.205, z: -0.012 },
        ],
        28,
        { caps: false },
      ),
      c.swatch(P.gold, 0.3),
      "head",
    );
    // ---------- shirt ----------
    const Y = { y0: 0.72, y1: 1.335 };
    const shirt = (g: CanvasRenderingContext2D, w: number, h: number) => weave(g, w, h, P.shirt, 0.05, 52);
    c.torso(
      shirtRings(Y.y0),
      c.cell(512, 256, (g, w, h) => {
        const fx = frontU(w, 0.185),
          fy = axesY(h, Y.y0, Y.y1);
        shirt(g, w, h);
        g.fillStyle = P.shirtDark;
        g.fillRect(fx(0.013), fy(1.335), 2, fy(1.1) - fy(1.335));
        g.fillRect(fx(-0.013), fy(1.335), 2, fy(1.1) - fy(1.335));
        g.fillRect(fx(0.013), fy(1.1), fx(-0.013) - fx(0.013), 2);
      }),
      [Y.y0, Y.y1],
    );
    // shirt collar
    fig.add(
      loft(
        [
          { y: 1.31, rx: 0.084, rz: 0.079 },
          { y: 1.355, rx: 0.08, rz: 0.075 },
        ],
        20,
        { caps: false },
      ),
      c.swatch(P.shirt, 0.8),
      "chest",
    );
    c.arms(sleeveRings(0.064, { end: 0.42 }), c.cell(128, 128, shirt, 0.82), { end: 0.42 });
    // ---------- joggers, shoes ----------
    c.legs(
      [
        [0, 0.09, 0.094],
        [0.5, 0.086, 0.09],
        [0.9, 0.07, 0.072],
        [0.93, 0.074, 0.076],
        [1, 0.072, 0.074],
      ],
      c.cell(
        128,
        128,
        (g, w, h) => {
          weave(g, w, h, P.joggers, 0.035, 53);
          // ribbed cuff
          g.fillStyle = "rgba(120,100,80,0.25)";
          for (let x = 0; x < w; x += 4) g.fillRect(x, h * 0.9, 1, h * 0.1);
        },
        0.88,
      ),
    );
    c.shoes(
      0.29,
      0.16,
      0.12,
      c.cell(
        64,
        64,
        (g, w, h) => {
          g.fillStyle = P.shoe;
          g.fillRect(0, 0, w, h);
          g.fillStyle = P.sole;
          g.fillRect(w * 0.36, 0, w * 0.28, h);
        },
        0.65,
      ),
    );
  },
};

export const buildFajar = (opts: { saver?: boolean } = {}) => buildMember(FAJAR, opts);
