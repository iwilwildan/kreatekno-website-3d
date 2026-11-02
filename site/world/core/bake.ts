// Ray-traced ambient occlusion for the AO planes (three-mesh-bvh). Runs in tools/render at build time, and in
// the browser only when a baked map is missing. Kept in its own chunk so visitors never download the tracer.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { MeshBVH } from "three-mesh-bvh";
import type { AoTarget } from "./ao";
import { clean } from "./kit";

const HEMI_N = 12;
const HEMI = Array.from({ length: HEMI_N }, (_, i) => {
  const u = (i + 0.5) / HEMI_N,
    phi = i * 2.399963,
    r = Math.sqrt(u);
  return [r * Math.cos(phi), r * Math.sin(phi), Math.sqrt(1 - u)] as const;
});

/**
 * Bakes every target against the occluders (world-space geometry). A generator, so the caller can run it in
 * time slices; it yields after each row and returns the maps by target id (3×3 box-blurred, as in the prototype).
 */
export function* bakeAO(targets: AoTarget[], occluders: THREE.BufferGeometry[]) {
  const geos = [...occluders];
  for (const t of targets) geos.push(clean(t.mesh.geometry).applyMatrix4(t.mesh.matrixWorld));
  const merged = mergeGeometries(
    geos.map((g) => {
      const n = new THREE.BufferGeometry();
      n.setAttribute("position", g.attributes.position);
      return n;
    }),
  );
  const bvh = new MeshBVH(merged);
  const total = targets.reduce((a, t) => a + t.res[0] * t.res[1], 0);
  let done = 0;
  const maps = new Map<string, Uint8Array>();

  const ray = new THREE.Ray(),
    o = new THREE.Vector3(),
    a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    c = new THREE.Vector3(),
    n = new THREE.Vector3();
  const tu = new THREE.Vector3(),
    tv = new THREE.Vector3(),
    d = new THREE.Vector3();
  for (const t of targets) {
    const [w, h] = t.res,
      m = t.mesh.matrixWorld,
      data = new Uint8Array(w * h).fill(255);
    a.set(t.local[0][0], t.local[0][1], 0).applyMatrix4(m);
    b.set(t.local[1][0], t.local[1][1], 0).applyMatrix4(m);
    c.set(t.local[2][0], t.local[2][1], 0).applyMatrix4(m);
    const U = b.clone().sub(a),
      V = c.clone().sub(a);
    n.crossVectors(U, V).normalize();
    tu.copy(U).normalize();
    tv.crossVectors(n, tu);
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        const u = (i + 0.5) / w,
          v = (j + 0.5) / h;
        if (t.skip && t.shapeUV && t.skip(t.shapeUV[0] + u * t.shapeUV[2], t.shapeUV[1] + v * t.shapeUV[3])) continue;
        o.copy(a).addScaledVector(U, u).addScaledVector(V, v).addScaledVector(n, 0.012);
        const rot = (((((i * 73856093) ^ (j * 19349663)) >>> 0) % 1000) / 1000) * Math.PI * 2,
          cr = Math.cos(rot),
          sr = Math.sin(rot);
        let occ = 0;
        for (const [x, y, z] of HEMI) {
          const rx = x * cr - y * sr,
            ry = x * sr + y * cr;
          d.copy(tu).multiplyScalar(rx).addScaledVector(tv, ry).addScaledVector(n, z);
          ray.set(o, d);
          const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0.0, t.maxDist);
          if (hit) occ += 1 - hit.distance / t.maxDist;
        }
        data[j * w + i] = Math.round(255 * (1 - t.strength * Math.min(1, (occ / HEMI.length) * 1.6)));
      }
      done += w;
      yield done / total;
    }
    const out = new Uint8Array(w * h);
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        let s = 0,
          k = 0;
        for (let y = -1; y <= 1; y++)
          for (let x = -1; x <= 1; x++) {
            const ii = i + x,
              jj = j + y;
            if (ii < 0 || jj < 0 || ii >= w || jj >= h) continue;
            s += data[jj * w + ii];
            k++;
          }
        out[j * w + i] = s / k;
      }
    maps.set(t.id, out);
  }
  return maps;
}
