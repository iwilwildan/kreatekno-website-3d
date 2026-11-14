// Small looping actions of the people in the COMPANY room (tahap 4), on top of their K2 poses: time-based,
// like the pigeons at K0, and only run while the room is on screen. Every action starts from its K2 pose at
// time 0, so stills and review shots (?shot, time 0) show the poses of tahap 3.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
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
 * A heavy sigh every 7–8 s, one member after another (the first a few seconds in, so time 0 is the K2 pose):
 * in (chest up, head up), then out (slumping a little past the pose, head down) and back. Returns 0 at rest, +1
 * at the top of the breath in, −1 at the bottom of the breath out.
 */
export function sighAt(t: number, seed: number) {
  const period = 7 + (seed % 3) * 0.5,
    on = 2.4,
    x = t - (2.5 + seed * 1.9);
  if (x < 0 || x % period >= on) return 0;
  const k = (x % period) / on;
  if (k < 0.35) return (1 - Math.cos((Math.PI * k) / 0.35)) / 2;
  const u = (k - 0.35) / 0.65;
  return u < 0.45 ? Math.cos((Math.PI * u) / 0.45) : -(1 + Math.cos((Math.PI * (u - 0.45)) / 0.55)) / 2;
}

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
  // the staff sigh now and then (Bu Dewi only breathes)
  const s = p.seat != null ? sighAt(t, seed) : 0;
  applyPose(
    m,
    {
      ...p,
      chest: add(p.chest, [breathe(t, seed) - 0.07 * s, 0, 0]),
      head: add(p.head, [-0.06 * s, 0, 0]),
    },
    false,
  );
  setBlink(m, Math.max(p.lids ?? 0, blinkAt(t, seed)));
}

/** Head turn (radians, ±0.35) for a member to look toward a world point, in its own frame. */
export function lookYaw(m: CastMember, at: THREE.Vector3) {
  const local = m.mesh.worldToLocal(at.clone());
  return Math.max(-0.35, Math.min(0.35, Math.atan2(local.x, local.z)));
}

/**
 * Sinta's phone, held between her hands with its screen lit, and green chat bubbles (plain, no app logo) popping
 * up from it, one every half second, and fading as they rise: the notifications that never stop. Separate small meshes (not part of her
 * skinned mesh), placed from her hand bones each frame. At time 0 three bubbles are already in the air, so the
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
  const bubbles = [0, 1, 2, 3, 4].map(() => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    s.scale.setScalar(0.055);
    group.add(s);
    return s;
  });
  const a = new THREE.Vector3(),
    b = new THREE.Vector3(),
    up = new THREE.Vector3(),
    aside = new THREE.Vector3();
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
    // they drift out to her left as they rise (her monitor stands on her right), so her face stays clear
    aside.set(1, 0, 0.3).normalize().transformDirection(m.mesh.matrixWorld);
    bubbles.forEach((s, i) => {
      // a new one every half second: more come in than she can answer
      const age = (((t + 0.9 + i * 0.51) % 2.55) + 2.55) % 2.55,
        k = Math.min(1, age / 1.6);
      s.position
        .copy(phone.position)
        .addScaledVector(up, 0.08 + 0.26 * k)
        .addScaledVector(aside, 0.07 + 0.16 * k + 0.025 * Math.sin(i * 2.1 + age * 2.4));
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

/** Which temple carries the sweat drop (the side the camera sees best) and how far it sits off the head. */
const SWEAT: Record<string, { side: 1 | -1; out: number; up: number }> = {
  sinta: { side: -1, out: 0.02, up: 0.06 },
  bayu: { side: 1, out: 0.04, up: 0.06 },
  nadia: { side: 1, out: 0.04, up: 0.06 },
  fajar: { side: 1, out: 0.045, up: 0.05 },
};

/**
 * Sweat drops on the temples of the four staff: glossy light-blue vinyl drops (a lathed teardrop), the comic sign
 * of someone worn out and tense. They sit still on the head and wobble a little (a running drop would read as
 * panic). Each hangs from its member's head bone, placed from the eyes of the rest pose.
 */
export function createSweat(crew: CastMember[]) {
  // teardrop profile: point on top, round below (x = sin a · sin a/2, y = cos a)
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI;
    pts.push(new THREE.Vector2(Math.sin(a) * Math.sin(a / 2) * 0.034, Math.cos(a) * 0.05));
  }
  const geo = new THREE.LatheGeometry(pts, 14);
  const material = new THREE.MeshStandardMaterial({
    color: "#86d4f7",
    roughness: 0.12,
    emissive: "#3c9fd0",
    emissiveIntensity: 0.25,
  });
  const drops: { mesh: THREE.Mesh; at: THREE.Vector3; seed: number }[] = [];
  const eL = new THREE.Vector3(),
    eR = new THREE.Vector3(),
    up = new THREE.Vector3();
  crew.forEach((m, i) => {
    const s = SWEAT[m.name];
    if (!s) return;
    const head = m.rig.bone("head");
    m.mesh.updateMatrixWorld(true);
    m.rig.bone("eyeL").getWorldPosition(eL);
    m.rig.bone("eyeR").getWorldPosition(eR);
    // out from the eye on that side, up toward the brow, a little back toward the ear
    const across = eL.clone().sub(eR),
      eye = s.side > 0 ? eL : eR;
    up.set(0, 1, 0).transformDirection(m.mesh.matrixWorld);
    const fwd = new THREE.Vector3(0, 0, 1).transformDirection(m.mesh.matrixWorld);
    const at = eye
      .clone()
      .addScaledVector(across, s.side * (0.75 + s.out / across.length()))
      .addScaledVector(up, s.up)
      .addScaledVector(fwd, -0.03);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.copy(head.worldToLocal(at));
    // upright in the head's frame, leaning out a little
    mesh.rotation.z = -s.side * 0.25;
    mesh.castShadow = false;
    head.add(mesh);
    drops.push({ mesh, at: mesh.position.clone(), seed: i });
  });
  /** The wobble at time t (seconds); time 0 is at rest. */
  const update = (t: number) => {
    for (const d of drops) {
      const w = Math.sin(TAU * 1.3 * t + d.seed * 1.7);
      d.mesh.scale.set(1 - 0.05 * w, 1 + 0.07 * w, 1 - 0.05 * w);
      d.mesh.position.copy(d.at).y -= 0.004 * (1 - Math.cos(TAU * 0.25 * t + d.seed));
    }
  };
  const dispose = () => {
    for (const d of drops) d.mesh.removeFromParent();
    geo.dispose();
    material.dispose();
  };
  /** Shown or not (tahap 9: no sweat in the classroom at the end of the day, their work done for them). */
  const setVisible = (on: boolean) => {
    for (const d of drops) d.mesh.visible = on;
  };
  return { update, dispose, setVisible };
}

/** Thought bubble: how high its centre sits over the crown and how far to the side (m), paper slabs in Bayu's stack. */
const THOUGHT = { up: 0.3, side: 0.12, slabs: 22 };
/** Extra height (m) for a head whose hair reaches up (Nadia's bun), so the trail does not touch it. */
const THOUGHT_LIFT: Record<string, number> = { nadia: 0.06 };

/**
 * A comic thought bubble over the heads of the four staff (issue #3, in place of the rain clouds), each holding what
 * that member is stuck on, read at a glance in the wide K2 shot: Sinta's unanswered chats, Bayu's slips and a long
 * receipt, Nadia's dark light bulb among crumpled drafts, Fajar's SOP binder and a question mark (no text or app
 * logos). The bubble is a puffy cloud of flattened balls with two small balls trailing to the head, glossy
 * lilac-white with a dark comic rim (its own balls a little larger, back faces only); rim and bubble are instanced
 * per side the bubble sits on, each member's thought is one mesh (vertex colours). No shadow. It faces the way its
 * member faces, breathes a little and its thought sways.
 */
export function createThought(crew: CastMember[]) {
  const group = new THREE.Group();
  const side = (m: CastMember) => -(SWEAT[m.name]?.side ?? 1);
  // the bubble in its own frame (centre at 0), the trail toward the head at (-side · THOUGHT.side, -THOUGHT.up)
  const bubble = (pad: number, dir: number) => {
    const balls: THREE.BufferGeometry[] = [];
    const ball = (x: number, y: number, r: number, flat = 0.42) =>
      balls.push(new THREE.SphereGeometry(r + pad, 14, 9).scale(1, 1, flat).translate(x, y, 0));
    ball(0, 0, 0.11);
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * TAU + 0.2;
      ball(Math.cos(a) * 0.125, Math.sin(a) * 0.075, 0.062);
    }
    const hx = -dir * THOUGHT.side,
      hy = -THOUGHT.up + 0.05;
    ball(hx * 0.62, hy * 0.62, 0.032, 0.8);
    ball(hx * 0.85, hy * 0.85, 0.02, 0.8);
    const g = mergeGeometries(balls)!;
    for (const b of balls) b.dispose();
    return g;
  };
  const rimGeo = [bubble(0.011, 1), bubble(0.011, -1)],
    bubGeo = [bubble(0, 1), bubble(0, -1)];
  const paint = (g: THREE.BufferGeometry, hex: string) => {
    const c = new THREE.Color(hex),
      n = g.getAttribute("position").count,
      a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) c.toArray(a, i * 3);
    g.setAttribute("color", new THREE.BufferAttribute(a, 3));
    return g.index ? g.toNonIndexed() : g;
  };
  const merge = (parts: THREE.BufferGeometry[]) => {
    const g = mergeGeometries(parts)!;
    for (const x of parts) x.dispose();
    return g;
  };
  /** A comic question mark (a bent tube and a dot), about 0.06 m tall, its foot at the origin. */
  const question = (hex: string) => {
    const pts: THREE.Vector3[] = [];
    for (let k = 0; k <= 10; k++) {
      const a = ((150 - (230 * k) / 10) * Math.PI) / 180;
      pts.push(new THREE.Vector3(0.019 * Math.cos(a), 0.046 + 0.019 * Math.sin(a), 0));
    }
    pts.push(new THREE.Vector3(0.002, 0.018, 0), new THREE.Vector3(0, 0.008, 0));
    return [
      paint(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.0065, 6), hex),
      paint(new THREE.SphereGeometry(0.0085, 10, 8).translate(0, -0.008, 0), hex),
    ];
  };
  const Z = 0.055;
  /** What each member is thinking about, in the bubble's frame (front face at about z = 0.05). */
  const CONTENT: Record<string, () => THREE.BufferGeometry> = {
    // chats piling up, the top one over the rim, with red unread dots
    sinta: () => {
      const parts: THREE.BufferGeometry[] = [];
      const chat = (x: number, y: number, rz: number, hex: string, flip: number) => {
        parts.push(
          paint(new RoundedBoxGeometry(0.1, 0.058, 0.018, 2, 0.02).rotateZ(rz).translate(x, y, Z), hex),
          paint(
            new THREE.ConeGeometry(0.014, 0.026, 3).rotateZ(flip * 0.6 + rz).translate(x - flip * 0.035, y - 0.034, Z),
            hex,
          ),
        );
        for (const d of [-1, 0, 1])
          parts.push(
            paint(
              new THREE.SphereGeometry(0.0075, 8, 6).translate(x + d * 0.022, y + d * 0.022 * Math.sin(rz), Z + 0.011),
              "#ffffff",
            ),
          );
      };
      chat(-0.035, -0.06, 0.08, "#2fa84f", 1);
      chat(0.035, -0.005, -0.1, "#3cc163", -1);
      chat(-0.025, 0.05, 0.06, "#2fa84f", 1);
      chat(0.03, 0.105, -0.12, "#3cc163", -1);
      for (const [x, y] of [
        [0.075, 0.135],
        [0.07, 0.025],
        [0.02, -0.035],
      ])
        parts.push(paint(new THREE.SphereGeometry(0.014, 12, 8).translate(x, y, Z + 0.014), "#e23b2e"));
      return merge(parts);
    },
    // slips and invoices stacked out of the top, a long receipt hanging out of the bottom
    bayu: () => {
      const parts: THREE.BufferGeometry[] = [];
      let y = -0.085;
      for (let k = 0; k < THOUGHT.slabs; k++) {
        const folder = k % 6 === 3,
          th = folder ? 0.015 : 0.011,
          hex = folder ? "#e8641c" : k % 3 ? "#ffffff" : "#f3e8d2",
          dx = 0.012 * Math.sin(k * 2.7) + 0.0022 * k - 0.02;
        parts.push(
          paint(
            new THREE.BoxGeometry(0.1, th, 0.05).rotateZ(0.06 * Math.sin(k * 1.9)).translate(dx, y + th / 2, Z),
            hex,
          ),
        );
        y += th + 0.0015;
      }
      parts.push(
        paint(new THREE.BoxGeometry(0.042, 0.19, 0.004).rotateZ(0.12).translate(0.085, -0.1, Z + 0.02), "#fbfaf6"),
      );
      for (let k = 0; k < 7; k++)
        parts.push(
          paint(
            new THREE.BoxGeometry(0.026, 0.004, 0.002)
              .rotateZ(0.12)
              .translate(0.085 + 0.003 - k * 0.0028, -0.03 - k * 0.022, Z + 0.023),
            "#9a97a6",
          ),
        );
      return merge(parts);
    },
    // a light bulb gone dark among crumpled drafts
    nadia: () => {
      const parts: THREE.BufferGeometry[] = [
        paint(new THREE.SphereGeometry(0.058, 16, 12).scale(1, 1.08, 0.7).translate(0, 0.03, Z), "#8a8694"),
        paint(new THREE.CylinderGeometry(0.025, 0.03, 0.036, 12).translate(0, -0.035, Z), "#4d4956"),
        paint(new THREE.TorusGeometry(0.029, 0.005, 6, 14).rotateX(Math.PI / 2).translate(0, -0.026, Z), "#6c6876"),
        paint(new THREE.TorusGeometry(0.028, 0.005, 6, 14).rotateX(Math.PI / 2).translate(0, -0.04, Z), "#6c6876"),
        paint(new THREE.SphereGeometry(0.012, 8, 6).translate(0, -0.058, Z), "#3f3c48"),
      ];
      for (const [x, y, r] of [
        [-0.1, -0.05, 0.024],
        [0.1, -0.055, 0.022],
        [-0.095, 0.065, 0.02],
        [0.095, 0.06, 0.023],
        [0.06, -0.085, 0.018],
      ]) {
        const g = new THREE.IcosahedronGeometry(r * 1.25, 0);
        const pos = g.getAttribute("position");
        for (let i = 0; i < pos.count; i++)
          pos.setXYZ(
            i,
            pos.getX(i) * (1 + 0.25 * Math.sin(i * 3.1 + x * 40)),
            pos.getY(i) * (1 + 0.25 * Math.cos(i * 2.3 + y * 50)),
            pos.getZ(i),
          );
        g.computeVertexNormals();
        parts.push(paint(g.translate(x, y, Z), "#cdbfa6"));
      }
      return merge(parts);
    },
    // a thick SOP binder and a big question mark over it
    fajar: () => {
      const parts: THREE.BufferGeometry[] = [
        paint(
          new RoundedBoxGeometry(0.095, 0.12, 0.034, 2, 0.008).rotateZ(-0.12).translate(-0.04, -0.025, Z),
          "#c2560f",
        ),
        paint(new THREE.BoxGeometry(0.012, 0.11, 0.03).rotateZ(-0.12).translate(-0.082, -0.02, Z + 0.003), "#7a3410"),
        paint(new THREE.BoxGeometry(0.05, 0.03, 0.004).rotateZ(-0.12).translate(-0.035, 0.0, Z + 0.018), "#fbfaf6"),
        paint(new THREE.BoxGeometry(0.008, 0.1, 0.028).rotateZ(-0.12).translate(0.012, -0.034, Z), "#f3eee2"),
      ];
      for (const g of question("#7a3fd0")) parts.push(g.scale(1.55, 1.55, 1.55).translate(0.075, 0.0, Z + 0.01));
      return merge(parts);
    },
  };
  const rimMat = new THREE.MeshBasicMaterial({ color: "#3b3350", side: THREE.BackSide }),
    bubMat = new THREE.MeshStandardMaterial({
      color: "#f6f2fb",
      roughness: 0.3,
      emissive: "#d9d2ea",
      emissiveIntensity: 0.25,
    }),
    contentMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.45,
      emissive: "#2a2630",
      emissiveIntensity: 0.2,
    });
  const staff = crew.filter((m) => SWEAT[m.name]);
  // one instanced mesh per side the bubble leans to (its trail differs); the stack is the same on both
  const meshes = [1, -1].flatMap((dir, j) => {
    const n = staff.filter((m) => side(m) === dir).length;
    if (!n) return [];
    return [new THREE.InstancedMesh(rimGeo[j], rimMat, n), new THREE.InstancedMesh(bubGeo[j], bubMat, n)].map((im) => ({
      im,
      dir,
    }));
  });
  // each member's own thought (one mesh each)
  const contents = staff.map((m) => {
    const mesh = new THREE.Mesh((CONTENT[m.name] ?? CONTENT.bayu)(), contentMat);
    mesh.frustumCulled = false;
    return mesh;
  });
  for (const { im } of meshes) {
    im.frustumCulled = false;
    im.castShadow = false;
    group.add(im);
  }
  for (const c of contents) group.add(c);
  const shown = staff.map(() => true);
  const at = new THREE.Vector3(),
    right = new THREE.Vector3(),
    mtx = new THREE.Matrix4(),
    q = new THREE.Quaternion(),
    tilt = new THREE.Quaternion(),
    e = new THREE.Euler(),
    s = new THREE.Vector3(),
    sway = new THREE.Quaternion();
  /** The bubbles over the heads where they are now, at time t (seconds). */
  const update = (t: number) => {
    const slot = { 1: 0, [-1]: 0 } as Record<number, number>;
    staff.forEach((m, i) => {
      const dir = side(m);
      m.rig.bone("head").localToWorld(at.set(0, 0.36, 0));
      right.set(1, 0, 0).applyQuaternion(m.mesh.quaternion);
      at.addScaledVector(right, dir * THOUGHT.side).y +=
        THOUGHT.up + (THOUGHT_LIFT[m.name] ?? 0) + 0.01 * Math.sin(TAU * 0.4 * t + i * 1.3);
      q.copy(m.mesh.quaternion).multiply(tilt.setFromEuler(e.set(0.1, 0, 0.04 * Math.sin(TAU * 0.3 * t + i))));
      const k = shown[i] ? 1 + 0.025 * Math.sin(TAU * 0.5 * t + i) : 0;
      mtx.compose(at, q, s.set(k, k, k));
      const n = slot[dir]++;
      for (const x of meshes) if (x.dir === dir) x.im.setMatrixAt(n, mtx);
      // the thought inside sways on its own a little
      const c = contents[i];
      c.position.copy(at);
      c.quaternion.copy(q).multiply(sway.setFromEuler(e.set(0, 0, 0.05 * Math.sin(TAU * 0.6 * t + i * 0.9))));
      c.scale.setScalar(k);
    });
    for (const { im } of meshes) im.instanceMatrix.needsUpdate = true;
  };
  /** Hides the bubbles within r metres of a camera passing among them (beat 5 backs out over the desks). */
  const clear = (cam: THREE.Vector3 | null, r = 1.3) => {
    staff.forEach((m, i) => {
      m.rig.bone("head").getWorldPosition(at);
      shown[i] = !cam || at.distanceTo(cam) > r;
    });
  };
  const dispose = () => {
    for (const g of [...rimGeo, ...bubGeo, ...contents.map((c) => c.geometry)]) g.dispose();
    for (const mat of [rimMat, bubMat, contentMat]) mat.dispose();
    for (const { im } of meshes) im.dispose();
  };
  return { group, update, clear, dispose };
}
