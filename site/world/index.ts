// The Home world: renderer, sets, light and the take, mounted into a host element by the page.
// The page owns the scroll and the HTML copy; the world owns the canvas and tells the page, per rendered frame,
// where each anchor (copy surface) is on screen. Loaded with import() after the page is visible.
import * as THREE from "three";
import { applyAO, encodeMap, loadAO, type AoTarget } from "./core/ao";
import { projectAnchor, quadVisible, rectAnchor, type Quad } from "./core/anchors";
import { createKit, disposeTree, type Kit } from "./core/kit";
import { createLight } from "./core/light";
import { ease, formatT } from "./core/segments";
import { createWhipBlur } from "./core/whipBlur";
import type { CastMember } from "./cast/member";
import type { Pose } from "./cast/poses";
import { dampStep } from "./motion/damp";
import { createCompanyFront, layoutStep, LAYOUT_STEPS, type CompanyFront } from "./sets/companyFront";
import { buildSky } from "./sets/sky";
import { billboardFace, buildStreet } from "./sets/street";
import type { KeyName } from "./takes/home/data";
import {
  cameraAt,
  craneAt,
  followClock,
  heruAt,
  heruClock,
  KEYS,
  keyP,
  poseHeru,
  roomInView,
  TAKE_SCREENS,
  whipTarget,
  type HeruState,
} from "./takes/home";

/** Inertia of the camera on the scroll: critically damped, ω = 2 / smoothing time (±0.25 s). */
const OMEGA = 8;
/** Duration of the whip pan to K2.2 (s). */
const WHIP_S = 0.45;

export { TAKE_SCREENS, KEYS, LAYOUT_STEPS, keyP };
export { mixQuad, quadToMatrix3d } from "./core/anchors";
export type { KeyName, Quad };

export type WorldOptions = {
  /** Force a keyframe format instead of following the host's aspect ratio. */
  fmt?: "pc" | "hp";
  /** Start (and stay) on a keyframe hold, for review shots and stills. */
  key?: KeyName;
  /** Saver mode: pixel ratio 1, smaller shadow map, no lamp lights. */
  saver?: boolean;
  noAO?: boolean;
  /** Keep the drawing buffer so tools can read the canvas. */
  shot?: boolean;
  /** Bake AO for this layout step in the browser and expose the maps (tools/render). */
  bake?: number;
  /** Where the baked AO maps live. */
  aoBase?: string;
  onFrame?: (f: FrameInfo) => void;
  onReady?: () => void;
  onContextLost?: (count: number) => void;
};

export type FrameInfo = {
  p: number;
  key: KeyName;
  /** Screen quad per anchor in CSS px of the host, or null when it is off screen or behind the camera. */
  anchors: Record<string, Quad | null>;
};

export type WorldStats = {
  fps: number;
  calls: number;
  triangles: number;
  pixelRatio: number;
  ao: string;
  key: KeyName;
  /** Main-thread time spent building the cast (ms), its longest single slice, and whether it is all built. */
  cast: { ms: number; longest: number; done: boolean };
  /** Draw calls and triangles of the last frame that also redrew the shadow map (while Heru or the door moves). */
  shadow: { calls: number; triangles: number };
};

export async function mount(host: HTMLElement, opts: WorldOptions = {}) {
  const { aoBase = "/world/ao" } = opts;
  const coarse = matchMedia("(pointer: coarse)").matches;
  let saver = !!opts.saver;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: "high-performance",
    preserveDrawingBuffer: !!opts.shot,
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.display = "block";
  canvas.style.width = canvas.style.height = "100%";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 600);
  const k0cam = new THREE.PerspectiveCamera(40, 1, 0.05, 600);
  const kit: Kit = createKit(renderer);
  const light = createLight(renderer, scene);

  // sets
  const extAO: AoTarget[] = [];
  const street = buildStreet(kit, extAO);
  scene.add(street.group);
  const sky = buildSky(kit);
  scene.add(sky.group);
  const buildRoom = createCompanyFront(kit);
  const anchors = billboardAnchors();

  // ---------- cast (own chunk, built after the sets; K0 does not need it) ----------
  // One member per idle slice so the build does not hold the main thread for long. Heru walks with the
  // take (sampled from the scroll); the others sit or stand in the room's spots, in their K2 poses, and act
  // over time while the room is on screen.
  let heru: CastMember | null = null;
  const crew: CastMember[] = [];
  let castMod: typeof import("./cast/roster") | null = null;
  let phone: ReturnType<typeof import("./cast/roster").createPhone> | null = null;
  let placeCrew = () => {};
  const castReady = import("./cast/roster").then(async (mod) => {
    const { CAST, buildMemberSliced, applyPose, K2_POSES } = mod;
    // each slice is timed; the HUD shows the total and the longest (a long slice is a stutter on a phone)
    let t = performance.now();
    const pause = () =>
      new Promise((r) => {
        const dt = Math.round(performance.now() - t);
        stats.cast.ms += dt;
        stats.cast.longest = Math.max(stats.cast.longest, dt);
        setTimeout(() => {
          t = performance.now();
          r(null);
        }, 0);
      });
    heru = await buildMemberSliced(CAST.heru, { saver }, pause);
    scene.add(heru.mesh);
    for (const name of ["dewi", "sinta", "bayu", "nadia", "fajar"] as const) {
      const m = await buildMemberSliced(CAST[name], { saver }, pause);
      crew.push(m);
      scene.add(m.mesh);
    }
    phone = mod.createPhone();
    scene.add(phone.group);
    await pause();
    castMod = mod;
    stats.cast.done = true;
    placeCrew = () => {
      if (!room) return;
      for (const m of crew) {
        const spot = room.spots[m.name as keyof typeof room.spots];
        m.mesh.position.copy(spot.pos);
        m.mesh.rotation.y = spot.rotY;
        m.mesh.updateMatrixWorld(true);
        applyPose(m, K2_POSES[m.name]);
        m.springs?.reset(opts.shot ? 1 : 0);
        if (m.name === "sinta") phone?.update(m, 0);
      }
      lastHeruKey = "";
      renderer.shadowMap.needsUpdate = true;
      needsRender = true;
    };
    placeCrew();
  });

  /** Poses Heru for the scroll position; returns true when he moved (his shadow and springs follow). */
  let lastHeruKey = "";
  const placeHeru = (h: HeruState, whip: number, breath: number) => {
    if (!heru) return false;
    // his body (walk, door) moves his shadow; his head turn and breathing don't
    const body = `${h.c.toFixed(5)} ${fmtT.toFixed(3)}`,
      key = `${body} ${h.pan.toFixed(4)} ${whip.toFixed(4)} ${breath.toFixed(4)}`;
    if (key === lastHeruKey) return false;
    const first = !lastHeruKey,
      moved = !lastHeruKey.startsWith(body + " ");
    lastHeruKey = key;
    poseHeru(heru, h, fmtT, whip, breath);
    if (first || opts.shot) heru.springs?.reset(opts.shot ? 1 : 0);
    else heru.springs?.poke(moved ? 1.5 : 0.5);
    return moved;
  };
  /** The room's actions at time t (seconds); Bu Dewi turns her head toward Heru. */
  const actCrew = (t: number) => {
    if (!castMod || !heru) return;
    const head = heru.rig.bone("head").getWorldPosition(new THREE.Vector3());
    for (const [i, m] of crew.entries()) {
      castMod.act(
        m,
        castMod.K2_POSES[m.name] as Pose,
        t,
        i + 1,
        m.name === "dewi" ? castMod.lookYaw(m, head) * 0.8 : 0,
      );
      if (m.name === "sinta") phone?.update(m, t);
    }
  };

  // ---------- AO ----------
  let aoState = opts.noAO ? "mati" : "memuat";
  let aoJob: Generator<number, Map<string, Uint8Array>> | null = null;
  let aoJobTargets: AoTarget[] = [];
  let baking = false;
  const aoQueue: AoTarget[][] = [];
  const baked = new Map<string, { data: Uint8Array; res: [number, number] }>();
  const occluders = () => {
    scene.updateMatrixWorld(true);
    const out = street.batch.occ.map((g) => g.clone().applyMatrix4(street.group.matrixWorld));
    if (room) for (const g of room.batch.occ) out.push(g.clone().applyMatrix4(room.group.matrixWorld));
    return out;
  };
  /** Bakes queued plane sets one after another (the tracer is loaded only when needed). */
  const nextBake = async () => {
    const targets = aoQueue.shift();
    if (!targets) {
      baking = false;
      aoState = "siap";
      return;
    }
    baking = true;
    aoState = "menghitung";
    const { bakeAO } = await import("./core/bake");
    aoJobTargets = targets;
    aoJob = bakeAO(targets, occluders());
  };
  const startBake = async (targets: AoTarget[]) => {
    aoQueue.push(targets);
    if (!baking) await nextBake();
  };
  const stepAO = (budgetMs: number) => {
    if (!aoJob) return;
    const t0 = performance.now();
    while (performance.now() - t0 < budgetMs) {
      const r = aoJob.next();
      if (r.done) {
        for (const t of aoJobTargets) {
          const data = r.value.get(t.id);
          if (!data) continue;
          applyAO(t, data);
          baked.set(t.id, { data, res: t.res });
        }
        aoJob = null;
        needsRender = true;
        void nextBake();
        break;
      }
      aoState = `${Math.round(r.value * 100)}%`;
    }
  };
  /** Loads the baked maps of these planes; whatever is missing is computed in the browser. */
  const provideAO = async (targets: AoTarget[]) => {
    if (opts.noAO) return;
    if (opts.bake != null) return startBake(targets);
    const missing = await loadAO(targets, aoBase);
    needsRender = true;
    if (missing.length) await startBake(missing);
    else if (!baking) aoState = "siap";
  };

  // ---------- interior, rebuilt when the layout step changes ----------
  let room: CompanyFront | null = null;
  let roomAO: Promise<void> = Promise.resolve();
  const setRoom = (step: number) => {
    if (room?.step === step) return;
    if (room) {
      scene.remove(room.group);
      disposeTree(room.group, kit.shared);
    }
    const targets: AoTarget[] = [];
    room = buildRoom(step, targets);
    room.lampLights.forEach((l) => (l.visible = !saver));
    scene.add(room.group);
    placeCrew();
    renderer.shadowMap.needsUpdate = true;
    roomAO = provideAO(targets);
  };

  // ---------- sizing and format blend ----------
  let fmtT = 0;
  let dprCap = 9;
  const maxDpr = () => (saver ? 1 : Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2));
  let width = 1,
    height = 1;
  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(maxDpr(), dprCap));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    fmtT = opts.fmt === "pc" ? 0 : opts.fmt === "hp" ? 1 : formatT(width / height);
    sky.setFormat(fmtT);
    {
      // the pigeons' flight wraps at the edges of the K0 view on this screen
      const k0 = cameraAt(keyP("K0"), fmtT, { x: 0, z: 0 }, 0);
      k0cam.position.copy(k0.pos);
      k0cam.quaternion.copy(k0.quat);
      k0cam.fov = k0.fov;
      k0cam.aspect = width / height;
      k0cam.updateProjectionMatrix();
      k0cam.updateMatrixWorld();
      sky.setFlight(k0cam);
    }
    setRoom(opts.bake ?? layoutStep(fmtT));
    light.setShadowSize(saver || coarse ? 1024 : 2048);
    renderer.shadowMap.needsUpdate = true;
    needsRender = true;
  };

  // ---------- loop ----------
  let target = opts.key ? keyP(opts.key) : 0,
    lastP = -1,
    needsRender = true,
    running = true,
    raf = 0,
    lostCount = 0,
    lost = false,
    readyFired = false,
    firstAO: Promise<void> | null = null;
  // the scroll position shown, with the camera's inertia (position and velocity of a critically damped spring)
  const view = { x: target, v: 0 };
  // the whip pan: linear time 0..1 toward its target (0 before the whip point, 1 after), shown eased
  let whipT = whipTarget(target);
  // Heru's clock (seconds at his own pace), following the scroll no faster than he walks
  const heruClk = { x: heruClock(target, fmtT), v: 0 };
  const stats: WorldStats = {
    fps: 0,
    calls: 0,
    triangles: 0,
    pixelRatio: 1,
    ao: aoState,
    key: "K0",
    cast: { ms: 0, longest: 0, done: false },
    shadow: { calls: 0, triangles: 0 },
  };
  const timer = new THREE.Timer();
  timer.connect(document);
  renderer.info.autoReset = false;
  const blur = createWhipBlur(renderer);
  let frames = 0,
    acc = 0,
    slow = 0;
  // Ambient animation (the K0 pigeons, the people in the room, springs settling) needs frames while nothing
  // else changes: capped to save battery, and only while there is something to see. Stills and review shots
  // (?shot) keep everyone still, in their K2 poses.
  const ambient = !opts.shot;
  let birdsVisible = false,
    lastAmbient = 0,
    lastRender = 0,
    lastShadow = 0,
    shadowDue = false;
  const lastQuat = new THREE.Quaternion();

  const frame = (ts: number) => {
    raf = requestAnimationFrame(frame);
    timer.update(ts);
    const dt = Math.min(timer.getDelta(), 0.1);
    if (lost) return;
    if (!opts.key) {
      dampStep(view, target, OMEGA, dt);
      if (Math.abs(view.x - target) < 1e-5 && Math.abs(view.v) < 1e-4) {
        view.x = target;
        view.v = 0;
      }
    }
    const shown = Math.min(1, Math.max(0, view.x));
    // the whip runs on time once the scroll has passed its point (and back when the visitor scrolls up)
    const wt = whipTarget(shown);
    if (whipT !== wt) {
      whipT = wt > whipT ? Math.min(wt, whipT + dt / WHIP_S) : Math.max(wt, whipT - dt / WHIP_S);
      needsRender = true;
    }
    const clockAt = heruClock(shown, fmtT);
    if (heruClk.x !== clockAt) {
      if (opts.key || opts.shot) heruClk.x = clockAt;
      else followClock(heruClk, clockAt, dt);
      needsRender = true;
    }
    stepAO(opts.bake != null ? 250 : coarse ? 6 : 10);
    if (Math.abs(shown - lastP) > 1e-6) {
      lastP = shown;
      needsRender = true;
    }
    const inRoom = roomInView(shown),
      springsBusy = !!heru?.springs?.busy || crew.some((m) => m.springs?.busy);
    const wantsAmbient = ambient && (birdsVisible || (inRoom && stats.cast.done) || springsBusy || shadowDue);
    if (wantsAmbient && ts - lastAmbient >= 1000 / (saver ? 20 : 30) - 2) needsRender = true;
    acc += dt;
    if (acc > 0.5) {
      if (frames) stats.fps = Math.round(frames / acc);
      frames = 0;
      acc = 0;
    }
    if (!needsRender || !running) return;
    needsRender = false;
    const rdt = Math.min(0.1, (ts - (lastRender || ts)) / 1000);
    lastRender = ts;
    const time = timer.getElapsed();
    if (ambient) {
      sky.animate(time, craneAt(shown));
      lastAmbient = ts;
    }

    const whip = ease(whipT);
    const h = heruAt(shown, fmtT, heruClk.x);
    const moved = placeHeru(h, whip, ambient && inRoom ? 0.012 * Math.sin(Math.PI * 2 * 0.22 * time) : 0);
    if (moved || street.hinge.rotation.y !== h.door) shadowDue = true;
    street.hinge.rotation.y = h.door;
    if (ambient && inRoom) actCrew(time);
    // springs follow the poses of this frame
    heru?.springs?.update(rdt);
    for (const m of crew) m.springs?.update(rdt);
    // shadows of moving people every frame (at most 30 times a second on phones; the shadow map is otherwise
    // drawn only on changes); the small actions in the room leave it as it is
    if (shadowDue && (!coarse || ts - lastShadow >= 32)) {
      renderer.shadowMap.needsUpdate = true;
      lastShadow = ts;
      shadowDue = false;
    }

    // the camera follows where the scroll puts Heru (his own clock may lag a little behind it)
    const c = cameraAt(shown, fmtT, heruAt(shown, fmtT), whip);
    light.setInside(c.pos.z);
    camera.position.copy(c.pos);
    camera.quaternion.copy(c.quat);
    camera.fov = c.fov;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // blur along the whip pan: the angle turned since the last frame, as a share of the view's width
    const turn = 2 * Math.acos(Math.min(1, Math.abs(lastQuat.dot(c.quat))));
    lastQuat.copy(c.quat);
    const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(c.fov) / 2) * camera.aspect),
      smear = whipT > 0 && whipT < 1 && !saver && rdt > 0 ? Math.min(0.08, ((turn / rdt) * (1 / 60)) / hfov) : 0;
    renderer.info.reset();
    // a frame that also redraws the shadow map (people moving, layout or size changes) is counted apart
    const shadowFrame = renderer.shadowMap.needsUpdate;
    if (smear > 0.003) {
      blur.render(scene, camera, smear);
      needsRender = true;
    } else renderer.render(scene, camera);
    birdsVisible = sky.birdsInView(camera);

    frames++;
    if (dt > 0.034 && renderer.getPixelRatio() > 1) {
      if (++slow > 30) {
        dprCap = Math.max(1, renderer.getPixelRatio() - 0.25);
        slow = 0;
        resize();
      }
    } else slow = Math.max(0, slow - 1);
    // the shadow pass is counted apart: it runs only while Heru or the door moves
    if (shadowFrame) {
      stats.shadow.calls = renderer.info.render.calls;
      stats.shadow.triangles = renderer.info.render.triangles;
    } else {
      stats.calls = renderer.info.render.calls;
      stats.triangles = renderer.info.render.triangles;
    }
    stats.pixelRatio = renderer.getPixelRatio();
    stats.ao = aoState;
    stats.key = c.key;

    const quads: Record<string, Quad | null> = {};
    for (const a of anchors) {
      const q = projectAnchor(a, camera, width, height);
      quads[a.name] = q && quadVisible(q, width, height) ? q : null;
    }
    opts.onFrame?.({ p: shown, key: c.key, anchors: quads });
    if (!readyFired && firstAO) {
      const fire = () => {
        if (readyFired) return;
        readyFired = true;
        opts.onReady?.();
      };
      void firstAO.then(() => requestAnimationFrame(fire));
      firstAO = null;
    }
  };

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    lost = true;
    opts.onContextLost?.(++lostCount);
  });
  canvas.addEventListener("webglcontextrestored", () => {
    lost = false;
    renderer.shadowMap.needsUpdate = true;
    needsRender = true;
  });

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();
  // the cast pops in when built; stills and review shots (?shot, ?bake) wait for it
  firstAO = Promise.all([provideAO(extAO), roomAO, opts.shot ? castReady : null]).then(() => {
    needsRender = true;
  });
  raf = requestAnimationFrame(frame);

  return {
    /** Scroll position of the take, 0..1; the camera eases toward it. */
    setTarget(p: number) {
      target = Math.min(1, Math.max(0, p));
    },
    /** Jump without easing (keyframe links, tools). */
    jump(p: number) {
      target = view.x = Math.min(1, Math.max(0, p));
      view.v = 0;
      whipT = whipTarget(target);
      heruClk.x = heruClock(target, fmtT);
      heruClk.v = 0;
      lastHeruKey = "";
      for (const m of crew) m.springs?.reset(opts.shot ? 1 : 0);
      needsRender = true;
    },
    /** Draws one more frame (tools: a frame without the shadow pass, for the draw call count). */
    redraw() {
      needsRender = true;
    },
    /** Stops rendering while the stage is off screen. */
    setRunning(on: boolean) {
      running = on;
      if (on) needsRender = true;
    },
    setSaver(on: boolean) {
      saver = on;
      room?.lampLights.forEach((l) => (l.visible = !saver));
      resize();
    },
    stats: () => stats,
    /** Live objects, for dev tools (camera solve, review shots). */
    debug: () => ({ scene, camera, heru, crew, room, fmtT }),
    keyP,
    canvas,
    renderer,
    /** True once the AO maps are on (loaded, or computed in the browser). */
    aoDone: () => !baking && (aoState === "siap" || aoState === "mati"),
    /** Baked maps as grey PNG data URLs, for tools/render. */
    aoExport: () => [...baked].map(([id, { data, res }]) => ({ id, w: res[0], h: res[1], png: encodeMap(data, res) })),
    dispose() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      timer.dispose();
      disposeTree(scene);
      kit.dispose();
      light.dispose();
      blur.dispose();
      heru?.dispose();
      phone?.dispose();
      for (const m of crew) m.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}

export type World = Awaited<ReturnType<typeof mount>>;

/**
 * Copy surfaces on the billboard face: the whole face (phones: kicker and headline), and its upper and lower
 * parts (desktop: kicker and headline above, body and buttons below).
 */
export const FACE_SPLIT = 0.56;
function billboardAnchors() {
  const f = billboardFace(),
    topH = f.hh * FACE_SPLIT,
    botH = f.hh - topH;
  return [
    rectAnchor("face", f.cx, f.cy, f.z, f.hw, f.hh),
    rectAnchor("faceTop", f.cx, f.cy + f.hh - topH, f.z, f.hw, topH),
    rectAnchor("faceBottom", f.cx, f.cy - f.hh + botH, f.z, f.hw, botH),
  ];
}
/** Width / height of each anchor, so the page can size the HTML boxes without distorting the text. */
export function anchorAspects() {
  const out: Record<string, number> = {};
  for (const a of billboardAnchors())
    out[a.name] = a.corners[0].distanceTo(a.corners[1]) / a.corners[0].distanceTo(a.corners[2]);
  return out;
}
