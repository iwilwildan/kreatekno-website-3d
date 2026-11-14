// The holograms over the front room's empty desks at the end of the day (tahap 9, the team's continuation video
// 24–33 s; the AI assistant doing the staff's routine work while they are in class): a cube in purple, magenta and
// blue turning slowly, two thin rings round it and three small lights running along them, a soft violet glow behind.
// Unlit and additive (no bloom), instanced: four draw calls for all of them. `update(time, camera)` turns them and
// keeps the glows facing the camera.
import * as THREE from "three";
import type { Kit } from "../core/kit";

const RING_R = 0.27;
/** Tilt of each hologram's two rings (radians about x and z). */
const TILTS = [
  [1.1, 0.35],
  [0.5, -0.9],
] as const;

export function buildHolograms(kit: Kit, at: THREE.Vector3[]) {
  const group = new THREE.Group();
  group.name = "holograms";
  const n = at.length;
  // the cube: each face its own colour, a little see-through
  const cubeGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22).toNonIndexed();
  {
    const faces = ["#8a3cff", "#c04cff", "#5b7dff", "#a347ff", "#e05cff", "#6b5cff"].map((h) => new THREE.Color(h)),
      col = new Float32Array(cubeGeo.attributes.position.count * 3);
    for (let i = 0; i < cubeGeo.attributes.position.count; i++) col.set(faces[Math.floor(i / 6)].toArray(), i * 3);
    cubeGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  }
  const add = (opacity: number) =>
    ({ transparent: true, opacity, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending }) as const;
  const cubes = new THREE.InstancedMesh(
    cubeGeo,
    new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, toneMapped: false }),
    n,
  );
  const rings = new THREE.InstancedMesh(
    new THREE.TorusGeometry(RING_R, 0.006, 6, 48),
    new THREE.MeshBasicMaterial({ color: "#8fd3ff", ...add(0.85) }),
    n * 2,
  );
  const dots = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.026, 10, 8),
    new THREE.MeshBasicMaterial({ color: "#b9f3ff", ...add(1) }),
    n * 3,
  );
  const glowTex = kit.canvasTex(128, 128, (g, w, h) => {
    const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    gr.addColorStop(0, "rgba(200,120,255,0.75)");
    gr.addColorStop(0.35, "rgba(150,90,255,0.3)");
    gr.addColorStop(1, "rgba(110,80,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const glows = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: glowTex, ...add(0.9) }),
    n,
  );
  for (const m of [cubes, rings, dots, glows]) {
    m.frustumCulled = false;
    m.castShadow = m.receiveShadow = false;
    m.renderOrder = 3;
    group.add(m);
  }
  const M = new THREE.Matrix4(),
    Q = new THREE.Quaternion(),
    E = new THREE.Euler(),
    P = new THREE.Vector3(),
    S = new THREE.Vector3(1, 1, 1),
    tiltQ = TILTS.map(([ax, az]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(ax, 0, az)));
  const update = (t: number, camera: THREE.Camera) => {
    at.forEach((base, i) => {
      const bob = 0.035 * Math.sin(t * 1.3 + i * 1.7);
      P.copy(base).setY(base.y + bob);
      cubes.setMatrixAt(i, M.compose(P, Q.setFromEuler(E.set(0.55, t * 0.8 + i, 0.35)), S));
      for (const [k, tq] of tiltQ.entries()) {
        const spin = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), t * (0.5 + 0.2 * k));
        rings.setMatrixAt(i * 2 + k, M.compose(P, tq.clone().multiply(spin), S));
      }
      for (let j = 0; j < 3; j++) {
        const a = t * 1.25 + (j * Math.PI * 2) / 3 + i,
          ring = tiltQ[j % 2],
          off = new THREE.Vector3(Math.cos(a) * RING_R, Math.sin(a) * RING_R, 0).applyQuaternion(ring);
        dots.setMatrixAt(i * 3 + j, M.compose(off.add(P), Q.identity(), S));
      }
      glows.setMatrixAt(i, M.compose(P, camera.quaternion, new THREE.Vector3(0.95, 0.95, 0.95)));
    });
    for (const m of [cubes, rings, dots, glows]) m.instanceMatrix.needsUpdate = true;
  };
  update(0, new THREE.Camera());
  return { group, update };
}
export type Holograms = ReturnType<typeof buildHolograms>;
