// Tubes lofted through rings: torsos, sleeves, trouser legs, tunics, heads, shoes. Each ring is a superellipse
// (p = 2 ellipse, larger p squarer) centred at (x, z) at height y. u runs around from the back (0) through the
// front (0.5); v runs from the first ring (0) to the last (1) by arc length, so painted details stay in place.
import * as THREE from "three";

export type Ring = { y: number; rx: number; rz: number; x?: number; z?: number; p?: number };

export function loft(rings: Ring[], seg = 24, { caps = true }: { caps?: boolean } = {}) {
  const cols = seg + 1,
    pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  // v by arc length along the ring centres and radii, so stretched rings do not squeeze the texture
  const vAt = [0];
  for (let i = 1; i < rings.length; i++) {
    const a = rings[i - 1],
      b = rings[i];
    const d = Math.hypot(b.y - a.y, (b.rx + b.rz - a.rx - a.rz) / 2, (b.z ?? 0) - (a.z ?? 0), (b.x ?? 0) - (a.x ?? 0));
    vAt.push(vAt[i - 1] + d);
  }
  const vLen = vAt[vAt.length - 1] || 1;
  for (let i = 0; i < rings.length; i++) {
    const r = rings[i],
      e = 2 / (r.p ?? 2);
    for (let j = 0; j < cols; j++) {
      const t = (j / seg) * Math.PI * 2,
        s = Math.sin(t),
        c = -Math.cos(t);
      pos.push(
        (r.x ?? 0) + r.rx * Math.sign(s) * Math.abs(s) ** e,
        r.y,
        (r.z ?? 0) + r.rz * Math.sign(c) * Math.abs(c) ** e,
      );
      uv.push(j / seg, vAt[i] / vLen);
    }
  }
  for (let i = 0; i < rings.length - 1; i++)
    for (let j = 0; j < seg; j++) {
      const a = i * cols + j,
        b = a + cols;
      if (rings[0].y <= rings[rings.length - 1].y) idx.push(a, b, a + 1, a + 1, b, b + 1);
      else idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // the seam column is doubled for the uv wrap: give both copies the same normal
  const n = g.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < rings.length; i++) {
    const a = i * cols,
      b = a + seg;
    const x = n.getX(a) + n.getX(b),
      y = n.getY(a) + n.getY(b),
      z = n.getZ(a) + n.getZ(b),
      l = Math.hypot(x, y, z) || 1;
    n.setXYZ(a, x / l, y / l, z / l);
    n.setXYZ(b, x / l, y / l, z / l);
  }
  if (!caps) return g;
  const parts = [g];
  for (const end of [0, rings.length - 1]) {
    const r = rings[end];
    if (Math.min(r.rx, r.rz) < 1e-3) continue;
    const up = (end === 0) === rings[0].y <= rings[rings.length - 1].y ? -1 : 1;
    parts.push(cap(pos, end * cols, seg, r, up, end === 0 ? 0 : 1));
  }
  return merge(parts);
}

/** Flat fan closing a ring, facing `dir` (±y). */
function cap(pos: number[], start: number, seg: number, r: Ring, dir: number, v: number) {
  const p: number[] = [r.x ?? 0, r.y, r.z ?? 0],
    uv: number[] = [0.5, v],
    idx: number[] = [];
  for (let j = 0; j <= seg; j++) {
    p.push(pos[(start + j) * 3], pos[(start + j) * 3 + 1], pos[(start + j) * 3 + 2]);
    uv.push(j / seg, v);
  }
  for (let j = 1; j <= seg; j++)
    if (dir < 0) idx.push(0, j, j + 1);
    else idx.push(0, j + 1, j);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setAttribute(
    "normal",
    new THREE.Float32BufferAttribute(
      new Array((seg + 2) * 3).fill(0).map((_, i) => (i % 3 === 1 ? dir : 0)),
      3,
    ),
  );
  g.setIndex(idx);
  return g;
}

/** Concatenates indexed geometries that carry position, normal and uv. */
export function merge(parts: THREE.BufferGeometry[]) {
  const out = new THREE.BufferGeometry(),
    names = ["position", "normal", "uv"] as const,
    data: Record<string, number[]> = { position: [], normal: [], uv: [] },
    idx: number[] = [];
  let base = 0;
  for (const g of parts) {
    const ix = g.index ? Array.from(g.index.array) : [...Array(g.attributes.position.count).keys()];
    for (const i of ix) idx.push(i + base);
    for (const k of names) {
      const a = g.attributes[k] as THREE.BufferAttribute | undefined;
      const size = k === "uv" ? 2 : 3;
      const arr = data[k];
      if (a) for (let i = 0; i < a.array.length; i++) arr.push(a.array[i]);
      else for (let i = 0; i < g.attributes.position.count * size; i++) arr.push(0);
    }
    base += g.attributes.position.count;
  }
  for (const k of names) out.setAttribute(k, new THREE.Float32BufferAttribute(data[k], k === "uv" ? 2 : 3));
  out.setIndex(idx);
  return out;
}
