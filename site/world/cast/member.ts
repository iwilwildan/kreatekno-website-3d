// Builds one cast member from a spec: the shared parts (rig, atlas, painted face, glossy eyes, nose, ears,
// neck, hands, material) plus the character's own clothes, hair and props from `dress`.
// Everyone is modelled in the space of the 1.8 m reference body (Heru, body.ts measures); a warp then scales
// the body to the character's height and the head less than the body, like the team's lineup where all heads
// are nearly the same size.
import * as THREE from "three";
import { lerp, mtx, type Vec3 } from "../core/kit";
import { Atlas, type Draw, type UvMap } from "./atlas";
import { ellipsoid, faceZAt, hand, headRings, joints, limb, shoe, SIDES, vByY, type Body } from "./body";
import { drawFace, type Expression, type FaceSpec } from "./face";
import { Figure, type Warp, type Weights } from "./figure";
import { loft } from "./loft";
import { Rig, type Joint } from "./rig";
import { sdfGeometry, type Sdf } from "./sdf";
import { Springs, type ColliderSpec, type SpringSpec } from "../motion/springs";
import { vinylMaterial } from "./vinyl";

/** Reference body: chin height and the height of the hair top, in modelling space. */
export const REF = { chin: 1.379, top: 1.8 };

/**
 * Warp from modelling space to a character `height` m tall (top of hair or headwear). The body below the chin
 * scales with the height; the head scales with its square root (times `head`); `width` widens the body.
 */
export function warpFor(height: number, { head = 1, width = 1 }: { head?: number; width?: number } = {}) {
  const s = height / REF.top,
    hs = Math.sqrt(s) * head,
    chin = height - (REF.top - REF.chin) * hs,
    by = chin / REF.chin,
    sw = s * width;
  const sy = (y: number) => (y <= REF.chin ? by : hs);
  // horizontal scale blends from the body to the head over the neck, so parts crossing the chin stay whole
  const sx = (y: number) => lerp(sw, hs, THREE.MathUtils.smoothstep(y, REF.chin - 0.1, REF.chin));
  const y = (v: number) => (v <= REF.chin ? v * by : chin + (v - REF.chin) * hs);
  const warp: Warp = (p, n) => {
    const kx = sx(p.y),
      ky = sy(p.y);
    n.set(n.x / kx, n.y / ky, n.z / kx).normalize();
    p.set(p.x * kx, y(p.y), p.z * kx);
  };
  const point = (v: Vec3): Vec3 => [v[0] * sx(v[1]), y(v[1]), v[2] * sx(v[1])];
  return { warp, point, y, s, hs };
}
export type CharWarp = ReturnType<typeof warpFor>;

/**
 * Canvas x (of a w px wide cell) of a point at body x on the front of a torso loft (superellipse ring, half
 * width rx): u runs from the back (0) through the left side (0.25) to the front (0.5).
 */
export const frontU =
  (w: number, rx: number, p = 2.6) =>
  (x: number) => {
    const t = Math.asin(Math.min(1, Math.abs(x) / rx) ** (p / 2));
    return (0.5 - (Math.sign(x) * t) / (Math.PI * 2)) * w;
  };

/** What a character's `dress` gets: the figure, the atlas and shortcuts for the usual parts. */
export type Ctx = {
  b: Body;
  fig: Figure;
  atlas: Atlas;
  saver: boolean;
  /** Segments for full quality and for saver mode. */
  seg: (full: number, low: number) => number;
  skin: UvMap;
  swatch: (hex: string, rough?: number) => UvMap;
  cell: (w: number, h: number, draw: Draw, rough?: number | Draw) => UvMap;
  /** A soft part from an SDF (hair, hijab, head wrap), meshed with MarchingCubes; front-projected uv. */
  soft: (f: Sdf, min: Vec3, max: Vec3, res: [number, number], uv: UvMap, bone?: string | Weights) => void;
  /** A torso-like loft painted by height (v from y0 to y1), blended hips → spine → chest. */
  torso: (
    rings: [number, number, number][],
    uv: UvMap,
    y: [number, number],
    opts?: { p?: number; z?: number; seg?: number },
  ) => void;
  /** Sleeves from shoulder to wrist; below `end` (0..1 along the arm) the bare forearm shows. */
  arms: (rings: [number, number, number][], uv: UvMap, opts?: { end?: number; cuff?: UvMap }) => void;
  /** Trouser legs from the hip line to the hem, blended hips → thigh → shin. */
  legs: (rings: [number, number, number][], uv: UvMap, opts?: { top?: number; hem?: number }) => void;
  shoes: (len: number, w: number, h: number, uv: UvMap) => void;
};

export type MemberSpec = {
  name: string;
  /** Top of the hair or headwear, metres. */
  height: number;
  head?: number;
  width?: number;
  /** Measures in modelling space (start from HERU in heru.ts). */
  body: Body;
  skin: string;
  /** Face paint; its box comes from the head measures. */
  face: Omit<FaceSpec, "box">;
  /** Ears and neck are skipped under a hijab. */
  ears?: boolean;
  neck?: boolean;
  /** Finger curl per hand (0 open … 1 fist). */
  curl?: { L?: number; R?: number };
  /** Extra bones (e.g. a ponytail), in modelling space. */
  extraJoints?: Joint[];
  /** Spring bones among the extra joints, and the colliders they keep out of (modelling space). */
  springs?: SpringSpec[];
  colliders?: ColliderSpec[];
  atlas?: [number, number];
  dress: (c: Ctx) => void;
};

export type CastMember = ReturnType<typeof buildMember>;

/** Builds a member in one go (the dev lab, tools). */
export function buildMember(spec: MemberSpec, opts: { saver?: boolean } = {}) {
  const steps = memberSteps(spec, opts);
  for (;;) {
    const r = steps.next();
    if (r.done) return r.value;
  }
}

/**
 * Builds a member in slices, giving the main thread back between them (each soft part is meshed in a slice of
 * its own), so the page stays responsive while the cast loads on a slow phone.
 */
export async function buildMemberSliced(
  spec: MemberSpec,
  opts: { saver?: boolean } = {},
  pause: () => Promise<unknown>,
) {
  const steps = memberSteps(spec, opts);
  for (;;) {
    const r = steps.next();
    if (r.done) return r.value;
    await pause();
  }
}

function* memberSteps(spec: MemberSpec, { saver = false }: { saver?: boolean } = {}) {
  const b = spec.body;
  const ms: Record<string, number> = {};
  let t0 = performance.now();
  const lap = (k: string) => {
    const t = performance.now();
    ms[k] = Math.round(t - t0);
    t0 = t;
  };
  const cw = warpFor(spec.height, { head: spec.head, width: spec.width });
  const rig = new Rig(joints(b, spec.extraJoints).map((j) => ({ ...j, at: cw.point(j.at) })));
  const fig = new Figure(rig, cw.warp);
  const [aw, ah] = spec.atlas ?? [1024, 1024];
  const atlas = new Atlas(aw, ah, saver ? 0.5 : 1);
  const seg = (full: number, low: number) => (saver ? low : full);
  const box = { x0: -(b.headRx + 0.014), x1: b.headRx + 0.014, y0: b.chin - 0.009, y1: b.crown + 0.015 };
  const face = { ...spec.face, box };

  // ---------- shared cells ----------
  const faceCell = atlas.cell(400, 512, drawFace(face), 0.52);
  const skin = atlas.uv(atlas.swatch(spec.skin, 0.52), true);
  const eye = atlas.uv(
    atlas.cell(
      48,
      64,
      (g, w, h) => {
        g.fillStyle = "#0f0f12";
        g.fillRect(0, 0, w, h);
        g.fillStyle = "#ffffff";
        g.beginPath();
        g.ellipse(w * 0.36, h * 0.3, w * 0.13, h * 0.11, 0, 0, Math.PI * 2);
        g.fill();
      },
      0.1,
    ),
  );

  // ---------- head ----------
  fig.add(loft(headRings(b), seg(26, 18)), atlas.uv(faceCell), "head", box);
  fig.add(
    ellipsoid([b.nose.r * 1.35, b.nose.r * 1.0, b.nose.r * 0.62], [0, b.nose.y, faceZAt(b, 0) - 0.003], [0, 0, 0], 12),
    skin,
    "head",
  );
  for (const [n, s] of SIDES) {
    if (spec.ears !== false)
      fig.add(
        ellipsoid([0.024, b.ear.h / 2, 0.036], [s * b.ear.x, b.ear.y, -0.02], [0, s * 0.25, 0], 12),
        skin,
        "head",
      );
    const ez = faceZAt(b, b.eye.x) - 0.006;
    fig.add(ellipsoid([b.eye.rx, b.eye.ry, 0.011], [s * b.eye.x, b.eye.y, ez], [0, s * 0.18, 0], 12), eye, "eye" + n, {
      x0: s * b.eye.x - b.eye.rx,
      x1: s * b.eye.x + b.eye.rx,
      y0: b.eye.y - b.eye.ry,
      y1: b.eye.y + b.eye.ry,
    });
  }
  if (spec.neck !== false)
    fig.add(
      loft(
        [
          { y: b.neck.y0, rx: b.neck.r, rz: b.neck.r },
          { y: b.neck.y1, rx: b.neck.r * 0.95, rz: b.neck.r * 0.95 },
        ],
        14,
        { caps: false },
      ),
      skin,
      "neck",
    );
  // hands follow the forearm direction from the elbow
  for (const [n, s] of SIDES) {
    const wr: Vec3 = [s * b.wrist[0], b.wrist[1], b.wrist[2]],
      el: Vec3 = [s * b.elbow[0], b.elbow[1], b.elbow[2]];
    const h = hand(b, s, { curl: spec.curl?.[n] ?? 0.3 });
    const dir = new THREE.Vector3(...wr).sub(new THREE.Vector3(...el)).normalize();
    h.applyMatrix4(
      new THREE.Matrix4().compose(
        new THREE.Vector3(...wr),
        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir),
        new THREE.Vector3(1, 1, 1),
      ),
    );
    fig.add(h, skin, "hand" + n);
  }
  lap("head");
  yield;

  // ---------- the character's own parts ----------
  // soft parts are only recorded here and meshed afterwards, one per slice
  const softJobs: (() => void)[] = [];
  const ctx: Ctx = {
    b,
    fig,
    atlas,
    saver,
    seg,
    skin,
    swatch: (hex, rough = 0.8) => atlas.uv(atlas.swatch(hex, rough), true),
    cell: (w, h, draw, rough = 0.8) => atlas.uv(atlas.cell(w, h, draw, rough)),
    soft: (f, min, max, [full, low], uv, bone = "head") => {
      softJobs.push(() =>
        fig.add(sdfGeometry(f, min, max, seg(full, low)), uv, bone, { x0: min[0], x1: max[0], y0: min[1], y1: max[1] }),
      );
    },
    torso: (rings, uv, [y0, y1], { p = 2.6, z = 0.004, seg: n = 28 } = {}) => {
      const g = loft(
        rings.map(([y, rx, rz]) => ({ y, rx, rz, z, p })),
        seg(n, Math.round(n * 0.7)),
      );
      fig.add(
        vByY(g, y0, y1),
        uv,
        fig.chain(
          [
            ["hips", [0, b.hipsY - 0.1, 0]],
            ["spine", [0, b.spineY, 0]],
            ["chest", [0, b.chestY, 0]],
          ],
          0.12,
        ),
      );
    },
    arms: (rings, uv, { end = 1, cuff } = {}) => {
      for (const [n, s] of SIDES) {
        const sh: Vec3 = [s * b.shoulder[0], b.shoulder[1], b.shoulder[2]],
          wr: Vec3 = [s * b.wrist[0], b.wrist[1], b.wrist[2]],
          el: Vec3 = [s * b.elbow[0], b.elbow[1], b.elbow[2]];
        const w = fig.chain(
          [
            ["upperArm" + n, sh],
            ["lowerArm" + n, el],
          ],
          0.09,
        );
        fig.add(limb(sh, wr, rings, seg(16, 12)), uv, w);
        if (end < 0.98)
          // bare arm from inside the sleeve to the wrist
          fig.add(
            limb(
              sh,
              wr,
              [
                [end - 0.06, 0.042, 0.04],
                [0.6, 0.038, 0.036],
                [1.0, 0.033, 0.031],
              ],
              seg(12, 8),
              false,
            ),
            skin,
            w,
          );
        if (cuff)
          fig.add(
            limb(
              sh,
              wr,
              [
                [0.97, 0.05, 0.049],
                [1.03, 0.047, 0.046],
              ],
              14,
              false,
            ),
            cuff,
            "lowerArm" + n,
          );
      }
    },
    legs: (rings, uv, { top = 0.75, hem = 0.115 } = {}) => {
      for (const [n, s] of SIDES) {
        const x = s * b.hip[0];
        fig.add(
          limb([x, top, 0], [x, hem, 0.005], rings, seg(16, 12)),
          uv,
          fig.chain(
            [
              ["hips", [x, b.hipsY, 0]],
              ["thigh" + n, [x, b.hip[1], 0]],
              ["shin" + n, [x, b.knee[1], 0]],
            ],
            0.07,
          ),
        );
      }
    },
    shoes: (len, w, h, uv) => {
      for (const [n, s] of SIDES)
        fig.add(shoe(len, w, h).applyMatrix4(mtx([s * b.hip[0] * 1.04, 0, 0.035])), uv, "foot" + n);
    },
  };
  spec.dress(ctx);
  for (const job of softJobs) {
    yield;
    job();
  }
  lap("parts");
  yield;
  atlas.build();
  lap("atlas");

  const material = vinylMaterial(atlas.texture, atlas.roughness, { wrap: saver ? 0 : 0.35 });
  const { mesh, triangles, partTris } = fig.build(material);
  // colliders sized like the body around them (the head scales less than the body, see warpFor)
  const springs = spec.springs?.length
    ? new Springs(
        rig,
        spec.springs,
        (spec.colliders ?? []).map((c) => ({ ...c, r: c.r * (c.at[1] > REF.chin ? cw.hs : cw.s) })),
        cw.point,
      )
    : null;
  lap("mesh");
  mesh.name = spec.name;
  return {
    name: spec.name,
    mesh,
    rig,
    atlas,
    triangles,
    /** Triangles of each part in the order they were added (for tuning the budget). */
    partTris,
    /** Build time per stage (ms). */
    ms,
    /** Secondary motion (null when the member has no spring bones). */
    springs,
    /** Joint position of the character in its own space (metres), for poses and props. */
    point: cw.point,
    /** Repaints the face for an expression. */
    express(e: Expression) {
      atlas.redraw(faceCell, drawFace(face, e));
    },
    dispose() {
      mesh.geometry.dispose();
      material.dispose();
      atlas.dispose();
    },
  };
}
