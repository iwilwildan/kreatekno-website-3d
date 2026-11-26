// The library desk of the Articles page (Pustaka P3), built like the Solutions shop (toko.ts) so both pages feel
// like one world: the same navy wall, wainscot and rail, the same lavender counter (lip 0.88 m, top 1.06 m, front
// at z 0) and the purple hanging lamp. Instead of the till: a desk lamp, a stamp on its ink pad and a stack of
// books left of Andi; a three-tier wall bookcase right of him with the KREATEKNO PERPUSTAKAAN sign above it, and a
// standing card catalogue at the right end. Decorative books are one InstancedMesh.
import * as THREE from "three";
import { rng } from "../core/kit";
import { SCENE_Z_SHIFT } from "../meja/kamera";

const protoZ = (z: number) => z - SCENE_Z_SHIFT;

/** Book cover colours of the article rack (RackArt) and a few quieter ones. */
const BOOK_COLORS = ["#8a5cc8", "#23897e", "#2f4f8a", "#e8641f", "#f1e3c2", "#6b4fb0", "#1d6f68", "#b8add9"];

export type PustakaSet = {
  group: THREE.Group;
  /** The sign above the bookcase (hidden on phones, where the hero copy lies over it). */
  sign: THREE.Object3D;
  lamp: THREE.Group;
  /** The stamp (handle up), resting on its pad; Andi picks it up in P3 step 2. */
  stamp: THREE.Group;
  stampRest: THREE.Vector3;
  /** The stamp's mark on the loan card. */
  mark: THREE.Object3D;
  /** The open book Andi reads while idle (pages face +z); the world places it in his hands. */
  book: THREE.Group;
  /** What stands on the front of the desk (book stack, pad, stamp, loan card): cleared while books are served. */
  clutter: THREE.Object3D[];
  /** Redraws the sign once the page font has loaded. */
  drawSign: (family: string) => void;
  dispose: () => void;
};

export function buildPustaka(sign: { title: string; sub: string }): PustakaSet {
  const group = new THREE.Group();
  group.name = "pustaka";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const instanced: THREE.InstancedMesh[] = [];

  const basic = (color: string, options: THREE.MeshBasicMaterialParameters = {}) => {
    const value = new THREE.MeshBasicMaterial({ color, ...options });
    materials.push(value);
    return value;
  };
  const standard = (color: string, options: THREE.MeshStandardMaterialParameters = {}) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...options });
    materials.push(value);
    return value;
  };
  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent: THREE.Object3D = group) => {
    geometries.push(geometry);
    const value = new THREE.Mesh(geometry, material);
    parent.add(value);
    return value;
  };
  const box = (
    size: [number, number, number],
    at: [number, number, number],
    material: THREE.Material,
    parent: THREE.Object3D = group,
  ) => {
    const value = mesh(new THREE.BoxGeometry(...size), material, parent);
    value.position.set(...at);
    return value;
  };
  const cyl = (
    rt: number,
    rb: number,
    h: number,
    at: [number, number, number],
    material: THREE.Material,
    parent: THREE.Object3D = group,
    seg = 24,
  ) => {
    const value = mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material, parent);
    value.position.set(...at);
    return value;
  };

  // ---------- room and desk: the shop's own ----------
  const wall = basic("#131951");
  const rail = basic("#232b77");
  const wallMesh = mesh(new THREE.PlaneGeometry(40, 14), wall);
  wallMesh.position.set(0, 4, protoZ(-2.3));
  const wainscotMesh = mesh(new THREE.PlaneGeometry(40, 1.5), wall);
  wainscotMesh.position.set(0, 0.95, protoZ(-2.29));
  box([40, 0.05, 0.05], [0, 1.72, protoZ(-2.27)], rail);
  box([40, 0.12, 2.6], [0, 1, protoZ(0.6)], standard("#cfc5e8", { roughness: 0.45 }));
  box([40, 6, 2.5], [0, -2.07, protoZ(0.6)], basic("#c2b8df"));
  box([40, 0.06, 0.04], [0, 0.91, protoZ(1.851)], basic("#afa4d2"));

  // ---------- on the desk, left of Andi: desk lamp, a stack of books, the stamp on its pad ----------
  const brass = standard("#c9a45c", { roughness: 0.35, metalness: 0.6 });
  const deskLamp = new THREE.Group();
  deskLamp.name = "lampu-meja";
  deskLamp.position.set(-0.15, 1.06, protoZ(0.1));
  group.add(deskLamp);
  cyl(0.16, 0.19, 0.05, [0, 0.025, 0], brass, deskLamp);
  cyl(0.022, 0.022, 0.5, [0, 0.3, 0], brass, deskLamp);
  // a dome shade tipped a little toward the desk, the bulb glowing under it
  const shade = mesh(
    new THREE.SphereGeometry(0.2, 24, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    standard("#9f0ed6", { roughness: 0.4, side: THREE.DoubleSide }),
    deskLamp,
  );
  shade.scale.set(1, 0.75, 1);
  shade.position.set(0, 0.56, 0.02);
  shade.rotation.x = 0.18;
  const glow = mesh(new THREE.SphereGeometry(0.06, 14, 8), basic("#fff6d8"), deskLamp);
  glow.position.set(0, 0.55, 0.04);
  // its warm pool of light on the desk (a soft radial decal, no extra light in the shaders)
  const poolCanvas = document.createElement("canvas");
  poolCanvas.width = poolCanvas.height = 128;
  const pg = poolCanvas.getContext("2d");
  if (pg) {
    const gr = pg.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,226,170,0.55)");
    gr.addColorStop(0.5, "rgba(255,214,150,0.22)");
    gr.addColorStop(1, "rgba(255,214,150,0)");
    pg.fillStyle = gr;
    pg.fillRect(0, 0, 128, 128);
  }
  const poolTexture = new THREE.CanvasTexture(poolCanvas);
  poolTexture.colorSpace = THREE.SRGBColorSpace;
  textures.push(poolTexture);
  const pool = mesh(
    new THREE.PlaneGeometry(1.5, 1.1),
    basic("#ffffff", { map: poolTexture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(-0.1, 1.062, protoZ(0.2));

  // the ink pad within Andi's right hand's reach, the loan card in front of him
  const pad = box([0.26, 0.035, 0.18], [1.45, 1.078, protoZ(-0.2)], standard("#2a2f5e", { roughness: 0.9 }));
  pad.name = "bantalan-stempel";
  const stampRest = new THREE.Vector3(1.45, 1.096, protoZ(-0.2));
  const card = new THREE.Group();
  card.name = "kartu-peminjaman";
  card.position.set(1.85, 1.06, protoZ(-0.25));
  card.rotation.y = -0.06;
  group.add(card);
  box([0.34, 0.006, 0.22], [0, 0.003, 0], standard("#fbf8ee", { roughness: 0.85 }), card);
  box([0.34, 0.007, 0.03], [0, 0.0035, -0.08], basic("#7b3fd6"), card);
  for (let k = 0; k < 3; k++) box([0.26, 0.007, 0.006], [0.02, 0.0035, -0.02 + k * 0.045], basic("#c9c2dc"), card);
  // the purple mark the stamp leaves (shown after the first press)
  const mark = box(
    [0.11, 0.008, 0.07],
    [-0.08, 0.004, 0.04],
    basic("#9f0ed6", { transparent: true, opacity: 0.85 }),
    card,
  );
  mark.visible = false;
  const stamp = new THREE.Group();
  stamp.name = "stempel";
  stamp.position.copy(stampRest);
  group.add(stamp);
  box([0.14, 0.04, 0.1], [0, 0.02, 0], standard("#9f0ed6", { roughness: 0.5 }), stamp);
  cyl(0.025, 0.03, 0.1, [0, 0.09, 0], standard("#1a2160", { roughness: 0.5 }), stamp, 12);
  const knob = mesh(new THREE.SphereGeometry(0.045, 14, 10), standard("#1a2160", { roughness: 0.45 }), stamp);
  knob.position.y = 0.16;

  const stack = new THREE.Group();
  stack.name = "tumpukan-buku";
  stack.position.set(0.35, 1.06, protoZ(-0.35));
  group.add(stack);
  [
    [0.5, 0.36, "#2f4f8a", 0.05],
    [0.46, 0.33, "#e8641f", -0.08],
    [0.48, 0.34, "#23897e", 0.12],
    [0.42, 0.3, "#f1e3c2", -0.03],
  ].forEach(([w, d, color, turn], k) => {
    const book = box(
      [w as number, 0.07, d as number],
      [0, 0.035 + k * 0.07, 0],
      standard(color as string, { roughness: 0.7 }),
      stack,
    );
    book.rotation.y = turn as number;
  });

  // ---------- wall bookcase right of Andi: three shelves of books ----------
  const shelf = new THREE.Group();
  shelf.name = "rak-buku-dinding";
  shelf.position.set(3.5, 0, protoZ(-2.05));
  group.add(shelf);
  const wood = standard("#b8add9", { roughness: 0.58 });
  const back = basic("#1b2266");
  const W = 1.7,
    BOARDS = [1.35, 2.05, 2.75];
  box([W, 2.2, 0.02], [0, 2.05, -0.2], back, shelf);
  for (const y of BOARDS) box([W + 0.06, 0.06, 0.42], [0, y, 0], wood, shelf);
  box([W + 0.12, 0.08, 0.46], [0, 3.42, 0], wood, shelf);
  for (const s of [-1, 1]) box([0.06, 2.4, 0.44], [(s * (W + 0.06)) / 2, 2.2, 0], wood, shelf);

  const random = rng(17);
  const spots: { x: number; y: number; w: number; h: number; lean: number; color: string }[] = [];
  BOARDS.forEach((y, row) => {
    let x = -W / 2 + 0.05;
    while (x < W / 2 - 0.1) {
      const w = 0.07 + random() * 0.06,
        h = 0.4 + random() * 0.17;
      // a gap now and then, with the last book leaning into it
      if (random() < 0.08 && x > -W / 2 + 0.3) {
        spots[spots.length - 1].lean = 0.22;
        x += 0.14;
        continue;
      }
      spots.push({
        x: x + w / 2,
        y: y + 0.03,
        w,
        h,
        lean: 0,
        color: BOOK_COLORS[(row * 3 + spots.length * 5) % BOOK_COLORS.length],
      });
      x += w + 0.008;
    }
  });
  const books = new THREE.InstancedMesh(
    new THREE.BoxGeometry(1, 1, 1),
    standard("#ffffff", { roughness: 0.7 }),
    spots.length,
  );
  geometries.push(books.geometry);
  books.name = "buku-dekor";
  const m = new THREE.Matrix4(),
    q = new THREE.Quaternion(),
    color = new THREE.Color();
  spots.forEach((b, i) => {
    q.setFromEuler(new THREE.Euler(0, 0, b.lean));
    // a leaning book pivots on its bottom corner
    const px = b.x - Math.sin(b.lean) * (b.h / 2),
      py = b.y + Math.cos(b.lean) * (b.h / 2);
    m.compose(new THREE.Vector3(px, py, 0.02), q, new THREE.Vector3(b.w, b.h, 0.3));
    books.setMatrixAt(i, m);
    books.setColorAt(i, color.set(b.color));
  });
  shelf.add(books);
  instanced.push(books);

  // ---------- the sign above the bookcase ----------
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 300;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  textures.push(texture);
  const drawSign = (family: string) => {
    const g = canvas.getContext("2d");
    if (!g) return;
    g.clearRect(0, 0, canvas.width, canvas.height);
    // cyan offset shadow, then the navy board (as the CSS sign)
    g.fillStyle = "#35eafe";
    g.fillRect(36, 36, 960, 240);
    g.fillStyle = "#0b0f3a";
    g.fillRect(12, 12, 960, 240);
    g.fillStyle = "#ffffff";
    g.textBaseline = "alphabetic";
    g.font = `900 112px ${family}`;
    g.fillText(sign.title.split("").join(String.fromCharCode(8202)), 64, 150);
    g.fillStyle = "#35eafe";
    g.font = `800 52px ${family}`;
    g.fillText(sign.sub.toUpperCase().split("").join(String.fromCharCode(8202)), 66, 222);
    texture.needsUpdate = true;
  };
  drawSign("monospace");
  const signMesh = mesh(new THREE.PlaneGeometry(1.7, 0.5), basic("#ffffff", { map: texture, transparent: true }));
  signMesh.name = "papan-nama";
  signMesh.position.set(3.4, 3.82, protoZ(-2.27));

  // ---------- card catalogue at the right end, standing behind the desk ----------
  const catalog = new THREE.Group();
  catalog.name = "laci-katalog";
  catalog.position.set(4.95, 0, protoZ(-1.95));
  group.add(catalog);
  const oak = standard("#8a6a9c", { roughness: 0.6 });
  box([0.72, 1.95, 0.5], [0, 0.975, 0], oak, catalog);
  box([0.78, 0.05, 0.55], [0, 1.975, 0], wood, catalog);
  // drawer fronts, label cards and pulls: one InstancedMesh each
  const drawers = (material: THREE.Material, size: [number, number, number], dy: number, z: number) => {
    const im = new THREE.InstancedMesh(new THREE.BoxGeometry(...size), material, 15);
    geometries.push(im.geometry);
    instanced.push(im);
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 3; c++)
        im.setMatrixAt(r * 3 + c, new THREE.Matrix4().makeTranslation(-0.22 + c * 0.22, 1.12 + r * 0.17 + dy, z));
    catalog.add(im);
  };
  drawers(standard("#a184b3", { roughness: 0.55 }), [0.19, 0.14, 0.02], 0, 0.26);
  drawers(basic("#f7f3e6"), [0.07, 0.035, 0.01], 0.025, 0.272);
  drawers(brass, [0.05, 0.012, 0.02], -0.03, 0.28);

  // ---------- the open book in Andi's hands: two covers and two page blocks in a shallow V ----------
  const book = new THREE.Group();
  book.name = "buku-dibaca";
  book.scale.setScalar(1.2);
  group.add(book);
  const cover = standard("#e8641f", { roughness: 0.7 }),
    paper = standard("#f7f3e6", { roughness: 0.9 });
  for (const s of [-1, 1]) {
    const half = new THREE.Group();
    half.rotation.y = s * 0.32;
    book.add(half);
    box([0.21, 0.3, 0.012], [s * 0.105, 0, -0.008], cover, half);
    box([0.195, 0.28, 0.022], [s * 0.1, 0, 0.01], paper, half);
  }

  // ---------- hanging lamp: the shop's ----------
  const lamp = new THREE.Group();
  lamp.name = "lampu-gantung";
  lamp.position.set(-0.6, 3.65, protoZ(-0.5));
  group.add(lamp);
  const cable = mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.2, 8), basic("#2a2f5e"), lamp);
  cable.position.y = 1.1;
  mesh(
    new THREE.ConeGeometry(0.32, 0.3, 24, 1, true),
    standard("#9f0ed6", { roughness: 0.4, side: THREE.DoubleSide }),
    lamp,
  );
  const bulb = mesh(new THREE.SphereGeometry(0.09, 16, 10), basic("#fff6d8"), lamp);
  bulb.position.y = -0.12;

  return {
    group,
    sign: signMesh,
    lamp,
    stamp,
    stampRest,
    mark,
    book,
    clutter: [stack, pad, stamp, card],
    drawSign,
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const item of materials) item.dispose();
      for (const item of textures) item.dispose();
      for (const item of instanced) item.dispose();
    },
  };
}
