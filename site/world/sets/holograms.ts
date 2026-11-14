// The holograms over the front room's empty desks at the end of the day (tahap 9, the team's continuation video
// 24–33 s; the AI assistant doing the staff's routine work while they are in class): Kreatekno's logo in 3D after the
// user's reference render (14 Nov). A glossy rounded cube seen corner on (left face cyan, right magenta, bottom
// violet, darker toward the middle and bright at its tip; each opposite face the same, so every view shows the
// three), and the logo's three nodes as thick glossy coins, the C groove sunk in their faces (a disc in the middle,
// bridged to the rim toward the cube), riding a thin glowing orbit round the cube: cyan large at the back left,
// magenta small at the back right, violet the largest in front at the right. The orbit fades cyan → violet →
// magenta, a few sparks beside it; a soft violet glow behind the cube and one round each coin. Measured off the
// reference (cube's side A): orbit radius 1.62 A, tilted 35°, coins 0.37 / 0.23 / 0.43 A.
// Each turns a little either side of facing the camera, floats, its coins circling slowly. Unlit (a fixed light from
// the upper left in the camera's space: the same gloss in the dusk as in the afternoon), instanced: four draw calls
// for all four. `update(time, camera)` moves them.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Kit } from "../core/kit";

/** The cube's side (m): the whole ±0.6 m wide (video 25 s: about a monitor's width). */
const A = 0.18;
/** The cube's colours (the reference, a little brighter: the light dims the right and the bottom faces). */
const FACE = { cyan: "#12c8ea", magenta: "#dc12d2", violet: "#7c26f2" };
/** The orbit: radius, tilt toward the eye (its front half lower), roll (its right end higher), centre below the cube. */
const ORBIT = { r: 1.62 * A, tilt: THREE.MathUtils.degToRad(35), roll: THREE.MathUtils.degToRad(7), y: -0.14 * A };
/** The coins: where on the orbit at time 0 (0 = right, π/2 = front), radius, colour. */
const COINS = [
  { at: THREE.MathUtils.degToRad(225), r: 0.37 * A, color: "#0ab6da" },
  { at: THREE.MathUtils.degToRad(309), r: 0.23 * A, color: "#d21ab8" },
  { at: THREE.MathUtils.degToRad(64), r: 0.43 * A, color: "#9a3ef6" },
] as const;
/** The whole is centred on its outline's middle (the violet coin hangs lower than the magenta one rises). */
const LIFT = 0.22 * A;
/** The cube's side: a little more than A (the reference: the cube 0.44 of the orbit's width). */
const CUBE = 1.12 * A;
/** The coins ride a little in front of the orbit's line (the line passes behind them, the reference). */
const COIN_OUT = 0.35 * A;
const X = new THREE.Vector3(1, 0, 0),
  Z = new THREE.Vector3(0, 0, 1);

/** The cube, rounded, its diagonal toward +z and the violet face's far corner straight down (as the logo). */
function cubeGeometry() {
  const diag = new THREE.Vector3(1, 1, 1).normalize(),
    q0 = new THREE.Quaternion().setFromUnitVectors(diag, Z),
    vb = new THREE.Vector3(1, -1, -1).applyQuaternion(q0),
    q = new THREE.Quaternion().setFromAxisAngle(Z, -Math.PI / 2 - Math.atan2(vb.y, vb.x)).multiply(q0);
  // +x violet (down); +y, +z cyan if their far corner is on the left, magenta on the right
  const left = (c: THREE.Vector3) => c.applyQuaternion(q).x < 0;
  const cols = [
    FACE.violet,
    left(new THREE.Vector3(-1, 1, -1)) ? FACE.cyan : FACE.magenta,
    left(new THREE.Vector3(-1, -1, 1)) ? FACE.cyan : FACE.magenta,
  ].map((h) => new THREE.Color(h));
  const g = new RoundedBoxGeometry(CUBE, CUBE, CUBE, 2, 0.13 * CUBE);
  g.deleteAttribute("uv");
  const pos = g.attributes.position,
    nor = g.attributes.normal,
    col = new Float32Array(pos.count * 3),
    n = new THREE.Vector3(),
    p = new THREE.Vector3(),
    c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    n.fromBufferAttribute(nor, i);
    const ax = [Math.abs(n.x), Math.abs(n.y), Math.abs(n.z)],
      k = ax.indexOf(Math.max(...ax));
    c.copy(cols[k]);
    // the shading within a face, by the vertex's height once turned: the side faces lighter at the top, the bottom
    // face dark by the middle corner and bright at its tip (the reference)
    p.fromBufferAttribute(pos, i).applyQuaternion(q);
    const h = p.y / (CUBE * 0.82);
    c.multiplyScalar(k === 0 ? THREE.MathUtils.lerp(1.55, 0.62, THREE.MathUtils.clamp(h + 1, 0, 1)) : 1 + 0.12 * h);
    col.set([c.r, c.g, c.b], i * 3);
  }
  g.setAttribute("color", new THREE.BufferAttribute(col, 3));
  g.applyQuaternion(q);
  return g;
}

/** A coin of radius 1 facing +z: thick, rounded at the edge, the C groove sunk in its face (white: the instance's
 * colour; the groove's floor and walls darker). The bridge across the groove points down (−y). */
function coinGeometry() {
  const RI = 0.36,
    RO = 0.62,
    GAP = 0.62,
    mid = (RI + RO) / 2,
    cap = (RO - RI) / 2,
    a0 = -Math.PI / 2 + GAP,
    a1 = (3 * Math.PI) / 2 - GAP,
    D = 0.22,
    B = 0.07,
    SUNK = 0.13;
  // (points placed by hand: absarc gives every arc, the small caps too, the same count)
  const arc = (
    path: THREE.Path,
    cx: number,
    cy: number,
    r: number,
    from: number,
    to: number,
    k: number,
    first = false,
  ) => {
    for (let i = first ? 0 : 1; i <= k; i++) {
      const a = from + ((to - from) * i) / k;
      if (first && i === 0) path.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      else path.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
    }
  };
  const disc = new THREE.Shape();
  arc(disc, 0, 0, 1, 0, Math.PI * 2, 22, true);
  const slot = new THREE.Path();
  arc(slot, 0, 0, RO, a0, a1, 12, true);
  arc(slot, mid * Math.cos(a1), mid * Math.sin(a1), cap, a1, a1 + Math.PI, 3);
  arc(slot, 0, 0, RI, a1, a0, 8);
  arc(slot, mid * Math.cos(a0), mid * Math.sin(a0), cap, a0 + Math.PI, a0 + 2 * Math.PI - 0.01, 3);
  disc.holes.push(slot);
  const body = new THREE.ExtrudeGeometry(disc, {
    depth: D,
    bevelEnabled: true,
    bevelThickness: B,
    bevelSize: B,
    bevelOffset: -B,
    bevelSegments: 1,
  });
  body.translate(0, 0, -D / 2);
  body.deleteAttribute("uv");
  const front = D / 2 + B;
  // the groove's walls darker the deeper
  {
    const pos = body.attributes.position,
      col = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const r = Math.hypot(pos.getX(i), pos.getY(i)),
        inGroove = r > RI - 0.09 && r < RO + 0.09,
        k = inGroove
          ? THREE.MathUtils.lerp(0.35, 1, THREE.MathUtils.clamp((Math.abs(pos.getZ(i)) - (front - SUNK)) / 0.1, 0, 1))
          : 1;
      col.set([k, k, k], i * 3);
    }
    body.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  // the groove's floor (the slot is cut through the body; the coins never show their backs)
  const floor = (z: number) => {
    const g = new THREE.CircleGeometry(RO + 0.05, 24);
    g.translate(0, 0, z);
    g.deleteAttribute("uv");
    g.setAttribute("color", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 3).fill(0.3), 3));
    return g.toNonIndexed();
  };
  return mergeGeometries([body, floor(front - SUNK)]);
}

/** A point at radius r and angle a in the orbit's plane (the hologram's frame, before LIFT). */
function orbitAt(a: number, out = new THREE.Vector3(), r = ORBIT.r) {
  return out
    .set(r * Math.cos(a), 0, r * Math.sin(a))
    .applyAxisAngle(X, ORBIT.tilt)
    .applyAxisAngle(Z, ORBIT.roll)
    .setY(out.y + ORBIT.y);
}

/** The orbit as a ribbon in its plane (a bright thin core, a soft glow either side; additive, so black is clear),
 * cyan at its left end, violet across, magenta at its right, brightest at the ends; a few sparks beside it. */
function orbitGeometry() {
  const N = 80,
    offs = [-0.055, -0.008, 0, 0.008, 0.055].map((o) => o * A),
    prof = [0, 0.3, 1, 0.3, 0],
    pos: number[] = [],
    col: number[] = [],
    idx: number[] = [];
  const cyan = new THREE.Color("#2ad6ff"),
    violet = new THREE.Color("#7a3cff"),
    magenta = new THREE.Color("#ff3cf0"),
    c = new THREE.Color(),
    p = new THREE.Vector3();
  const tint = (x: number) => {
    const u = THREE.MathUtils.clamp((x / ORBIT.r + 1) / 2, 0, 1);
    return u < 0.5 ? c.copy(cyan).lerp(violet, u * 2) : c.copy(violet).lerp(magenta, (u - 0.5) * 2);
  };
  for (let j = 0; j <= N; j++) {
    const a = (j / N) * Math.PI * 2,
      bright = 0.35 + 0.65 * THREE.MathUtils.smoothstep(Math.abs(Math.cos(a)), 0.2, 0.95);
    tint(orbitAt(a, p).x);
    offs.forEach((o, k) => {
      orbitAt(a, p, ORBIT.r + o);
      pos.push(p.x, p.y, p.z);
      const v = prof[k] * bright * 1.3;
      col.push(c.r * v, c.g * v, c.b * v);
    });
  }
  const S = offs.length;
  for (let j = 0; j < N; j++)
    for (let k = 0; k < S - 1; k++) {
      const a = j * S + k,
        b = a + S;
      idx.push(a, b, a + 1, a + 1, b, b + 1);
    }
  // sparks: small squares in the orbit's plane just off it, in clusters (the reference: along the cyan coin's trail
  // at the left, and at the right)
  const spark = (a: number, off: number, s: number) => {
    const base = pos.length / 3;
    tint(orbitAt(a, p).x);
    for (const [dr, da] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      orbitAt(a + (da * s) / ORBIT.r, p, ORBIT.r + off + dr * s);
      pos.push(p.x, p.y, p.z);
      col.push(c.r * 1.8, c.g * 1.8, c.b * 1.8);
    }
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  for (const [a, o] of [
    [168, 0.08],
    [176, 0.12],
    [160, -0.07],
    [112, 0.09],
    [104, 0.13],
    [97, 0.1],
    [-12, 0.1],
    [-4, 0.14],
    [8, -0.08],
    [24, 0.11],
  ])
    spark(THREE.MathUtils.degToRad(a), o * A, 0.012 * A);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}

/** Glossy and unlit: the vertex colour (times the instance's) lit by a fixed light from the upper left in the
 * camera's space, a white highlight on what turns toward it (the rounded edges, the coins' rims) and a rim light. */
function glossMaterial() {
  return new THREE.ShaderMaterial({
    vertexColors: true,
    vertexShader: /* glsl */ `
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        mat4 m = modelMatrix * instanceMatrix;
        vec4 vp = viewMatrix * m * vec4(position, 1.0);
        vN = normalize(mat3(viewMatrix) * mat3(m) * normal);
        vV = -vp.xyz;
        vColor = color;
        #ifdef USE_INSTANCING_COLOR
          vColor *= instanceColor;
        #endif
        gl_Position = projectionMatrix * vp;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vV;
      void main() {
        vec3 n = normalize(vN), v = normalize(vV);
        if (dot(n, v) < 0.0) n = -n;
        vec3 L = normalize(vec3(-0.45, 0.65, 0.6));
        float d = max(dot(n, L), 0.0);
        float spec = pow(max(dot(n, normalize(L + v)), 0.0), 110.0);
        float rim = pow(1.0 - max(dot(n, v), 0.0), 3.0);
        vec3 c = vColor * (0.7 + 0.42 * d) + vec3(0.75 * spec) + (vColor * 0.9 + 0.05) * rim * 0.4;
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

export function buildHolograms(kit: Kit, at: THREE.Vector3[]) {
  const group = new THREE.Group();
  group.name = "holograms";
  const n = at.length,
    nc = COINS.length,
    gloss = glossMaterial();
  const cubes = new THREE.InstancedMesh(cubeGeometry(), gloss, n);
  const coins = new THREE.InstancedMesh(coinGeometry(), gloss, n * nc);
  const orbits = new THREE.InstancedMesh(
    orbitGeometry(),
    new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    }),
    n,
  );
  // glows: one behind each whole (violet, behind the orbit's back so it does not veil the coins there), one round each
  // coin (its colour)
  const glowTex = kit.canvasTex(128, 128, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, "rgba(255,255,255,0.75)");
    r.addColorStop(0.35, "rgba(255,255,255,0.28)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  });
  const glows = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    }),
    n * (1 + nc),
  );
  const coinCol = COINS.map((k) => new THREE.Color(k.color)),
    cubeGlow = new THREE.Color("#5a2cc0");
  for (let i = 0; i < n; i++) {
    glows.setColorAt(i * (1 + nc), cubeGlow);
    coinCol.forEach((c, k) => {
      coins.setColorAt(i * nc + k, c);
      glows.setColorAt(i * (1 + nc) + 1 + k, c.clone().multiplyScalar(0.45));
    });
  }
  for (const m of [cubes, coins, orbits, glows]) {
    m.frustumCulled = false;
    m.castShadow = m.receiveShadow = false;
    group.add(m);
  }
  orbits.renderOrder = glows.renderOrder = 3;

  const M = new THREE.Matrix4(),
    H = new THREE.Matrix4(),
    C = new THREE.Matrix4(),
    Q = new THREE.Quaternion(),
    P = new THREE.Vector3(),
    ONE = new THREE.Vector3(1, 1, 1),
    toCam = new THREE.Vector3(),
    look = new THREE.Matrix4(),
    sway = new THREE.Quaternion(),
    Y = new THREE.Vector3(0, 1, 0),
    O = new THREE.Vector3(),
    lift = new THREE.Matrix4().makeTranslation(0, LIFT, 0),
    v = new THREE.Vector3(),
    w = new THREE.Vector3(),
    s = new THREE.Vector3(),
    // the coins face the upper left a little (the reference: their thickness shows at the lower right)
    face = new THREE.Quaternion().setFromUnitVectors(Z, new THREE.Vector3(-0.3, 0.2, 0.93).normalize()),
    roll = new THREE.Quaternion(),
    cq = new THREE.Quaternion();
  const glowAt = (k: number, p: THREE.Vector3, back: number, size: number, camera: THREE.Camera) => {
    toCam.copy(camera.position).sub(p).normalize().multiplyScalar(-back).add(p);
    glows.setMatrixAt(k, M.compose(toCam, camera.quaternion, s.setScalar(size)));
  };
  const update = (t: number, camera: THREE.Camera) => {
    at.forEach((base, i) => {
      P.copy(base).setY(base.y + 0.03 * Math.sin(t * 1.2 + i * 1.7));
      // facing the camera (turned about y only: upright), swung ±14° either side of it, each on its own phase
      toCam.copy(camera.position).sub(P).setY(0);
      if (toCam.lengthSq() < 1e-6) toCam.set(0, 0, 1);
      look.lookAt(toCam, O, Y);
      Q.setFromRotationMatrix(look).multiply(sway.setFromAxisAngle(Y, 0.24 * Math.sin(t * 0.5 + i * 2.1)));
      H.compose(P, Q, ONE).multiply(lift);
      cubes.setMatrixAt(i, H);
      orbits.setMatrixAt(i, H);
      // the coins circling the orbit, their bridges toward the cube
      COINS.forEach((k, j) => {
        orbitAt(k.at + 0.3 * t, v).z += COIN_OUT;
        roll.setFromAxisAngle(Z, Math.atan2(-v.y, -v.x) + Math.PI / 2);
        cq.copy(face).multiply(roll);
        M.multiplyMatrices(H, C.compose(v, cq, s.setScalar(k.r)));
        coins.setMatrixAt(i * nc + j, M);
        glowAt(i * (1 + nc) + 1 + j, w.setFromMatrixPosition(M), 0.09, k.r * 3.4, camera);
      });
      glowAt(i * (1 + nc), w.set(0, -0.15 * A, 0).applyMatrix4(H), 0.4, 3.2 * A, camera);
    });
    for (const m of [cubes, coins, orbits, glows]) m.instanceMatrix.needsUpdate = true;
  };
  update(0, new THREE.Camera());
  return { group, update };
}
export type Holograms = ReturnType<typeof buildHolograms>;
