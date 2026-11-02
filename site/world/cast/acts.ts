// Small looping actions of the people in the COMPANY room (tahap 4), on top of their K2 poses: time-based,
// like the pigeons at K0, and only run while the room is on screen. Every action starts from its K2 pose at
// time 0, so stills and review shots (?shot, time 0) show the poses of tahap 3.
import * as THREE from "three";
import type { Vec3 } from "../core/kit";
import type { CastMember } from "./member";
import { applyPose, type Pose } from "./poses";

const TAU = Math.PI * 2;
/** 0 … 1 … 0 bursts: on for `on` seconds of every `period`, eased in and out. */
const burst = (t: number, period: number, on: number, phase = 0) => {
  const x = (((t + phase) % period) + period) % period;
  return x < on ? Math.sin((Math.PI * x) / on) ** 2 : 0;
};
const add = (a: Vec3 | undefined, b: Vec3): Vec3 => [(a?.[0] ?? 0) + b[0], (a?.[1] ?? 0) + b[1], (a?.[2] ?? 0) + b[2]];
const move = (h: Pose["L"], d: Vec3): Pose["L"] => (h ? { ...h, at: add(h.at, d) } : h);

type Act = (p: Pose, t: number, look: number) => Pose;

/** What each member does over time; `look` is the head turn toward Heru (Bu Dewi only). */
const ACTS: Record<string, Act> = {
  // thumbs on the phone in quick bursts, a small nod at each new message
  sinta: (p, t) => {
    const k = burst(t, 2.6, 1.8),
      tap = (ph: number) => Math.max(0, Math.sin(TAU * 5.5 * t + ph)) * 0.006 * k;
    return {
      ...p,
      L: move(p.L, [0, tap(0), 0]),
      R: move(p.R, [0, tap(Math.PI), 0]),
      head: add(p.head, [0.03 * Math.sin(TAU * 0.38 * t) - 0.04 * burst(t, 2.6, 0.5, 2.0), 0, 0]),
    };
  },
  // typing, now and then a glance at the slips stacked on his left
  bayu: (p, t) => {
    const k = 1 - burst(t, 6.5, 1.6, 3.5) * 0.8,
      tap = (ph: number) => Math.max(0, Math.sin(TAU * 4.2 * t + ph)) * 0.007 * k;
    return {
      ...p,
      L: move(p.L, [0, tap(0.6), 0]),
      R: move(p.R, [0, tap(2.4), 0]),
      head: add(p.head, [0.02 * Math.sin(TAU * 0.3 * t), 0.55 * burst(t, 6.5, 1.6, 3.5), 0]),
    };
  },
  // chin on her hand, the head rocking a little, no idea coming
  nadia: (p, t) => ({
    ...p,
    head: add(p.head, [0.015 * Math.sin(TAU * 0.21 * t), 0, 0.035 * Math.sin(TAU * 0.13 * t)]),
  }),
  // scratching his head in bursts, tilting it the other way while he does
  fajar: (p, t) => {
    const k = burst(t, 2.4, 1.6, 0.3),
      a = TAU * 3.2 * t;
    return {
      ...p,
      R: move(p.R, [0.012 * Math.cos(a) * k, 0.014 * Math.sin(a) * k, 0]),
      head: add(p.head, [0, 0, -0.05 * k + 0.02 * Math.sin(TAU * 0.17 * t)]),
    };
  },
  // at the counter, turning her head toward Heru
  dewi: (p, _t, look) => ({ ...p, head: add(p.head, [0, look, 0]) }),
};

/** Breathing, per member a different phase. */
const breathe = (t: number, seed: number) => 0.012 * Math.sin(TAU * 0.24 * t + seed * 1.7);

/**
 * Blink: one quick blink at a random moment of every 3–6 s window (deterministic, from the member's seed); never
 * in the first half second, so time 0 has open eyes. Returns the eye squash 0 (open) … 1 (shut).
 */
export function blinkAt(t: number, seed: number) {
  const span = 4.5,
    i = Math.floor(t / span),
    h = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1,
    at = i * span + 0.5 + h * (span - 1.2),
    x = (t - at) / 0.16;
  return x > 0 && x < 1 ? Math.sin(Math.PI * x) : 0;
}

export function setBlink(m: CastMember, shut: number) {
  for (const n of ["eyeL", "eyeR"]) m.rig.bone(n).scale.y = 1 - 0.88 * shut;
}

/** Poses a seated or standing member at time t (seconds) from its K2 pose; `look` turns Bu Dewi's head. */
export function act(m: CastMember, base: Pose, t: number, seed: number, look = 0) {
  const p = (ACTS[m.name] ?? ((q: Pose) => q))(base, t, look);
  applyPose(m, { ...p, chest: add(p.chest, [breathe(t, seed), 0, 0]) }, false);
  setBlink(m, blinkAt(t, seed));
}

/** Head turn (radians, ±0.35) for a member to look toward a world point, in its own frame. */
export function lookYaw(m: CastMember, at: THREE.Vector3) {
  const local = m.mesh.worldToLocal(at.clone());
  return Math.max(-0.35, Math.min(0.35, Math.atan2(local.x, local.z)));
}

/**
 * Sinta's phone, held between her hands with its screen lit, and green chat bubbles (plain, no app logo) popping
 * up from it and fading as they rise: the notifications that never stop. Separate small meshes (not part of her
 * skinned mesh), placed from her hand bones each frame. At time 0 two bubbles are already in the air, so the
 * stills show them too.
 */
export function createPhone() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(0.075, 0.009, 0.15),
    new THREE.MeshStandardMaterial({ color: "#2d2c33", roughness: 0.35 }),
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.064, 0.13).rotateX(-Math.PI / 2).translate(0, 0.0047, 0),
    new THREE.MeshBasicMaterial({ color: "#d9f7e4" }),
  );
  body.castShadow = true;
  const phone = new THREE.Group().add(body, screen);
  group.add(phone);
  const tex = bubbleTexture();
  const bubbles = [0, 1, 2].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.scale.setScalar(0.055);
    group.add(s);
    return s;
  });
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    up = new THREE.Vector3();
  /** Places the phone in Sinta's hands and the bubbles above it at time t. */
  const update = (m: CastMember, t: number) => {
    m.rig.bone("handL").getWorldPosition(a);
    m.rig.bone("handR").getWorldPosition(b);
    phone.position.copy(a).add(b).multiplyScalar(0.5);
    phone.quaternion.copy(m.mesh.quaternion);
    // forward of the wrists, screen tilted up toward her face
    phone.translateZ(0.07);
    phone.translateY(0.015);
    phone.rotateX(0.55);
    phone.updateMatrixWorld();
    up.set(0, 1, 0);
    bubbles.forEach((s, i) => {
      const age = (((t + 0.9 + i * 0.85) % 2.55) + 2.55) % 2.55,
        k = Math.min(1, age / 1.6);
      s.position.copy(phone.position).addScaledVector(up, 0.08 + 0.26 * k);
      s.position.x += 0.04 * Math.sin(i * 2.1 + age * 2.4);
      s.scale.setScalar(0.05 + 0.035 * Math.min(1, age / 0.25));
      s.material.opacity = age < 1.6 ? Math.min(1, age / 0.15) * (1 - Math.max(0, (age - 1.1) / 0.5)) : 0;
      s.visible = s.material.opacity > 0.01;
    });
  };
  const dispose = () => {
    body.geometry.dispose();
    (body.material as THREE.Material).dispose();
    screen.geometry.dispose();
    (screen.material as THREE.Material).dispose();
    tex.dispose();
    for (const s of bubbles) s.material.dispose();
  };
  return { group, update, dispose };
}

/** A green speech bubble with three white dots (generic, no app logo). */
function bubbleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#2fbf5f";
  g.beginPath();
  g.roundRect(6, 8, 52, 38, 14);
  g.fill();
  g.beginPath();
  g.moveTo(16, 40);
  g.lineTo(12, 58);
  g.lineTo(30, 44);
  g.fill();
  g.fillStyle = "#ffffff";
  for (const x of [20, 32, 44]) {
    g.beginPath();
    g.arc(x, 27, 4.2, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
