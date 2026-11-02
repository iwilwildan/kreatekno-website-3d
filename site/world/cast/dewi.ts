// Bu Dewi (owner of COMPANY): 1.60 m, terracotta hijab over the shoulders, pointed at the back; cream A-line
// tunic with an orange motif at the hem and cuffs, orange flower brooch, wide brown culottes, brown flats.
// Measured on refs/KARKATER/BUK DEWI.png; modelled in the 1.8 m reference space (member.ts).
import * as THREE from "three";
import { weave } from "./atlas";
import { ellipsoid, type Body } from "./body";
import { HERU } from "./heru";
import { hijab, hijabHem } from "./headwear";
import { buildMember, frontU, type MemberSpec } from "./member";

const P = {
  skin: "#c58463",
  hijab: "#b0583c",
  hijabDark: "#8f4530",
  undercap: "#6b3426",
  tunic: "#e7d6c4",
  motif: "#d9762f",
  motifDark: "#a9521f",
  culottes: "#5e3629",
  shoe: "#7e4a35",
  brow: "#5e3b2e",
  lip: "#b4584a",
};

const BODY: Body = {
  ...HERU,
  headRx: 0.15,
  shoulder: [0.172, 1.228, 0],
  elbow: [0.245, 0.99, -0.01],
  wrist: [0.285, 0.74, 0.01],
  hip: [0.11, 0.74, 0],
  knee: [0.11, 0.43, 0.005],
  ankle: [0.11, 0.1, -0.01],
  hand: { len: 0.165, w: 0.088 },
};

/** Motif band: a row of small orange triangles between two lines, as on the tunic hem and cuffs. */
function motifBand(g: CanvasRenderingContext2D, w: number, y0: number, y1: number, n: number) {
  g.fillStyle = P.motif;
  g.fillRect(0, y0, w, y1 - y0);
  g.fillStyle = P.motifDark;
  g.fillRect(0, y0, w, 2);
  g.fillRect(0, y1 - 2, w, 2);
  g.fillStyle = "#f2c48e";
  const step = w / n,
    h = (y1 - y0) * 0.55,
    mid = (y0 + y1) / 2;
  for (let i = 0; i < n; i++) {
    const x = i * step;
    g.beginPath();
    g.moveTo(x, mid + h / 2);
    g.lineTo(x + step / 2, mid - h / 2);
    g.lineTo(x + step, mid + h / 2);
    g.closePath();
    g.fill();
  }
}

const HEM = hijabHem({ front: 1.268, side: 1.16, back: 1.04 });
export const DEWI: MemberSpec = {
  name: "dewi",
  extraJoints: HEM.joints,
  springs: HEM.springs,
  colliders: HEM.colliders,
  height: 1.6,
  head: 1.06,
  body: BODY,
  skin: P.skin,
  ears: false,
  neck: false,
  face: {
    skin: P.skin,
    blush: "rgba(222,110,96,0.3)",
    brow: { y: 1.61, x: 0.074, w: 0.07, thick: 0.009, tilt: 0.02, arch: 0.007, color: P.brow },
    mouth: { y: 1.452, w: 0.082, color: P.lip, lip: "#d0806e" },
    // the brown under-cap shows as a band at the top of the hijab opening
    extra: (g, w, h) => {
      const py = (y: number) => ((1.78 - y) / 0.41) * h;
      g.fillStyle = P.undercap;
      g.fillRect(0, 0, w, py(1.648));
    },
  },
  dress(c) {
    const { fig } = c;
    const fabric = (hex: string, seed: number) => (g: CanvasRenderingContext2D, w: number, h: number) =>
      weave(g, w, h, hex, 0.05, seed);
    c.soft(
      hijab({ front: 1.268, side: 1.16, back: 1.04 }),
      [-0.27, 0.98, -0.27],
      [0.27, 1.84, 0.27],
      [26, 20],
      c.cell(128, 128, fabric(P.hijab, 11), 0.82),
      // the hood turns with the head, the cape stays on the shoulders
      // below the shoulders the cape sways a little on the hem springs
      fig.hem(
        fig.chain(
          [
            ["chest", [0, 1.2, 0]],
            ["head", [0, 1.4, 0]],
          ],
          0.08,
        ),
        HEM.bones,
        1.28,
        1.1,
      ),
    );
    // ---------- tunic ----------
    const Y = { y0: 0.486, y1: 1.335 };
    c.torso(
      [
        [0.486, 0.232, 0.162],
        [0.55, 0.224, 0.158],
        [0.7, 0.206, 0.146],
        [0.85, 0.19, 0.134],
        [0.95, 0.182, 0.126],
        [1.06, 0.188, 0.128],
        [1.15, 0.19, 0.126],
        [1.2, 0.19, 0.124],
        [1.25, 0.184, 0.118],
        [1.28, 0.165, 0.105],
        [1.305, 0.13, 0.093],
        [1.325, 0.09, 0.08],
        [1.335, 0.075, 0.07],
      ],
      c.cell(512, 256, (g, w, h) => {
        const fx = frontU(w, 0.19),
          fy = (y: number) => ((Y.y1 - y) / (Y.y1 - Y.y0)) * h;
        weave(g, w, h, P.tunic, 0.05, 12);
        // front seam and the hem band
        g.fillStyle = "rgba(120,90,60,0.25)";
        g.fillRect(fx(0) - 1, fy(1.3), 2, fy(0.95) - fy(1.3));
        motifBand(g, w, fy(0.535), fy(0.49), 40);
      }),
      [Y.y0, Y.y1],
    );
    c.arms(
      [
        [-0.04, 0.001, 0.001],
        [-0.035, 0.028, 0.027],
        [-0.018, 0.048, 0.046],
        [0, 0.058, 0.056],
        [0.3, 0.056, 0.054],
        [0.55, 0.053, 0.052],
        [0.85, 0.052, 0.051],
        [1.0, 0.054, 0.053],
      ],
      c.cell(
        256,
        128,
        (g, w, h) => {
          weave(g, w, h, P.tunic, 0.05, 13);
          motifBand(g, w, h * 0.88, h * 0.98, 16);
        },
        0.82,
      ),
    );
    // ---------- culottes, flats ----------
    const culottes = c.cell(128, 128, fabric(P.culottes, 14), 0.86);
    c.legs(
      [
        [0, 0.108, 0.11],
        [0.4, 0.112, 0.114],
        [1, 0.118, 0.12],
      ],
      culottes,
      { top: 0.62, hem: 0.105 },
    );
    c.shoes(0.25, 0.14, 0.085, c.swatch(P.shoe, 0.5));
    // ---------- brooch: five orange petals on the tunic, below the hijab ----------
    const petal = c.swatch(P.motif, 0.4),
      heart = c.swatch(P.motifDark, 0.4);
    const at = new THREE.Vector3(0.096, 1.19, 0.135);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
      fig.add(
        ellipsoid(
          [0.012, 0.03, 0.007],
          [at.x + Math.cos(a) * 0.025, at.y + Math.sin(a) * 0.025, at.z],
          [0, 0, a - Math.PI / 2],
          8,
        ),
        petal,
        "chest",
      );
    }
    fig.add(ellipsoid([0.011, 0.011, 0.008], [at.x, at.y, at.z + 0.005], [0, 0, 0], 8), heart, "chest");
  },
};

export const buildDewi = (opts: { saver?: boolean } = {}) => buildMember(DEWI, opts);
