// Sinta (staff): 1.58 m, mustard hijab over the shoulders, brown-and-yellow check vest with a yellow chat-bubble
// pin over a white shirt with rolled cuffs, brown trousers, yellow flats. Measured on refs/KARKATER/SINTA.png.
import { weave } from "./atlas";
import { ellipsoid } from "./body";
import { hijab, hijabHem } from "./headwear";
import { buildMember, frontU, type MemberSpec } from "./member";
import { axesY, checker, shirtRings, sleeveRings, WOMAN } from "./wardrobe";

const P = {
  skin: "#f0c09f",
  hijab: "#dba84c",
  undercap: "#c08a38",
  shirt: "#f1eef2",
  vestA: "#dcaa4e",
  vestB: "#8b5b38",
  trousers: "#a3705e",
  shoe: "#f2bf3e",
  pin: "#f8cf4a",
  brow: "#a8775a",
  lip: "#c46a5c",
};

const HEM = hijabHem({ front: 1.27, side: 1.25, back: 1.21 });
export const SINTA: MemberSpec = {
  name: "sinta",
  extraJoints: HEM.joints,
  springs: HEM.springs,
  colliders: HEM.colliders,
  height: 1.58,
  body: { ...WOMAN, headRx: 0.152, hip: [0.1, 0.74, 0], knee: [0.1, 0.43, 0.005], ankle: [0.1, 0.1, -0.01] },
  skin: P.skin,
  ears: false,
  neck: false,
  face: {
    skin: P.skin,
    blush: "rgba(232,118,108,0.38)",
    brow: { y: 1.612, x: 0.074, w: 0.066, thick: 0.008, tilt: 0.03, arch: 0.007, color: P.brow },
    mouth: { y: 1.452, w: 0.08, color: P.lip, lip: "#e19a8a" },
    extra: (g, w, h) => {
      const py = axesY(h, 1.37, 1.78);
      g.fillStyle = P.undercap;
      g.fillRect(0, 0, w, py(1.652));
    },
  },
  dress(c) {
    const { fig } = c;
    c.soft(
      hijab({ front: 1.27, side: 1.25, back: 1.21, width: 0.2 }),
      [-0.26, 1.15, -0.26],
      [0.26, 1.84, 0.26],
      [26, 20],
      c.cell(128, 128, (g, w, h) => weave(g, w, h, P.hijab, 0.05, 21), 0.82),
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
        1.22,
      ),
    );
    // ---------- shirt under a check vest ----------
    const Y = { y0: 0.78, y1: 1.335 };
    c.torso(
      shirtRings(Y.y0, { w: 0.97 }),
      c.cell(512, 256, (g, w, h) => {
        const fx = frontU(w, 0.18),
          fy = axesY(h, Y.y0, Y.y1);
        weave(g, w, h, P.shirt, 0.03, 22);
        // vest: all round from its hem to the shoulders, open over the shirt's placket in front
        const top = fy(1.335),
          hem = fy(0.87);
        checker(g, 0, top, w, hem - top, Math.round(w / 34), P.vestA, P.vestB);
        g.fillStyle = P.shirt;
        g.beginPath();
        g.moveTo(fx(0.065), top);
        g.lineTo(fx(0.045), hem);
        g.lineTo(fx(-0.045), hem);
        g.lineTo(fx(-0.065), top);
        g.fill();
        g.fillStyle = "rgba(90,60,40,0.35)";
        g.fillRect(fx(0.045) - 1, top, 2, hem - top);
        g.fillRect(fx(-0.045) - 1, top, 2, hem - top);
        g.fillStyle = "rgba(0,0,0,0.12)";
        g.fillRect(0, hem - 3, w, 3);
        // placket seam on the shirt
        g.fillStyle = "rgba(150,140,150,0.5)";
        g.fillRect(fx(0) - 1, top, 2, h - top);
      }),
      [Y.y0, Y.y1],
    );
    c.arms(
      sleeveRings(0.056),
      c.cell(
        256,
        128,
        (g, w, h) => {
          weave(g, w, h, P.shirt, 0.03, 23);
          // rolled cuff
          g.fillStyle = "rgba(160,150,160,0.5)";
          g.fillRect(0, h * 0.86, w, 2);
          g.fillRect(0, h * 0.94, w, 2);
        },
        0.85,
      ),
    );
    // rolled cuffs stand out a little
    c.arms(
      [
        [0.86, 0.06, 0.059],
        [0.9, 0.064, 0.063],
        [0.96, 0.061, 0.06],
      ],
      c.swatch(P.shirt, 0.85),
    );
    // ---------- trousers, flats ----------
    const trousers = c.cell(128, 128, (g, w, h) => weave(g, w, h, P.trousers, 0.04, 24), 0.86);
    c.legs(
      [
        [0, 0.092, 0.096],
        [0.5, 0.088, 0.092],
        [1, 0.088, 0.09],
      ],
      trousers,
      { top: 0.8, hem: 0.085 },
    );
    c.shoes(0.24, 0.135, 0.08, c.swatch(P.shoe, 0.45));
    // ---------- chat-bubble pin on the vest ----------
    const pin = c.swatch(P.pin, 0.4);
    fig.add(ellipsoid([0.05, 0.044, 0.011], [0.1, 1.17, 0.13], [0, 0.25, 0], 16), pin, "chest");
    fig.add(ellipsoid([0.014, 0.02, 0.008], [0.072, 1.13, 0.13], [0, 0.25, 0.6], 8), pin, "chest");
  },
};

export const buildSinta = (opts: { saver?: boolean } = {}) => buildMember(SINTA, opts);
