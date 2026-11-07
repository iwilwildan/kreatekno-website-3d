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
  return { update, dispose };
}

/** Rain clouds: drops per cloud, how long a drop falls (s) and how far (m). */
const RAIN = { drops: 10, fall: 0.5, dist: 0.2 };

/**
 * Small dark rain clouds over the heads of the four staff, raining on them: the gloom of work piling up, made
 * to read at a glance in the wide K2 shot (faces and sweat drops are too small there). Low-poly like the sky's
 * clouds, flat-shaded dark grey, bobbing gently; the drops are one instanced mesh. Neither casts a shadow.
 */
export function createGloom(crew: CastMember[], cloudGeo: (seed: number) => THREE.BufferGeometry) {
  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({
    color: "#4d4a5c",
    roughness: 0.95,
    flatShading: true,
    emissive: "#242130",
    emissiveIntensity: 0.4,
  });
  const staff = crew.filter((m) => SWEAT[m.name]);
  const clouds = staff.map((m, i) => {
    const mesh = new THREE.Mesh(cloudGeo(41 + i), material);
    // the sky's cloud is about 3.7 units wide: about 0.55 m over a head
    mesh.scale.setScalar(0.15);
    group.add(mesh);
    return { m, mesh, at: new THREE.Vector3() };
  });
  const drop = new THREE.CylinderGeometry(0.0075, 0.0075, 0.06, 6),
    dropMat = new THREE.MeshStandardMaterial({
      color: "#8fb3e0",
      roughness: 0.3,
      emissive: "#3d6ea8",
      emissiveIntensity: 0.3,
    });
  const rain = new THREE.InstancedMesh(drop, dropMat, clouds.length * RAIN.drops);
  rain.frustumCulled = false;
  group.add(rain);
  const head = new THREE.Vector3(),
    up = new THREE.Vector3(),
    mtx = new THREE.Matrix4(),
    q = new THREE.Quaternion(),
    s = new THREE.Vector3(),
    p = new THREE.Vector3();
  /** Clouds over the heads where they are now, and the rain at time t (seconds). */
  const update = (t: number) => {
    clouds.forEach((c, i) => {
      // over the crown (the head bone sits at the chin; a bowed head carries its crown forward), drifting a little
      c.m.rig.bone("head").localToWorld(head.set(0, 0.36, 0));
      up.set(0, 1, 0);
      c.at.copy(head).addScaledVector(up, 0.3 + 0.015 * Math.sin(TAU * 0.4 * t + i * 1.3));
      c.at.x += 0.012 * Math.sin(TAU * 0.23 * t + i);
      c.mesh.position.copy(c.at);
      c.mesh.quaternion.copy(c.m.mesh.quaternion);
      for (let k = 0; k < RAIN.drops; k++) {
        const age = (((t + (k * RAIN.fall) / RAIN.drops + i * 0.17) % RAIN.fall) + RAIN.fall) % RAIN.fall,
          f = age / RAIN.fall,
          // spread under the cloud's belly, a fixed spot per drop
          a = k * 2.399 + i,
          r = 0.05 + 0.1 * ((k * 0.618) % 1);
        p.set(c.at.x + Math.cos(a) * r, c.at.y - 0.06 - RAIN.dist * f, c.at.z + Math.sin(a) * r * 0.6);
        // shrinking away as it reaches the hair
        const k2 = f > 0.8 ? (1 - f) / 0.2 : 1;
        mtx.compose(p, q.identity(), s.set(k2, k2, k2));
        rain.setMatrixAt(i * RAIN.drops + k, mtx);
      }
    });
    rain.instanceMatrix.needsUpdate = true;
  };
  /** Hides the clouds within r metres of a camera passing among them (beat 5 backs out over the desks). */
  const clear = (cam: THREE.Vector3 | null, r = 1.3) => {
    for (const c of clouds) c.mesh.visible = !cam || c.mesh.position.distanceTo(cam) > r;
  };
  const dispose = () => {
    material.dispose();
    drop.dispose();
    dropMat.dispose();
    rain.dispose();
    for (const c of clouds) c.mesh.geometry.dispose();
  };
  return { group, update, clear, dispose };
}
