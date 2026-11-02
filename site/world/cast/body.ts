// Shared body plan of the vinyl cast (about 4.3 heads tall, measured on the Heru turnaround): joints, head with
// nose, ears and glossy eyes, limbs as lofted tubes, simple hands, chunky shoes. Characters give their own
// measures and clothes (cast/<name>.ts); everything is in metres, rest pose standing, facing +z.
import * as THREE from "three";
import { mtx, type Vec3 } from "../core/kit";
import { loft, merge, type Ring } from "./loft";
import type { Joint } from "./rig";

export type Body = {
  /** Height of the skull top (without hair) and the chin. */
  crown: number;
  chin: number;
  /** Half width and half depth of the skull at the cheeks; the face front sits at faceZ. */
  headRx: number;
  headRz: number;
  faceZ: number;
  eye: { y: number; x: number; rx: number; ry: number };
  nose: { y: number; r: number };
  ear: { y: number; x: number; h: number };
  neck: { y0: number; y1: number; r: number };
  /** Left side joints (+x); the right side mirrors them. */
  shoulder: Vec3;
  elbow: Vec3;
  wrist: Vec3;
  hip: Vec3;
  knee: Vec3;
  ankle: Vec3;
  hipsY: number;
  spineY: number;
  chestY: number;
  hand: { len: number; w: number };
};

const L = (v: Vec3, s: 1 | -1): Vec3 => [v[0] * s, v[1], v[2]];
export const SIDES = [
  ["L", 1],
  ["R", -1],
] as const;

export function joints(b: Body, extra: Joint[] = []): Joint[] {
  const out: Joint[] = [
    { name: "root", parent: null, at: [0, 0, 0] },
    { name: "hips", parent: "root", at: [0, b.hipsY, 0] },
    { name: "spine", parent: "hips", at: [0, b.spineY, 0] },
    { name: "chest", parent: "spine", at: [0, b.chestY, 0] },
    { name: "neck", parent: "chest", at: [0, b.neck.y0, 0] },
    { name: "head", parent: "neck", at: [0, b.chin, 0] },
  ];
  for (const [n, s] of SIDES)
    out.push(
      { name: "upperArm" + n, parent: "chest", at: L(b.shoulder, s) },
      { name: "lowerArm" + n, parent: "upperArm" + n, at: L(b.elbow, s) },
      { name: "hand" + n, parent: "lowerArm" + n, at: L(b.wrist, s) },
      { name: "thigh" + n, parent: "hips", at: L(b.hip, s) },
      { name: "shin" + n, parent: "thigh" + n, at: L(b.knee, s) },
      { name: "foot" + n, parent: "shin" + n, at: L(b.ankle, s) },
      // eyes squash on their own bone to blink
      { name: "eye" + n, parent: "head", at: [s * b.eye.x, b.eye.y, faceZAt(b, b.eye.x) - 0.006] },
    );
  return out.concat(extra);
}

/** Skull rings from chin to crown: a rounded, slightly square toy head with the chin forward. */
export function headRings(b: Body, shape: { jaw?: number; top?: number } = {}): Ring[] {
  const h = b.crown - b.chin,
    jaw = shape.jaw ?? 1,
    top = shape.top ?? 1;
  // [height 0..1, rx, rz, z shift] as fractions of the head
  const prof: [number, number, number, number][] = [
    [0, 0.3 * jaw, 0.28, 0.1],
    [0.03, 0.5 * jaw, 0.52, 0.08],
    [0.1, 0.74 * jaw, 0.78, 0.055],
    [0.2, 0.9, 0.92, 0.03],
    [0.33, 0.985, 0.99, 0.012],
    [0.46, 1, 1, 0],
    [0.6, 0.985, 0.99, -0.008],
    [0.73, 0.93 * top, 0.95, -0.015],
    [0.84, 0.8 * top, 0.83, -0.02],
    [0.92, 0.6 * top, 0.64, -0.02],
    [0.97, 0.36 * top, 0.4, -0.02],
    [1, 0.001, 0.001, -0.02],
  ];
  const zc = b.faceZ - b.headRz;
  return prof.map(([t, rx, rz, dz]) => ({
    y: b.chin + t * h,
    rx: rx * b.headRx,
    rz: rz * b.headRz,
    z: zc + dz * b.headRz * 2,
    p: 2.3,
  }));
}

/** Front of the skull surface at (x, y), for placing eyes and features. */
export function faceZAt(b: Body, x: number) {
  const t = Math.min(1, Math.abs(x) / b.headRx);
  return b.faceZ - b.headRz * (1 - Math.pow(1 - Math.pow(t, 2.3), 1 / 2.3));
}

export const ellipsoid = (r: Vec3, at: Vec3, rot: Vec3 = [0, 0, 0], seg = 16) =>
  new THREE.SphereGeometry(1, seg, Math.max(6, Math.round(seg * 0.6))).applyMatrix4(mtx(at, rot, r));

/** A limb tube between two joints: rings are [t 0..1 along the limb, radius x, radius z]. */
export function limb(a: Vec3, b: Vec3, rings: [number, number, number][], seg = 16, caps = true) {
  const A = new THREE.Vector3(...a),
    B = new THREE.Vector3(...b),
    len = A.distanceTo(B);
  const g = loft(
    rings.map(([t, rx, rz]) => ({ y: -t * len, rx, rz })),
    seg,
    { caps },
  );
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), B.clone().sub(A).normalize());
  return g.applyMatrix4(new THREE.Matrix4().compose(A, q, new THREE.Vector3(1, 1, 1)));
}

/**
 * A relaxed toy hand hanging from the wrist: rounded palm, four fingers held together and a thumb, curled by
 * `curl` (0 open … 1 fist). Palm faces −x for the left hand (toward the body).
 */
export function hand(b: Body, side: 1 | -1, { curl = 0.25, spread = 0 }: { curl?: number; spread?: number } = {}) {
  const { len, w } = b.hand,
    palmH = len * 0.52,
    t = w * 0.42;
  const parts: THREE.BufferGeometry[] = [];
  // palm: a flattened loft, thick at the heel, thinner toward the knuckles
  parts.push(
    loft(
      [
        { y: 0.01, rx: t * 0.35, rz: w * 0.3 },
        { y: 0, rx: t * 0.5, rz: w * 0.42 },
        { y: -palmH * 0.5, rx: t * 0.55, rz: w * 0.5 },
        { y: -palmH, rx: t * 0.45, rz: w * 0.48 },
        { y: -palmH - 0.008, rx: t * 0.3, rz: w * 0.38 },
      ],
      10,
    ),
  );
  const fl = len - palmH,
    r = w * 0.115;
  for (let i = 0; i < 4; i++) {
    const z = (i - 1.5) * r * 2.05,
      l = fl * [0.88, 1, 0.95, 0.78][i],
      bend = curl * 1.2;
    // two segments per finger: straight, then curled toward the palm (−x)
    const base = new THREE.Vector3(0, -palmH + 0.004, z),
      mid = base
        .clone()
        .add(new THREE.Vector3(-Math.sin(bend * 0.6) * l * 0.5, -Math.cos(bend * 0.6) * l * 0.5, z * spread)),
      tip = mid.clone().add(new THREE.Vector3(-Math.sin(bend * 1.4) * l * 0.5, -Math.cos(bend * 1.4) * l * 0.5, 0));
    parts.push(
      limb(
        base.toArray() as Vec3,
        mid.toArray() as Vec3,
        [
          [0, r, r],
          [1, r * 0.95, r * 0.95],
        ],
        6,
        false,
      ),
    );
    parts.push(
      limb(
        mid.toArray() as Vec3,
        tip.toArray() as Vec3,
        [
          [-0.15, r * 0.95, r * 0.95],
          [0.75, r * 0.9, r * 0.9],
          [0.93, r * 0.6, r * 0.6],
          [1, 0.001, 0.001],
        ],
        6,
      ),
    );
  }
  // thumb toward the front (+z), angled in
  {
    const base: Vec3 = [-t * 0.2, -palmH * 0.25, w * 0.42],
      tip: Vec3 = [-t * 0.2 - 0.012 - curl * 0.02, -palmH * 0.25 - fl * 0.75, w * 0.55];
    parts.push(
      limb(
        base,
        tip,
        [
          [0, r * 1.15, r * 1.15],
          [0.8, r * 1.05, r],
          [0.95, r * 0.7, r * 0.6],
          [1, 0.001, 0.001],
        ],
        6,
      ),
    );
  }
  const g = merge(parts);
  // mirror for the right hand (flip x, keep winding by swapping two indices)
  if (side < 0) mirrorX(g);
  return g;
}

/** Mirrors a geometry across x = 0, keeping faces outward. */
export function mirrorX(g: THREE.BufferGeometry) {
  g.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));
  const I = g.index!;
  for (let i = 0; i < I.count; i += 3) {
    const a = I.getX(i + 1);
    I.setX(i + 1, I.getX(i + 2));
    I.setX(i + 2, a);
  }
  return g;
}

/** Chunky toy shoe: lofted from heel to toe, sole underneath (uv u≈0.5 is the bottom, u≈0 the top). */
export function shoe(len: number, w: number, h: number) {
  const rings: Ring[] = [
    [-0.5, 0.55, 0.62, 0.05],
    [-0.47, 0.82, 0.86, 0.02],
    [-0.38, 0.95, 0.97, 0],
    [-0.1, 0.98, 0.94, 0],
    [0.15, 1, 0.82, -0.07],
    [0.33, 0.95, 0.66, -0.15],
    [0.44, 0.78, 0.5, -0.23],
    [0.49, 0.5, 0.36, -0.28],
    [0.5, 0.001, 0.001, -0.28],
  ].map(([t, rx, rz, dz]) => ({ y: t * len, rx: (rx * w) / 2, rz: (rz * h) / 2, z: (-dz * h) / 2, p: 3 }));
  // loft runs along +y; turn it so it runs heel → toe along +z, with the ring's −z side on top
  return loft(rings, 16)
    .applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2))
    .applyMatrix4(mtx([0, h / 2, 0]));
}

/** Outward from the body axis (y), tipped up a little so straps over a shoulder stay flat on it. */
const radial = (p: THREE.Vector3) => new THREE.Vector3(p.x, Math.max(0, p.y - 1.15) * 2, p.z).normalize();

/** A flat strap or ribbon following points (width w, thickness d) lying flat on the body, e.g. lanyards. */
export function ribbon(
  points: Vec3[],
  w: number,
  d: number,
  out: (p: THREE.Vector3) => THREE.Vector3 = radial,
  seg = 24,
) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const pts = curve.getSpacedPoints(seg);
  const pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  pts.forEach((p, i) => {
    const tan = curve.getTangentAt(i / seg),
      side = new THREE.Vector3().crossVectors(tan, out(p)).normalize(),
      n = new THREE.Vector3().crossVectors(side, tan).normalize();
    // four corners of the strap section: out-left, out-right, in-right, in-left
    for (const [s, k] of [
      [-1, 1],
      [1, 1],
      [1, -1],
      [-1, -1],
    ]) {
      const q = p
        .clone()
        .addScaledVector(side, (s * w) / 2)
        .addScaledVector(n, (k * d) / 2);
      pos.push(q.x, q.y, q.z);
      uv.push((s + 1) / 2, i / seg);
    }
  });
  for (let i = 0; i < seg; i++)
    for (let k = 0; k < 4; k++) {
      const a = i * 4 + k,
        b = i * 4 + ((k + 1) % 4),
        c = a + 4,
        d2 = b + 4;
      idx.push(a, b, c, b, d2, c);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Sets uv.v from height (y0 → 0, y1 → 1), so painted clothes line up with real heights on any loft. */
export function vByY(g: THREE.BufferGeometry, y0: number, y1: number) {
  const P = g.attributes.position,
    U = g.attributes.uv as THREE.BufferAttribute;
  for (let i = 0; i < P.count; i++) U.setY(i, (P.getY(i) - y0) / (y1 - y0));
  return g;
}
