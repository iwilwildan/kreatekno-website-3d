// Shared building blocks, copied from prototype/k0-k2/src/scene.js (kept in step by hand until both settle; see SOLUSI.md).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export const clamp01 = v => Math.min(1, Math.max(0, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// deterministic noise, so every load builds the same scene
export function rng(seed) { return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// palette of the Home world (k0-k2), plus the neighbours of the Master 3-6 facades
export const C = {
  facade: '#ece6f5', trim: '#f1ebf7', plinth: '#f2b9a0', orange: '#f2742f', orangeDeep: '#e2622a', plaque: '#fdf6f3',
  metal: '#77737f', glassUp: '#3d4673', mint: '#86cdb6', mintLight: '#9fd9c5', yellow: '#f6e19a', yellowDeep: '#ead27f',
  pave: '#b9b2dc', curb: '#d6cfdb', road: '#8f8a99', frame: '#5d6272', panel: '#f7f3fb',
  wall: '#efe1e8', ceiling: '#ecdfe6', base: '#e7683b', wood: '#e9c49b', woodDark: '#cf9c6c', woodPanel: '#e4ba8f',
  counter: '#ef6b2c', counterTop: '#fbf7f8', plinthGrey: '#8f8995', chair: '#ef7633', black: '#2d2c33', door: '#dba27a',
  white: '#f8f5f6', paper: '#fbfafa', lilac: '#c9b6ec', pink: '#f3b8c8', sky: '#a9c8f0',
};

export function makeMat() {
  const cache = new Map();
  return (hex, o = {}) => {
    const key = hex + JSON.stringify(o);
    if (!cache.has(key)) cache.set(key, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.82, metalness: 0, ...o }));
    return cache.get(key);
  };
}

export const G = {
  box: (w, h, d) => new THREE.BoxGeometry(w, h, d),
  rbox: (w, h, d, r = 0.03, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.max(0.001, Math.min(r, w / 2, h / 2, d / 2) - 1e-4)),
  cyl: (rt, rb, h, seg = 20, open = false) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open),
  sph: (r, ws = 20, hs = 14) => new THREE.SphereGeometry(r, ws, hs),
};
const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
export function mtx(pos = [0, 0, 0], rot = [0, 0, 0], scl = 1) {
  const s = Array.isArray(scl) ? scl : [scl, scl, scl];
  return new THREE.Matrix4().compose(_v.set(...pos), _q.setFromEuler(_e.set(...rot)), _s.set(...s));
}
function clean(g) {
  const n = g.index ? g.toNonIndexed() : g.clone();
  n.clearGroups();
  for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(k)) n.deleteAttribute(k);
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  return n;
}
// Parts are merged per material (one draw call each).
export class Batch {
  constructor(parent) { this.parent = parent; this.byMat = new Map(); this.meshes = []; }
  add(geo, material, m = mtx(), { shadow = true } = {}) {
    const g = clean(geo).applyMatrix4(m);
    geo.dispose();
    const key = material.uuid + (shadow ? 's' : 'n');
    if (!this.byMat.has(key)) this.byMat.set(key, { material, shadow, geos: [] });
    this.byMat.get(key).geos.push(g);
    return g;
  }
  build() {
    for (const { material, shadow, geos } of this.byMat.values()) {
      const mesh = new THREE.Mesh(mergeGeometries(geos), material);
      geos.forEach(g => g.dispose());
      mesh.castShadow = shadow; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
      this.parent.add(mesh); this.meshes.push(mesh);
    }
    this.byMat.clear();
  }
}

export function canvasTex(renderer, w, h, draw, { repeat, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
export function roundRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2); s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5); return s;
}
export const rectPath = (x0, y0, x1, y1) => { const p = new THREE.Path(); p.moveTo(x0, y0); p.lineTo(x0, y1); p.lineTo(x1, y1); p.lineTo(x1, y0); p.closePath(); return p; };

// terrazzo floor of the COMPANY interior
export function terrazzo(renderer, base = '#f3e6e6', cols = ['#ec8a42', '#ea7a33', '#a9b0bb', '#93a7c4', '#d9bfa6', '#c6c3cc'], repeat = [2.4, 2.4]) {
  return canvasTex(renderer, 1024, 1024, (g, w, h) => {
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    const r = rng(21);
    for (let i = 0; i < 1100; i++) {
      const s = 1.2 + r() * 3.6; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.45 + r() * 0.4;
      g.beginPath(); g.ellipse(r() * w, r() * h, s * 1.4, s * 0.8, r() * 3, 0, 7); g.fill();
    }
    g.globalAlpha = 1;
  }, { repeat });
}

// free every GPU resource under a root (three.js does not do it by itself)
export function disposeTree(root) {
  const seen = new Set();
  root.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    for (const m of [].concat(o.material || [])) {
      if (seen.has(m)) continue; seen.add(m);
      for (const v of Object.values(m)) if (v && v.isTexture) v.dispose();
      m.dispose();
    }
  });
}
