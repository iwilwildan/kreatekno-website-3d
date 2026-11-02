// Bayu (staff): 1.68 m, short neat black hair with a side part, round glasses, a pencil behind his right ear,
// brown baju koko with a band collar, yellow check sarong at the waist, brown trousers, black shoes.
// Measured on refs/KARKATER/BAYU.png.
import * as THREE from "three";
import { G, mtx } from "../core/kit";
import { weave } from "./atlas";
import { faceZAt, SIDES } from "./body";
import { HERU } from "./heru";
import { loft } from "./loft";
import { buildMember, frontU, type MemberSpec } from "./member";
import { intersect, sd, subtract, union, type Sdf } from "./sdf";
import { axesY, plaid, shirtRings, sleeveRings } from "./wardrobe";

const P = {
  skin: "#d9926b",
  hair: "#2e2c31",
  shirt: "#4d3134",
  shirtDark: "#352023",
  sarong: "#e8d4a2",
  sarongLine: "#c79a3c",
  trousers: "#4b302f",
  shoe: "#2f2d31",
  frame: "#3a2724",
  pencil: "#e9b62a",
  eraser: "#e98a9a",
  wood: "#e6c49a",
  brow: "#2a2020",
  lip: "#9a5040",
};

/** Short hair: a cap over the skull, side part on his right, cut above the ears and short at the nape. */
function hairSdf(): Sdf {
  const cap = sd.ellipsoid([0, 1.6, -0.015], [0.185, 0.21, 0.195]);
  const swoop = sd.ellipsoid([0.035, 1.735, 0.08], [0.125, 0.055, 0.085]);
  let f: Sdf = union(0.03, cap, swoop);
  // hairline: forehead and temples
  f = subtract(0.025, f, sd.roundBox([0, 1.5, 0.19], [0.14, 0.17, 0.16], 0.07));
  // short back and sides: down to the nape behind, rising toward the front above the ears
  f = intersect(0.02, f, (_x, y, z) => 1.46 + Math.max(0, z + 0.05) * 1.2 - y);
  f = subtract(0.012, f, (x, y, z) =>
    Math.min(
      sd.ellipsoid([0.15, 1.522, -0.008], [0.04, 0.06, 0.045])(x, y, z),
      sd.ellipsoid([-0.15, 1.522, -0.008], [0.04, 0.06, 0.045])(x, y, z),
    ),
  );
  // the part line
  f = subtract(0.006, f, sd.capsule([-0.06, 1.79, 0.11], [-0.07, 1.8, -0.06], 0.004));
  return f;
}

export const BAYU: MemberSpec = {
  name: "bayu",
  height: 1.68,
  body: { ...HERU, shoulder: [0.176, 1.235, 0] },
  skin: P.skin,
  face: {
    skin: P.skin,
    blush: "rgba(214,110,92,0.24)",
    brow: { y: 1.612, x: 0.076, w: 0.07, thick: 0.016, tilt: -0.02, arch: 0.003, color: P.brow },
    mouth: { y: 1.452, w: 0.09, color: P.lip, lip: "#c47c66" },
  },
  dress(c) {
    const { fig, b } = c;
    c.soft(
      hairSdf(),
      [-0.24, 1.42, -0.25],
      [0.24, 1.83, 0.23],
      [24, 18],
      c.cell(128, 128, (g, w, h) => weave(g, w, h, P.hair, 0.03, 31), 0.55),
    );
    // ---------- round glasses, pencil ----------
    const frame = c.swatch(P.frame, 0.3);
    for (const [, s] of SIDES) {
      const z = faceZAt(b, b.eye.x) + 0.018;
      fig.add(
        new THREE.TorusGeometry(0.037, 0.0045, 6, 20).applyMatrix4(mtx([s * b.eye.x, b.eye.y, z])),
        frame,
        "head",
      );
      // temple arm back to the ear
      fig.add(
        G.box(0.004, 0.005, 0.15).applyMatrix4(mtx([s * 0.142, b.eye.y + 0.008, z - 0.075], [0, s * 0.12, 0])),
        frame,
        "head",
      );
    }
    fig.add(G.box(0.03, 0.005, 0.005).applyMatrix4(mtx([0, b.eye.y + 0.012, faceZAt(b, 0) + 0.018])), frame, "head");
    {
      // resting on his right ear (−x), pointing forward and a little up
      const at = mtx([-0.194, 1.585, 0.0], [Math.PI / 2 - 0.35, 0, 0.12]);
      fig.add(G.cyl(0.008, 0.008, 0.11, 6).applyMatrix4(at), c.swatch(P.pencil, 0.5), "head");
      fig.add(
        G.cyl(0.008, 0.008, 0.018, 6)
          .applyMatrix4(mtx([0, -0.064, 0]))
          .applyMatrix4(at),
        c.swatch(P.eraser, 0.6),
        "head",
      );
      fig.add(
        G.cyl(0.001, 0.008, 0.024, 6)
          .applyMatrix4(mtx([0, 0.067, 0]))
          .applyMatrix4(at),
        c.swatch(P.wood, 0.7),
        "head",
      );
    }
    // ---------- baju koko ----------
    const Y = { y0: 0.7, y1: 1.335 };
    const shirt = (g: CanvasRenderingContext2D, w: number, h: number) => weave(g, w, h, P.shirt, 0.05, 32);
    c.torso(
      shirtRings(Y.y0),
      c.cell(512, 256, (g, w, h) => {
        const fx = frontU(w, 0.185),
          fy = axesY(h, Y.y0, Y.y1);
        shirt(g, w, h);
        // placket from the collar to the chest
        g.fillStyle = P.shirtDark;
        g.fillRect(fx(0.012), fy(1.335), 2, fy(1.12) - fy(1.335));
        g.fillRect(fx(-0.012), fy(1.335), 2, fy(1.12) - fy(1.335));
        g.fillRect(fx(0.012), fy(1.12), fx(-0.012) - fx(0.012), 2);
      }),
      [Y.y0, Y.y1],
    );
    // band collar
    fig.add(
      loft(
        [
          { y: 1.315, rx: 0.08, rz: 0.075 },
          { y: 1.36, rx: 0.074, rz: 0.069 },
        ],
        20,
        { caps: false },
      ),
      c.swatch(P.shirt, 0.8),
      "chest",
    );
    c.arms(sleeveRings(0.06), c.cell(128, 128, shirt, 0.82));
    // ---------- sarong over the hips, rolled at the waist ----------
    const S = { y0: 0.62, y1: 0.97 };
    fig.add(
      loft(
        [
          { y: S.y0, rx: 0.215, rz: 0.15 },
          { y: 0.8, rx: 0.205, rz: 0.142 },
          { y: 0.93, rx: 0.19, rz: 0.13 },
          { y: 0.945, rx: 0.2, rz: 0.138 },
          { y: S.y1, rx: 0.192, rz: 0.13 },
        ].map((r) => ({ ...r, z: 0.004, p: 2.6 })),
        c.seg(28, 20),
      ),
      c.cell(
        256,
        128,
        (g, w, h) => {
          plaid(g, w, h, Math.round(w / 18), P.sarong, P.sarongLine);
          // the rolled band at the top
          const fy = axesY(h, S.y0, S.y1);
          g.fillStyle = "rgba(120,80,20,0.3)";
          g.fillRect(0, fy(0.93), w, 3);
        },
        0.85,
      ),
      "hips",
    );
    // ---------- trousers, shoes ----------
    c.legs(
      [
        [0, 0.086, 0.09],
        [0.5, 0.082, 0.086],
        [1, 0.08, 0.084],
      ],
      c.cell(128, 128, (g, w, h) => weave(g, w, h, P.trousers, 0.04, 33), 0.86),
    );
    c.shoes(0.29, 0.16, 0.11, c.swatch(P.shoe, 0.35));
  },
};

export const buildBayu = (opts: { saver?: boolean } = {}) => buildMember(BAYU, opts);
