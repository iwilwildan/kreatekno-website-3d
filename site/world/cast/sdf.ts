// Signed distance shapes for the soft parts of the cast (hair, hijab, head wraps), meshed at load with the
// official MarchingCubes addon. Distances are in metres; negative inside.
import * as THREE from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import type { Vec3 } from "../core/kit";

export type Sdf = (x: number, y: number, z: number) => number;

const len3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

export const sd = {
  sphere:
    (c: Vec3, r: number): Sdf =>
    (x, y, z) =>
      len3(x - c[0], y - c[1], z - c[2]) - r,
  /** Ellipsoid (bound-corrected approximation, good near the surface). */
  ellipsoid:
    (c: Vec3, r: Vec3): Sdf =>
    (x, y, z) => {
      const px = (x - c[0]) / r[0],
        py = (y - c[1]) / r[1],
        pz = (z - c[2]) / r[2];
      const k0 = len3(px, py, pz),
        k1 = len3(px / r[0], py / r[1], pz / r[2]);
      return k1 > 0 ? (k0 * (k0 - 1)) / k1 : -Math.min(...r);
    },
  capsule:
    (a: Vec3, b: Vec3, r: number): Sdf =>
    (x, y, z) => {
      const pax = x - a[0],
        pay = y - a[1],
        paz = z - a[2],
        bax = b[0] - a[0],
        bay = b[1] - a[1],
        baz = b[2] - a[2];
      const h = Math.max(0, Math.min(1, (pax * bax + pay * bay + paz * baz) / (bax * bax + bay * bay + baz * baz)));
      return len3(pax - bax * h, pay - bay * h, paz - baz * h) - r;
    },
  /** Box with rounded edges; `s` is the half size. */
  roundBox:
    (c: Vec3, s: Vec3, r: number): Sdf =>
    (x, y, z) => {
      const qx = Math.abs(x - c[0]) - s[0] + r,
        qy = Math.abs(y - c[1]) - s[1] + r,
        qz = Math.abs(z - c[2]) - s[2] + r;
      return len3(Math.max(qx, 0), Math.max(qy, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qy, qz), 0) - r;
    },
  /** Half space below the plane through `p` with normal `n` (unit). */
  plane:
    (p: Vec3, n: Vec3): Sdf =>
    (x, y, z) =>
      (x - p[0]) * n[0] + (y - p[1]) * n[1] + (z - p[2]) * n[2],
};

/** Smooth union (polynomial smooth minimum, k in metres). */
export const smin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};
export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

export const union =
  (k: number, ...fs: Sdf[]): Sdf =>
  (x, y, z) => {
    let d = fs[0](x, y, z);
    for (let i = 1; i < fs.length; i++) d = smin(d, fs[i](x, y, z), k);
    return d;
  };
/** `a` minus `b`, softened by k. */
export const subtract =
  (k: number, a: Sdf, b: Sdf): Sdf =>
  (x, y, z) =>
    smax(a(x, y, z), -b(x, y, z), k);
export const intersect =
  (k: number, a: Sdf, b: Sdf): Sdf =>
  (x, y, z) =>
    smax(a(x, y, z), b(x, y, z), k);

/**
 * Meshes `f` inside the box min..max on a res³ grid (the grid is cubic, so cells stretch with the box).
 * Normals come from the field gradient, which keeps soft shapes smooth at low resolution.
 */
export function sdfGeometry(f: Sdf, min: Vec3, max: Vec3, res: number) {
  const mc = new MarchingCubes(res, new THREE.MeshBasicMaterial(), false, false, 120000);
  mc.isolation = 0;
  const hs = mc.halfsize as number,
    size = mc.size as number,
    // grid index i sits at min + i * step; MarchingCubes reports it as (i - hs) / hs
    step = [0, 1, 2].map((a) => (max[a] - min[a]) / (size - 1)),
    at = (a: number, i: number) => min[a] + step[a] * i;
  const field = mc.field as Float32Array;
  for (let k = 0; k < size; k++)
    for (let j = 0; j < size; j++)
      for (let i = 0; i < size; i++) {
        const edge = i < 2 || j < 2 || k < 2 || i > size - 3 || j > size - 3 || k > size - 3;
        // outside on the border cells, so every surface is closed
        field[i + j * size + k * size * size] = edge ? -1 : -f(at(0, i), at(1, j), at(2, k));
      }
  mc.update();
  const n = mc.count as number,
    P = mc.positionArray as Float32Array,
    N = mc.normalArray as Float32Array;
  const pos = new Float32Array(n * 3),
    nor = new Float32Array(n * 3);
  for (let v = 0; v < n; v++) {
    for (let a = 0; a < 3; a++) pos[v * 3 + a] = at(a, P[v * 3 + a] * hs + hs);
    // the gradient was taken per grid cell; undo the stretch of each axis before normalising
    const nx = N[v * 3] / step[0],
      ny = N[v * 3 + 1] / step[1],
      nz = N[v * 3 + 2] / step[2],
      l = len3(nx, ny, nz) || 1;
    nor[v * 3] = nx / l;
    nor[v * 3 + 1] = ny / l;
    nor[v * 3 + 2] = nz / l;
  }
  mc.geometry.dispose();
  (mc.material as THREE.Material).dispose();
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
  return mergeVertices(g, 1e-5);
}
