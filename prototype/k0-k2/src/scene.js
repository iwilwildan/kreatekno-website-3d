import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshBVH } from 'three-mesh-bvh';

// World, cameras and placements solved from the team's keyframes (metres; x along the street, y up, z toward the street;
// origin = centre of the COMPANY door at pavement level on the facade). pc = 16:9 keyframes, hp = 9:16 keyframes.
import DATA from './data.json';
const E = DATA.ext;
const Q = new URLSearchParams(location.search);
const lerp = THREE.MathUtils.lerp, clamp01 = v => Math.min(1, Math.max(0, v));

// ---------- renderer ----------
const stage = document.getElementById('stage');
const coarse = matchMedia('(pointer: coarse)').matches;
let saver = Q.has('hemat');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: Q.has('shot') });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = Q.get('tone') === 'agx' ? THREE.AgXToneMapping : THREE.NeutralToneMapping;
renderer.toneMappingExposure = Number(Q.get('exp') || 0.9);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 600);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.3;

// deterministic noise, so every load builds the same scene
function rng(seed) { return () => { seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// ---------- materials ----------
const matCache = new Map();
const mat = (hex, o = {}) => {
  const key = hex + JSON.stringify(o);
  if (!matCache.has(key)) matCache.set(key, new THREE.MeshStandardMaterial({ color: hex, roughness: 0.82, metalness: 0, ...o }));
  return matCache.get(key);
};
const C = {
  facade: '#ece6f5', trim: '#f1ebf7', plinth: '#f2b9a0', orange: '#f2742f', orangeDeep: '#e2622a', plaque: '#fdf6f3',
  metal: '#77737f', glassUp: '#3d4673', mint: '#86cdb6', mintLight: '#9fd9c5', yellow: '#f6e19a', yellowDeep: '#ead27f',
  pave: '#b9b2dc', curb: '#d6cfdb', road: '#8f8a99', frame: '#5d6272', panel: '#f7f3fb',
  wall: '#efe1e8', ceiling: '#ecdfe6', base: '#e7683b', wood: '#e9c49b', woodDark: '#cf9c6c', woodPanel: '#e4ba8f',
  counter: '#ef6b2c', counterTop: '#fbf7f8', plinthGrey: '#8f8995', chair: '#ef7633', black: '#2d2c33', door: '#dba27a',
  white: '#f8f5f6', paper: '#fbfafa', placeholder: '#a9a5b0',
};

// ---------- geometry helpers and batching ----------
const G = {
  box: (w, h, d) => new THREE.BoxGeometry(w, h, d),
  rbox: (w, h, d, r = 0.03, s = 3) => new RoundedBoxGeometry(w, h, d, s, Math.max(0.001, Math.min(r, w / 2, h / 2, d / 2) - 1e-4)),
  cyl: (rt, rb, h, seg = 20, open = false) => new THREE.CylinderGeometry(rt, rb, h, seg, 1, open),
  sph: (r, ws = 20, hs = 14) => new THREE.SphereGeometry(r, ws, hs),
};
const _m4 = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3();
function mtx(pos = [0, 0, 0], rot = [0, 0, 0], scl = 1) {
  const s = Array.isArray(scl) ? scl : [scl, scl, scl];
  return new THREE.Matrix4().compose(_v.set(...pos), _q.setFromEuler(_e.set(...rot)), _s.set(...s));
}
function clean(g) {
  let n = g.index ? g.toNonIndexed() : g.clone();
  n.clearGroups();
  for (const k of Object.keys(n.attributes)) if (!['position', 'normal', 'uv'].includes(k)) n.deleteAttribute(k);
  if (!n.attributes.uv) n.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
  return n;
}
// Parts are merged per material (one draw call each). Occluders also feed the AO ray tracer.
class Batch {
  constructor(parent) { this.parent = parent; this.byMat = new Map(); this.occ = []; this.meshes = []; }
  add(geo, material, m = mtx(), { occ = true, shadow = true } = {}) {
    const g = clean(geo).applyMatrix4(m);
    const key = material.uuid + (shadow ? 's' : 'n');
    if (!this.byMat.has(key)) this.byMat.set(key, { material, shadow, geos: [] });
    this.byMat.get(key).geos.push(g);
    if (occ) this.occ.push(g);
    return g;
  }
  build() {
    for (const { material, shadow, geos } of this.byMat.values()) {
      const mesh = new THREE.Mesh(mergeGeometries(geos), material);
      mesh.castShadow = shadow; mesh.receiveShadow = true; mesh.matrixAutoUpdate = false;
      this.parent.add(mesh); this.meshes.push(mesh);
    }
    this.byMat.clear();
  }
}

function canvasTex(w, h, draw, { repeat, srgb = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); }
  return t;
}
function roundRect(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2; r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0); s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2); s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5); return s;
}
const rectPath = (x0, y0, x1, y1) => { const p = new THREE.Path(); p.moveTo(x0, y0); p.lineTo(x0, y1); p.lineTo(x1, y1); p.lineTo(x1, y0); p.closePath(); return p; };

// ---------- AO planes: big flat surfaces get a baked ambient-occlusion map (see bakeAO) ----------
const aoTargets = [];
const AO_RES = coarse ? 10 : 14;
function aoPlane(parent, w, h, material, m, { res = 1, maxDist = 1.2, strength = 0.9, shadow = false } = {}) {
  const geo = new THREE.PlaneGeometry(w, h, 1, 1);
  const mesh = new THREE.Mesh(geo, material.clone()); res *= AO_RES;
  if (shadow) mesh.material.shadowSide = THREE.DoubleSide;
  mesh.matrixAutoUpdate = false; mesh.matrix.copy(m); mesh.receiveShadow = true; mesh.castShadow = shadow;
  parent.add(mesh);
  aoTargets.push({ mesh, w, h, local: [[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2]], res: [Math.max(4, Math.round(w * res)), Math.max(4, Math.round(h * res))], maxDist, strength });
  return mesh;
}

// =====================================================================================================
// EXTERIOR
// =====================================================================================================
const ext = new THREE.Group(); scene.add(ext);
const X = new Batch(ext);
const dw = E.dw, doorH = 2.2, wallT = 0.3;

// facade front (one shape with the openings, so the AO map can follow it)
{
  const s = new THREE.Shape(); s.moveTo(E.xfL, 0); s.lineTo(E.xfR, 0); s.lineTo(E.xfR, E.yP); s.lineTo(E.xfL, E.yP); s.closePath();
  s.holes.push(rectPath(-dw, 0.0, dw, doorH), rectPath(E.xwL, E.ywB, E.xwR, E.ywT), rectPath(E.xu1L, E.yuB, E.xu1R, E.yuT), rectPath(E.xu2L, E.yuB, E.xu2R, E.yuT));
  const geo = new THREE.ShapeGeometry(s, 6);
  const m = new THREE.Mesh(geo, mat(C.facade).clone()); m.material.shadowSide = THREE.DoubleSide; m.receiveShadow = true; m.castShadow = true; ext.add(m);
  const W = E.xfR - E.xfL, H = E.yP;
  aoTargets.push({ mesh: m, shapeUV: [E.xfL, 0, W, H], local: [[E.xfL, 0], [E.xfR, 0], [E.xfL, H]], res: [Math.round(W * AO_RES), Math.round(H * AO_RES)], maxDist: 1.4, strength: 0.85,
    skip: (x, y) => (Math.abs(x) < dw && y < doorH) || (x > E.xwL && x < E.xwR && y > E.ywB && y < E.ywT) || (y > E.yuB && y < E.yuT && ((x > E.xu1L && x < E.xu1R) || (x > E.xu2L && x < E.xu2R))) });
  // reveals (jambs) so the openings have depth
  const rev = (x0, y0, x1, y1) => {
    const d = wallT, mt = mat(C.trim);
    X.add(G.box(0.04, y1 - y0, d), mt, mtx([x0 + 0.02, (y0 + y1) / 2, -d / 2])); X.add(G.box(0.04, y1 - y0, d), mt, mtx([x1 - 0.02, (y0 + y1) / 2, -d / 2]));
    X.add(G.box(x1 - x0, 0.04, d), mt, mtx([(x0 + x1) / 2, y1 - 0.02, -d / 2])); if (y0 > 0.01) X.add(G.box(x1 - x0, 0.04, d), mt, mtx([(x0 + x1) / 2, y0 + 0.02, -d / 2]));
  };
  rev(-dw, 0, dw, doorH); rev(E.xwL, E.ywB, E.xwR, E.ywT); rev(E.xu1L, E.yuB, E.xu1R, E.yuT); rev(E.xu2L, E.yuB, E.xu2R, E.yuT);
}
// band between the floors, cornice and parapet, plinth, side pillars
{
  const W = E.xfR - E.xfL, cx = (E.xfL + E.xfR) / 2;
  X.add(G.rbox(W + 0.14, 1.0, 0.16, 0.05), mat(C.trim), mtx([cx, 3.42, -0.05]));
  X.add(G.rbox(W + 0.2, 0.12, 0.22, 0.05), mat(C.trim), mtx([cx, 2.95, -0.04]));
  X.add(G.rbox(W + 0.24, 0.42, 0.5, 0.07), mat(C.trim), mtx([cx, E.yP - 0.21, E.zc - 0.13]));
  X.add(G.rbox(W + 0.3, 0.1, 0.56, 0.04), mat(C.trim), mtx([cx, E.yP - 0.42, E.zc - 0.1]));
  for (const [x0, x1] of [[E.xfL, E.xwL - 0.02], [E.xwR + 0.02, -dw - 0.02], [dw + 0.02, E.xfR]]) {
    if (x1 - x0 < 0.05) continue;
    X.add(G.rbox(x1 - x0, 0.16, 0.08, 0.025), mat(C.plinth), mtx([(x0 + x1) / 2, 0.08, 0.02]));
  }
  X.add(G.rbox(0.62, 2.88, 0.12, 0.04), mat(C.trim), mtx([E.xfR - 0.31, 1.44, 0.03]));
  X.add(G.rbox(0.66, 0.16, 0.16, 0.03), mat(C.plinth), mtx([E.xfR - 0.31, 0.08, 0.05]));
  X.add(G.rbox(0.62, 2.88, 0.12, 0.04), mat(C.trim), mtx([E.xfL + 0.31, 1.44, 0.03]));
}
// shop window (frosted, lit from inside) and the upper windows
const glowTex = canvasTex(256, 128, (g, w, h) => {
  const r = g.createRadialGradient(w * 0.32, h * 0.38, 4, w * 0.4, h * 0.5, w * 0.7);
  r.addColorStop(0, '#fff3d6'); r.addColorStop(0.35, '#ffd9a6'); r.addColorStop(0.75, '#c99b8e'); r.addColorStop(1, '#8f7a86');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
  const bar = g.createLinearGradient(0, h * 0.05, 0, h * 0.2); bar.addColorStop(0, 'rgba(255,250,235,0)'); bar.addColorStop(0.5, 'rgba(255,250,235,.85)'); bar.addColorStop(1, 'rgba(255,250,235,0)');
  g.fillStyle = bar; g.fillRect(w * 0.04, h * 0.05, w * 0.92, h * 0.15);
});
const glowMat = new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.35, emissive: '#ffffff', emissiveMap: glowTex, emissiveIntensity: 1.35 });
function orangeFrame(x0, y0, x1, y1, t = 0.08, z = 0.02, d = 0.1, mullion = false) {
  const o = mat(C.orange, { roughness: 0.55 });
  X.add(G.rbox(x1 - x0 + t, t, d, 0.025), o, mtx([(x0 + x1) / 2, y1, z])); X.add(G.rbox(x1 - x0 + t, t, d, 0.025), o, mtx([(x0 + x1) / 2, y0, z]));
  X.add(G.rbox(t, y1 - y0, d, 0.025), o, mtx([x0, (y0 + y1) / 2, z])); X.add(G.rbox(t, y1 - y0, d, 0.025), o, mtx([x1, (y0 + y1) / 2, z]));
  if (mullion) X.add(G.rbox(t * 0.8, y1 - y0, d * 0.8, 0.02), o, mtx([(x0 + x1) / 2, (y0 + y1) / 2, z - 0.03]));
}
{
  orangeFrame(E.xwL, E.ywB, E.xwR, E.ywT, 0.09);
  const gw = new THREE.Mesh(new THREE.PlaneGeometry(E.xwR - E.xwL, E.ywT - E.ywB), glowMat); gw.position.set((E.xwL + E.xwR) / 2, (E.ywB + E.ywT) / 2, -0.12); gw.castShadow = true; gw.material.shadowSide = THREE.DoubleSide; ext.add(gw);
  X.add(G.rbox(E.xwR - E.xwL + 0.3, 0.1, 0.22, 0.04), mat(C.trim), mtx([(E.xwL + E.xwR) / 2, E.ywB - 0.06, 0.06]));
  const up = new THREE.MeshStandardMaterial({ color: C.glassUp, roughness: 0.2, metalness: 0.1, envMapIntensity: 0.6 });
  for (const [x0, x1] of [[E.xu1L, E.xu1R], [E.xu2L, E.xu2R]]) {
    orangeFrame(x0, E.yuB, x1, E.yuT, 0.08, 0.02, 0.1, true);
    X.add(G.box(x1 - x0, E.yuT - E.yuB, 0.02), up, mtx([(x0 + x1) / 2, (E.yuB + E.yuT) / 2, -0.12]), { occ: false });
    X.add(G.rbox(x1 - x0 + 0.34, 0.1, 0.24, 0.04), mat(C.trim), mtx([(x0 + x1) / 2, E.yuT + 0.1, 0.07]));
    X.add(G.rbox(x1 - x0 + 0.22, 0.07, 0.16, 0.03), mat(C.trim), mtx([(x0 + x1) / 2, E.yuB - 0.06, 0.05]));
  }
}
// door: metal frame, two frosted leaves; the right leaf swings inward on its hinge
const doorGlass = new THREE.MeshStandardMaterial({ color: '#a39aa6', roughness: 0.25, metalness: 0.15, emissive: '#ffffff', emissiveMap: glowTex, emissiveIntensity: 0.32 });
const hinge = new THREE.Group(); hinge.position.set(dw - 0.05, 0, -0.1); ext.add(hinge);
const leafL = new THREE.Group(); leafL.position.set(-dw + 0.05, 0, -0.1); ext.add(leafL);
function doorLeaf(parent, sign) {
  const B = new Batch(parent), w = dw - 0.07, met = mat(C.metal, { roughness: 0.42, metalness: 0.35 });
  const cx = sign * w / 2;
  B.add(G.box(w - 0.1, doorH - 0.2, 0.02), doorGlass, mtx([cx, doorH / 2, 0]), { occ: false });
  for (const [dx, dy, ww, hh] of [[0, doorH / 2 - 0.08, w, 0.08], [0, -doorH / 2 + 0.07, w, 0.12], [-w / 2 + 0.04, 0, 0.08, doorH - 0.04], [w / 2 - 0.04, 0, 0.08, doorH - 0.04]])
    B.add(G.box(ww, hh, 0.05), met, mtx([cx + dx, doorH / 2 + dy, 0]));
  B.add(G.rbox(0.035, 0.42, 0.035, 0.016), mat('#d8dbe2', { roughness: 0.25, metalness: 0.8 }), mtx([sign * (w - 0.1), 1.08, 0.07]));
  B.build();
}
doorLeaf(leafL, 1); doorLeaf(hinge, -1);
{
  const met = mat(C.metal, { roughness: 0.42, metalness: 0.35 });
  X.add(G.box(0.08, doorH, 0.34), met, mtx([-dw - 0.0, doorH / 2, -0.12])); X.add(G.box(0.08, doorH, 0.34), met, mtx([dw, doorH / 2, -0.12]));
  X.add(G.box(2 * dw + 0.08, 0.09, 0.34), met, mtx([0, doorH - 0.045, -0.12])); X.add(G.box(2 * dw, 0.03, 0.34), met, mtx([0, 0.015, -0.12]));
}
// sign: white pill plaque, orange rim, extruded COMPANY letters (Nunito ExtraBold outlines)
{
  const w = E.xsR - E.xsL, h = E.ysT - E.ysB, cx = (E.xsL + E.xsR) / 2, cy = (E.ysB + E.ysT) / 2, z0 = E.zs;
  const plaque = new THREE.ExtrudeGeometry(roundRect(w, h, h / 2), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 24 });
  X.add(plaque, mat(C.plaque, { roughness: 0.6 }), mtx([cx, cy, 0.06]));
  const ring = roundRect(w, h, h / 2); ring.holes.push(roundRect(w - 0.12, h - 0.12, (h - 0.12) / 2));
  X.add(new THREE.ExtrudeGeometry(ring, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 24 }), mat(C.orange, { roughness: 0.5 }), mtx([cx, cy, 0.15]));
  const sp = new THREE.ShapePath();
  for (const c of DATA.glyphs.cmds) {
    if (c[0] === 'M') sp.moveTo(c[1], c[2]); else if (c[0] === 'L') sp.lineTo(c[1], c[2]);
    else if (c[0] === 'Q') sp.quadraticCurveTo(c[1], c[2], c[3], c[4]); else if (c[0] === 'C') sp.bezierCurveTo(c[1], c[2], c[3], c[4], c[5], c[6]);
  }
  const [bx0, by0, bx1, by1] = DATA.glyphs.bbox, k = 0.596 * h / (by1 - by0);
  const letters = new THREE.ExtrudeGeometry(sp.toShapes(false), { depth: 0.04 / k, bevelEnabled: true, bevelThickness: 0.03 / k, bevelSize: 0.022 / k, bevelSegments: 3, curveSegments: 8 });
  letters.translate(-(bx0 + bx1) / 2, -(by0 + by1) / 2, 0);
  X.add(letters, mat(C.orange, { roughness: 0.5 }), mtx([cx, cy, 0.16], [0, 0, 0], k), { occ: false });
}
// awning: ribbed orange canopy; side profile extruded along the street in short segments with a groove between
{
  const za = E.za, r = (E.yaT - E.yaB) / 2, cyF = (E.yaT + E.yaB) / 2, zF = za - r;
  const prof = new THREE.Shape();
  prof.moveTo(-0.0, E.yaT + 0.16); prof.lineTo(-zF, E.yaT);
  prof.absarc(-zF, cyF, r, Math.PI / 2, Math.PI * 1.5, false);
  prof.lineTo(-0.0, E.yaB + 0.04); prof.closePath();
  const L = E.xaR - E.xaL, n = Math.max(6, Math.round(L / 0.43)), segL = L / n;
  const seg = new THREE.ExtrudeGeometry(prof, { depth: segL - 0.03, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 2, curveSegments: 16 });
  seg.rotateY(Math.PI / 2);
  const o = mat(C.orange, { roughness: 0.5 });
  for (let i = 0; i < n; i++) X.add(seg, o, mtx([E.xaL + i * segL + 0.015, 0, 0]));
  X.add(G.rbox(0.06, E.yaT - E.yaB + 0.1, za + 0.02, 0.025), mat(C.orangeDeep, { roughness: 0.5 }), mtx([E.xaR - 0.02, cyF, za / 2]));
}
// roof, roof box, billboard with its truss
const roofY = E.yP - 0.36;
{
  X.add(G.box(E.xfR - E.xfL, 0.1, 12), mat('#f1dad8', { roughness: 1 }), mtx([(E.xfL + E.xfR) / 2, roofY - 0.05, -6.3]));
  X.add(G.rbox(E.xrR - E.xrL, E.yrT - roofY, E.drb, 0.06), mat(C.trim), mtx([(E.xrL + E.xrR) / 2, (E.yrT + roofY) / 2, E.zr - E.drb / 2]));
  X.add(G.rbox(E.xrR - E.xrL + 0.12, 0.08, E.drb + 0.12, 0.035), mat(C.trim), mtx([(E.xrL + E.xrR) / 2, E.yrT - 0.02, E.zr - E.drb / 2]));
  const w = E.xbR - E.xbL, h = E.ybT - E.ybB, cx = (E.xbL + E.xbR) / 2, zb = E.zb, fr = mat(C.frame, { roughness: 0.48, metalness: 0.35 });
  const ledge = 0.17, panelH = h - ledge;
  const ring = roundRect(w, panelH, 0.09); ring.holes.push(roundRect(w - 0.2, panelH - 0.2, 0.05));
  X.add(new THREE.ExtrudeGeometry(ring, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.03, bevelSegments: 3, curveSegments: 10 }), fr, mtx([cx, E.ybB + ledge + panelH / 2, zb - 0.06]));
  X.add(G.box(w - 0.18, panelH - 0.18, 0.03), new THREE.MeshStandardMaterial({ color: '#f2f0fa', roughness: 0.7, emissive: '#ece8fa', emissiveIntensity: 0.38 }), mtx([cx, E.ybB + ledge + panelH / 2, zb - 0.05]));
  X.add(G.rbox(w + 0.12, ledge, 0.36, 0.06), fr, mtx([cx, E.ybB + ledge / 2, zb]));
  const legs = [0.106, 0.503, 0.887].map(f => E.xbL + f * w), legTop = E.ybB, legBot = roofY;
  for (const x of legs) {
    X.add(G.cyl(0.05, 0.06, legTop - legBot, 12), fr, mtx([x, (legTop + legBot) / 2, zb]));
    X.add(G.cyl(0.035, 0.04, legTop - legBot, 10), fr, mtx([x, (legTop + legBot) / 2, zb - 0.55]));
  }
  const beam = (x0, y0, x1, y1, z, r = 0.025) => {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    X.add(G.cyl(r, r, len, 8), fr, mtx([(x0 + x1) / 2, (y0 + y1) / 2, z], [0, 0, Math.atan2(dx, dy) * -1]));
  };
  const yA = legTop - 0.22, yB = legBot + 0.15;
  for (const z of [zb, zb - 0.55]) {
    beam(legs[0], yA, legs[2], yA, z, 0.03);
    for (let i = 0; i < 2; i++) { beam(legs[i], yA, legs[i + 1], yB, z); beam(legs[i], yB, legs[i + 1], yA, z); }
  }
}
// neighbours: yellow end house on the left, the mint fruit shop and the laundry on the right
{
  const ny = E.xfL - 0.05, yw = 2.7, H = 5.9;
  X.add(G.box(yw, H, 6), mat(C.yellow), mtx([ny - yw / 2, H / 2, -3]));
  X.add(G.rbox(yw + 0.1, 0.25, 0.4, 0.05), mat(C.yellowDeep), mtx([ny - yw / 2, H - 0.1, 0.05]));
  X.add(G.rbox(yw + 0.1, 0.2, 0.36, 0.05), mat(C.yellowDeep), mtx([ny - yw / 2, 3.2, 0.05]));
  X.add(G.box(yw - 0.6, 2.6, 0.04), mat('#e3d8c6'), mtx([ny - yw / 2, 1.4, 0.03]));
  for (const x of [ny - 0.75, ny - 1.95]) X.add(G.box(0.7, 1.15, 0.04), mat('#c9cdd7', { roughness: 0.3 }), mtx([x, 5.0, 0.03]));
  const mx0 = E.xfR + 0.06, mw = 7.0, MH = 8.0;
  X.add(G.box(mw, MH, 6), mat(C.mint), mtx([mx0 + mw / 2, MH / 2, -3.06]));
  for (const x of [mx0 + 0.32, mx0 + mw - 0.32]) {
    X.add(G.rbox(0.64, MH - 0.6, 0.2, 0.06), mat(C.mintLight), mtx([x, (MH - 0.6) / 2, 0.06]));
    X.add(G.rbox(0.72, 0.7, 0.26, 0.08), mat(C.mintLight), mtx([x, 0.35, 0.08]));
    X.add(G.rbox(0.72, 0.5, 0.26, 0.08), mat(C.mintLight), mtx([x, 3.4, 0.08]));
  }
  X.add(G.rbox(mw, 0.5, 0.34, 0.08), mat(C.mintLight), mtx([mx0 + mw / 2, MH - 0.3, 0.1]));
  X.add(G.rbox(mw - 1.6, 1.7, 0.08, 0.05), mat('#fbfbfb'), mtx([mx0 + mw / 2, 5.4, 0.05]));
  X.add(G.box(mw - 1.4, 2.6, 0.04), mat('#5f6b68'), mtx([mx0 + mw / 2, 1.35, -0.4]));
  const r = rng(7), fruit = ['#f2a33a', '#e94d3d', '#f4d24a', '#7cc35a', '#f28a2e'];
  for (let i = 0; i < 6; i++) {
    const x = mx0 + 1.1 + i * 0.85;
    X.add(G.rbox(0.72, 0.42, 0.5, 0.04), mat('#d9a066'), mtx([x, 0.45, 0.05]));
    for (let k = 0; k < 6; k++) X.add(G.sph(0.08, 10, 8), mat(fruit[Math.floor(r() * fruit.length)], { roughness: 0.5 }), mtx([x - 0.24 + (k % 3) * 0.24, 0.72, -0.08 + Math.floor(k / 3) * 0.2]), { occ: false });
  }
  const lx0 = mx0 + mw + 0.05, lw = 7.0;
  X.add(G.box(lw, 7.8, 6), mat('#efd9bd'), mtx([lx0 + lw / 2, 3.9, -3]));
  X.add(G.rbox(lw, 0.5, 0.34, 0.08), mat('#f6e6d0'), mtx([lx0 + lw / 2, 7.5, 0.1]));
}
// pavement (AO plane), kerb, road with a dashed centre line
{
  const tiles = canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = C.pave; g.fillRect(0, 0, w, h);
    const r = rng(3);
    for (let i = 0; i < 1400; i++) { g.fillStyle = `rgba(120,100,130,${0.025 + r() * 0.03})`; g.fillRect(r() * w, r() * h, 2, 2); }
    g.strokeStyle = 'rgba(120,108,150,.7)'; g.lineWidth = 5; g.strokeRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 6); g.lineTo(w - 4, 6); g.stroke();
  }, { repeat: [11, 1.2] });
  aoPlane(ext, 30, 1.7, new THREE.MeshStandardMaterial({ map: tiles, roughness: 0.9 }), mtx([0, 0, 0.85], [-Math.PI / 2, 0, 0]), { res: 0.6, maxDist: 1.4, strength: 0.75 });
  X.add(G.rbox(30, 0.18, 0.3, 0.05), mat(C.curb), mtx([0, -0.07, 1.82]));
  X.add(G.box(60, 0.1, 30), mat(C.road, { roughness: 0.95 }), mtx([0, -0.2, 18.2]), { occ: false });
  const dash = mat('#f6f4f2', { roughness: 0.6 });
  for (let x = -28; x < 30; x += 3.4) X.add(G.box(1.8, 0.01, 0.1), dash, mtx([x, -0.145, 3.3]), { occ: false, shadow: false });
  X.add(G.box(60, 0.15, 3), mat(C.pave), mtx([0, -0.075, 13.6]), { occ: false });
}
{
  const zo = 20, slope = 0.43, hx = x => 8.4 + slope * (x + 11.2);
  const shape = new THREE.Shape(); shape.moveTo(-28, -1); shape.lineTo(30, -1); shape.lineTo(30, hx(30)); shape.lineTo(-28, hx(-28)); shape.closePath();
  const caster = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, side: THREE.DoubleSide }));
  caster.position.z = zo; caster.castShadow = true; caster.material.shadowSide = THREE.DoubleSide; ext.add(caster);
}
X.build();

// sky dome, low-poly clouds (one set per keyframe format), birds (posed; they fly in stage 4)
const skyTex = canvasTex(8, 1024, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#3f8ff5'); gr.addColorStop(0.38, '#5aa6fc'); gr.addColorStop(0.444, '#6cadfd'); gr.addColorStop(0.49, '#acccfb'); gr.addColorStop(0.52, '#e4d8e6'); gr.addColorStop(0.545, '#f0dcdc'); gr.addColorStop(1, '#f0dcdc');
  g.fillStyle = gr; g.fillRect(0, 0, w, h);
});
const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, toneMapped: false }));
scene.add(sky);
function cloudGeo(seed) {
  const r = rng(seed), parts = [];
  const blobs = [[0, 0, 0, 1], [-0.85, -0.12, 0.05, 0.72], [0.85, -0.15, 0, 0.7], [-0.35, 0.42, -0.05, 0.62], [0.4, 0.35, 0.1, 0.58], [1.45, -0.28, 0, 0.42], [-1.45, -0.3, 0, 0.4]];
  for (const [x, y, z, s] of blobs) {
    const g = new THREE.IcosahedronGeometry(s * (0.9 + r() * 0.2), 1);
    g.scale(1, 0.72, 0.8); g.translate(x, y, z); parts.push(clean(g));
  }
  const g = mergeGeometries(parts); g.translate(0, 0.2, 0);
  const pos = g.attributes.position; for (let i = 0; i < pos.count; i++) if (pos.getY(i) < -0.15) pos.setY(i, -0.15 + (pos.getY(i) + 0.15) * 0.25);
  g.computeVertexNormals(); return g;
}
const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95, flatShading: true, emissive: '#cfcaf7', emissiveIntensity: 0.45 });
const cloudSets = {};
for (const fmt of ['pc', 'hp']) {
  const grp = new THREE.Group(); scene.add(grp); cloudSets[fmt] = grp;
  DATA.clouds[fmt].forEach(([x, y, z, w], i) => { const m = new THREE.Mesh(cloudGeo(11 + i), cloudMat); m.position.set(x, y, z); m.scale.setScalar(w / 3.4); grp.add(m); });
}
function birdGeo() {
  const parts = [], body = new THREE.SphereGeometry(0.5, 16, 12); body.scale(1.15, 0.72, 0.72); parts.push(clean(body));
  const head = new THREE.SphereGeometry(0.3, 14, 10); head.translate(0.62, 0.22, 0); parts.push(clean(head));
  const tail = new THREE.ConeGeometry(0.22, 0.6, 8); tail.rotateZ(Math.PI / 2); tail.scale(1, 1, 0.35); tail.translate(-0.8, 0.05, 0); parts.push(clean(tail));
  for (const s of [1, -1]) { const w = new THREE.SphereGeometry(0.5, 12, 8); w.scale(0.55, 0.12, 1.1); w.rotateX(s * 0.6); w.translate(-0.05, 0.42, s * 0.5); parts.push(clean(w)); }
  return mergeGeometries(parts);
}
const birdMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.7, emissive: '#e6e2f6', emissiveIntensity: 0.25 });
const beakMat = new THREE.MeshStandardMaterial({ color: '#f2a23a', roughness: 0.5 });
const birdSets = {};
for (const fmt of ['pc', 'hp']) {
  const grp = new THREE.Group(); scene.add(grp); birdSets[fmt] = grp;
  const bg = birdGeo(), beak = new THREE.ConeGeometry(0.08, 0.22, 8); beak.rotateZ(-Math.PI / 2); beak.translate(0.95, 0.2, 0);
  DATA.birds[fmt].forEach(([x, y, z, w]) => {
    const b = new THREE.Group(); b.add(new THREE.Mesh(bg, birdMat)); b.add(new THREE.Mesh(beak, beakMat));
    b.position.set(x, y, z); b.scale.setScalar(w / 2.0); b.rotation.set(0, -0.15, 0.32); grp.add(b);
  });
}

// =====================================================================================================
// INTERIOR (solved in its own frame; a 9:16 variant moves furniture so both keyframes line up)
// =====================================================================================================
let interior = null;
const floorTex = canvasTex(1024, 1024, (g, w, h) => {
  g.fillStyle = '#f3e6e6'; g.fillRect(0, 0, w, h);
  const r = rng(21), cols = ['#ec8a42', '#ea7a33', '#a9b0bb', '#93a7c4', '#d9bfa6', '#c6c3cc'];
  for (let i = 0; i < 1100; i++) {
    const s = 1.2 + r() * 3.6; g.fillStyle = cols[Math.floor(r() * cols.length)]; g.globalAlpha = 0.45 + r() * 0.4;
    g.beginPath(); g.ellipse(r() * w, r() * h, s * 1.4, s * 0.8, r() * 3, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
}, { repeat: [2.4, 2.4] });

function buildInterior(t) {
  const P = {}, pc = DATA.int.pc, hp = DATA.int.hp;
  for (const k in pc) P[k] = lerp(pc[k], hp[k], t);
  const B0 = P.izB;
  for (const i of [1, 2, 3]) P['lz' + i] = B0 + P['ld' + i];
  P.czF = B0 + P.cd; P.s1z = B0 + P.s1d; P.s2z = B0 + P.s2d;
  for (const k of ['D1', 'D2', 'D3', 'D4']) P[k + 'z'] = B0 + P[k + 'd'];
  const off = [0, 1, 2].map(i => lerp(DATA.intOffset.pc[i], DATA.intOffset.hp[i], t));
  const grp = new THREE.Group(); grp.position.set(...off); grp.updateMatrixWorld(true);
  const B = new Batch(grp);
  const zFront = -wallT - off[2], W = P.ixR - P.ixL, D = zFront - P.izB, H = P.Hc, cxR = (P.ixL + P.ixR) / 2;
  const wallM = new THREE.MeshStandardMaterial({ color: C.wall, roughness: 0.92 });
  aoPlane(grp, W, D, new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.62, metalness: 0 }), mtx([cxR, 0, (zFront + P.izB) / 2], [-Math.PI / 2, 0, 0]), { res: 0.9, maxDist: 1.1, strength: 0.95 });
  aoPlane(grp, W, H, wallM, mtx([cxR, H / 2, P.izB]), { res: 0.75, maxDist: 1.2, shadow: true });
  aoPlane(grp, D, H, wallM, mtx([P.ixL, H / 2, (zFront + P.izB) / 2], [0, Math.PI / 2, 0]), { res: 0.75, maxDist: 1.2, shadow: true });
  aoPlane(grp, D, H, wallM, mtx([P.ixR, H / 2, (zFront + P.izB) / 2], [0, -Math.PI / 2, 0]), { res: 0.75, maxDist: 1.2, shadow: true });
  aoPlane(grp, W, D, new THREE.MeshStandardMaterial({ color: C.ceiling, roughness: 0.95 }), mtx([cxR, H, (zFront + P.izB) / 2], [Math.PI / 2, 0, 0]), { res: 0.35, maxDist: 1.0, strength: 0.6, shadow: true });
  { // front wall seen from inside, with the door and shop-window openings
    const s = new THREE.Shape(); s.moveTo(P.ixL, 0); s.lineTo(P.ixR, 0); s.lineTo(P.ixR, H); s.lineTo(P.ixL, H); s.closePath();
    const dL = -dw - off[0], dR = dw - off[0]; s.holes.push(rectPath(dL, 0, dR, doorH));
    const wL = Math.max(P.ixL + 0.05, E.xwL - off[0]), wR = Math.min(P.ixR - 0.05, E.xwR - off[0]); if (wR > wL + 0.1) s.holes.push(rectPath(wL, E.ywB, wR, E.ywT));
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), wallM.clone()); m.material.side = THREE.DoubleSide; m.position.z = zFront; m.receiveShadow = true; m.castShadow = true; grp.add(m);
    for (const [x0, x1] of [[P.ixL, dL], [dR, P.ixR]]) B.add(G.box(x1 - x0, 0.1, 0.03), mat(C.base), mtx([(x0 + x1) / 2, 0.05, zFront - 0.015]));
  }
  // baseboards
  B.add(G.box(W, 0.1, 0.03), mat(C.base), mtx([cxR, 0.05, P.izB + 0.015]));
  B.add(G.box(0.03, 0.1, D), mat(C.base), mtx([P.ixL + 0.015, 0.05, (zFront + P.izB) / 2]));
  B.add(G.box(0.03, 0.1, D), mat(C.base), mtx([P.ixR - 0.015, 0.05, (zFront + P.izB) / 2]));
  // back door
  {
    const w = P.dxR - P.dxL, x = (P.dxL + P.dxR) / 2;
    B.add(G.rbox(w + 0.14, P.dH + 0.07, 0.05, 0.02), mat('#f1e3dc'), mtx([x, (P.dH + 0.07) / 2, P.izB + 0.025]));
    B.add(G.rbox(w - 0.04, P.dH - 0.04, 0.05, 0.015), mat(C.door, { roughness: 0.7 }), mtx([x, P.dH / 2, P.izB + 0.05]));
    for (const yy of [P.dH * 0.72, P.dH * 0.3]) B.add(G.rbox(w - 0.3, P.dH * 0.34, 0.02, 0.01), mat('#d39770', { roughness: 0.7 }), mtx([x, yy, P.izB + 0.08]));
    B.add(G.sph(0.035, 10, 8), mat('#d8c2a0', { roughness: 0.35, metalness: 0.5 }), mtx([P.dxR - 0.12, 1.02, P.izB + 0.1]));
  }
  // shelves with stacked stationery, paper rolls
  const r = rng(5);
  function shelf(x0, x1, top, zF, depth, rows) {
    const wood = mat(C.woodDark, { roughness: 0.72 }), w = x1 - x0, cx = (x0 + x1) / 2, zc = zF - depth / 2, th = 0.035;
    B.add(G.box(w, top, 0.02), mat(C.woodPanel, { roughness: 0.8 }), mtx([cx, top / 2, zF - depth + 0.01]));
    for (const x of [x0 + th / 2, x1 - th / 2]) B.add(G.rbox(th, top, depth, 0.01), wood, mtx([x, top / 2, zc]));
    const n = rows.length;
    for (let i = 0; i <= n; i++) { const y = i === n ? top - th / 2 : 0.06 + i * (top - 0.08) / n; B.add(G.rbox(w, th, depth, 0.008), wood, mtx([cx, y, zc])); }
    rows.forEach((row, i) => {
      const y0 = 0.06 + i * (top - 0.08) / n + th / 2, slot = (w - 0.12) / row.length;
      row.forEach((it, k) => {
        const x = x0 + 0.06 + slot * (k + 0.5);
        if (it.startsWith('mug')) { B.add(G.cyl(0.055, 0.05, 0.12, 14), mat('#fbfafa', { roughness: 0.35 }), mtx([x, y0 + 0.06, zc + 0.02])); return; }
        const [col, hgt] = it.split(':'); const hh = Number(hgt || 0.18);
        B.add(G.box(slot * 0.82, hh, depth * 0.72), mat(col, { roughness: 0.75 }), mtx([x, y0 + hh / 2, zc + 0.02]));
        if (hh > 0.1) for (let s = 0; s < 3; s++) B.add(G.box(slot * 0.84, 0.004, depth * 0.73), mat('#ffffff'), mtx([x, y0 + hh * (0.25 + s * 0.25), zc + 0.02]), { occ: false, shadow: false });
      });
    });
  }
  shelf(P.s1xL, P.s1xR, P.s1H, P.s1z, 0.34, [['#ffffff:0.16', '#9fc6e8:0.2', '#ffffff:0.14'], ['#5b8fd6:0.18', '#ef8db0:0.16', '#67bf72:0.2', '#f7f4f2:0.18'], ['#f7f3f3:0.17', '#f7f3f3:0.24', '#f2cf46:0.14', '#5b8fd6:0.15'], ['#ffffff:0.1']]);
  shelf(P.s2xL, P.s2xR, P.s2H, P.s2z, 0.32, [['#f4eef4:0.2', 'mug', '#cfd8e6:0.24'], ['mug', '#c9cbd6:0.12', '#f3a7b6:0.14', '#96c7e9:0.16'], ['#8fd09b:0.15', 'mug', '#f1a5c0:0.12', '#a6dc8f:0.12'], ['#f2f0f4:0.16', '#f4f0f4:0.16', '#f1e4f0:0.24', '#f6d65a:0.24']]);
  for (let i = 0; i < 4; i++) B.add(G.cyl(0.07, 0.07, 1.36 + (i % 2) * 0.16, 16), mat(C.paper, { roughness: 0.6 }), mtx([P.s1xL - 0.42 + (i % 2) * 0.17 + Math.floor(i / 2) * 0.08, (1.36 + (i % 2) * 0.16) / 2, P.izB + 0.22 + Math.floor(i / 2) * 0.1]));
  // till counter
  {
    const w = P.cxR - P.cxL, x = (P.cxL + P.cxR) / 2, z = P.czF - 0.3;
    B.add(G.rbox(w, P.ch - 0.16, 0.6, 0.03), mat(C.counter, { roughness: 0.6 }), mtx([x, 0.1 + (P.ch - 0.16) / 2, z]));
    B.add(G.rbox(w + 0.1, 0.07, 0.7, 0.03), mat(C.counterTop, { roughness: 0.45 }), mtx([x, P.ch - 0.035, z]));
    B.add(G.box(w - 0.06, 0.1, 0.54), mat(C.plinthGrey), mtx([x, 0.05, z - 0.01]));
    B.add(G.rbox(0.26, 0.06, 0.2, 0.02), mat(C.black), mtx([P.cxR - 0.32, P.ch + 0.03, z - 0.05]));
    B.add(G.rbox(0.24, 0.17, 0.025, 0.012), mat(C.black), mtx([P.cxR - 0.32, P.ch + 0.17, z - 0.12], [-0.25, 0, 0]));
  }
  // desks, chairs and what sits on them
  const desk = (k, items) => {
    const g = new THREE.Group(); g.position.set(P[k + 'x'], 0, P[k + 'z']); g.rotation.y = P[k + 'r']; g.updateMatrix();
    const L = (pos, rot = [0, 0, 0], s = 1) => new THREE.Matrix4().multiplyMatrices(g.matrix, mtx(pos, rot, s));
    const w = P.dW, d = P.dD, h = P.dHt, wood = mat(C.wood, { roughness: 0.62 });
    B.add(G.rbox(w, 0.045, d, 0.018), wood, L([0, h - 0.0225, 0]));
    B.add(G.rbox(w - 0.1, 0.28, 0.025, 0.01), mat(C.woodPanel, { roughness: 0.7 }), L([0, h - 0.19, d / 2 - 0.05]));
    for (const sx of [-1, 1]) B.add(G.rbox(0.025, 0.22, d - 0.12, 0.01), mat(C.woodPanel, { roughness: 0.7 }), L([sx * (w / 2 - 0.07), h - 0.16, 0]));
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) B.add(G.cyl(0.026, 0.024, h - 0.04, 12), mat(C.woodDark, { roughness: 0.6 }), L([sx * (w / 2 - 0.07), (h - 0.04) / 2, sz * (d / 2 - 0.07)]));
    const cz = -(d / 2 + 0.36);
    B.add(G.rbox(0.46, 0.07, 0.44, 0.03), mat(C.chair, { roughness: 0.55 }), L([0, 0.47, cz]));
    B.add(G.rbox(0.46, 0.46, 0.06, 0.04), mat(C.chair, { roughness: 0.55 }), L([0, 0.78, cz - 0.22], [0.08, 0, 0]));
    B.add(G.cyl(0.025, 0.025, 0.36, 8), mat(C.black), L([0, 0.26, cz]));
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; B.add(G.rbox(0.28, 0.03, 0.04, 0.012), mat(C.black), L([Math.cos(a) * 0.13, 0.04, cz + Math.sin(a) * 0.13], [0, -a, 0])); }
    if (items.includes('monitor')) {
      B.add(G.rbox(0.56, 0.36, 0.04, 0.018), mat(C.black, { roughness: 0.4 }), L([-0.18, h + 0.3, 0.02]));
      B.add(G.rbox(0.07, 0.16, 0.04, 0.01), mat(C.black), L([-0.18, h + 0.1, -0.02])); B.add(G.rbox(0.24, 0.015, 0.16, 0.006), mat(C.black), L([-0.18, h + 0.01, -0.02]));
    }
    if (items.includes('stack')) for (let i = 0; i < 11; i++) B.add(G.box(0.27, 0.022, 0.21), mat(i % 3 ? C.paper : '#f2eef0'), L([0.36 + Math.sin(i * 2.3) * 0.012, h + 0.012 + i * 0.023, 0.04], [0, Math.sin(i * 1.7) * 0.1, 0]), { occ: i === 0 });
    if (items.includes('laptop')) {
      B.add(G.rbox(0.42, 0.018, 0.3, 0.008), mat('#9b9ba6', { roughness: 0.35, metalness: 0.4 }), L([0, h + 0.01, 0.0]));
      B.add(G.rbox(0.42, 0.29, 0.014, 0.008), mat('#9b9ba6', { roughness: 0.35, metalness: 0.4 }), L([0, h + 0.15, -0.15], [-0.22, 0, 0]));
    }
    if (items.includes('tray')) {
      B.add(G.rbox(0.42, 0.1, 0.3, 0.02), mat(C.chair, { roughness: 0.55 }), L([-0.12, h + 0.05, -0.02], [0.1, 0, 0]));
      B.add(G.box(0.36, 0.01, 0.26), mat(C.paper), L([-0.12, h + 0.09, -0.02], [0.1, 0, 0]), { occ: false });
      B.add(G.rbox(0.3, 0.018, 0.21, 0.01), mat(C.black, { roughness: 0.3 }), L([0.36, h + 0.01, 0.08], [0, 0.2, 0]));
      B.add(G.box(0.26, 0.004, 0.17), mat('#e9edf4', { roughness: 0.2 }), L([0.36, h + 0.021, 0.08], [0, 0.2, 0]), { occ: false });
    }
    if (items.includes('phone')) B.add(G.rbox(0.08, 0.012, 0.16, 0.006), mat(C.black, { roughness: 0.3 }), L([0.16, h + 0.006, 0.1], [0, 0.4, 0]));
  };
  desk('D1', 'monitor phone'); desk('D2', 'monitor stack'); desk('D3', 'laptop'); desk('D4', 'tray');
  // pendant lamps (glow + a warm point light each)
  const lampLights = [];
  for (const i of [1, 2, 3]) {
    const x = P['lx' + i], y = P['ly' + i], z = P['lz' + i], rr = P.lr, sh = 0.3;
    B.add(G.cyl(0.006, 0.006, H - (y + sh), 6), mat('#3b3a40'), mtx([x, (H + y + sh) / 2, z]), { occ: false });
    B.add(G.cyl(0.05, 0.06, 0.03, 12), mat('#3b3a40'), mtx([x, H - 0.015, z]), { occ: false });
    B.add(G.cyl(rr * 0.24, rr, sh, 32, true), mat(C.orangeDeep, { roughness: 0.55, side: THREE.DoubleSide }), mtx([x, y + sh / 2, z]), { occ: false });
    B.add(new THREE.CircleGeometry(rr * 0.96, 32), new THREE.MeshStandardMaterial({ color: '#fff6e6', emissive: '#fff1d6', emissiveIntensity: 2.2 }), mtx([x, y + 0.01, z], [Math.PI / 2, 0, 0]), { occ: false, shadow: false });
    const pl = new THREE.PointLight('#ffd7a3', 2.0, 6, 1.8); pl.position.set(x, y - 0.15, z); grp.add(pl); lampLights.push(pl);
  }
  // morning light that falls in through the shop window (soft additive patches on floor and left wall)
  const patchTex = canvasTex(128, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, 'rgba(255,240,220,0)'); gr.addColorStop(0.2, 'rgba(255,240,220,1)'); gr.addColorStop(0.8, 'rgba(255,240,220,1)'); gr.addColorStop(1, 'rgba(255,240,220,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    const v = g.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.12, 'rgba(0,0,0,0)'); v.addColorStop(0.88, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    g.globalCompositeOperation = 'destination-out'; g.fillStyle = v; g.fillRect(0, 0, w, h);
  });
  const patchMat = new THREE.MeshBasicMaterial({ map: patchTex, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: true });
  const patch = (w, h, m) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), patchMat); p.matrixAutoUpdate = false; p.matrix.copy(m); p.renderOrder = 1; grp.add(p); };
  for (const [x, z, a, len, wid] of [[P.ixL + 1.6, P.izB + 5.2, 0.62, 4.2, 1.3], [P.ixL + 2.9, P.izB + 4.1, 0.62, 4.6, 1.0], [cxR + 0.9, P.izB + 5.6, 0.62, 5.2, 0.9]])
    patch(wid, len, mtx([x, 0.004, z], [-Math.PI / 2, 0, a]));
  for (const [z, w] of [[P.izB + 5.6, 1.1], [P.izB + 4.2, 0.8]]) patch(w, 2.2, mtx([P.ixL + 0.004, 1.35, z], [0, Math.PI / 2, 0]));
  // yellow mat just inside the door
  B.add(G.rbox(1.5, 0.012, 0.85, 0.006), mat('#f2c94c', { roughness: 0.95 }), mtx([0.1 - off[0], 0.006, zFront - 0.5]), { occ: false });
  B.build();
  // grey stand-ins for the cast (characters come in stage 3)
  const figs = new THREE.Group(); grp.add(figs);
  const seat = (k, back = 0.5) => { const rr = P[k + 'r'], c = Math.cos(rr), s = Math.sin(rr), dd = -back - P.dD / 2; return [P[k + 'x'] + s * dd, P[k + 'z'] + c * dd]; };
  const F = DATA.figs;
  for (const [name, k] of [['sinta', 'D1'], ['bayu', 'D2'], ['nadia', 'D3'], ['fajar', 'D4']]) {
    const [x, z] = seat(k); figs.add(standIn(F[name].head, true, x, z, -P[k + 'r']));
  }
  { const x = (P.cxL + P.cxR) / 2 + (F.dewi.x - (DATA.int.pc.cxL + DATA.int.pc.cxR) / 2); figs.add(standIn(F.dewi.head, false, x, P.czF - 0.55, 0)); }
  return { grp, batch: B, lampLights, P, off };
}

// a grey placeholder: head sphere at the measured height, body under it (seated or standing)
const phMat = new THREE.MeshStandardMaterial({ color: C.placeholder, roughness: 0.9 });
function standIn(headY, seated, x, z, rotY) {
  const g = new THREE.Group(), hr = 0.2;
  g.add(new THREE.Mesh(G.sph(hr, 20, 14), phMat)).position.set(0, headY, 0);
  const top = headY - hr - 0.04, bot = seated ? 0.46 : 0.02;
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, Math.max(0.05, top - bot - 0.34), 6, 14), phMat); body.position.y = (top + bot) / 2; g.add(body);
  if (seated) { const lap = new THREE.Mesh(G.rbox(0.34, 0.14, 0.42, 0.06), phMat); lap.position.set(0, 0.5, 0.18); g.add(lap); }
  g.position.set(x, 0, z); g.rotation.y = rotY;
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
const heru = standIn(DATA.heru.height - 0.2, false, ...[DATA.heru.k1[0], DATA.heru.k1[2]], Math.PI);
scene.add(heru);
const heruHead = heru.children[0], heruBody = heru.children[1], heruBodyH = heruBody.position.y;

// ---------- lights ----------
const hemi = new THREE.HemisphereLight('#b9adf0', '#e6acb6', 1.05); scene.add(hemi);
const sun = new THREE.DirectionalLight('#ffd2b0', 2.3);
const SUN_DIR = new THREE.Vector3(-0.5, 0.3, 0.81).normalize();
sun.target.position.set(-0.5, 2.5, -1); sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 45); scene.add(sun, sun.target);
sun.castShadow = true;
Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 15, bottom: -15, near: 5, far: 90 }); sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 4;

// =====================================================================================================
// AO bake: ray-traced ambient occlusion for the AO planes, run in small slices so the page stays responsive
// =====================================================================================================
const HEMI = (() => { const n = coarse ? 8 : 12, out = []; for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, phi = i * 2.399963; const r = Math.sqrt(u); out.push([r * Math.cos(phi), r * Math.sin(phi), Math.sqrt(1 - u)]); } return out; })();
let aoJob = null, aoDone = 0, aoTotal = 0;
function startAO() {
  if (Q.has('noao')) { document.getElementById('ao').textContent = 'mati'; return; }
  const geos = [];
  scene.updateMatrixWorld(true);
  const collect = (batch, root) => batch.occ.forEach(g => geos.push(g.clone().applyMatrix4(root.matrixWorld)));
  collect(X, ext); if (interior) collect(interior.batch, interior.grp);
  for (const t of aoTargets) { const g = clean(t.mesh.geometry).applyMatrix4(t.mesh.matrixWorld); geos.push(g); }
  const merged = mergeGeometries(geos.map(g => { const n = new THREE.BufferGeometry(); n.setAttribute('position', g.attributes.position); return n; }));
  const bvh = new MeshBVH(merged);
  aoTotal = aoTargets.reduce((a, t) => a + t.res[0] * t.res[1], 0); aoDone = 0;
  aoJob = (function* () {
    const ray = new THREE.Ray(), o = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
    const tu = new THREE.Vector3(), tv = new THREE.Vector3(), d = new THREE.Vector3();
    for (const t of aoTargets) {
      const [w, h] = t.res, m = t.mesh.matrixWorld, data = new Uint8Array(w * h).fill(255);
      a.set(t.local[0][0], t.local[0][1], 0).applyMatrix4(m); b.set(t.local[1][0], t.local[1][1], 0).applyMatrix4(m); c.set(t.local[2][0], t.local[2][1], 0).applyMatrix4(m);
      const U = b.clone().sub(a), V = c.clone().sub(a); n.crossVectors(U, V).normalize();
      tu.copy(U).normalize(); tv.crossVectors(n, tu);
      for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
          const u = (i + 0.5) / w, v = (j + 0.5) / h;
          if (t.skip && t.skip(t.shapeUV[0] + u * t.shapeUV[2], t.shapeUV[1] + v * t.shapeUV[3])) continue;
          o.copy(a).addScaledVector(U, u).addScaledVector(V, v).addScaledVector(n, 0.012);
          const rot = ((i * 73856093 ^ j * 19349663) >>> 0) % 1000 / 1000 * Math.PI * 2, cr = Math.cos(rot), sr = Math.sin(rot);
          let occ = 0;
          for (const [x, y, z] of HEMI) {
            const rx = x * cr - y * sr, ry = x * sr + y * cr;
            d.copy(tu).multiplyScalar(rx).addScaledVector(tv, ry).addScaledVector(n, z);
            ray.set(o, d);
            const hit = bvh.raycastFirst(ray, THREE.DoubleSide, 0.0, t.maxDist);
            if (hit) occ += 1 - hit.distance / t.maxDist;
          }
          data[j * w + i] = Math.round(255 * (1 - t.strength * Math.min(1, occ / HEMI.length * 1.6)));
        }
        aoDone += w; yield;
      }
      // soften and upload
      const out = new Uint8Array(w * h);
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
        let s = 0, k = 0;
        for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) { const ii = i + x, jj = j + y; if (ii < 0 || jj < 0 || ii >= w || jj >= h) continue; s += data[jj * w + ii]; k++; }
        out[j * w + i] = s / k;
      }
      const tex = new THREE.DataTexture(out, w, h, THREE.RedFormat, THREE.UnsignedByteType);
      tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true;
      if (t.shapeUV) { tex.repeat.set(1 / t.shapeUV[2], 1 / t.shapeUV[3]); tex.offset.set(-t.shapeUV[0] / t.shapeUV[2], -t.shapeUV[1] / t.shapeUV[3]); }
      t.mesh.material.aoMap = tex; t.mesh.material.aoMapIntensity = 1; t.mesh.material.needsUpdate = true;
      needsRender = true;
    }
  })();
}
function stepAO(budgetMs) {
  if (!aoJob) return;
  const t0 = performance.now();
  while (performance.now() - t0 < budgetMs) { if (aoJob.next().done) { aoJob = null; break; } }
  document.getElementById('ao').textContent = aoJob ? Math.round(aoDone / aoTotal * 100) + '%' : 'siap';
}

// =====================================================================================================
// CAMERA TAKE (stage 2: plain interpolation between the solved keyframe cameras)
// =====================================================================================================
// scroll in screens: hold K0, crane down to K1, short hold, follow through the door to K2, hold
const SEG = [['hold', 'K0', 0.9], ['move', 'K0', 1.0], ['hold', 'K1', 0.3], ['move', 'K1', 1.2], ['hold', 'K2', 0.6]];
const SEG_TOTAL = SEG.reduce((a, s) => a + s[2], 0);
document.getElementById('track').style.height = (SEG_TOTAL + 1) * 100 + 'vh';
let fmtT = 0;
const kf = name => {
  const a = DATA.cams.pc[name], b = DATA.cams.hp[name];
  return { pos: new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), fmtT), quat: new THREE.Quaternion(...a.quat).slerp(new THREE.Quaternion(...b.quat), fmtT), fov: lerp(a.fov, b.fov, fmtT) };
};
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
function cameraAt(p) {
  let acc = 0, s = p * SEG_TOTAL;
  for (const [type, from, len] of SEG) {
    if (s <= acc + len || from === 'K2') {
      const u = clamp01((s - acc) / len);
      if (type === 'hold') return { ...kf(from), name: from };
      const A = kf(from), Bk = kf(from === 'K0' ? 'K1' : 'K2'), e = ease(u);
      let pos;
      if (from === 'K0') pos = A.pos.clone().lerp(Bk.pos, e);
      else {
        const hx = heru.position.x;
        const curve = new THREE.CatmullRomCurve3([A.pos, new THREE.Vector3(hx * 0.6, 1.85, 3.2), new THREE.Vector3(hx * 0.4, 1.78, 0.4), Bk.pos], false, 'centripetal');
        pos = curve.getPoint(e);
      }
      return { pos, quat: A.quat.clone().slerp(Bk.quat, e), fov: lerp(A.fov, Bk.fov, e), name: u < 0.5 ? from : (from === 'K0' ? 'K1' : 'K2') };
    }
    acc += len;
  }
}
function heruAt(p) { // stand-in walk: K1 spot to the K2 spot (scale follows the keyframes, see review notes)
  const s = p * SEG_TOTAL, a = 0.9 + 1.0 + 0.3, u = ease(clamp01((s - a) / 1.2));
  const k2 = new THREE.Vector3(...DATA.heruK2.pc).lerp(new THREE.Vector3(...DATA.heruK2.hp), fmtT);
  const h1 = DATA.heru.height - 0.2, hy = lerp(h1, k2.y, u);
  const p1 = new THREE.Vector3(DATA.heru.k1[0], 0, DATA.heru.k1[2]), p2 = new THREE.Vector3(k2.x, 0, k2.z);
  heru.position.lerpVectors(p1, p2, u);
  heruHead.position.y = hy; heruBody.scale.y = hy / h1; heruBody.position.y = heruBodyH * hy / h1;
  hinge.rotation.y = -1.45 * ease(clamp01((s - a + 0.15) / 0.5));
}

// ---------- sizing, format blend ----------
function formatT(aspect) { const a = Math.log(16 / 9), b = Math.log(9 / 16); return clamp01((a - Math.log(aspect)) / (a - b)); }
let builtT = -1;
function rebuildInterior(t) {
  if (interior) {
    for (let i = aoTargets.length - 1; i >= 0; i--) if (aoTargets[i].mesh.parent === interior.grp) aoTargets.splice(i, 1);
    scene.remove(interior.grp); interior.grp.traverse(o => { if (o.isMesh) o.geometry.dispose(); });
  }
  interior = buildInterior(t); scene.add(interior.grp); builtT = t;
  renderer.shadowMap.needsUpdate = true; startAO();
}
const maxDpr = () => saver ? 1 : Math.min(devicePixelRatio || 1, coarse ? 1.75 : 2);
let dprCap = 9;
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setPixelRatio(Math.min(maxDpr(), dprCap)); renderer.setSize(w, h, false);
  camera.aspect = w / h;
  const fq = Q.get('fmt');
  fmtT = fq === 'pc' ? 0 : fq === 'hp' ? 1 : formatT(w / h);
  for (const f of ['pc', 'hp']) { cloudSets[f].visible = (f === 'pc') === (fmtT < 0.5); birdSets[f].visible = cloudSets[f].visible; }
  if (Math.abs(fmtT - builtT) > 0.08) rebuildInterior(fmtT);
  sun.shadow.mapSize.setScalar(saver || coarse ? 1024 : 2048); sun.shadow.map?.dispose(); sun.shadow.map = null; renderer.shadowMap.needsUpdate = true;
  document.getElementById('dpr').textContent = renderer.getPixelRatio().toFixed(2);
  needsRender = true;
}

// ---------- scroll, loop, HUD ----------
let target = 0, shown = 0, needsRender = true;
const track = document.getElementById('track');
const readScroll = () => { const max = track.offsetHeight - innerHeight; target = max > 0 ? clamp01(scrollY / max) : 0; };
addEventListener('scroll', readScroll, { passive: true });
const kq = Q.get('k');
if (kq) { const at = { K0: 0.45, K1: 2.05, K2: 3.9 }[kq] ?? 0; target = shown = at / SEG_TOTAL; } else readScroll();
new ResizeObserver(resize).observe(stage);
resize();

const hud = { fps: document.getElementById('fps'), calls: document.getElementById('calls'), tris: document.getElementById('tris'), prog: document.getElementById('prog'), hint: document.getElementById('hint'), kf: document.getElementById('kf') };
if (Q.has('shot')) document.getElementById('hud').hidden = true, hud.hint.hidden = true;
document.getElementById('quality').addEventListener('click', e => { saver = !saver; e.currentTarget.textContent = 'Mode hemat: ' + (saver ? 'nyala' : 'mati'); interior?.lampLights.forEach(l => l.visible = !saver); resize(); });

let lost = false;
renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; });
renderer.domElement.addEventListener('webglcontextrestored', () => { lost = false; renderer.shadowMap.needsUpdate = true; needsRender = true; });

const HEMI_OUT = { sky: new THREE.Color('#b9adf0'), ground: new THREE.Color('#e6acb6'), i: 1.05 }, HEMI_IN = { sky: new THREE.Color('#ece2f6'), ground: new THREE.Color('#ecc9c9'), i: 1.2 };
const timer = new THREE.Timer(); timer.connect(document);
let frames = 0, acc = 0, slow = 0, lastP = -1;
function frame(ts) {
  requestAnimationFrame(frame);
  timer.update(ts); const dt = Math.min(timer.getDelta(), 0.1);
  if (lost) return;
  if (!kq) shown += (target - shown) * Math.min(1, dt * 8);
  if (Math.abs(shown - target) < 1e-5) shown = target;
  stepAO(coarse ? 6 : 10);
  if (Math.abs(shown - lastP) > 1e-6) { lastP = shown; needsRender = true; }
  if (!needsRender) return;
  needsRender = false;
  const c = cameraAt(shown); heruAt(shown);
  const inside = THREE.MathUtils.smoothstep(-c.pos.z, -0.6, 0.6);
  hemi.color.copy(HEMI_OUT.sky).lerp(HEMI_IN.sky, inside); hemi.groundColor.copy(HEMI_OUT.ground).lerp(HEMI_IN.ground, inside);
  hemi.intensity = lerp(HEMI_OUT.i, HEMI_IN.i, inside); scene.environmentIntensity = lerp(0.3, 0.35, inside);
  camera.position.copy(c.pos); camera.quaternion.copy(c.quat); camera.fov = c.fov; camera.updateProjectionMatrix();
  const t0 = performance.now();
  renderer.render(scene, camera);
  const ft = performance.now() - t0;
  frames++; acc += dt;
  if (dt > 0.034 && renderer.getPixelRatio() > 1) { if (++slow > 30) { dprCap = Math.max(1, renderer.getPixelRatio() - 0.25); slow = 0; resize(); } } else slow = Math.max(0, slow - 1);
  if (acc > 0.5) { hud.fps.textContent = Math.round(frames / acc); frames = 0; acc = 0; }
  hud.calls.textContent = renderer.info.render.calls;
  hud.tris.textContent = (renderer.info.render.triangles / 1000).toFixed(1) + ' rb';
  hud.prog.style.width = (shown * 100).toFixed(1) + '%';
  hud.hint.style.opacity = shown > 0.02 ? 0 : 1;
  hud.kf.textContent = c.name;
  void ft;
}
requestAnimationFrame(frame);
window.__k02 = { renderer, scene, camera, setP: v => { target = shown = v; needsRender = true; }, aoState: () => ({ done: !aoJob, pct: aoTotal ? aoDone / aoTotal : 1 }), data: DATA,
  lights: { sun, hemi, HEMI_OUT, SUN_DIR }, keyP: { K0: 0.45 / SEG_TOTAL, K1: 2.05 / SEG_TOTAL, K2: 3.9 / SEG_TOTAL } };
