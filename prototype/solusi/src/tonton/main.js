// Tonton: one Three.js take per solution, mounted inside the page's overlay and driven by its scroller.
// The page owns the copy (step card, rail, end card); this module owns the canvas, the camera, the ORB and the hotspots.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { makeMat, canvasTex, clamp01, lerp, ease, disposeTree } from './kit.js';
import orderGrup from './takes/order-grup.js';

const TAKES = { 'order-grup': orderGrup };
export const has = slug => slug in TAKES;

const toV = a => a.isVector3 ? a.clone() : new THREE.Vector3(...a);
// 0 at 16:9 (pc keyframes) .. 1 at 9:16 (hp keyframes), as in k0-k2
const formatT = aspect => { const a = Math.log(16 / 9), b = Math.log(9 / 16); return clamp01((a - Math.log(aspect)) / (a - b)); };
const _m = new THREE.Matrix4(), _up = new THREE.Vector3(0, 1, 0);
const quatLook = (pos, look) => new THREE.Quaternion().setFromRotationMatrix(_m.lookAt(pos, look, _up));

export async function mount({ slug, host, hots, scroller, track, reduce = false, onStation = () => {}, onFrame = () => {}, onZoom = () => {} }) {
  const Q = new URLSearchParams(location.search);
  const coarse = matchMedia('(pointer: coarse)').matches;
  let saver = Q.has('hemat');
  // screens are drawn on canvases with the page font, so wait for it (but never for long)
  if (document.fonts) await Promise.race([document.fonts.load('700 20px "Plus Jakarta Sans"'), new Promise(r => setTimeout(r, 1500))]).catch(() => {});

  // ---------- renderer (same look as k0-k2: Neutral tone mapping, exposure 0.9, PCF shadows, room environment) ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: Q.has('shot') });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.03, 600);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex; scene.environmentIntensity = 0.3;

  // sky dome: lavender at the top, warm pink at the horizon
  const skyTex = canvasTex(renderer, 4, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#8fa6ea'); gr.addColorStop(0.42, '#b9c3f2'); gr.addColorStop(0.5, '#f1d9e6'); gr.addColorStop(1, '#f1d9e6');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false, toneMapped: false }));
  sky.renderOrder = -1; scene.add(sky);

  const mat = makeMat();
  const take = TAKES[slug]({ scene, renderer, mat });

  // ---------- lights ----------
  const hemi = new THREE.HemisphereLight('#b9adf0', '#e6acb6', 1.05); scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffd2b0', 2.3);
  const SUN_DIR = new THREE.Vector3(-0.5, 0.3, 0.81).normalize();
  sun.target.position.set(-1, 1.5, -4); sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 45);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12, near: 5, far: 90 });
  sun.shadow.mapSize.setScalar(saver || coarse ? 1024 : 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);
  const HEMI_OUT = { sky: new THREE.Color('#b9adf0'), ground: new THREE.Color('#e6acb6'), i: 1.05 }, HEMI_IN = { sky: new THREE.Color('#ece2f6'), ground: new THREE.Color('#ecc9c9'), i: 1.2 };
  const lampI = take.lamps.map(l => l.intensity);
  const setSaver = on => { saver = on; take.lamps.forEach((l, i) => { l.intensity = on ? 0 : lampI[i]; }); resize(); };

  // ---------- ORB: the assistant, the only actor of the take ----------
  const orb = new THREE.Group();
  const glowTex = canvasTex(renderer, 128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    gr.addColorStop(0, 'rgba(225,253,255,.9)'); gr.addColorStop(0.16, 'rgba(120,240,255,.55)'); gr.addColorStop(0.42, 'rgba(53,234,254,.14)'); gr.addColorStop(1, 'rgba(53,234,254,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
  });
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.04, 24, 16), new THREE.MeshBasicMaterial({ color: '#e9feff', toneMapped: false }));
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  glow.scale.setScalar(0.26);
  const orbLight = new THREE.PointLight('#5fe9ff', 0, 1.8, 2);
  orb.add(core, glow, orbLight); scene.add(orb);
  renderer.shadowMap.needsUpdate = true;

  // ---------- the take: holds and moves between stations, in screens of scroll ----------
  const ST = take.stations;
  const segs = []; let total = 0;
  ST.forEach((s, i) => {
    segs.push({ type: 'hold', i, a: total, len: s.hold }); total += s.hold;
    if (s.move && i < ST.length - 1) { segs.push({ type: 'move', i, j: i + 1, a: total, len: s.move }); total += s.move; }
  });
  track.style.height = (total + 1) * 100 + '%';
  let fmtT = 0;
  const kf = i => {
    const s = ST[i], pos = toV(s.pc.pos).lerp(toV(s.hp.pos), fmtT), look = toV(s.pc.look).lerp(toV(s.hp.look), fmtT);
    return { pos, quat: quatLook(pos, look), fov: lerp(s.pc.fov, s.hp.fov, fmtT) };
  };
  const segAt = p => {
    const s = clamp01(p) * total;
    for (const g of segs) if (s <= g.a + g.len) return { g, u: clamp01((s - g.a) / g.len) };
    const g = segs[segs.length - 1]; return { g, u: 1 };
  };
  function cameraAt(p) {
    const { g, u } = segAt(p);
    if (g.type === 'hold') return { ...kf(g.i), station: g.i, hold: true, endT: g.i === ST.length - 1 ? u : 0, g, u };
    const A = kf(g.i), Bk = kf(g.j), e = ease(u), via = ST[g.j].via;
    const pos = via ? new THREE.CatmullRomCurve3([A.pos, ...via.map(toV), Bk.pos], false, 'centripetal').getPoint(e) : A.pos.clone().lerp(Bk.pos, e);
    return { pos, quat: A.quat.clone().slerp(Bk.quat, e), fov: lerp(A.fov, Bk.fov, e), station: u < 0.5 ? g.i : g.j, hold: false, endT: 0, g, u };
  }
  function orbAt({ g, u }) {
    if (g.type === 'hold') { const o = ST[g.i].orb; return o ? { pos: toV(o), s: 1 } : { pos: null, s: 0 }; }
    const a = ST[g.i].orb, b = ST[g.j].orb, e = ease(u);
    if (a && b) return { pos: toV(a).lerp(toV(b), e).add(new THREE.Vector3(0, Math.sin(Math.PI * e) * 0.35, 0)), s: 1 };
    if (b) return { pos: toV(b), s: e };
    if (a) return { pos: toV(a), s: 1 - e };
    return { pos: null, s: 0 };
  }

  // ---------- hotspots: real buttons glued to points in the scene ----------
  hots.textContent = '';
  const HS = take.hotspots.map(h => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tt-hot'; b.tabIndex = -1; b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="lb"></span>';
    b.querySelector('.lb').textContent = h.label;
    b.addEventListener('click', () => zoomTo(h));
    hots.appendChild(b);
    return { ...h, at: toV(h.at), el: b, on: false };
  });
  let zoom = null; // { h, t, dir, top }
  function zoomTo(h) {
    zoom = { h, t: reduce ? 1 : 0, dir: 1, top: scroller.scrollTop };
    onZoom(h.label); needsRender = true;
  }
  function unzoom() {
    if (!zoom) return false;
    if (reduce) { zoom = null; onZoom(null); } else zoom.dir = -1;
    needsRender = true; return true;
  }
  const _p = new THREE.Vector3();
  function placeHotspots(c, w, h) {
    for (const s of HS) {
      _p.copy(s.at).project(camera);
      const x = (_p.x + 1) / 2 * w, y = (1 - _p.y) / 2 * h;
      const vis = !zoom && c.hold && c.station === s.station && _p.z < 1 && x > 24 && x < w - 24 && y > 24 && y < h - 24;
      if (vis) s.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
      if (vis !== s.on) { s.on = vis; s.el.classList.toggle('on', vis); s.el.tabIndex = vis ? 0 : -1; s.el.setAttribute('aria-hidden', String(!vis)); }
    }
  }

  // ---------- sizing ----------
  const maxDpr = () => saver ? 1 : Math.min(devicePixelRatio || 1, coarse ? 1.75 : 2);
  let dprCap = 9, W = 1, H = 1;
  function resize() {
    W = host.clientWidth || 1; H = host.clientHeight || 1;
    renderer.setPixelRatio(Math.min(maxDpr(), dprCap)); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const fq = Q.get('fmt'); fmtT = fq === 'pc' ? 0 : fq === 'hp' ? 1 : formatT(W / H);
    needsRender = true;
  }

  // ---------- scroll, loop ----------
  let target = 0, shown = 0, needsRender = true, lastStation = -1, raf = 0, lost = false;
  const readScroll = () => {
    const max = scroller.scrollHeight - scroller.clientHeight; target = max > 0 ? clamp01(scroller.scrollTop / max) : 0;
    if (zoom && zoom.dir > 0 && Math.abs(scroller.scrollTop - zoom.top) > 24) unzoom();
  };
  scroller.addEventListener('scroll', readScroll, { passive: true });
  const ro = new ResizeObserver(resize); ro.observe(host);
  resize(); readScroll(); shown = target;
  const onLost = e => { e.preventDefault(); lost = true; }, onRestored = () => { lost = false; renderer.shadowMap.needsUpdate = true; needsRender = true; };
  renderer.domElement.addEventListener('webglcontextlost', onLost);
  renderer.domElement.addEventListener('webglcontextrestored', onRestored);

  const hud = Q.has('hud') ? Object.assign(document.createElement('div'), { className: 'tt-hud' }) : null;
  if (hud) host.parentElement.appendChild(hud);
  const timer = new THREE.Timer(); timer.connect(document);
  let frames = 0, acc = 0, slow = 0, lastP = -1;
  const zc = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() };
  function frame(ts) {
    raf = requestAnimationFrame(frame);
    timer.update(ts); const dt = Math.min(timer.getDelta(), 0.1);
    if (lost) return;
    shown = reduce ? target : shown + (target - shown) * Math.min(1, dt * 8);
    if (Math.abs(shown - target) < 1e-5) shown = target;
    if (Math.abs(shown - lastP) > 1e-6) { lastP = shown; needsRender = true; }
    if (zoom) {
      const t0 = zoom.t; zoom.t = clamp01(zoom.t + zoom.dir * dt / 0.7);
      if (zoom.t !== t0) needsRender = true;
      if (zoom.dir < 0 && zoom.t === 0) { zoom = null; onZoom(null); needsRender = true; }
    }
    if (!needsRender) return;
    needsRender = false;

    const c = cameraAt(shown);
    let pos = c.pos, quat = c.quat, fov = c.fov;
    if (zoom) {
      const e = ease(zoom.t), z = zoom.h.zoom;
      zc.pos.copy(toV(z.pos)); zc.quat.copy(quatLook(zc.pos, toV(z.look)));
      pos = pos.clone().lerp(zc.pos, e); quat = quat.clone().slerp(zc.quat, e); fov = lerp(fov, lerp(z.fov, z.fov * 1.35, fmtT), e);
    }
    camera.position.copy(pos); camera.quaternion.copy(quat); camera.fov = fov;
    // lens shift, so the subject clears the step card: right of centre on desktop (card bottom-left), higher on phones (card in the bottom band)
    const free = zoom ? 1 - ease(zoom.t) : 1;
    camera.setViewOffset(W, H, -0.12 * (1 - fmtT) * free * W, 0.1 * fmtT * free * H, W, H);

    const o = orbAt(c);
    orb.visible = o.s > 0.001;
    if (o.pos) orb.position.copy(o.pos);
    orb.scale.setScalar(Math.max(0.001, o.s)); orbLight.intensity = 0.5 * o.s;

    const inside = THREE.MathUtils.smoothstep(-pos.z, -take.insideZ - 0.6, -take.insideZ + 0.8);
    hemi.color.copy(HEMI_OUT.sky).lerp(HEMI_IN.sky, inside); hemi.groundColor.copy(HEMI_OUT.ground).lerp(HEMI_IN.ground, inside);
    hemi.intensity = lerp(HEMI_OUT.i, HEMI_IN.i, inside); scene.environmentIntensity = lerp(0.3, 0.35, inside);

    renderer.render(scene, camera);
    placeHotspots(c, W, H);
    if (c.station !== lastStation) { lastStation = c.station; onStation(c.station, ST[c.station]); }
    onFrame({ p: shown, station: c.station, endT: c.endT });

    frames++; acc += dt;
    if (dt > 0.034 && renderer.getPixelRatio() > 1) { if (++slow > 30) { dprCap = Math.max(1, renderer.getPixelRatio() - 0.25); slow = 0; resize(); } } else slow = Math.max(0, slow - 1);
    if (hud && acc > 0.5) { hud.textContent = `${Math.round(frames / acc)} fps · ${renderer.info.render.calls} draw · ${(renderer.info.render.triangles / 1000).toFixed(1)} rb · dpr ${renderer.getPixelRatio().toFixed(2)}`; frames = 0; acc = 0; }
  }
  raf = requestAnimationFrame(frame);

  // scroll position (px) of a station: the middle of its hold (the last one stops before the end card)
  function stationTop(i) {
    const g = segs.find(s => s.type === 'hold' && s.i === i);
    const at = g.a + g.len * (i === ST.length - 1 ? 0.2 : 0.5);
    return at / total * (scroller.scrollHeight - scroller.clientHeight);
  }
  const api = {
    stations: ST.map(s => ({ kind: s.kind, step: s.step })),
    jump(i) { unzoom(); scroller.scrollTo({ top: stationTop(i), behavior: reduce ? 'auto' : 'smooth' }); },
    toEnd() { scroller.scrollTo({ top: scroller.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); },
    unzoom, setSaver, get saver() { return saver; },
    destroy() {
      cancelAnimationFrame(raf); ro.disconnect(); timer.dispose?.();
      scroller.removeEventListener('scroll', readScroll);
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onRestored);
      disposeTree(scene); envTex.dispose(); pmrem.dispose();
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
      hots.textContent = ''; hud?.remove(); track.style.height = '';
      if (window.__tonton === api) delete window.__tonton;
    },
    // dev: jump the take without scrolling (screenshots)
    setP(v) { target = shown = clamp01(v); needsRender = true; },
    keyP: i => { const g = segs.find(s => s.type === 'hold' && s.i === i); return (g.a + g.len * 0.5) / total; },
  };
  window.__tonton = api;
  return api;
}
