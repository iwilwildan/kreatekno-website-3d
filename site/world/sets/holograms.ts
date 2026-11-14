// The holograms over the front room's empty desks at the end of the day (tahap 9, the team's continuation video
// 24–33 s; the AI assistant doing the staff's routine work while they are in class): Kreatekno's logo in 3D
// (assets/brand/kreatekno-mark.png, user 14 Nov). A cube seen corner on, its faces in the logo's colours (left cyan,
// right purple, bottom violet; each opposite face the same, so every view shows the three), and the logo's three
// nodes (a ring open toward the cube, a disc inside it on a stem to the cube's corner) as plaques in the plane
// through the corners they hang from, each in the colour of its face. Measured off the mark (477 px, the hexagon's
// circumradius R ±114 px): node centres 1.62 R from the middle, ring 0.38–0.48 R, disc 0.24 R, stem 0.21 R wide.
// Each floats and turns a little either side of facing the camera (the logo reads, the depth shows), a soft glow in
// its colours behind it. Unlit (the logo's exact colours, a face darker as it turns away), instanced: two draw calls
// for all four. `update(time, camera)` moves them.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { Kit } from "../core/kit";

/** The logo's colours (assets/brand/README.md). */
const CYAN = "#35eafe",
  PURPLE = "#9f0ed6",
  VIOLET = "#8c2bfa";
/** The cube's side (m): the logo ±0.6 m wide, ±0.52 m tall (video 25 s: about a monitor's width). */
const A = 0.19;
/** The hexagon's circumradius: the cube seen along its diagonal. */
const R = A * Math.sqrt(2 / 3);
// the nodes, in R (measured off the mark): the rings and the discs, the stems' width and length from the corner
const RING_OUT = 0.46,
  RING_IN = 0.36,
  DISC = 0.23,
  STEM = 0.103,
  /** Half the ring's opening (radians) round the stem, the disc's clearance either side. */
  GAP = 0.73,
  PLATE = 0.11,
  /** The mark's cube is ±5% wider than one seen exactly along its diagonal, and seen a little from below (its middle
   * corner 0.064 R above the outline's centre). */
  WIDE = 1.05,
  TILT = THREE.MathUtils.degToRad(-3.5);
/** The nodes: the stem's direction off its corner (the upper ones almost level, the lower one straight down) and
 * its length to the node's centre. */
const NODES = { left: [Math.PI - 0.454, 0.545], right: [0.454, 0.545], down: [-Math.PI / 2, 0.54] } as const;

/** A node in its own frame (R = 1; +y away from the cube, the corner at y −len): the ring open toward the cube, and
 * the disc on its stem flaring into the cube (the flare's end is inside the cube, out of sight). */
function nodeShapes(len: number) {
  const ring = new THREE.Shape(),
    mid = (RING_OUT + RING_IN) / 2,
    cap = (RING_OUT - RING_IN) / 2,
    a0 = -Math.PI / 2 + GAP,
    a1 = (3 * Math.PI) / 2 - GAP;
  ring.absarc(0, 0, RING_OUT, a0, a1, false);
  ring.absarc(mid * Math.cos(a1), mid * Math.sin(a1), cap, a1, a1 + Math.PI, false);
  ring.absarc(0, 0, RING_IN, a1, a0, true);
  ring.absarc(mid * Math.cos(a0), mid * Math.sin(a0), cap, a0 + Math.PI, a0 + 2 * Math.PI, false);

  const disc = new THREE.Shape(),
    y0 = -Math.sqrt(DISC * DISC - STEM * STEM),
    corner = -len,
    sa = Math.atan2(y0, STEM);
  disc.moveTo(STEM, y0);
  disc.absarc(0, 0, DISC, sa, Math.PI - sa, false);
  disc.lineTo(-STEM, corner + 0.14);
  disc.quadraticCurveTo(-STEM, corner + 0.02, -0.16, corner - 0.2);
  disc.lineTo(0.16, corner - 0.2);
  disc.quadraticCurveTo(STEM, corner + 0.02, STEM, corner + 0.14);
  disc.closePath();
  return [ring, disc];
}

/** The logo as one geometry (vertex colours), centred on its outline's middle, facing +z. */
function logoGeometry() {
  // the cube turned so its diagonal faces +z and the violet face's far corner points straight down, then tipped a
  // little toward the eye at the bottom (the mark)
  const diag = new THREE.Vector3(1, 1, 1).normalize(),
    q0 = new THREE.Quaternion().setFromUnitVectors(diag, new THREE.Vector3(0, 0, 1)),
    far = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z).multiplyScalar(A / 2).applyQuaternion(q0),
    vb = far(1, -1, -1),
    q = new THREE.Quaternion()
      .setFromAxisAngle(new THREE.Vector3(1, 0, 0), TILT)
      .multiply(
        new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), -Math.PI / 2 - Math.atan2(vb.y, vb.x)),
      )
      .multiply(q0);
  // each face's corner the nodes hang from (the one next to the hidden far corner), and its colour: +x violet (down),
  // +y and +z cyan (up left) or purple (up right)
  const corners = [new THREE.Vector3(1, -1, -1), new THREE.Vector3(-1, 1, -1), new THREE.Vector3(-1, -1, 1)].map((c) =>
    c.multiplyScalar(A / 2).applyQuaternion(q),
  );
  const colours = [VIOLET, ...corners.slice(1).map((c) => (c.x < 0 ? CYAN : PURPLE))].map((h) => new THREE.Color(h));

  const paint = (g: THREE.BufferGeometry, c: THREE.Color | ((i: number) => THREE.Color)) => {
    const n = g.attributes.position.count,
      col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) col.set((typeof c === "function" ? c(i) : c).toArray(), i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return g;
  };
  const cube = new THREE.BoxGeometry(A, A, A).toNonIndexed();
  cube.deleteAttribute("uv");
  // BoxGeometry's faces in order +x, −x, +y, −y, +z, −z (6 vertices each, non-indexed)
  paint(cube, (i) => colours[Math.floor(i / 12)]);
  cube.applyQuaternion(q).scale(WIDE, 1, 1);

  const plate = (sh: THREE.Shape) => {
    const g = new THREE.ExtrudeGeometry(sh, {
      depth: PLATE,
      curveSegments: 7,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelOffset: -0.025,
      bevelSegments: 1,
    });
    g.translate(0, 0, -PLATE / 2);
    g.deleteAttribute("uv");
    return g;
  };
  const nodes = corners.map((c, k) => {
    const [dir, len] = k === 0 ? NODES.down : c.x < 0 ? NODES.left : NODES.right,
      u = new THREE.Vector3(Math.cos(dir), Math.sin(dir), 0),
      at = new THREE.Vector3(c.x * WIDE, c.y, c.z).addScaledVector(u, len * R),
      m = new THREE.Matrix4()
        .makeBasis(new THREE.Vector3(u.y, -u.x, 0), u, new THREE.Vector3(0, 0, 1))
        .scale(new THREE.Vector3(R, R, R))
        .setPosition(at);
    return nodeShapes(len).map((sh) => paint(plate(sh).applyMatrix4(m), colours[k]));
  });
  const g = mergeGeometries([cube, ...nodes.flat()]);
  g.computeBoundingBox();
  const bb = g.boundingBox!;
  g.translate(0, -(bb.min.y + bb.max.y) / 2, 0);
  return g;
}

export function buildHolograms(kit: Kit, at: THREE.Vector3[]) {
  const group = new THREE.Group();
  group.name = "holograms";
  const n = at.length;
  const logos = new THREE.InstancedMesh(
    logoGeometry(),
    new THREE.ShaderMaterial({
      vertexColors: true,
      toneMapped: false,
      vertexShader: /* glsl */ `
        varying vec3 vColor;
        varying float vFacing;
        void main() {
          mat4 m = modelMatrix * instanceMatrix;
          vec4 wp = m * vec4(position, 1.0);
          vFacing = abs(dot(normalize(mat3(m) * normal), normalize(cameraPosition - wp.xyz)));
          vColor = color;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      // the logo's colour where a face meets the eye as the mark's do (the cube's at ±55°, the plates' fronts),
      // darker as it turns edge on (the plates' sides, a face swung away)
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vFacing;
        void main() {
          gl_FragColor = vec4(vColor * mix(0.62, 1.0, smoothstep(0.08, 0.56, vFacing)), 1.0);
          #include <colorspace_fragment>
        }`,
    }),
    n,
  );
  // a soft glow in the logo's colours behind each (cyan up left, violet below)
  const glowTex = kit.canvasTex(128, 128, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, "rgba(190,150,255,0.7)");
    r.addColorStop(0.4, "rgba(150,110,255,0.26)");
    r.addColorStop(1, "rgba(110,90,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "source-atop";
    const c = g.createLinearGradient(0, 0, w, h);
    c.addColorStop(0, "rgba(53,234,254,0.55)");
    c.addColorStop(0.55, "rgba(140,43,250,0.15)");
    c.addColorStop(1, "rgba(159,14,214,0.4)");
    g.fillStyle = c;
    g.fillRect(0, 0, w, h);
  });
  const glows = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      toneMapped: false,
      blending: THREE.AdditiveBlending,
    }),
    n,
  );
  for (const m of [logos, glows]) {
    m.frustumCulled = false;
    m.castShadow = m.receiveShadow = false;
    group.add(m);
  }
  glows.renderOrder = 3;
  const M = new THREE.Matrix4(),
    Q = new THREE.Quaternion(),
    P = new THREE.Vector3(),
    S = new THREE.Vector3(1, 1, 1),
    G = new THREE.Vector3(0.8, 0.8, 0.8),
    toCam = new THREE.Vector3(),
    up = new THREE.Vector3(0, 1, 0),
    look = new THREE.Matrix4(),
    sway = new THREE.Quaternion(),
    Y = new THREE.Vector3(0, 1, 0),
    O = new THREE.Vector3();
  const update = (t: number, camera: THREE.Camera) => {
    at.forEach((base, i) => {
      P.copy(base).setY(base.y + 0.03 * Math.sin(t * 1.2 + i * 1.7));
      // facing the camera (turned about y only: upright), swung ±23° either side of it, each on its own phase
      toCam.copy(camera.position).sub(P).setY(0);
      if (toCam.lengthSq() < 1e-6) toCam.set(0, 0, 1);
      look.lookAt(toCam, O, up);
      Q.setFromRotationMatrix(look).multiply(sway.setFromAxisAngle(Y, 0.4 * Math.sin(t * 0.55 + 0.9 + i * 2.1)));
      logos.setMatrixAt(i, M.compose(P, Q, S));
      // the glow a little behind the logo, square to the camera
      toCam.copy(camera.position).sub(P).normalize().multiplyScalar(-0.12).add(P);
      glows.setMatrixAt(i, M.compose(toCam, camera.quaternion, G));
    });
    for (const m of [logos, glows]) m.instanceMatrix.needsUpdate = true;
  };
  update(0, new THREE.Camera());
  return { group, update };
}
export type Holograms = ReturnType<typeof buildHolograms>;
