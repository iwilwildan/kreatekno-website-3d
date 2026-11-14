import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

/*
 * Orthographic etalase pass (v1 13 Nov, VISUAL 8.4): 1 world unit = 1 CSS pixel. The HTML keeps the room,
 * counter and window below the canvas and the box faces (status, title, chips, apps) above it; this pass
 * draws only the planks and the boxes in between, read from the DOM every frame so hover, focus and shelf
 * scrolling follow the HTML exactly.
 *
 * Geometry is built at the measured pixel size (cached), not scaled from a unit box, so the corner radii
 * (box 6, panel 10, plank 4) stay round. Draw calls: one for the planks, then three per visible shelf row
 * (boxes, panels, shadows), each clipped to its row.
 */
const TILT = 0.2;
const COS = Math.cos(TILT);
const MAX_BOXES = 24;
const MAX_PLANKS = 12;

type Rect = { left: number; top: number; width: number; height: number };

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** Soft contact shadow: a blurred ellipse drawn just below each box, behind it, so it sits on the plank. */
function softShadowTexture() {
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 32;
  const g = c.getContext("2d");
  if (g) {
    g.setTransform(1, 0, 0, 0.25, 0, 0);
    const rg = g.createRadialGradient(64, 64, 4, 64, 64, 62);
    rg.addColorStop(0, "rgba(0,0,0,.95)");
    rg.addColorStop(0.5, "rgba(0,0,0,.7)");
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 128, 128);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function buildRakPass() {
  const cache = new Map<string, THREE.BufferGeometry>();
  const rbox = (w: number, h: number, d: number, r: number) => {
    w = Math.max(2, Math.round(w));
    h = Math.max(2, Math.round(h));
    d = Math.max(2, Math.round(d));
    r = Math.max(0.5, Math.min(r, w / 2 - 0.5, h / 2 - 0.5, d / 2 - 0.5));
    const key = `b${w}|${h}|${d}|${r}`;
    let g = cache.get(key);
    if (!g) {
      g = new RoundedBoxGeometry(w, h, d, 3, r);
      g.translate(0, 0, -d / 2); // front face at z 0
      cache.set(key, g);
    }
    return g;
  };
  const rrect = (w: number, h: number, r: number) => {
    w = Math.max(2, Math.round(w));
    h = Math.max(2, Math.round(h));
    const key = `p${w}|${h}|${r}`;
    let g = cache.get(key);
    if (!g) {
      g = new THREE.ShapeGeometry(roundedRectShape(w, h, r), 6);
      cache.set(key, g);
    }
    return g;
  };
  /** Use one geometry sized from the first element; other instances scale by their ratio to it. */
  const sizeGeometry = (mesh: THREE.InstancedMesh, geometry: THREE.BufferGeometry, w: number, h: number) => {
    if (mesh.geometry !== geometry) mesh.geometry = geometry;
    return { width: Math.max(2, Math.round(w)), height: Math.max(2, Math.round(h / COS)) };
  };

  const plankScene = new THREE.Scene();
  const boxScene = new THREE.Scene();
  for (const scene of [plankScene, boxScene]) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0xe6defc, 2.35));
    const light = new THREE.DirectionalLight(0xffffff, 0.95);
    light.position.set(-0.35, 0.9, 1);
    scene.add(light);
  }
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, 1, 4000);
  camera.position.z = 2000;

  const materials: THREE.Material[] = [];
  const standard = (color: string, options: THREE.MeshStandardMaterialParameters = {}) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...options });
    materials.push(m);
    return m;
  };
  const instanced = (material: THREE.Material, count: number, scene: THREE.Scene, geometry = rbox(10, 10, 10, 2)) => {
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);
    return mesh;
  };
  const planks = instanced(standard("#B4A9D5", { roughness: 0.55 }), MAX_PLANKS, plankScene);
  const boxes = instanced(standard("#FFFFFF", { roughness: 0.62 }), MAX_BOXES, boxScene);
  // a panel lying on a box front: same tilt, drawn after the boxes without depth test (it only ever sits on its own box)
  const panels = instanced(standard("#F1F1F5", { roughness: 0.5, depthTest: false }), MAX_BOXES, boxScene);
  panels.renderOrder = 2;
  const shadowTexture = softShadowTexture();
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x05071f,
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
  });
  materials.push(shadowMaterial);
  const shadowGeometry = new THREE.PlaneGeometry(1, 1);
  const shadows = instanced(shadowMaterial, MAX_BOXES, boxScene, shadowGeometry);

  const tilted = new THREE.Object3D();
  tilted.rotation.x = TILT;
  const flat = new THREE.Object3D();
  const color = new THREE.Color();
  let colorKey = "";

  const setTilted = (mesh: THREE.InstancedMesh, i: number, r: Rect, gw: number, gh: number, z: number) => {
    tilted.position.set(r.left + r.width / 2, -(r.top + r.height / 2), z);
    tilted.scale.set(r.width / gw, r.height / COS / gh, 1);
    tilted.updateMatrix();
    mesh.setMatrixAt(i, tilted.matrix);
  };
  const setShadow = (i: number, cx: number, bottom: number, w: number, lift: number) => {
    const k = 1 - Math.min(1, Math.max(0, lift) / 6) * 0.25;
    flat.position.set(cx, -(bottom + 8), -30);
    flat.scale.set(w * 1.24 * k, 40, 1);
    flat.updateMatrix();
    shadows.setMatrixAt(i, flat.matrix);
  };

  /** Numbers for QA (`window.__solusi.rak`): what the last frame placed. */
  const stats = { calls: 0, boxes: 0, planks: 0, rows: 0, firstBox: null as Rect | null, firstLift: 0 };

  const render = (renderer: THREE.WebGLRenderer, viewportWidth: number, viewportHeight: number) => {
    stats.calls = stats.rows = 0;
    const section = document.querySelector<HTMLElement>(".etalase");
    if (!section) return false;
    const sr = section.getBoundingClientRect();
    if (sr.bottom <= 0 || sr.top >= viewportHeight || sr.width <= 0) return false;
    const frame = section.querySelector<HTMLElement>(".frame")?.getBoundingClientRect() ?? sr;

    camera.left = 0;
    camera.right = viewportWidth;
    camera.top = 0;
    camera.bottom = -viewportHeight;
    camera.updateProjectionMatrix();
    renderer.setViewport(0, 0, viewportWidth, viewportHeight);
    if (cache.size > 400) {
      const inUse = new Set([planks.geometry, boxes.geometry, panels.geometry]);
      for (const [key, g] of cache)
        if (!inUse.has(g)) {
          g.dispose();
          cache.delete(key);
        }
    }
    const scissor = (r: { left: number; top: number; right: number; bottom: number }) => {
      const x0 = Math.max(0, r.left);
      const y0 = Math.max(0, r.top);
      const x1 = Math.min(viewportWidth, r.right);
      const y1 = Math.min(viewportHeight, r.bottom);
      if (x1 <= x0 || y1 <= y0) return false;
      renderer.setScissor(Math.round(x0), Math.round(viewportHeight - y1), Math.round(x1 - x0), Math.round(y1 - y0));
      return true;
    };

    // planks under the boxes (the window, body and plinth are CSS)
    const plankEls = [...section.querySelectorAll<HTMLElement>(".plank")].slice(0, MAX_PLANKS);
    if (plankEls.length) {
      const k0 = plankEls[0].getBoundingClientRect();
      const q = sizeGeometry(planks, rbox(k0.width, k0.height / COS, 52, 4), k0.width, k0.height);
      plankEls.forEach((el, i) => setTilted(planks, i, el.getBoundingClientRect(), q.width, q.height, 8));
    }
    planks.count = plankEls.length;
    planks.instanceMatrix.needsUpdate = true;
    stats.planks = planks.count;

    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    let drawn = false;
    if (scissor(sr)) {
      renderer.clearDepth();
      renderer.render(plankScene, camera);
      stats.calls += 1;
      drawn = true;
    }

    // boxes: one tilted box, its face panel and a contact shadow per product, read from the HTML box
    const pks = [...section.querySelectorAll<HTMLElement>(".pk[data-slot]")].slice(0, MAX_BOXES);
    if (pks.length) {
      const b0 = pks[0].getBoundingClientRect();
      const c0 = pks[0].querySelector(".cover")?.getBoundingClientRect() ?? b0;
      const bq = sizeGeometry(boxes, rbox(b0.width, b0.height / COS, 64, 6), b0.width, b0.height);
      const cq = sizeGeometry(panels, rrect(c0.width, c0.height / COS, 10), c0.width, c0.height);
      const key = pks.map((pk) => pk.dataset.color).join();
      pks.forEach((pk, i) => {
        const r = pk.getBoundingClientRect();
        const cover = pk.querySelector(".cover")?.getBoundingClientRect() ?? r;
        const slot = (pk.closest(".slot") ?? pk).getBoundingClientRect();
        setTilted(boxes, i, r, bq.width, bq.height, 0);
        setTilted(panels, i, cover, cq.width, cq.height, 2);
        setShadow(i, r.left + r.width / 2, slot.bottom, r.width, slot.bottom - r.bottom);
        if (key !== colorKey) boxes.setColorAt(i, color.set(pk.dataset.color || "#CDB8F8"));
        if (i === 0) {
          stats.firstBox = { left: r.left, top: r.top, width: r.width, height: r.height };
          stats.firstLift = slot.bottom - r.bottom;
        }
      });
      if (key !== colorKey && boxes.instanceColor) boxes.instanceColor.needsUpdate = true;
      colorKey = key;
    }
    boxes.count = panels.count = shadows.count = pks.length;
    boxes.instanceMatrix.needsUpdate = panels.instanceMatrix.needsUpdate = shadows.instanceMatrix.needsUpdate = true;
    stats.boxes = pks.length;

    // each shelf row is its own scroll window: clip the boxes to it
    if (pks.length)
      for (const track of section.querySelectorAll<HTMLElement>(".track")) {
        const r = track.getBoundingClientRect();
        const clip = {
          left: Math.max(r.left, frame.left),
          right: Math.min(r.right, frame.right),
          top: Math.max(r.top, sr.top),
          bottom: Math.min(r.bottom, sr.bottom),
        };
        if (!scissor(clip)) continue;
        renderer.clearDepth();
        renderer.render(boxScene, camera);
        stats.calls += 3;
        stats.rows += 1;
        drawn = true;
      }
    renderer.autoClear = autoClear;
    return drawn;
  };

  return {
    render,
    stats,
    dispose() {
      for (const g of cache.values()) g.dispose();
      cache.clear();
      shadowGeometry.dispose();
      shadowTexture.dispose();
      for (const m of materials) m.dispose();
      for (const mesh of [planks, boxes, panels, shadows]) mesh.dispose();
    },
  };
}
