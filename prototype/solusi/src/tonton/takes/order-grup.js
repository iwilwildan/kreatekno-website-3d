// order-grup (distributor air minum): greybox set for stage 1. A blue depot ruko between Master 3-6 style neighbours,
// an open ground floor with the four stations of the solution's steps. Same world units as k0-k2: metres, x along the
// street, y up, z toward the street, origin = centre of the depot door at pavement level on the facade.
import * as THREE from 'three';
import { C, G, Batch, mtx, rng, canvasTex, terrazzo, rectPath } from '../kit.js';

const ROOM = { xL: -3.0, xR: 1.6, zF: -0.2, zB: -10, H: 3.2 };
const FAC = { xL: -3.2, xR: 1.8, H: 7.4, doorW: 1.1, doorH: 2.25, win: [-2.9, 0.55, -0.85, 2.35] };

// Kreatekno-coloured screens (never a look-alike of a chat app), drawn once with the page font
function screen(renderer, kind) {
  const W = 360, H = kind === 'sheet' ? 225 : 720;
  return canvasTex(renderer, W, H, (g, w, h) => {
    const font = (wt, px) => `${wt} ${px}px "Plus Jakarta Sans", system-ui, sans-serif`;
    const pill = (x, y, ww, hh, r, fill) => { g.fillStyle = fill; g.beginPath(); g.roundRect(x, y, ww, hh, r); g.fill(); };
    if (kind === 'sheet') {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#131951'; g.fillRect(0, 0, w, 30); g.fillStyle = '#ffffff'; g.font = font(700, 14); g.fillText('Order hari ini', 12, 20);
      const cols = [12, 42, 196, 258], rows = [['1', 'Toko Sinar', '20', 1], ['2', 'Bu Rina', '5', 2], ['3', 'Warung Jaya', '12', 1], ['4', 'Kantor Camat', '30', 0], ['5', 'Pak Udin', '3', 0]];
      g.font = font(700, 11); g.fillStyle = '#565B81'; ['No', 'Pelanggan', 'Galon', 'Status'].forEach((t, i) => g.fillText(t, cols[i], 48));
      rows.forEach((r, k) => {
        const y = 58 + k * 32; g.fillStyle = k % 2 ? '#ffffff' : '#F4F4FA'; g.fillRect(0, y, w, 32);
        g.fillStyle = '#121640'; g.font = font(600, 12); r.slice(0, 3).forEach((t, i) => g.fillText(t, cols[i], y + 21));
        const st = [['Baru', '#EDE3FF', '#5B1BB5'], ['Diantar', '#DDF9FD', '#06606C'], ['Selesai', '#E1F4E8', '#1C7A43']][r[3]];
        pill(cols[3], y + 7, 74, 19, 9, st[1]); g.fillStyle = st[2]; g.font = font(700, 11); g.fillText(st[0], cols[3] + 10, y + 21);
      });
      return;
    }
    g.fillStyle = '#F4F4FA'; g.fillRect(0, 0, w, h);
    const title = { chat: 'Grup Order', status: 'Grup Order', recap: 'Rekap malam' }[kind];
    g.fillStyle = '#131951'; g.fillRect(0, 0, w, 74); g.fillStyle = '#ffffff'; g.font = font(700, 26); g.fillText(title, 24, 48);
    const bubble = (y, text, mine, accent) => {
      g.font = font(600, 22); const tw = Math.min(w - 90, g.measureText(text).width + 36);
      const x = mine ? w - tw - 18 : 18; pill(x, y, tw, 52, 18, accent || (mine ? '#9F0ED6' : '#ffffff'));
      g.fillStyle = mine || accent ? '#ffffff' : '#121640'; g.fillText(text, x + 18, y + 34);
    };
    if (kind === 'chat') {
      bubble(104, 'Toko Sinar 20 galon', false); bubble(170, 'Bu Rina 5, antar sore', false); bubble(236, 'Warung Jaya 12 ya', false);
      bubble(316, 'Order #128 tercatat', false, '#131951'); bubble(382, 'Kantor Camat 30 galon', false);
    } else if (kind === 'status') {
      bubble(104, 'Order #126 jalan', false, '#131951'); bubble(176, 'kirim #126', true); bubble(256, 'Status: Diantar', false, '#06606C'); bubble(336, 'selesai #125', true);
    } else {
      pill(24, 110, w - 48, 300, 26, '#ffffff');
      g.fillStyle = '#565B81'; g.font = font(700, 20); g.fillText('Total hari ini', 52, 160);
      g.fillStyle = '#121640'; g.font = font(800, 72); g.fillText('120', 52, 244); g.font = font(700, 26); g.fillText('order', 200, 244);
      g.fillStyle = '#1C7A43'; g.font = font(700, 22); g.fillText('+12 dari kemarin', 52, 300);
      g.fillStyle = '#565B81'; g.font = font(600, 20); g.fillText('Terlaris: galon isi ulang', 52, 352);
    }
  });
}

export default function build({ scene, renderer, mat }) {
  const root = new THREE.Group(); scene.add(root);
  const B = new Batch(root);
  const r = rng(7);

  // ---------- street ----------
  B.add(G.box(80, 0.2, 3.2), mat(C.pave), mtx([0, -0.1, 1.6]));
  B.add(G.box(80, 0.18, 0.22), mat(C.curb), mtx([0, -0.06, 3.3]));
  B.add(G.box(80, 0.1, 16), mat(C.road, { roughness: 0.95 }), mtx([0, -0.2, 11.4]), { shadow: false });
  for (let x = -38; x < 40; x += 3) B.add(G.box(1.5, 0.01, 0.14), mat(C.white), mtx([x, -0.145, 10.5]), { shadow: false });
  for (let x = -39; x < 40; x += 1.6) B.add(G.box(0.012, 0.005, 3.1), mat('#a9a2cf'), mtx([x, 0.002, 1.6]), { shadow: false });

  // ---------- neighbours (Master 3-6 style): box, roller shutter, upper window, cornice ----------
  const shop = (x0, x1, h, body, trim, shutter = true) => {
    const w = x1 - x0, cx = (x0 + x1) / 2;
    B.add(G.box(w, h, 12), mat(body), mtx([cx, h / 2, -6]));
    B.add(G.box(w + 0.1, 0.22, 0.35), mat(trim), mtx([cx, h + 0.11, -0.1]));
    B.add(G.box(w + 0.06, 0.3, 0.28), mat(trim), mtx([cx, 3.45, 0.08]));
    B.add(G.rbox(w * 0.5, 1.3, 0.06, 0.03), mat(C.glassUp, { roughness: 0.25 }), mtx([cx, 4.9, 0.02]));
    B.add(G.rbox(w * 0.5 + 0.16, 1.46, 0.05, 0.03), mat(C.white), mtx([cx, 4.9, 0.0]));
    if (shutter) {
      B.add(G.box(w - 0.9, 2.7, 0.05), mat('#e3dfe8', { roughness: 0.7 }), mtx([cx, 1.35, 0.03]));
      for (let y = 0.2; y < 2.7; y += 0.16) B.add(G.box(w - 0.92, 0.015, 0.02), mat('#cfc9d8'), mtx([cx, y, 0.065]), { shadow: false });
    }
  };
  shop(-13.2, -8.2, 7.0, C.lilac, '#e2d6f6'); shop(-8.2, FAC.xL, 7.6, C.yellow, C.yellowDeep);
  shop(FAC.xR, 6.8, 7.2, C.mint, C.mintLight); shop(6.8, 11.8, 7.8, C.pink, '#f8d3dd');
  shop(-18.2, -13.2, 7.3, '#bfe0f0', '#d9eef8'); shop(11.8, 16.8, 7.0, '#f3d0b0', '#f8e2cc');

  // ---------- the depot: blue facade with the door and shop-window openings ----------
  {
    const s = new THREE.Shape(); s.moveTo(FAC.xL, 0); s.lineTo(FAC.xR, 0); s.lineTo(FAC.xR, FAC.H); s.lineTo(FAC.xL, FAC.H); s.closePath();
    s.holes.push(rectPath(-FAC.doorW / 2, 0, FAC.doorW / 2, FAC.doorH));
    s.holes.push(rectPath(FAC.win[0], FAC.win[1], FAC.win[2], FAC.win[3]));
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false });
    const m = new THREE.Mesh(geo, mat('#a9c4f0')); m.position.z = -0.2; m.castShadow = m.receiveShadow = true; root.add(m);
    m.material.shadowSide = THREE.DoubleSide;
    const w = FAC.xR - FAC.xL, cx = (FAC.xL + FAC.xR) / 2;
    B.add(G.box(w + 0.1, 0.24, 0.1), mat('#7d9fdc'), mtx([cx, 0.12, 0.05]));
    B.add(G.box(w + 0.12, 0.32, 0.3), mat('#dce7fb'), mtx([cx, 3.5, 0.1]));
    B.add(G.box(w + 0.16, 0.24, 0.36), mat('#dce7fb'), mtx([cx, FAC.H + 0.12, 0.0]));
    for (const x of [FAC.xL + 0.1, FAC.xR - 0.1]) B.add(G.box(0.2, FAC.H, 0.12), mat('#dce7fb'), mtx([x, FAC.H / 2, 0.04]));
    for (const x of [-1.85, 0.6]) { // upper windows
      B.add(G.rbox(1.5, 1.4, 0.05, 0.03), mat(C.glassUp, { roughness: 0.25 }), mtx([x, 5.1, 0.02]));
      B.add(G.rbox(1.66, 1.56, 0.04, 0.03), mat(C.white), mtx([x, 5.1, 0.0]));
      B.add(G.box(0.04, 1.4, 0.04), mat(C.white), mtx([x, 5.1, 0.05]));
    }
    // frames, awning, blank sign (the name comes in stage 2)
    const frame = (x0, y0, x1, y1) => {
      const t = 0.07;
      B.add(G.box(x1 - x0 + 2 * t, t, 0.12), mat(C.white), mtx([(x0 + x1) / 2, y1 + t / 2, 0.02]));
      if (y0 > 0.01) B.add(G.box(x1 - x0 + 2 * t, t, 0.12), mat(C.white), mtx([(x0 + x1) / 2, y0 - t / 2, 0.02]));
      for (const x of [x0 - t / 2, x1 + t / 2]) B.add(G.box(t, y1 - y0, 0.12), mat(C.white), mtx([x, (y0 + y1) / 2, 0.02]));
    };
    frame(-FAC.doorW / 2, 0, FAC.doorW / 2, FAC.doorH); frame(...FAC.win);
    B.add(G.box(0.03, FAC.win[3] - FAC.win[1], 0.05), mat(C.white), mtx([(FAC.win[0] + FAC.win[2]) / 2, (FAC.win[1] + FAC.win[3]) / 2, -0.1]));
    const glass = new THREE.MeshStandardMaterial({ color: '#d6e2f6', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.28, depthWrite: false });
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(FAC.win[2] - FAC.win[0], FAC.win[3] - FAC.win[1]), glass);
    pane.position.set((FAC.win[0] + FAC.win[2]) / 2, (FAC.win[1] + FAC.win[3]) / 2, -0.1); root.add(pane);
    // the right door leaf stands open inward on its hinge
    const hinge = new THREE.Group(); hinge.position.set(FAC.doorW / 2, 0, -0.12); hinge.rotation.y = -1.35; root.add(hinge);
    const leaf = new THREE.Mesh(G.rbox(FAC.doorW - 0.04, FAC.doorH - 0.04, 0.04, 0.015), mat(C.white)); leaf.position.set(-(FAC.doorW - 0.04) / 2, FAC.doorH / 2, 0);
    const leafGlass = new THREE.Mesh(new THREE.PlaneGeometry(FAC.doorW - 0.24, FAC.doorH - 0.5), glass); leafGlass.position.set(-(FAC.doorW - 0.04) / 2, FAC.doorH / 2 + 0.08, 0.025);
    leaf.castShadow = true; hinge.add(leaf, leafGlass);
    B.add(G.rbox(w - 0.2, 0.08, 0.95, 0.03), mat('#5b84d6', { roughness: 0.6 }), mtx([cx, 2.78, 0.42], [0.22, 0, 0]));
    for (let x = FAC.xL + 0.3; x < FAC.xR - 0.1; x += 0.5) B.add(G.box(0.025, 0.02, 0.96), mat('#7c9fe2'), mtx([x, 2.84, 0.42], [0.22, 0, 0]), { shadow: false });
    B.add(G.rbox(2.6, 0.5, 0.08, 0.25), mat(C.plaque), mtx([cx, 3.02, 0.3]));
  }

  // ---------- interior shell ----------
  const W = ROOM.xR - ROOM.xL, D = ROOM.zF - ROOM.zB, cxR = (ROOM.xL + ROOM.xR) / 2, czR = (ROOM.zF + ROOM.zB) / 2;
  const wallM = mat(C.wall, { roughness: 0.92 }), plane = (w, h, material, m, shadow = true) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material); p.matrixAutoUpdate = false; p.matrix.copy(m);
    p.receiveShadow = true; p.castShadow = shadow; root.add(p); return p;
  };
  wallM.shadowSide = THREE.DoubleSide;
  plane(W, D, new THREE.MeshStandardMaterial({ map: terrazzo(renderer, '#eef0f8', ['#7da3e6', '#9fbdf0', '#a9b0bb', '#f2a15f', '#c6c3cc']), roughness: 0.62 }), mtx([cxR, 0.001, czR], [-Math.PI / 2, 0, 0]), false);
  plane(W, ROOM.H, wallM, mtx([cxR, ROOM.H / 2, ROOM.zB]));
  plane(D, ROOM.H, wallM, mtx([ROOM.xL, ROOM.H / 2, czR], [0, Math.PI / 2, 0]));
  plane(D, ROOM.H, wallM, mtx([ROOM.xR, ROOM.H / 2, czR], [0, -Math.PI / 2, 0]));
  const ceil = mat(C.ceiling, { roughness: 0.95 }); ceil.shadowSide = THREE.DoubleSide;
  plane(W, D, ceil, mtx([cxR, ROOM.H, czR], [Math.PI / 2, 0, 0]));
  for (const [x, z, w, d] of [[cxR, ROOM.zB + 0.015, W, 0.03], [ROOM.xL + 0.015, czR, 0.03, D], [ROOM.xR - 0.015, czR, 0.03, D]]) B.add(G.box(w, 0.1, d), mat('#5b84d6'), mtx([x, 0.05, z]));
  { // back door
    const x = -0.4, w = 0.9, h = 2.1;
    B.add(G.rbox(w + 0.14, h + 0.07, 0.05, 0.02), mat('#f1e3dc'), mtx([x, (h + 0.07) / 2, ROOM.zB + 0.025]));
    B.add(G.rbox(w - 0.04, h - 0.04, 0.05, 0.015), mat(C.door, { roughness: 0.7 }), mtx([x, h / 2, ROOM.zB + 0.05]));
  }

  // ---------- furniture ----------
  const screens = {};
  const desk = (x, z, rotY, items) => {
    const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotY; g.updateMatrix();
    const L = (pos, rot = [0, 0, 0], s = 1) => new THREE.Matrix4().multiplyMatrices(g.matrix, mtx(pos, rot, s));
    const w = 1.2, d = 0.62, h = 0.76, wood = mat(C.wood, { roughness: 0.62 });
    B.add(G.rbox(w, 0.045, d, 0.018), wood, L([0, h - 0.0225, 0]));
    B.add(G.rbox(w - 0.1, 0.28, 0.025, 0.01), mat(C.woodPanel, { roughness: 0.7 }), L([0, h - 0.19, d / 2 - 0.05]));
    for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) B.add(G.cyl(0.026, 0.024, h - 0.04, 12), mat(C.woodDark, { roughness: 0.6 }), L([sx * (w / 2 - 0.07), (h - 0.04) / 2, sz * (d / 2 - 0.07)]));
    const cz = -(d / 2 + 0.36); // the empty chair
    B.add(G.rbox(0.46, 0.07, 0.44, 0.03), mat(C.chair, { roughness: 0.55 }), L([0, 0.47, cz]));
    B.add(G.rbox(0.46, 0.46, 0.06, 0.04), mat(C.chair, { roughness: 0.55 }), L([0, 0.78, cz - 0.22], [0.08, 0, 0]));
    B.add(G.cyl(0.025, 0.025, 0.36, 8), mat(C.black), L([0, 0.26, cz]));
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; B.add(G.rbox(0.28, 0.03, 0.04, 0.012), mat(C.black), L([Math.cos(a) * 0.13, 0.04, cz + Math.sin(a) * 0.13], [0, -a, 0])); }
    const screenAt = (name, w2, h2, pos, rot) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w2, h2), new THREE.MeshBasicMaterial({ map: screen(renderer, name) }));
      m.matrixAutoUpdate = false; m.matrix.copy(L(pos, rot)); root.add(m); screens[name] = m;
      return new THREE.Vector3().setFromMatrixPosition(m.matrix);
    };
    const out = {};
    if (items.includes('monitor')) {
      B.add(G.rbox(0.6, 0.38, 0.04, 0.018), mat(C.black, { roughness: 0.4 }), L([0, h + 0.33, 0.06]));
      B.add(G.rbox(0.07, 0.16, 0.04, 0.01), mat(C.black), L([0, h + 0.1, 0.1])); B.add(G.rbox(0.24, 0.015, 0.16, 0.006), mat(C.black), L([0, h + 0.01, 0.1]));
      out.screen = screenAt('sheet', 0.56, 0.35, [0, h + 0.33, 0.035], [0, Math.PI, 0]);
    }
    if (items.includes('pile')) [[0.45, -0.02, 13], [-0.45, 0.0, 9], [0.4, -0.2, 7]].forEach(([px, pz, n], s) => { // the problem: paper piles
      for (let i = 0; i < n; i++) B.add(G.box(0.24, 0.02, 0.32), mat(i % 3 ? C.paper : '#f2eef0'), L([px + Math.sin(i * 2.3) * 0.015, h + 0.012 + i * 0.021, pz], [0, Math.sin(i * 1.7 + s) * 0.12, 0]));
    });
    const phone = (name, pos, tilt) => {
      B.add(G.rbox(0.09, 0.18, 0.012, 0.008), mat(C.black, { roughness: 0.3 }), L(pos, [tilt, Math.PI, 0]));
      B.add(G.rbox(0.07, 0.03, 0.08, 0.008), mat('#9b9ba6'), L([pos[0], h + 0.015, pos[2] + 0.03]));
      return screenAt(name, 0.078, 0.162, [pos[0], pos[1], pos[2] - 0.009], [tilt, Math.PI, 0]);
    };
    if (items.includes('chat')) out.screen = phone('chat', [-0.15, h + 0.1, 0.0], 0.25);
    if (items.includes('recap')) out.screen = phone('recap', [0.2, h + 0.1, -0.05], 0.3);
    if (items.includes('orders')) for (let i = 0; i < 4; i++) B.add(G.box(0.2, 0.004, 0.28), mat(C.paper), L([0.25 + i * 0.03, h + 0.003 + i * 0.004, 0.02], [0, 0.3 - i * 0.2, 0]), { shadow: false });
    if (items.includes('lamp')) {
      B.add(G.cyl(0.07, 0.08, 0.02, 16), mat(C.black), L([-0.42, h + 0.01, 0.15]));
      B.add(G.cyl(0.012, 0.012, 0.36, 8), mat(C.black), L([-0.42, h + 0.19, 0.15]));
      B.add(G.cyl(0.05, 0.11, 0.12, 16, true), mat(C.orangeDeep, { side: THREE.DoubleSide }), L([-0.42, h + 0.39, 0.08], [0.5, 0, 0]));
    }
    return out;
  };
  // step 1: the order phone on the front desk (right wall), chair toward the room
  const s1 = desk(1.2, -2.5, Math.PI / 2, 'chat orders');
  // step 2 + problem: the admin desk on the left wall with the order sheet and paper piles
  const s2 = desk(-2.6, -3.9, -Math.PI / 2, 'monitor pile');
  // step 4: the owner's desk at the back, facing the shop
  const s4 = desk(-1.9, -8.5, Math.PI, 'recap lamp');

  // step 3: gallon racks on the right wall, crates and the courier phone by the back door
  const galon = mat('#9ccbf2', { roughness: 0.12, transparent: true, opacity: 0.88 }), cap = mat('#3f6fd1', { roughness: 0.5 });
  const gallon = (x, y, z) => { B.add(G.cyl(0.135, 0.135, 0.4, 18), galon, mtx([x, y + 0.2, z])); B.add(G.cyl(0.07, 0.135, 0.06, 18), galon, mtx([x, y + 0.43, z])); B.add(G.cyl(0.035, 0.035, 0.04, 10), cap, mtx([x, y + 0.48, z])); };
  {
    const x0 = 1.08, x1 = 1.56, z0 = -5.9, z1 = -7.9, xc = (x0 + x1) / 2, zc = (z0 + z1) / 2, metal = mat('#8e93a6', { roughness: 0.5, metalness: 0.3 });
    for (const y of [0.08, 0.66, 1.24]) { B.add(G.box(x1 - x0, 0.03, z0 - z1), metal, mtx([xc, y, zc])); for (let z = z0 - 0.17; z > z1 + 0.1; z -= 0.33) if (r() > 0.12) gallon(xc, y + 0.015, z); }
    for (const [x, z] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) B.add(G.box(0.035, 1.8, 0.035), metal, mtx([x, 0.9, z]));
  }
  for (const [x, z, n] of [[0.95, -9.35, 3], [0.45, -9.4, 2]]) for (let i = 0; i < n; i++) B.add(G.rbox(0.46, 0.28, 0.36, 0.02), mat(i % 2 ? '#5b84d6' : C.orange, { roughness: 0.6 }), mtx([x, 0.14 + i * 0.29, z], [0, 0.05 * i, 0]));
  let s3;
  {
    const p = [0.95, 0.88 + 0.1, -9.25], tilt = -0.35;
    B.add(G.rbox(0.09, 0.18, 0.012, 0.008), mat(C.black, { roughness: 0.3 }), mtx(p, [tilt, 0, 0]));
    const m = new THREE.Mesh(new THREE.PlaneGeometry(0.078, 0.162), new THREE.MeshBasicMaterial({ map: screen(renderer, 'status') }));
    m.position.set(p[0], p[1], p[2] + 0.009); m.rotation.x = tilt; root.add(m); screens.status = m; s3 = m.position.clone();
  }
  // gallons stacked in the shop window, so the street can read the shop as a water depot
  for (const [x, y] of [[-2.55, 0], [-2.25, 0], [-1.95, 0], [-1.65, 0], [-1.35, 0], [-2.4, 0.5], [-2.1, 0.5], [-1.8, 0.5], [-1.5, 0.5], [-2.25, 1.0], [-1.95, 1.0], [-1.65, 1.0]]) gallon(x, y + 0.02, -0.75);
  B.add(G.box(1.7, 0.02, 0.5), mat(C.wood), mtx([-1.95, 0.01, -0.75]));

  // pendant lamps (orange shade, glowing disc, warm point light)
  const lamps = [];
  for (const z of [-2.6, -5.4, -8.0]) {
    const x = -0.7, y = 2.45, rr = 0.26, sh = 0.3;
    B.add(G.cyl(0.006, 0.006, ROOM.H - (y + sh), 6), mat('#3b3a40'), mtx([x, (ROOM.H + y + sh) / 2, z]), { shadow: false });
    B.add(G.cyl(rr * 0.24, rr, sh, 32, true), mat(C.orangeDeep, { roughness: 0.55, side: THREE.DoubleSide }), mtx([x, y + sh / 2, z]), { shadow: false });
    B.add(new THREE.CircleGeometry(rr * 0.96, 32), new THREE.MeshStandardMaterial({ color: '#fff6e6', emissive: '#fff1d6', emissiveIntensity: 2.2 }), mtx([x, y + 0.01, z], [Math.PI / 2, 0, 0]), { shadow: false });
    const pl = new THREE.PointLight('#ffd7a3', 2.0, 6, 1.8); pl.position.set(x, y - 0.15, z); root.add(pl); lamps.push(pl);
  }
  B.build();

  // ---------- stations: one camera per beat, for 16:9 (pc) and 9:16 (hp); fov is vertical ----------
  const V = a => new THREE.Vector3(...a);
  const near = (target, dir, dist, up = 0.04) => target.clone().addScaledVector(V(dir).normalize(), dist).add(V([0, up, 0]));
  const stations = [
    { kind: 'datang', hold: 0.4, move: 1.0, orb: null,
      pc: { pos: [0.3, 1.7, 11.5], look: [-0.5, 2.9, 0], fov: 34 }, hp: { pos: [0.0, 1.6, 13.5], look: [-0.6, 3.6, 0], fov: 52 } },
    { kind: 'masalah', hold: 0.5, move: 0.7, orb: null, via: [[0, 1.66, 3.0], [0, 1.64, 0.7]],
      pc: { pos: [0.15, 1.65, -0.6], look: [-0.6, 1.0, -6], fov: 52 }, hp: { pos: [0.7, 1.75, -1.0], look: [-1.9, 0.95, -4.4], fov: 68 } },
    { kind: 'langkah', step: 0, hold: 0.5, move: 0.7, orb: [0.7, 1.28, -2.15],
      pc: { pos: [-0.35, 1.35, -1.55], look: s1.screen.toArray(), fov: 38 }, hp: { pos: [-0.5, 1.5, -1.8], look: s1.screen.toArray(), fov: 55 } },
    { kind: 'langkah', step: 1, hold: 0.5, move: 0.7, orb: [-1.75, 1.45, -3.55],
      pc: { pos: [-0.2, 1.4, -3.0], look: s2.screen.toArray(), fov: 36 }, hp: { pos: [-0.3, 1.5, -3.6], look: s2.screen.toArray(), fov: 55 } },
    { kind: 'langkah', step: 2, hold: 0.5, move: 0.7, orb: [0.4, 1.4, -8.2],
      pc: { pos: [-0.9, 1.55, -5.2], look: [0.8, 0.9, -8.3], fov: 40 }, hp: { pos: [-1.2, 1.6, -5.0], look: [0.85, 0.9, -8.2], fov: 58 } },
    { kind: 'langkah', step: 3, hold: 0.5, move: 0.7, orb: [-1.5, 1.3, -8.0],
      pc: { pos: [-1.2, 1.45, -6.6], look: s4.screen.toArray(), fov: 36 }, hp: { pos: [-1.6, 1.5, -6.2], look: s4.screen.toArray(), fov: 55 } },
    { kind: 'hasil', hold: 1.4, move: 0, orb: [-0.6, 2.2, -4.5],
      pc: { pos: [1.0, 2.55, -0.7], look: [-0.9, 0.5, -6.8], fov: 52 }, hp: { pos: [0.9, 2.7, -0.5], look: [-0.8, 0.5, -7], fov: 72 } },
  ];
  // hotspots: a button glued to a screen; a click brings the camera close to it
  const hotspots = [
    { station: 2, label: 'Lihat chat grup', at: s1.screen, zoom: { pos: near(s1.screen, [-1, 0.15, 0.1], 0.42), look: s1.screen, fov: 34 } },
    { station: 3, label: 'Lihat tabel order', at: s2.screen, zoom: { pos: near(s2.screen, [1, 0.05, 0], 0.85), look: s2.screen, fov: 34 } },
    { station: 4, label: 'Lihat balasan kurir', at: s3, zoom: { pos: near(s3, [0, 0.35, 1], 0.42), look: s3, fov: 34 } },
    { station: 5, label: 'Lihat rekap malam', at: s4.screen, zoom: { pos: near(s4.screen, [0, 0.3, 1], 0.42), look: s4.screen, fov: 34 } },
  ];
  return { root, stations, hotspots, lamps, insideZ: ROOM.zF };
}
