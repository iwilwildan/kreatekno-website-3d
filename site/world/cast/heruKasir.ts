// Heru in the Solutions-shop cashier uniform. His body, face, hair, trousers and shoes are shared with Home;
// only the white short-sleeve tee, cyan collar, purple apron and blank name badge differ.
import { G, mtx } from "../core/kit";
import { ribbon } from "./body";
import { HERU, HERU_COLLIDERS, HERU_HAIR_JOINTS, HERU_HAIR_SPRING_SPECS, heruFace, heruHair, heruLegs } from "./heru";
import { loft } from "./loft";
import { buildMember, type MemberSpec } from "./member";

const WHITE = "#f7f7ff";
const PURPLE = "#9f0ed6";
const PURPLE_DARK = "#7710a3";
const CYAN = "#35eafe";

export const HERU_KASIR_SPEC: MemberSpec = {
  name: "heruKasir",
  height: 1.8,
  body: HERU,
  skin: "#b8754f",
  face: heruFace(),
  extraJoints: HERU_HAIR_JOINTS,
  springs: HERU_HAIR_SPRING_SPECS,
  colliders: HERU_COLLIDERS,
  dress(c) {
    const { fig } = c;
    heruHair(c);

    const tee = c.swatch(WHITE, 0.84);
    c.torso(
      [
        [0.68, 0.187, 0.127],
        [0.78, 0.183, 0.124],
        [0.95, 0.178, 0.118],
        [1.12, 0.19, 0.126],
        [1.23, 0.2, 0.12],
        [1.29, 0.17, 0.105],
        [1.325, 0.1, 0.08],
        [1.34, 0.073, 0.068],
      ],
      tee,
      [0.68, 1.34],
    );
    c.arms(
      [
        [-0.04, 0.001, 0.001],
        [-0.035, 0.03, 0.029],
        [-0.018, 0.052, 0.05],
        [0, 0.064, 0.062],
        [0.24, 0.064, 0.062],
        [0.34, 0.06, 0.058],
      ],
      tee,
      { end: 0.34 },
    );

    // Cyan crew-neck ring. The open ends keep it clear of the neck mesh.
    fig.add(
      loft(
        [
          { y: 1.31, rx: 0.092, rz: 0.086, z: 0.002 },
          { y: 1.335, rx: 0.083, rz: 0.078, z: -0.003 },
        ],
        22,
        { caps: false },
      ),
      c.swatch(CYAN, 0.55),
      "chest",
    );

    const apron = c.swatch(PURPLE, 0.72);
    const trim = c.swatch(CYAN, 0.5);
    const apronWeights = fig.chain(
      [
        ["hips", [0, 0.78, 0]],
        ["spine", [0, 0.95, 0]],
        ["chest", [0, 1.12, 0]],
      ],
      0.14,
    );
    fig.add(G.rbox(0.34, 0.49, 0.018, 0.028).applyMatrix4(mtx([0, 0.96, 0.139])), apron, apronWeights);
    // Cyan edging, lifted a fraction in front to avoid z-fighting.
    for (const x of [-0.169, 0.169])
      fig.add(G.rbox(0.012, 0.475, 0.01, 0.005).applyMatrix4(mtx([x, 0.96, 0.151])), trim, apronWeights);
    fig.add(G.rbox(0.316, 0.012, 0.01, 0.005).applyMatrix4(mtx([0, 0.724, 0.151])), trim, apronWeights);

    // Neck and waist straps share the apron material.
    for (const x of [-0.11, 0.11])
      fig.add(
        ribbon(
          [
            [x * 0.56, 1.315, 0.045],
            [x, 1.23, 0.13],
            [x, 1.19, 0.145],
          ],
          0.024,
          0.008,
        ),
        apron,
        "chest",
      );
    fig.add(
      loft(
        [
          { y: 0.805, rx: 0.19, rz: 0.129, z: 0.004 },
          { y: 0.84, rx: 0.19, rz: 0.129, z: 0.004 },
        ],
        22,
      ),
      c.swatch(PURPLE_DARK, 0.72),
      "hips",
    );

    // Blank white badge on Heru's right chest.
    fig.add(
      G.rbox(0.09, 0.045, 0.009, 0.006).applyMatrix4(mtx([-0.102, 1.16, 0.159])),
      c.swatch("#ffffff", 0.38),
      "chest",
    );

    heruLegs(c);
  },
};

export const buildHeruKasir = (opts: { saver?: boolean } = {}) => buildMember(HERU_KASIR_SPEC, opts);
