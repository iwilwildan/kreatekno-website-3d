// The mini office under the footer's logo and tagline (Kantor mini, 13 Nov): Heru, Andi and Wildan take turns at
// the whiteboard, the standing desk with a laptop, the arcade machine and the water dispenser (four spots for three
// people, so one is always free and only one person walks at a time). The cursor turns their heads; the one under
// it waves. A click or tap on the floor sends the nearest person there; they look at the visitor, then go back.
// Its own small renderer on a transparent canvas over the footer's navy; rendered only while on screen.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { blinkAt, setBlink } from "../cast/acts";
import { ANDI } from "../cast/andi";
import { HERU_SPEC } from "../cast/heru";
import { buildMemberSliced, type CastMember, type MemberSpec } from "../cast/member";
import { TimedWalk, turnStride, walkPose, type Stride, type WalkExtra } from "../cast/walk";
import { WILDAN } from "../cast/wildan";
import { Batch, createKit, G, mtx, type Kit } from "../core/kit";

type Who = "heru" | "andi" | "wildan";
type SpotName = "board" | "desk" | "arcade" | "water";
const V = (x: number, z: number) => new THREE.Vector3(x, 0, z);
const TAU = Math.PI * 2;
const ph = (c: number, a: number, b: number) => THREE.MathUtils.smoothstep(c, a, b);
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));
/** Eases x toward target with time constant tau (s), the same at any frame rate. */
const follow = (x: number, target: number, tau: number, dt: number) => x + (target - x) * (1 - Math.exp(-dt / tau));

/** The front lane everyone walks along (z), and where a click may send someone. */
const LANE = 0.45;
const ROAM = { x0: -1.6, x1: 1.7, z0: 0.2, z1: 0.95 };

/**
 * Each spot: where the person stands and faces (yaw, 0 = toward the camera), and the way out to the lane.
 * Layout (metres, floor at y 0): whiteboard on the left facing right, the desk in the middle with the person
 * behind it facing the camera, the arcade on the right facing left, the dispenser at the back left (seen
 * between the whiteboard and the desk from the camera).
 */
const SPOTS: Record<SpotName, { at: THREE.Vector3; yaw: number; exit: THREE.Vector3[] }> = {
  board: { at: V(-1.12, 0.02), yaw: -Math.PI / 2, exit: [V(-0.95, LANE)] },
  desk: { at: V(0, -1.2), yaw: 0, exit: [V(0.76, -1.12), V(0.8, -0.38), V(0.66, LANE)] },
  arcade: { at: V(1.22, 0.02), yaw: Math.PI / 2, exit: [V(1.02, LANE)] },
  water: { at: V(-0.75, -1.55), yaw: 0.3, exit: [V(-0.82, -1.08), V(-0.84, -0.4), V(-0.62, LANE)] },
};

/** Props (world positions shared by the set and the poses). */
const BOARD = { x: -1.66, y: 1.32, w: 1.0, h: 0.66 };
const DESK = { z: -0.68, top: 0.98, w: 1.1, d: 0.56 };
const ARCADE = { x: 1.86, panel: 1.0 };

type Move = {
  walk: TimedWalk;
  /** Turn on the spot before (from the start heading to the path's) and after (path's end to `endYaw`). */
  t0: number;
  turn0: number;
  turn1: number;
  endYaw: number;
  t: number;
  dur: number;
  to: SpotName | "away";
};
type Person = {
  who: Who;
  m: CastMember;
  spot: SpotName;
  /** Where they stand (and face) when not walking. */
  at: THREE.Vector3;
  yaw: number;
  move: Move | null;
  /** Seconds left at a clicked spot before going back (null when at a station). */
  away: number | null;
  wave: number;
  look: number;
  lookYaw: number;
  seed: number;
  hovered: boolean;
};

export type Office = { dispose: () => void };

/**
 * Mounts the office into `host` (a sized box). `onReady` fires after the first frame; `onLow` when the frame rate
 * stays too low (the canvas then stops moving and keeps its last frame).
 */
export async function mountOffice(
  host: HTMLElement,
  {
    reduced = false,
    saver = false,
    onReady,
    onLow,
    hud = false,
  }: { reduced?: boolean; saver?: boolean; onReady?: () => void; onLow?: () => void; hud?: boolean } = {},
): Promise<Office> {
  let disposed = false;
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { width: "100%", height: "100%", display: "block", touchAction: "manipulation" });
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, saver ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environment = env;
  scene.environmentIntensity = 0.35;
  // warm key from the front left, cool cyan rim from the back right, a navy fill from below like the footer
  const key = new THREE.DirectionalLight("#fff1e4", 2.4);
  key.position.set(-2.5, 5.5, 4.5);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(saver ? 512 : 1024);
  Object.assign(key.shadow.camera, { left: -2.6, right: 2.6, top: 2.4, bottom: -1.6, near: 1, far: 14 });
  key.shadow.bias = -0.0005;
  key.shadow.normalBias = 0.02;
  const rim = new THREE.DirectionalLight("#6fe3ff", 1.4);
  rim.position.set(3, 3, -4);
  scene.add(key, rim, new THREE.HemisphereLight("#e9e6ff", "#1b2160", 1.0));

  const camera = new THREE.PerspectiveCamera(22, 16 / 10, 0.1, 40);
  const kit = createKit(renderer);
  const set = new THREE.Group();
  scene.add(set);
  const screens = buildSet(set, kit);

  // ---------- cast ----------
  const pause = () => new Promise((r) => setTimeout(r, 0));
  const specs: [Who, MemberSpec, SpotName][] = [
    ["wildan", WILDAN, "board"],
    ["andi", ANDI, "desk"],
    ["heru", HERU_SPEC, "arcade"],
  ];
  const people: Person[] = [];
  for (const [i, [who, spec, spot]] of specs.entries()) {
    const m = await buildMemberSliced(spec, { saver }, pause);
    if (disposed) {
      m.dispose();
      break;
    }
    m.mesh.castShadow = true;
    m.mesh.frustumCulled = false;
    m.express({ smile: 0.3 });
    scene.add(m.mesh);
    const s = SPOTS[spot];
    people.push({
      who,
      m,
      spot,
      at: s.at.clone(),
      yaw: s.yaw,
      move: null,
      away: null,
      wave: 0,
      look: 0,
      lookYaw: 0,
      seed: i + 1,
      hovered: false,
    });
  }

  // ---------- pointer ----------
  const ray = new THREE.Raycaster(),
    ndc = new THREE.Vector2(),
    floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    cursor = new THREE.Vector3();
  let pointerIn = false;
  const toRay = (e: PointerEvent | MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  };
  const hit = () => {
    let best: Person | null = null,
      bd = 0.3 ** 2;
    for (const p of people) {
      const base = p.m.mesh.position,
        d = ray.ray.distanceSqToSegment(base.clone().setY(0.2), base.clone().setY(1.6));
      if (d < bd) {
        bd = d;
        best = p;
      }
    }
    return best;
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    toRay(e);
    pointerIn = !!ray.ray.intersectPlane(floorPlane, cursor);
    const h = hit();
    for (const p of people) {
      if (p.hovered !== (p === h)) p.m.express(p === h ? { smile: 0.75, browLift: 0.003, open: 0.25 } : { smile: 0.3 });
      p.hovered = p === h;
    }
    wake();
  };
  const onLeave = () => {
    pointerIn = false;
    for (const p of people) {
      if (p.hovered) p.m.express({ smile: 0.3 });
      p.hovered = false;
    }
    wake();
  };
  /** Last click waiting while someone else walks. */
  let queued: THREE.Vector3 | null = null;
  const marker = new THREE.Mesh(
    new THREE.RingGeometry(0.09, 0.13, 40),
    new THREE.MeshBasicMaterial({ color: "#6fe3ff", transparent: true, opacity: 0, depthWrite: false }),
  );
  marker.rotation.x = -Math.PI / 2;
  marker.position.y = 0.004;
  scene.add(marker);
  let markerT = 9;
  const onClick = (e: MouseEvent) => {
    if (reduced) return;
    toRay(e);
    const p = new THREE.Vector3();
    if (!ray.ray.intersectPlane(floorPlane, p)) return;
    p.set(THREE.MathUtils.clamp(p.x, ROAM.x0, ROAM.x1), 0, THREE.MathUtils.clamp(p.z, ROAM.z0, ROAM.z1));
    marker.position.set(p.x, 0.004, p.z);
    markerT = 0;
    queued = p;
    wake();
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("click", onClick);

  // ---------- moves ----------
  const walking = () => people.some((p) => p.move);
  const pathBetween = (p: Person, to: THREE.Vector3, toSpot: SpotName | null) => {
    const pts = [p.at.clone()];
    if (p.away == null) pts.push(...SPOTS[p.spot].exit);
    if (toSpot) pts.push(...[...SPOTS[toSpot].exit].reverse(), SPOTS[toSpot].at);
    else pts.push(to);
    // drop points too close to each other (Catmull-Rom loops on doubled points)
    return pts.filter((q, i) => i === 0 || q.distanceTo(pts[i - 1]) > 0.08);
  };
  const startMove = (p: Person, to: SpotName | "away", target: THREE.Vector3, endYaw: number) => {
    const pts = pathBetween(p, target, to === "away" ? null : to);
    if (pts.length < 2) return;
    const walk = new TimedWalk(pts, () => 0.95, 0.4, "R");
    const turn0 = wrap(walk.yaw0 - p.yaw),
      t0 = Math.abs(turn0) > 0.25 ? 0.55 : 0,
      turn1 = wrap(endYaw - walk.yaw1),
      t1 = Math.abs(turn1) > 0.25 ? 0.55 : 0;
    p.move = { walk, t0, turn0, turn1, endYaw, t: 0, dur: t0 + walk.dur + t1, to };
  };
  const strideOf = (p: Person): Stride => {
    const mv = p.move;
    if (!mv) return turnStride(p.at, p.yaw, 0, 0);
    if (mv.t < mv.t0) return turnStride(p.at, p.yaw, mv.turn0, mv.t / mv.t0);
    const wt = mv.t - mv.t0;
    if (wt < mv.walk.dur) return mv.walk.stride(wt);
    const end = mv.walk.walk.at(mv.walk.walk.length);
    return turnStride(
      end.body,
      mv.walk.yaw1,
      mv.turn1,
      Math.min(1, (wt - mv.walk.dur) / Math.max(0.01, mv.dur - mv.t0 - mv.walk.dur)),
    );
  };
  /** Next rotation (seconds of scene time): someone goes to the free spot. */
  let nextTurn = 7,
    lastMover: Person | null = null;
  const freeSpot = () =>
    (Object.keys(SPOTS) as SpotName[]).find((s) => !people.some((p) => p.spot === s && p.away == null)) ?? null;

  // ---------- poses ----------
  const W = (m: CastMember, v: [number, number, number]) => m.mesh.localToWorld(new THREE.Vector3(...m.point(v)));
  const poleL = new THREE.Vector3(0.5, -0.3, -0.4),
    poleR = new THREE.Vector3(-0.5, -0.3, -0.4);
  /** What each spot's activity asks of the arms and head at time t. */
  const activity = (p: Person, t: number): WalkExtra => {
    const s = p.seed,
      m = p.m;
    switch (p.spot) {
      case "board": {
        // writing: the right hand traces small loops on the board, the head follows it
        const k = Math.sin(TAU * 0.11 * t + s) * 0.5 + 0.5,
          wr = new THREE.Vector3(
            BOARD.x + 0.03,
            BOARD.y - 0.12 + 0.05 * Math.sin(TAU * 1.3 * t) + 0.12 * k,
            -0.18 + 0.32 * (((t * 0.22 + s) % 1) * 1),
          );
        return {
          head: [0.08 - 0.06 * k, -0.25],
          reachR: { at: wr, weight: 1, pole: poleR },
          breathe: 0.01 * Math.sin(TAU * 0.25 * t),
        };
      }
      case "desk": {
        // typing on the laptop in bursts, a glance up now and then
        const burst = Math.max(0, Math.sin(TAU * 0.13 * t + s)),
          tap = (q: number) => Math.max(0, Math.sin(TAU * 4.6 * t + q)) * 0.012 * burst;
        const z = DESK.z - 0.1;
        return {
          head: [0.32 - 0.25 * (1 - burst) * ph(Math.sin(TAU * 0.07 * t), 0.4, 0.8), 0],
          lean: 0.08,
          reachL: { at: new THREE.Vector3(0.1, DESK.top + 0.05 + tap(0), z), weight: 1, pole: poleL },
          reachR: { at: new THREE.Vector3(-0.1, DESK.top + 0.05 + tap(1.9), z), weight: 1, pole: poleR },
        };
      }
      case "arcade": {
        // joystick (left hand, world −z side) and buttons (right), leaning in at the exciting bits
        const hype = ph(Math.sin(TAU * 0.09 * t + s), 0.2, 0.9);
        return {
          head: [0.22, 0],
          lean: 0.05 + 0.06 * hype,
          reachL: {
            at: new THREE.Vector3(
              ARCADE.x - 0.34 + 0.03 * Math.sin(TAU * 1.7 * t),
              ARCADE.panel + 0.06,
              -0.11 + 0.03 * Math.sin(TAU * 2.3 * t + 1),
            ),
            weight: 1,
            pole: poleL,
          },
          reachR: {
            at: new THREE.Vector3(
              ARCADE.x - 0.33,
              ARCADE.panel + 0.04 + Math.max(0, Math.sin(TAU * (3 + 2 * hype) * t)) * 0.025,
              0.12,
            ),
            weight: 1,
            pole: poleR,
          },
        };
      }
      case "water": {
        // a break: a big stretch now and then, looking round the room
        const st = ph(Math.sin(TAU * 0.08 * t + s), 0.3, 0.85);
        return {
          head: [-0.15 * st, 0.35 * Math.sin(TAU * 0.05 * t)],
          breathe: 0.02 * Math.sin(TAU * 0.25 * t) - 0.05 * st,
          reachL:
            st > 0.01 ? { at: W(m, [0.12, 2.05, 0.02]), weight: st, pole: new THREE.Vector3(0.6, 0.4, 0) } : undefined,
          reachR:
            st > 0.01
              ? { at: W(m, [-0.12, 2.05, 0.02]), weight: st, pole: new THREE.Vector3(-0.6, 0.4, 0) }
              : undefined,
        };
      }
    }
  };
  const awayExtra = (t: number): WalkExtra => ({ breathe: 0.012 * Math.sin(TAU * 0.25 * t), head: [-0.05, 0] });
  const waveReach = (p: Person, t: number) => ({
    at: W(p.m, [-0.3 + 0.07 * Math.sin(TAU * 2.2 * t), 1.72, 0.12]),
    weight: p.wave,
    pole: new THREE.Vector3(-0.7, -0.2, -0.2),
  });

  const posePerson = (p: Person, t: number) => {
    const s = strideOf(p),
      moving = !!p.move;
    // the mesh goes in place first: the reach targets are worked out in its own frame
    p.m.mesh.position.copy(s.body);
    p.m.mesh.rotation.set(0, s.yaw, 0);
    p.m.mesh.updateMatrixWorld(true);
    const x: WalkExtra = moving ? { head: [0.05, 0] } : p.away != null ? awayExtra(t) : activity(p, t);
    // the head turns toward the cursor (or, at a clicked spot, the camera), as far as the neck allows
    const head = x.head ?? [0, 0];
    x.head = [head[0] * (1 - 0.6 * p.look), head[1] * (1 - p.look) + p.lookYaw * p.look];
    if (p.wave > 0.01 && !moving) x.reachR = waveReach(p, t);
    walkPose(p.m, s, x);
    setBlink(p.m, blinkAt(t, p.seed * 3));
  };

  // ---------- frame ----------
  let t = 0,
    last = 0,
    raf = 0,
    visible = true,
    frames = 0,
    slow = 0,
    low = false,
    started = false;
  let width = 0,
    height = 0;
  const resize = () => {
    const r = host.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    width = r.width;
    height = r.height;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // a three-quarter view from the front right, a little from above; narrower boxes step back to fit the stage
    const fit = Math.max(1, 1.6 / camera.aspect);
    camera.position.set(0.15 + 1.6 * fit, 2.5 * fit, 8.3 * fit);
    camera.lookAt(0.15, 0.66, -0.3);
    camera.updateProjectionMatrix();
    if (started) wake();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const camPos = new THREE.Vector3();
  const step = (dt: number) => {
    t += dt;
    // a walk to the clicked spot by whoever is nearest and not busy (one walker at a time)
    if (queued && !walking()) {
      const target = queued;
      queued = null;
      const free = people.filter((p) => !p.move);
      free.sort((a, b) => a.at.distanceTo(target) - b.at.distanceTo(target));
      const p = free[0];
      if (p) {
        camera.getWorldPosition(camPos);
        const face = Math.atan2(camPos.x - target.x, camPos.z - target.z);
        startMove(p, "away", target, face);
        p.away = -1;
        lastMover = p;
      }
    }
    // the rotation: someone at a station goes to the free one, never the last one to move
    if (!walking() && !queued && t > nextTurn && people.every((p) => p.away == null)) {
      const free = freeSpot();
      const cand = people.filter((p) => p !== lastMover);
      const p = cand[Math.floor((Math.sin(t * 12.9898) * 0.5 + 0.5) * cand.length) % cand.length];
      if (free && p) {
        startMove(p, free, SPOTS[free].at, SPOTS[free].yaw);
        lastMover = p;
      }
      nextTurn = t + 9 + 4 * (Math.sin(t * 7.1) * 0.5 + 0.5);
    }
    for (const p of people) {
      const mv = p.move;
      if (mv) {
        mv.t += dt;
        if (mv.t >= mv.dur) {
          const end = mv.walk.walk.at(mv.walk.walk.length);
          p.at.copy(end.body).setY(0);
          p.yaw = mv.endYaw;
          p.move = null;
          if (mv.to === "away") p.away = 2.6;
          else {
            p.spot = mv.to;
            p.away = null;
            nextTurn = Math.max(nextTurn, t + 6);
          }
        }
      } else if (p.away != null && p.away > 0) {
        p.away -= dt;
        if (p.away <= 0) {
          // back to their station
          startMove(p, p.spot, SPOTS[p.spot].at, SPOTS[p.spot].yaw);
          p.away = 0;
        }
      }
      // head: toward the cursor on the floor, or the camera at a clicked spot
      let want = 0,
        yaw = p.lookYaw;
      const walkingNow = !!p.move;
      if (!walkingNow && (pointerIn || (p.away != null && p.away > 0))) {
        const at = pointerIn ? cursor.clone().setY(1.2) : camera.getWorldPosition(camPos);
        const local = p.m.mesh.worldToLocal(at.clone());
        yaw = THREE.MathUtils.clamp(Math.atan2(local.x, local.z), -0.75, 0.75);
        want = p.away != null && !pointerIn ? 1 : 0.85;
      }
      p.look = follow(p.look, want, 0.12, dt);
      p.lookYaw = follow(p.lookYaw, yaw, 0.1, dt);
      p.wave = follow(p.wave, p.hovered && !walkingNow ? 1 : 0, 0.12, dt);
      posePerson(p, t);
      p.m.springs?.update(dt);
    }
    markerT += dt;
    (marker.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 * (1 - markerT / 1.2));
    marker.scale.setScalar(1 + markerT * 0.6);
    screens.update(t);
  };
  const render = () => {
    renderer.render(scene, camera);
  };
  const loop = (ts: number) => {
    raf = 0;
    if (disposed || !visible || low) return;
    const dt = last ? Math.min(0.1, (ts - last) / 1000) : 1 / 60;
    last = ts;
    // frame-rate check over the first seconds on screen: a phone that cannot keep up keeps a still frame
    frames++;
    if (frames > 20 && frames < 140) slow = dt > 1 / 22 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 40 && !hud) {
      low = true;
      onLow?.();
      return;
    }
    step(dt);
    render();
    raf = requestAnimationFrame(loop);
  };
  function wake() {
    if (reduced || low) {
      render();
      return;
    }
    if (!raf && visible && !disposed) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  }
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting && document.visibilityState === "visible";
    if (visible) wake();
  });
  io.observe(host);
  const onVis = () => {
    visible = document.visibilityState === "visible";
    if (visible) wake();
  };
  document.addEventListener("visibilitychange", onVis);

  // first frame: everyone at their station in their pose
  step(0);
  host.appendChild(canvas);
  resize();
  render();
  onReady?.();
  started = true;
  wake();
  // ?hud: state for tools (positions per frame, the frame-rate fallback)
  if (hud)
    Object.assign(window, {
      __office: {
        get t() {
          return t;
        },
        get low() {
          return low;
        },
        people: () =>
          people.map((p) => ({
            who: p.who,
            spot: p.spot,
            x: +p.m.mesh.position.x.toFixed(3),
            z: +p.m.mesh.position.z.toFixed(3),
            moving: !!p.move,
            away: p.away,
            wave: +p.wave.toFixed(2),
          })),
        calls: () => renderer.info.render.calls,
        triangles: () => renderer.info.render.triangles,
      },
    });

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
      for (const p of people) p.m.dispose();
      set.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
      screens.dispose();
      kit.dispose();
      env.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

/** The office furniture, merged per material; returns the arcade screen's animation. */
function buildSet(root: THREE.Group, kit: Kit) {
  const b = new Batch(root);
  const white = kit.mat("#f4f2f8", { roughness: 0.5 }),
    frame = kit.mat("#8a8fa8", { roughness: 0.45, metalness: 0.3 }),
    dark = kit.mat("#2d2c33", { roughness: 0.6 }),
    wood = kit.mat("#e9c49b", { roughness: 0.7 }),
    orange = kit.mat("#f2742f", { roughness: 0.55 }),
    purple = kit.mat("#5b3fb8", { roughness: 0.5 }),
    mint = kit.mat("#86cdb6", { roughness: 0.6 }),
    water = kit.mat("#8fd3f4", { roughness: 0.15, transparent: true, opacity: 0.75 });

  // floor: a soft pool of light on the footer's navy (no visible edge) that catches the shadows
  const glow = kit.canvasTex(256, 256, (g, w, h) => {
    const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    r.addColorStop(0, "rgba(46,56,140,0.55)");
    r.addColorStop(0.6, "rgba(30,38,110,0.28)");
    r.addColorStop(1, "rgba(11,15,58,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, h);
  });
  const pool = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 3.6),
    new THREE.MeshBasicMaterial({ map: glow, transparent: true, depthWrite: false }),
  );
  pool.rotation.x = -Math.PI / 2;
  pool.position.set(0, 0, -0.2);
  pool.renderOrder = -1;
  const shade = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), new THREE.ShadowMaterial({ opacity: 0.38 }));
  shade.rotation.x = -Math.PI / 2;
  shade.position.set(0, 0.001, -0.2);
  shade.receiveShadow = true;
  root.add(pool, shade);

  // whiteboard on a stand, facing +x
  const bx = BOARD.x;
  b.add(G.rbox(0.04, BOARD.h + 0.06, BOARD.w + 0.06, 0.012), frame, mtx([bx - 0.01, BOARD.y, 0]));
  for (const z of [-0.42, 0.42]) {
    b.add(G.cyl(0.018, 0.018, BOARD.y - BOARD.h / 2, 10), frame, mtx([bx - 0.03, (BOARD.y - BOARD.h / 2) / 2, z]));
    b.add(G.rbox(0.42, 0.03, 0.05, 0.01), frame, mtx([bx - 0.03, 0.015, z]));
  }
  b.add(G.rbox(0.07, 0.025, 0.5, 0.008), frame, mtx([bx + 0.04, BOARD.y - BOARD.h / 2 - 0.02, 0]));
  const doodle = kit.canvasTex(512, 340, (g, w, h) => {
    g.fillStyle = "#fbfbfd";
    g.fillRect(0, 0, w, h);
    g.lineWidth = 6;
    g.lineCap = g.lineJoin = "round";
    const box = (x: number, y: number, c: string) => {
      g.strokeStyle = c;
      g.beginPath();
      g.roundRect(x, y, 104, 62, 12);
      g.stroke();
    };
    box(36, 52, "#5b3fb8");
    box(204, 52, "#f2742f");
    box(372, 52, "#1aa98c");
    box(204, 220, "#2a62d8");
    g.strokeStyle = "#2d2c33";
    g.lineWidth = 5;
    const arrow = (x0: number, y0: number, x1: number, y1: number) => {
      g.beginPath();
      g.moveTo(x0, y0);
      g.lineTo(x1, y1);
      const a = Math.atan2(y1 - y0, x1 - x0);
      g.lineTo(x1 - 16 * Math.cos(a - 0.5), y1 - 16 * Math.sin(a - 0.5));
      g.moveTo(x1, y1);
      g.lineTo(x1 - 16 * Math.cos(a + 0.5), y1 - 16 * Math.sin(a + 0.5));
      g.stroke();
    };
    arrow(146, 83, 196, 83);
    arrow(314, 83, 364, 83);
    arrow(424, 120, 300, 216);
    g.strokeStyle = "#f2742f";
    g.beginPath();
    g.moveTo(60, 270);
    g.quadraticCurveTo(110, 200, 160, 290);
    g.stroke();
  });
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(BOARD.w, BOARD.h),
    new THREE.MeshStandardMaterial({ map: doodle, roughness: 0.35 }),
  );
  face.position.set(bx + 0.012, BOARD.y, 0);
  face.rotation.y = Math.PI / 2;
  face.receiveShadow = true;
  root.add(face);

  // standing desk with a laptop (its lid toward the person behind it; the camera sees the back with an orange dot)
  const dz = DESK.z;
  b.add(G.rbox(DESK.w, 0.04, DESK.d, 0.012), wood, mtx([0, DESK.top - 0.02, dz]));
  for (const x of [-0.46, 0.46]) {
    b.add(G.rbox(0.06, DESK.top - 0.04, 0.06, 0.01), dark, mtx([x, (DESK.top - 0.04) / 2, dz]));
    b.add(G.rbox(0.07, 0.03, DESK.d - 0.04, 0.01), dark, mtx([x, 0.015, dz]));
  }
  b.add(G.rbox(0.36, 0.016, 0.24, 0.006), frame, mtx([0, DESK.top + 0.008, dz - 0.08]));
  b.add(G.rbox(0.36, 0.24, 0.014, 0.006), frame, mtx([0, DESK.top + 0.13, dz + 0.04], [-0.22, 0, 0]));
  b.add(G.cyl(0.03, 0.03, 0.004, 20), orange, mtx([0, DESK.top + 0.15, dz + 0.05], [Math.PI / 2 - 0.22, 0, 0]));
  b.add(G.cyl(0.04, 0.035, 0.1, 16), mint, mtx([0.4, DESK.top + 0.05, dz + 0.06]));
  b.add(G.rbox(0.22, 0.012, 0.16, 0.004), white, mtx([-0.36, DESK.top + 0.006, dz + 0.02], [0, 0.3, 0]));

  // arcade cabinet facing −x
  const ax = ARCADE.x;
  b.add(G.rbox(0.5, 1.72, 0.62, 0.03), purple, mtx([ax + 0.04, 0.86, 0]));
  b.add(G.rbox(0.3, 0.1, 0.6, 0.02), dark, mtx([ax - 0.3, ARCADE.panel - 0.02, 0], [0, 0, 0.2]));
  b.add(G.rbox(0.12, 0.85, 0.6, 0.02), purple, mtx([ax - 0.2, 0.47, 0]));
  b.add(G.rbox(0.06, 0.2, 0.64, 0.02), orange, mtx([ax - 0.19, 1.66, 0]));
  b.add(G.cyl(0.01, 0.01, 0.08, 8), dark, mtx([ax - 0.34, ARCADE.panel + 0.05, -0.11]));
  b.add(G.sph(0.022, 12, 8), orange, mtx([ax - 0.34, ARCADE.panel + 0.09, -0.11]));
  for (const [i, z] of [0.07, 0.12, 0.17].entries())
    b.add(G.cyl(0.018, 0.018, 0.02, 12), i === 1 ? mint : orange, mtx([ax - 0.33, ARCADE.panel + 0.04, z]));
  const art = kit.canvasTex(128, 256, (g, w, h) => {
    // side art: diagonal stripes in the brand colours and a pixel star
    g.clearRect(0, 0, w, h);
    const stripe = (y: number, c: string) => {
      g.fillStyle = c;
      g.beginPath();
      g.moveTo(0, y);
      g.lineTo(w, y - 70);
      g.lineTo(w, y - 46);
      g.lineTo(0, y + 24);
      g.fill();
    };
    stripe(190, "#f2742f");
    stripe(226, "#86cdb6");
    g.fillStyle = "#f6e19a";
    for (const [x, y] of [
      [3, 0],
      [2, 1],
      [3, 1],
      [4, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2],
      [6, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [1, 4],
      [2, 4],
      [4, 4],
      [5, 4],
    ])
      g.fillRect(36 + x * 8, 40 + y * 8, 8, 8);
  });
  const side = new THREE.Mesh(
    new THREE.PlaneGeometry(0.46, 1.6),
    new THREE.MeshStandardMaterial({ map: art, transparent: true, roughness: 0.5 }),
  );
  side.position.set(ax + 0.04, 0.86, 0.312);
  root.add(side);
  const screenTex = kit.canvasTex(128, 112, () => {});
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.4), new THREE.MeshBasicMaterial({ map: screenTex }));
  screen.position.set(ax - 0.205, 1.32, 0);
  screen.rotation.set(0, -Math.PI / 2, 0);
  screen.rotateX(-0.12);
  root.add(screen);
  const sg = (screenTex.image as HTMLCanvasElement).getContext("2d")!;
  let lastFrame = -1;
  const drawScreen = (t: number) => {
    // a little invented space game: a ship at the bottom, blocks drifting down, a score
    const f = Math.floor(t * 8);
    if (f === lastFrame) return;
    lastFrame = f;
    sg.fillStyle = "#120c2e";
    sg.fillRect(0, 0, 128, 112);
    for (let i = 0; i < 14; i++) {
      sg.fillStyle = i % 3 ? "#3d3a7a" : "#7f7bd6";
      sg.fillRect((i * 37) % 128, (i * 23 + f * (1 + (i % 3))) % 112, 2, 2);
    }
    const colors = ["#f2742f", "#86cdb6", "#f6e19a", "#ff7ab6"];
    for (let i = 0; i < 5; i++) {
      sg.fillStyle = colors[i % 4];
      sg.fillRect(12 + i * 22, ((f * 2 + i * 19) % 90) + 4, 12, 8);
    }
    const sx = 56 + Math.round(36 * Math.sin(t * 1.7));
    sg.fillStyle = "#6fe3ff";
    sg.fillRect(sx, 96, 16, 6);
    sg.fillRect(sx + 6, 90, 4, 6);
    sg.fillStyle = "#ffffff";
    sg.fillRect(4, 4, 4 + (f % 40), 3);
    screenTex.needsUpdate = true;
  };

  // water dispenser at the back left
  const wx = -0.78,
    wz = -1.98;
  b.add(G.rbox(0.3, 0.92, 0.3, 0.03), white, mtx([wx, 0.46, wz]));
  b.add(G.rbox(0.18, 0.08, 0.06, 0.02), dark, mtx([wx, 0.72, wz + 0.16]));
  b.add(G.cyl(0.13, 0.13, 0.36, 24), water, mtx([wx, 1.1, wz]), { shadow: false });
  b.add(G.cyl(0.05, 0.13, 0.08, 24), water, mtx([wx, 0.96, wz]), { shadow: false });
  // a plant behind the desk
  b.add(G.cyl(0.11, 0.09, 0.26, 18), orange, mtx([0.55, 0.13, -1.6]));
  b.add(G.sph(0.2, 14, 10), mint, mtx([0.55, 0.42, -1.6], [0, 0, 0], [1, 1.25, 1]));

  b.build();
  drawScreen(0);
  return {
    update: drawScreen,
    dispose() {
      screen.geometry.dispose();
      (screen.material as THREE.Material).dispose();
      face.geometry.dispose();
      side.geometry.dispose();
      (side.material as THREE.Material).dispose();
      (face.material as THREE.Material).dispose();
      (pool.material as THREE.Material).dispose();
      (shade.material as THREE.Material).dispose();
    },
  };
}
