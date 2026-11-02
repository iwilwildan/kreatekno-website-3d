// Shared building blocks for every set: palette, cached materials, geometry helpers, per-material batching,
// canvas textures and disposal. Ported from prototype/k0-k2/src/scene.js and prototype/solusi/src/tonton/kit.js.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

export type Vec3 = [number, number, number];

export const lerp = THREE.MathUtils.lerp;

/** Deterministic noise, so every load builds the same scene (and the baked AO keeps matching it). */
export function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Palette of the Home world. */
export const C = {
  facade: "#ece6f5",
  trim: "#f1ebf7",
  plinth: "#f2b9a0",
  orange: "#f2742f",
  orangeDeep: "#e2622a",
  plaque: "#fdf6f3",
  metal: "#77737f",
  glassUp: "#3d4673",
  mint: "#86cdb6",
  mintLight: "#9fd9c5",
  yellow: "#f6e19a",
  yellowDeep: "#ead27f",
  pave: "#b9b2dc",
  curb: "#d6cfdb",
  road: "#8f8a99",
  frame: "#5d6272",
  panel: "#f7f3fb",
  wall: "#efe1e8",
  ceiling: "#ecdfe6",
  base: "#e7683b",
  wood: "#e9c49b",
  woodDark: "#cf9c6c",
  woodPanel: "#e4ba8f",
  counter: "#ef6b2c",
  counterTop: "#fbf7f8",
  plinthGrey: "#8f8995",
  chair: "#ef7633",
  black: "#2d2c33",
  door: "#dba27a",
  white: "#f8f5f6",
  paper: "#fbfafa",
  placeholder: "#a9a5b0",
} as const;

export const G = {
  box: (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d),
  rbox: (w: number, h: number, d: number, r = 0.03, s = 2) =>
    new RoundedBoxGeometry(w, h, d, s, Math.max(0.001, Math.min(r, w / 2, h / 2, d / 2) - 1e-4)),
  cyl: (rt: number, rb: number, h: number, seg = 20, open = false) =>
    new THREE.CylinderGeometry(rt, rb, h, seg, 1, open),
  sph: (r: number, ws = 20, hs = 14) => new THREE.SphereGeometry(r, ws, hs),
};

const _q = new THREE.Quaternion(),
  _e = new THREE.Euler(),
  _v = new THREE.Vector3(),
  _s = new THREE.Vector3();
export function mtx(pos: Vec3 = [0, 0, 0], rot: Vec3 = [0, 0, 0], scl: number | Vec3 = 1) {
  const s = Array.isArray(scl) ? scl : ([scl, scl, scl] as Vec3);
  return new THREE.Matrix4().compose(_v.set(...pos), _q.setFromEuler(_e.set(...rot)), _s.set(...s));
}

/** Non-indexed copy with only position, normal and uv, so any parts can be merged together. */
export function clean(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g.clone();
  n.clearGroups();
  for (const k of Object.keys(n.attributes)) if (!["position", "normal", "uv"].includes(k)) n.deleteAttribute(k);
  if (!n.attributes.uv)
    n.setAttribute("uv", new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  return n;
}

/** Parts are merged per material (one draw call each). Occluders also feed the AO ray tracer. */
export class Batch {
  private byMat = new Map<string, { material: THREE.Material; shadow: boolean; geos: THREE.BufferGeometry[] }>();
  readonly occ: THREE.BufferGeometry[] = [];
  readonly meshes: THREE.Mesh[] = [];
  constructor(readonly parent: THREE.Object3D) {}
  add(
    geo: THREE.BufferGeometry,
    material: THREE.Material,
    m = mtx(),
    { occ = true, shadow = true }: { occ?: boolean; shadow?: boolean } = {},
  ) {
    const g = clean(geo).applyMatrix4(m);
    const key = material.uuid + (shadow ? "s" : "n");
    let entry = this.byMat.get(key);
    if (!entry) this.byMat.set(key, (entry = { material, shadow, geos: [] }));
    entry.geos.push(g);
    if (occ) this.occ.push(g);
    return g;
  }
  build() {
    for (const { material, shadow, geos } of this.byMat.values()) {
      const mesh = new THREE.Mesh(mergeGeometries(geos), material);
      mesh.castShadow = shadow;
      mesh.receiveShadow = true;
      mesh.matrixAutoUpdate = false;
      this.parent.add(mesh);
      this.meshes.push(mesh);
    }
    this.byMat.clear();
  }
}

export type MatOpts = THREE.MeshStandardMaterialParameters;

/** Materials and textures of one world instance (bound to its renderer, disposed with it). */
export function createKit(renderer: THREE.WebGLRenderer) {
  const cache = new Map<string, THREE.MeshStandardMaterial>();
  const textures: THREE.Texture[] = [];
  const mat = (hex: string, o: MatOpts = {}) => {
    const key = hex + JSON.stringify(o);
    let m = cache.get(key);
    if (!m) cache.set(key, (m = new THREE.MeshStandardMaterial({ color: hex, roughness: 0.82, metalness: 0, ...o })));
    return m;
  };
  const canvasTex = (
    w: number,
    h: number,
    draw: (g: CanvasRenderingContext2D, w: number, h: number) => void,
    { repeat, srgb = true }: { repeat?: [number, number]; srgb?: boolean } = {},
  ) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!, w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (repeat) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(...repeat);
    }
    textures.push(t);
    return t;
  };
  const dispose = () => {
    for (const m of cache.values()) m.dispose();
    for (const t of textures) t.dispose();
    cache.clear();
  };
  /** True for materials and textures the kit shares between sets (freed only with the whole world). */
  const shared = (o: THREE.Material | THREE.Texture) =>
    o instanceof THREE.Texture ? textures.includes(o) : [...cache.values()].includes(o as THREE.MeshStandardMaterial);
  return { mat, canvasTex, dispose, shared };
}
export type Kit = ReturnType<typeof createKit>;

export function roundRect(w: number, h: number, r: number) {
  const s = new THREE.Shape(),
    x = -w / 2,
    y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5);
  return s;
}

export const rectPath = (x0: number, y0: number, x1: number, y1: number) => {
  const p = new THREE.Path();
  p.moveTo(x0, y0);
  p.lineTo(x0, y1);
  p.lineTo(x1, y1);
  p.lineTo(x1, y0);
  p.closePath();
  return p;
};

/**
 * Frees every GPU resource under a root (three.js does not do it by itself). `keep` protects shared materials
 * and textures, e.g. the kit's cache when only one set is rebuilt.
 */
export function disposeTree(root: THREE.Object3D, keep: (o: THREE.Material | THREE.Texture) => boolean = () => false) {
  const seen = new Set<THREE.Material>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    mesh.geometry?.dispose();
    for (const m of ([] as THREE.Material[]).concat(mesh.material ?? [])) {
      if (seen.has(m)) continue;
      seen.add(m);
      for (const v of Object.values(m)) if (v instanceof THREE.Texture && !keep(v)) v.dispose();
      if (!keep(m)) m.dispose();
    }
  });
}
