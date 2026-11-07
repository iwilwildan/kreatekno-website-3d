// Close-up hands for the top views of beats 3–4 (K3, K4): Heru's and Bu Dewi's right hands seen from above, in
// more detail than the cast's own hands. One signed distance field (palm, four fingers in three segments with
// knuckles, thumb, wrist) meshed with MarchingCubes; nails, skin and the sleeve are vertex colours, so a hand
// with its sleeve is one draw call. Finger poses are fixed per keyframe (holding the leaflet's corner, resting
// on the counter).
// Hand frame: right hand, palm down on y = 0, fingers toward -z, knuckles at z = 0, wrist toward +z (the thumb
// is on the -x side).
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { clean, type Vec3 } from "../core/kit";
import { sd, sdfGeometry, smin, type Sdf } from "./sdf";
import { withWrap } from "./vinyl";

/** Flex of one finger at its three joints (radians, + bends the tip down) and its spread (+ toward the thumb). */
export type Finger = { flex: [number, number, number]; spread: number };
export type HandPose = {
  /** Index, middle, ring, little finger. */
  fingers: [Finger, Finger, Finger, Finger];
  /** Thumb: turn away from the index (radians), bend down, and bend of its tip. */
  thumb: { out: number; down: number; flex: number };
  /** Raises the knuckles off the table (m): an arched hand pressing with its fingertips. */
  arch: number;
};

export type HandSpec = {
  skin: string;
  nail: string;
  /** Sleeve colour, and an optional cuff ring between it and the wrist (Heru's white shirt cuff). */
  sleeve: string;
  cuff?: string;
  /** A band near the sleeve's end (Bu Dewi's orange motif). */
  band?: string;
  /** Scale of the whole hand (Heru 1). */
  scale?: number;
};

/** Finger bases on the knuckle line and their three segment lengths, index → little (Heru's 0.18 m hand). */
const FINGERS = [
  { x: -0.0375, len: [0.026, 0.017, 0.015], r: 0.0122 },
  { x: -0.0125, len: [0.028, 0.018, 0.016], r: 0.0128 },
  { x: 0.0125, len: [0.026, 0.017, 0.015], r: 0.012 },
  { x: 0.0362, len: [0.021, 0.014, 0.012], r: 0.0108 },
];
const PALM_Y = 0.0145;

/** Pose presets from the keyframes. */
export const HAND_POSES = {
  /** K3: fingertips pressing the leaflet's corner, fingers a little apart, the thumb tucked along the side. */
  hold: {
    fingers: [
      { flex: [0.18, 0.32, 0.12], spread: 0.035 },
      { flex: [0.16, 0.3, 0.12], spread: 0 },
      { flex: [0.17, 0.32, 0.12], spread: -0.03 },
      { flex: [0.2, 0.36, 0.14], spread: -0.07 },
    ],
    thumb: { out: 0.55, down: 0.35, flex: 0.2 },
    arch: 0.012,
  },
  /** K4: resting flat beside the binder, fingers relaxed and slightly spread. */
  rest: {
    fingers: [
      { flex: [0.08, 0.14, 0.06], spread: 0.07 },
      { flex: [0.06, 0.12, 0.06], spread: 0.02 },
      { flex: [0.07, 0.13, 0.06], spread: -0.035 },
      { flex: [0.1, 0.16, 0.08], spread: -0.09 },
    ],
    thumb: { out: 0.85, down: 0.18, flex: 0.1 },
    arch: 0.004,
  },
} satisfies Record<string, HandPose>;

type Seg = { a: THREE.Vector3; b: THREE.Vector3; r0: number; r1: number };

/** Joint chains of a pose: each finger and the thumb as tapered segments; the tip of each and its direction. */
function chains(pose: HandPose) {
  const segs: Seg[] = [],
    knuckles: { p: THREE.Vector3; r: number }[] = [],
    tips: { p: THREE.Vector3; dir: THREE.Vector3; r: number }[] = [];
  const y0 = PALM_Y + pose.arch;
  FINGERS.forEach((f, i) => {
    const { flex, spread } = pose.fingers[i];
    let p = new THREE.Vector3(f.x, y0, 0.004),
      pitch = 0,
      r = f.r;
    knuckles.push({ p: p.clone(), r: f.r * 1.02 });
    for (let k = 0; k < 3; k++) {
      pitch += flex[k];
      // spread turns the finger toward the thumb (-x) for a right hand
      const dir = new THREE.Vector3(
        -Math.sin(spread) * Math.cos(pitch),
        -Math.sin(pitch),
        -Math.cos(spread) * Math.cos(pitch),
      );
      const q = p.clone().addScaledVector(dir, f.len[k]),
        r1 = r * (k === 2 ? 0.96 : 0.98);
      segs.push({ a: p, b: q, r0: r, r1 });
      if (k === 2) tips.push({ p: q.clone(), dir, r: r1 });
      p = q;
      r = r1;
    }
  });
  // thumb: from the heel of the palm on the thumb side, out and forward, two segments
  {
    const { out, down, flex } = pose.thumb;
    const base = new THREE.Vector3(-0.036, y0 - 0.002, 0.06);
    const d1 = new THREE.Vector3(-Math.sin(out), -Math.sin(down), -Math.cos(out)).normalize();
    const m = base.clone().addScaledVector(d1, 0.038);
    const d2 = new THREE.Vector3(-Math.sin(out * 0.6), -Math.sin(down + flex), -Math.cos(out * 0.6)).normalize();
    const t = m.clone().addScaledVector(d2, 0.03);
    segs.push({ a: base, b: m, r0: 0.0125, r1: 0.0108 }, { a: m, b: t, r0: 0.0108, r1: 0.0095 });
    tips.push({ p: t.clone(), dir: d2, r: 0.0095 });
  }
  return { segs, knuckles, tips, y0 };
}

/** Tapered capsule (round cone, approximated: the radius follows the projection along the segment). */
const cone =
  (s: Seg): Sdf =>
  (x, y, z) => {
    const bax = s.b.x - s.a.x,
      bay = s.b.y - s.a.y,
      baz = s.b.z - s.a.z,
      pax = x - s.a.x,
      pay = y - s.a.y,
      paz = z - s.a.z;
    const h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
    const dx = pax - bax * h,
      dy = pay - bay * h,
      dz = paz - baz * h;
    return Math.sqrt(dx * dx + dy * dy + dz * dz) - (s.r0 + (s.r1 - s.r0) * h);
  };

/** The hand's distance field for a pose (hand frame, metres). */
function handSdf(pose: HandPose) {
  const { segs, knuckles, y0 } = chains(pose);
  // palm: a rounded slab, thicker at the heel, sloping from the wrist down to the knuckles when arched
  const palm = sd.roundBox([0, y0 - 0.001, 0.046], [0.048, 0.0125, 0.046], 0.0115),
    heel = sd.ellipsoid([0.006, y0 - 0.002, 0.075], [0.042, 0.016, 0.028]),
    wrist = sd.capsule([0, y0 + 0.002, 0.08], [0, y0 + 0.012, 0.15], 0.024);
  // each part with a bounding sphere: a part whose sphere is farther than the blend width can't change the
  // distance, so it is skipped (most grid points are far from most fingers); the build is ±3× faster
  type Part = { f: Sdf; c: THREE.Vector3; R: number; k: number };
  const parts: Part[] = [
    ...knuckles.map((n) => ({
      f: sd.sphere([n.p.x, n.p.y + 0.002, n.p.z + 0.004], n.r),
      c: n.p,
      R: n.r + 0.005,
      k: 0.007,
    })),
    ...segs.map((s, i) => ({
      f: cone(s),
      c: s.a.clone().add(s.b).multiplyScalar(0.5),
      R: s.a.distanceTo(s.b) / 2 + Math.max(s.r0, s.r1),
      // fingers join the palm softly; their own segments meet at a knuckle without a seam
      k: i % 3 === 0 ? 0.006 : 0.002,
    })),
  ];
  const lower = (p: Part, x: number, y: number, z: number) =>
    Math.sqrt((x - p.c.x) ** 2 + (y - p.c.y) ** 2 + (z - p.c.z) ** 2) - p.R;
  // the grid reaches far above the hand (see buildCloseHand): up there the height above the hand's top is a safe
  // outside distance, and two thirds of the grid stop here
  const top = Math.max(y0 + 0.016, ...parts.map((p) => p.c.y + p.R)) + 0.008;
  return (x: number, y: number, z: number) => {
    if (y > top) return y - top + 0.008;
    let d = smin(palm(x, y, z), heel(x, y, z), 0.012);
    d = smin(d, wrist(x, y, z), 0.014);
    for (const p of parts) if (lower(p, x, y, z) < d + p.k) d = smin(d, p.f(x, y, z), p.k);
    // nothing below the table
    return Math.max(d, -y - 0.0005);
  };
}

/** Removes the faces on the table (flat underside, never seen). */
function dropUnderside(g: THREE.BufferGeometry) {
  const p = g.attributes.position.array as Float32Array,
    n = g.attributes.normal.array as Float32Array,
    keep: number[] = [];
  for (let t = 0; t < p.length / 9; t++) {
    const low = p[t * 9 + 1] < 0.001 && p[t * 9 + 4] < 0.001 && p[t * 9 + 7] < 0.001,
      down = n[t * 9 + 1] + n[t * 9 + 4] + n[t * 9 + 7] < -2.4;
    if (!(low && down)) keep.push(t);
  }
  const out = new THREE.BufferGeometry();
  for (const name of ["position", "normal", "uv"] as const) {
    const a = g.attributes[name] as THREE.BufferAttribute,
      k = a.itemSize,
      d = new Float32Array(keep.length * 3 * k);
    keep.forEach((t, i) => d.set((a.array as Float32Array).subarray(t * 3 * k, (t + 1) * 3 * k), i * 3 * k));
    out.setAttribute(name, new THREE.BufferAttribute(d, k));
  }
  return out;
}

/** Sleeve: a soft tube from just past the wrist back up the forearm, rising a little; colours per part. */
function sleeveGeometry(spec: HandSpec, y0: number) {
  const parts: [THREE.BufferGeometry, string][] = [];
  const rise = 0.22,
    tube = (z0: number, z1: number, r0: number, r1: number, color: string, open = true) => {
      const g = new THREE.CylinderGeometry(r1, r0, z1 - z0, 20, 1, open);
      g.rotateX(Math.PI / 2 - rise);
      const c = (z0 + z1) / 2;
      g.translate(0, y0 + 0.012 + Math.sin(rise) * (c - 0.12), c);
      parts.push([g, color]);
    };
  let z = 0.112;
  if (spec.cuff) {
    tube(z, z + 0.022, 0.03, 0.031, spec.cuff, false);
    z += 0.018;
  }
  tube(z, z + 0.012, 0.039, 0.04, spec.band ?? spec.sleeve, false);
  tube(z + 0.012, z + 0.34, 0.04, 0.046, spec.sleeve, false);
  return parts;
}

export type CloseHand = ReturnType<typeof buildCloseHand>;

/**
 * Builds a close-up right hand with its sleeve for a pose; `res` is the MarchingCubes grid (saver mode lower).
 * Returns the mesh and the fingertips in the hand frame (index, middle, ring, little, thumb).
 */
export function buildCloseHand(spec: HandSpec, pose: HandPose, { res = 52, wrap = 0.35 } = {}) {
  const f = handSdf(pose),
    { tips, y0 } = chains(pose);
  // MarchingCubes grids are cubic: the box is made about as tall as it is wide, so the cells are not much
  // thinner than they are wide (thin cells pile triangles onto the hand's sides); it ends inside the sleeve
  const min: Vec3 = [-0.085, -0.004, -0.11],
    max: Vec3 = [0.065, 0.14, 0.125];
  const hand = dropUnderside(clean(sdfGeometry(f, min, max, res, { merge: false })));
  const color = new THREE.Color();
  const tint = (g: THREE.BufferGeometry, hex: string) => {
    color.set(hex);
    const a = new Float32Array(g.attributes.position.count * 3);
    for (let i = 0; i < g.attributes.position.count; i++) a.set([color.r, color.g, color.b], i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g;
  };
  const geos = [tint(hand, spec.skin)];
  // nails: flattened ellipsoids sunk into the top of each fingertip, so their rim is crisp (vertex colours on
  // the meshed field would give a ragged edge)
  const up = new THREE.Vector3(0, 1, 0);
  for (const t of tips) {
    const side = new THREE.Vector3().crossVectors(t.dir, up).normalize(),
      top = new THREE.Vector3().crossVectors(side, t.dir).normalize(),
      basis = new THREE.Matrix4().makeBasis(side, top, t.dir.clone().negate()),
      g = new THREE.SphereGeometry(1, 14, 8);
    g.scale(t.r * 0.66, t.r * 0.3, t.r * 0.8);
    g.applyMatrix4(basis);
    g.translate(
      ...t.p
        .clone()
        .addScaledVector(t.dir, -t.r * 0.62)
        .addScaledVector(top, t.r * 0.8)
        .toArray(),
    );
    geos.push(tint(clean(g), spec.nail));
  }
  for (const [g, hex] of sleeveGeometry(spec, y0)) geos.push(tint(clean(g), hex));
  const geometry = mergeGeometries(geos);
  if (spec.scale && spec.scale !== 1) geometry.scale(spec.scale, spec.scale, spec.scale);
  const material = withWrap(
    new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0 }),
    wrap,
  );
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  const s = spec.scale ?? 1;
  return { mesh, tips: tips.map((t) => t.p.clone().multiplyScalar(s)) };
}

/** Heru's and Bu Dewi's close-up hands (colours from heru.ts and dewi.ts; Bu Dewi's hand is a little smaller). */
export const CLOSE_HANDS = {
  heru: { skin: "#b8754f", nail: "#e9b8a4", sleeve: "#5c3e9a", cuff: "#f1eef2" },
  dewi: { skin: "#c58463", nail: "#f2c8b6", sleeve: "#e7d6c4", band: "#d9762f", scale: 0.93 },
} satisfies Record<string, HandSpec>;

/**
 * Both hands in both poses (four meshes, one draw call each; only one pose per hand is shown). `pause` runs
 * between meshes, so the build is spread over several idle slices like the cast's.
 */
export async function buildCloseHands(opts: { saver?: boolean } = {}, pause: () => Promise<unknown> = async () => {}) {
  const o = opts.saver ? { res: 36, wrap: 0 } : {};
  const both = async (spec: HandSpec) => {
    const hold = buildCloseHand(spec, HAND_POSES.hold, o);
    await pause();
    const rest = buildCloseHand(spec, HAND_POSES.rest, o);
    await pause();
    return { hold, rest };
  };
  const heru = await both(CLOSE_HANDS.heru);
  return { heru, dewi: await both(CLOSE_HANDS.dewi) };
}
export type CloseHands = Awaited<ReturnType<typeof buildCloseHands>>;
