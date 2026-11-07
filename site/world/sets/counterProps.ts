// Props of beats 3–4 on the till counter: a lilac desk pad, the A4 leaflet, the purple ring binder with four
// coloured tabs (closed from K2, opened for K4), and a yellow and a pink pencil. Shapes and colours from the
// keyframes K3/K4 and refs/Properti (Binder tebal). The copy is HTML on the leaflet and the binder's page
// (tahap 5 step 5). Heru's and Bu Dewi's close-up hands (cast/closeHand.ts, in the cast chunk) are shown only
// in the top views, where the camera looks down steeper than HANDS_PITCH.
// Parts that move together are merged, small coloured parts with vertex colours, so the props cost ±10 draw
// calls (the K2 view sees them too).
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { clean, G, mtx, type Kit, type Vec3 } from "../core/kit";
import { rectAnchorFrom, type Anchor } from "../core/anchors";
import { BINDER, counterLayout, type CounterLayout } from "../takes/home/counter";
import { PAGE, PAGE_COPY, TABS } from "./binderLayout";
import { beatAt, DEWI_HOLDS, phase4, type Beat3 } from "../takes/home/counterCast";
import type { CloseHands } from "../cast/closeHand";

/** The close-up hands replace the cast's own hands once the camera looks down steeper than this (radians). */
export const HANDS_PITCH = -THREE.MathUtils.degToRad(60);
/**
 * Where the close-up hands lie, from the keyframes: the middle fingertip relative to a leaflet corner (K3:
 * Heru's on the corner nearest him on the left, Bu Dewi's on the one nearest her on the right) or to the binder
 * (K4), and the way the fingers point (yaw; 0 = fingers toward Bu Dewi).
 */
const HAND_AT = {
  heru: { hold: { tip: [-0.03, -0.025], yaw: 0.3 }, rest: { tip: [0.256, 0.074], yaw: 0.25 } },
  dewi: { hold: { tip: [0.028, 0.038], yaw: Math.PI + 0.55 }, rest: { tip: [-0.25, -0.075], yaw: Math.PI + 0.15 } },
} as const;

/** Purple strip of the leaflet: 11 mm below its top edge, 3 mm wide, edge to edge (K3 pc and hp). */
const STRIP = { from: 0.011, width: 0.003 };
const COVER_T = 0.004,
  STACK_T = 0.03,
  RING_X = 0.112;

type Part = [THREE.BufferGeometry, string, THREE.Matrix4?];
/** Parts merged into one geometry with a vertex colour per part. */
function tinted(parts: Part[]) {
  const color = new THREE.Color();
  const geos = parts.map(([g, hex, m]) => {
    const c = clean(g);
    if (m) c.applyMatrix4(m);
    color.set(hex);
    const n = c.attributes.position.count,
      a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) a.set([color.r, color.g, color.b], i * 3);
    c.setAttribute("color", new THREE.Float32BufferAttribute(a, 3));
    return c;
  });
  return mergeGeometries(geos);
}
const tintMat = (roughness: number, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ vertexColors: true, roughness, metalness: 0, ...o });
const shadowed = <T extends THREE.Object3D>(o: T, receive = true) => {
  o.traverse((c) => {
    if (c instanceof THREE.Mesh) {
      c.castShadow = true;
      c.receiveShadow = receive;
    }
  });
  return o;
};

/**
 * Where the logo is printed on the leaflet, as shares of the sheet (x from the left, or the right edge when
 * negative; y of its middle from the top; h its height). Landscape: at the foot, below the service cards and clear
 * of Bu Dewi's fingers (bottom right), with a thin rule after it up to `rule`. Matches the copy's layout in
 * stage.css (`.leaflet-copy`).
 */
const LEAF_FOOT = {
  land: { x: 0.05, y: 0.815, h: 0.052, rule: 0.75 },
  // the portrait column is full down to the foot: the logo goes top right instead, on the kicker's line
  port: { x: -0.94, y: 0.069, h: 0.022, rule: 0 },
};
const LOGO_SRC = "/brand/kreatekno-logo.webp";

/**
 * A sheet's top face as a canvas: paper white with the purple strip near the top edge (as read), and the logo
 * with a rule at the foot once the logo has loaded (the sheet is plain until then). The copy itself is HTML.
 */
function leafletTex(kit: Kit, w: number, h: number) {
  const px = 2000,
    foot = w > h ? LEAF_FOOT.land : LEAF_FOOT.port;
  const paint = (g: CanvasRenderingContext2D, W: number, H: number, logo?: HTMLImageElement) => {
    g.fillStyle = "#fdfcfe";
    g.fillRect(0, 0, W, H);
    g.fillStyle = "#8748d4";
    g.fillRect(0, (H * STRIP.from) / h, W, Math.max(2, (H * STRIP.width) / h));
    if (!logo) return;
    const lh = foot.h * H,
      lw = (lh * logo.naturalWidth) / logo.naturalHeight,
      // a negative x is the logo's right edge (right aligned)
      x = foot.x < 0 ? -foot.x * W - lw : foot.x * W,
      y = foot.y * H - lh / 2;
    g.drawImage(logo, x, y, lw, lh);
    const rx = x + lw + 0.02 * W;
    if (rx < foot.rule * W) {
      g.fillStyle = "#d7c6ee";
      g.fillRect(rx, foot.y * H - 1.5, foot.rule * W - rx, 3);
    }
  };
  const tex = kit.canvasTex(Math.round((px * w) / Math.max(w, h)), Math.round((px * h) / Math.max(w, h)), paint);
  if (typeof Image !== "undefined") {
    const logo = new Image();
    logo.decoding = "async";
    logo.onload = () => {
      const c = tex.image as HTMLCanvasElement;
      paint(c.getContext("2d")!, c.width, c.height, logo);
      tex.needsUpdate = true;
    };
    logo.src = LOGO_SRC;
  }
  return tex;
}

/**
 * A hexagonal pencil from a to b (b is the writing point), lying on the counter: painted shaft, sharpened wood
 * cone and lead at b; at a a second point, or a metal band and an eraser.
 */
function pencilParts(color: string, a: THREE.Vector3, b: THREE.Vector3, eraser: boolean): Part[] {
  const r = 0.0037,
    dir = b.clone().sub(a),
    len = dir.length(),
    q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  // along the pencil from a (0) to b (len)
  const at = (y: number, flip = false) =>
    new THREE.Matrix4().compose(
      a.clone().addScaledVector(dir, y),
      flip ? q.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI)) : q,
      new THREE.Vector3(1, 1, 1),
    );
  const point = (y: number, flip: boolean): Part[] => [
    [new THREE.CylinderGeometry(0.0012, r * 0.98, 0.016, 6).translate(0, 0.008, 0), "#e8c9a0", at(y, flip)],
    [new THREE.ConeGeometry(0.0012, 0.004, 6).translate(0, 0.018, 0), "#3a3740", at(y, flip)],
  ];
  const tail = eraser ? 0.016 : 0.02,
    shaft = len - 0.02 - tail;
  const parts: Part[] = [
    [new THREE.CylinderGeometry(r, r, shaft, 6).translate(0, shaft / 2, 0), color, at(tail)],
    ...point(len - 0.02, false),
  ];
  if (eraser)
    parts.push(
      [new THREE.CylinderGeometry(r * 1.03, r * 1.03, 0.008, 12).translate(0, 0.004, 0), "#c9c8d1", at(0.008)],
      [G.rbox(r * 1.9, 0.009, r * 1.9, r * 0.9).translate(0, 0.0045, 0), "#f6a7d9", at(0)],
    );
  else parts.push(...point(0.02, true));
  return parts;
}

export function createCounterProps(kit: Kit) {
  const group = new THREE.Group();
  group.name = "counterProps";

  // ---------- desk pad: the lilac surface of the top views (keyframes K3 #e8ddeb, K4 #cdbde0) ----------
  const pad = new THREE.Mesh(G.rbox(1, 0.003, 1, 0.0015), kit.mat("#ddd0ea", { roughness: 0.85 }));
  pad.receiveShadow = true;
  const pencils = shadowed(new THREE.Mesh(new THREE.BufferGeometry(), tintMat(0.5)), false);

  // ---------- leaflet ----------
  const texLand = leafletTex(kit, 0.297, 0.21),
    texPort = leafletTex(kit, 0.21, 0.297);
  const paper = new THREE.MeshStandardMaterial({ map: texLand, roughness: 0.82 });
  // one material on every face (the 1.2 mm edges just look white); turned half a turn so the sheet's top edge
  // is toward +z (Heru's side) and it reads upright from above with the door at the top of the frame
  const leaflet = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1, 0.0012, 1), paper));
  leaflet.rotation.y = Math.PI;

  // ---------- binder ----------
  const binder = new THREE.Group(),
    body = new THREE.Group(),
    coverPivot = new THREE.Group();
  const purpleMat = kit.mat("#8442b9", { roughness: 0.45 });
  const spine = new THREE.Mesh(G.rbox(0.012, BINDER.h, BINDER.d, 0.004), kit.mat("#7536ab", { roughness: 0.5 }));
  spine.position.set(BINDER.w / 2 - 0.006, BINDER.h / 2, 0);
  binder.add(body);
  {
    // the top page lifts a little toward the rings: the last 18 mm rise by up to 3 mm
    const top = new THREE.PlaneGeometry(PAGE.w, PAGE.d, 14, 1).rotateX(-Math.PI / 2);
    const p = top.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      const k = THREE.MathUtils.smoothstep(p.getX(i), PAGE.w / 2 - 0.018, PAGE.w / 2);
      p.setY(i, 0.003 * k * k);
    }
    top.computeVertexNormals();
    const at = (pos: Vec3) => mtx(pos);
    const parts: Part[] = [
      [G.rbox(BINDER.w, COVER_T, BINDER.d, 0.0018), "#8442b9", at([0, COVER_T / 2, 0])],
      [G.box(PAGE.w, STACK_T - 0.001, PAGE.d), "#efe7d6", at([PAGE.x, COVER_T + (STACK_T - 0.001) / 2, 0])],
      [top, "#f8f3e8", at([PAGE.x, COVER_T + STACK_T, 0])],
      // tabs on the dividers, sticking out past the page's right edge (seen from above)
      ...TABS.map(([c, z0, z1]): Part => [
        G.rbox(0.017, 0.0016, z0 - z1, 0.004),
        c,
        at([PAGE.x - PAGE.w / 2 - 0.006, COVER_T + STACK_T - 0.002, (z0 + z1) / 2]),
      ]),
    ];
    const paperBody = new THREE.Mesh(tinted(parts), tintMat(0.75));
    paperBody.name = "binderBody";
    // the ring mechanism: a steel bar with rivets at both ends and four rings through the pages, tilted toward
    // the pages so they read as arcs from above
    const steelGeos = [
      clean(G.rbox(0.014, 0.006, 0.3, 0.003)).applyMatrix4(at([RING_X + 0.004, COVER_T + 0.003, 0])),
      ...[0.154, -0.152].map((z) =>
        clean(G.cyl(0.004, 0.004, 0.003, 10)).applyMatrix4(at([RING_X + 0.004, COVER_T + 0.007, z])),
      ),
      ...[0.117, 0.04, -0.034, -0.101].map((z) =>
        clean(new THREE.TorusGeometry(0.0125, 0.0022, 6, 20)).applyMatrix4(
          mtx([RING_X, COVER_T + STACK_T, z], [-0.55, 0, 0]),
        ),
      ),
    ];
    const steel = new THREE.Mesh(mergeGeometries(steelGeos), kit.mat("#cfd0d8", { roughness: 0.22, metalness: 0.85 }));
    // front cover, hinged on the spine's top edge
    coverPivot.position.set(BINDER.w / 2, BINDER.h - COVER_T / 2, 0);
    const front = new THREE.Mesh(G.rbox(BINDER.w, COVER_T, BINDER.d, 0.0018), purpleMat);
    front.position.x = -BINDER.w / 2;
    coverPivot.add(front);
    body.add(paperBody, steel, spine, coverPivot);
  }
  shadowed(binder);

  // ---------- close-up hands, handed over once the cast chunk has built them ----------
  let hands: CloseHands | null = null;
  const setHands = (h: CloseHands) => {
    hands = h;
    // hidden until the next update places them (a hold does not change the update's key, so they would
    // otherwise stay drawn wherever they were built: ±46 thousand triangles at K2.4)
    for (const who of [h.heru, h.dewi])
      for (const v of [who.hold, who.rest]) {
        v.mesh.visible = false;
        group.add(v.mesh);
      }
    last = "";
  };

  group.add(pad, pencils, leaflet, binder);

  let L: CounterLayout | null = null;
  /** Lays the props out on the counter of layout step `step`. */
  const place = (step: number) => {
    L = counterLayout(step);
    const P = L.pad,
      y = L.f.top + 0.003;
    pad.scale.set(P.x1 - P.x0, 1, P.z1 - P.z0);
    pad.position.set((P.x0 + P.x1) / 2, L.f.top + 0.0015, (P.z0 + P.z1) / 2);
    pencils.geometry.dispose();
    pencils.geometry = tinted(
      L.pencils.flatMap((pc, i) =>
        pencilParts(
          pc.color,
          new THREE.Vector3(pc.a[0], y + 0.0037, pc.a[1]),
          new THREE.Vector3(pc.b[0], y + 0.0037, pc.b[1]),
          i === 1,
        ),
      ),
    );
    paper.map = L.portrait ? texPort : texLand;
    paper.needsUpdate = true;
    leaflet.scale.set(L.leafX, 1, L.leafZ);
    leaflet.position.set(L.leaflet.x, y + 0.0006, L.leaflet.z);
  };

  /**
   * Binder lid: 0 closed … 1 tucked under the binder, so one tabbed page lies open (K4). The cover swings up and
   * over on the spine's top edge until it lies flat beside the binder, then slides in under the binder as it
   * comes down, and the binder rises by its thickness.
   */
  const setOpen = (k: number) => {
    k = Math.min(1, Math.max(0, k));
    const sm = THREE.MathUtils.smootherstep,
      swing = sm(k, 0, 0.55),
      tuck = sm(k, 0.55, 1),
      rise = COVER_T * tuck,
      h = THREE.MathUtils.lerp(BINDER.h, 2 * COVER_T + STACK_T, tuck);
    body.position.y = rise;
    coverPivot.rotation.z = -Math.PI * swing;
    // the hinge slides in under the binder and down to the counter together, so the cover clears the pencil
    // beside the binder while it is still out
    coverPivot.position.set(
      THREE.MathUtils.lerp(BINDER.w / 2, -BINDER.w / 2, tuck),
      THREE.MathUtils.lerp(BINDER.h - COVER_T / 2, COVER_T / 2 - rise, tuck),
      0,
    );
    spine.scale.y = h / BINDER.h;
    spine.position.y = h / 2 - rise;
  };

  /** Where a close-up hand lies: the middle fingertip (world), the way the fingers point, its pose and lift. */
  type HandAt = { pose: "hold" | "rest"; tip: THREE.Vector3; yaw: number; lift: number };
  const between = (a: HandAt, b: HandAt, k: number): HandAt => {
    const e = THREE.MathUtils.smootherstep(k, 0, 1);
    return {
      pose: e < 0.5 ? a.pose : b.pose,
      tip: a.tip.clone().lerp(b.tip, e),
      yaw: THREE.MathUtils.lerp(a.yaw, b.yaw, e),
      lift: THREE.MathUtils.lerp(a.lift, b.lift, e) + 0.035 * Math.sin(Math.PI * e),
    };
  };

  /**
   * Pose for the scroll position p, the camera's pitch and Heru's beat-3 state (leaflet in his hand or laid
   * down). Beat 4 (K3 → K4) from its own clock (`k4`, 0..1; see counterCast): Bu Dewi lets go, Heru slides the leaflet out to the left, pulls the
   * binder to the middle, its cover folds under, and both hands come to rest beside it. Returns true when
   * something moved (the shadow map is redrawn).
   */
  const fade = { leaflet: 0, page: 0 };
  let last = "";
  const update = (p: number, pitch: number, b3: Beat3 | null, k4 = beatAt(p).u) => {
    if (!L) return false;
    const { on, s: s3 } = beatAt(p),
      u = k4,
      y = L.f.top + 0.003;
    // the leaflet: brought up from below the counter when Heru arrives, laid down, slid aside in beat 4
    leaflet.visible = !!b3 && on && b3.lay > 0;
    if (b3) {
      leaflet.position.copy(b3.leaflet.pos);
      leaflet.quaternion.copy(b3.leaflet.quat);
    }
    // the binder: pulled to the middle, then opened
    const pull = THREE.MathUtils.smootherstep(phase4(u, "pull"), 0, 1),
      open = phase4(u, "open");
    // the copy on the leaflet comes in as the camera settles straight above it, and goes as Heru slides the
    // leaflet out; the binder's comes in once its cover is under and both hands rest (the hands never cross it)
    fade.leaflet =
      (b3 && on && b3.lay > 0.99 ? THREE.MathUtils.smoothstep(-pitch, 1.26, 1.5) : 0) *
      (1 - THREE.MathUtils.smoothstep(phase4(u, "slide"), 0.35, 0.7));
    fade.page = THREE.MathUtils.smoothstep(phase4(u, "rest"), 0.3, 1) * THREE.MathUtils.smoothstep(-pitch, 1.26, 1.5);
    setOpen(open);
    binder.position.copy(L.binderK3).lerp(L.binderK4, pull).setY(y);
    binder.updateMatrixWorld(true);
    // the close-up hands, in the top views only, each once its own hand is on the leaflet (Heru's once it is
    // laid down, Bu Dewi's once she has reached its corner)
    const hs = L.portrait ? 0.7 : 1,
      seen = !!hands && on && pitch < HANDS_PITCH,
      top = { heru: seen && (b3?.lay ?? 0) > 0.99, dewi: seen && s3 >= DEWI_HOLDS };
    const key = `${L.f.x0} ${top.heru} ${top.dewi} ${b3?.c.toFixed(4)} ${u.toFixed(5)}`;
    if (key === last) return false;
    last = key;
    if (!hands) return true;
    const slide = 0.42 * THREE.MathUtils.smootherstep(phase4(u, "slide"), 0, 1);
    const at = (who: "heru" | "dewi", pose: "hold" | "rest", base: THREE.Vector3, lift = 0): HandAt => ({
      pose,
      tip: new THREE.Vector3(base.x + HAND_AT[who][pose].tip[0], 0, base.z + HAND_AT[who][pose].tip[1]),
      yaw: HAND_AT[who][pose].yaw,
      lift,
    });
    const cornerH = new THREE.Vector3(L.leaflet.x + L.leafX / 2 + slide, 0, L.leaflet.z + L.leafZ / 2),
      cornerD = new THREE.Vector3(L.leaflet.x - L.leafX / 2, 0, L.leaflet.z - L.leafZ / 2),
      onBinder: HandAt = {
        pose: "hold",
        tip: new THREE.Vector3(binder.position.x + BINDER.w / 2 - 0.05, 0, binder.position.z + BINDER.d / 2 - 0.035),
        yaw: 0.3,
        lift: BINDER.h - 0.004,
      };
    const heruHold = at("heru", "hold", cornerH, 0.0012),
      heruRest = at("heru", "rest", L.binderK4),
      dewiHold = at("dewi", "hold", cornerD, 0.0012),
      dewiRest = at("dewi", "rest", L.binderK4);
    const heruAt =
      phase4(u, "toBinder") <= 0
        ? heruHold
        : phase4(u, "pull") <= 0
          ? between(heruHold, onBinder, phase4(u, "toBinder"))
          : phase4(u, "rest") <= 0
            ? onBinder
            : between(onBinder, heruRest, phase4(u, "rest"));
    const dewiAt = between(dewiHold, dewiRest, phase4(u, "letGo"));
    for (const [who, a] of [
      ["heru", heruAt],
      ["dewi", dewiAt],
    ] as const) {
      const h = hands[who],
        { mesh, tips } = h[a.pose];
      h.hold.mesh.visible = top[who] && a.pose === "hold";
      h.rest.mesh.visible = top[who] && a.pose === "rest";
      // the middle fingertip goes to its spot
      const tip = tips[1]
        .clone()
        .multiplyScalar(hs)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), a.yaw);
      mesh.rotation.y = a.yaw;
      mesh.scale.setScalar(hs);
      mesh.position.set(a.tip.x - tip.x, y + a.lift, a.tip.z - tip.z);
    }
    return true;
  };

  // ---------- copy surfaces (the HTML copy is placed on them, see core/anchors) ----------
  const pageY = COVER_T + STACK_T + 0.0005;
  /** The leaflet's top and the binder's open page with its tabs, where they are now (world). */
  const copyAnchors = (): Anchor[] => {
    leaflet.updateMatrixWorld();
    body.updateMatrixWorld();
    return [
      rectAnchorFrom("leaflet", leaflet.matrixWorld, [-0.5, 0.0007, -0.5], [0.5, 0.0007, 0.5]),
      rectAnchorFrom("page", body.matrixWorld, [PAGE_COPY.x0, pageY, PAGE.d / 2], [PAGE_COPY.x1, pageY, -PAGE.d / 2]),
    ];
  };
  /** The same surfaces where they lie at their holds (K3: the leaflet laid down; K4: the binder open). */
  const holdAnchors = (): Anchor[] => {
    if (!L) return [];
    const y = L.f.top + 0.003,
      lm = new THREE.Matrix4().compose(
        new THREE.Vector3(L.leaflet.x, y + 0.0006, L.leaflet.z),
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI),
        new THREE.Vector3(L.leafX, 1, L.leafZ),
      ),
      bm = new THREE.Matrix4().makeTranslation(L.binderK4.x, y + COVER_T, L.binderK4.z);
    return [
      rectAnchorFrom("leaflet", lm, [-0.5, 0.0007, -0.5], [0.5, 0.0007, 0.5]),
      rectAnchorFrom("page", bm, [PAGE_COPY.x0, pageY, PAGE.d / 2], [PAGE_COPY.x1, pageY, -PAGE.d / 2]),
    ];
  };

  return { group, place, update, setOpen, setHands, copyAnchors, holdAnchors, fade };
}
export type CounterProps = ReturnType<typeof createCounterProps>;
