// The Home world: renderer, sets, light and the take, mounted into a host element by the page.
// The page owns the scroll and the HTML copy; the world owns the canvas and tells the page, per rendered frame,
// where each anchor (copy surface) is on screen. Loaded with import() after the page is visible.
import * as THREE from "three";
import { applyAO, encodeMap, loadAO, type AoTarget } from "./core/ao";
import { projectAnchor, quadVisible, rectAnchor, type Anchor, type Quad } from "./core/anchors";
import { createKit, disposeTree, type Kit } from "./core/kit";
import { createLight } from "./core/light";
import { ease, formatT, segmentStart, smoothstep } from "./core/segments";
import { createWhipBlur } from "./core/whipBlur";
import type { CastMember } from "./cast/member";
import type { Pose } from "./cast/poses";
import { dampStep } from "./motion/damp";
import { createCompanyFront, layoutStep, LAYOUT_STEPS, type CompanyFront } from "./sets/companyFront";
import { createCounterProps, HANDS_PITCH } from "./sets/counterProps";
import { buildShop, panelFace, rowMaterials } from "./sets/shop";
import { SHOPS } from "./sets/rowLayout";
import { buildSky } from "./sets/sky";
import { billboardFace, buildStreet } from "./sets/street";
import type { KeyName } from "./takes/home/data";
import {
  cameraAt,
  craneAt,
  followDoorClock,
  heruAt,
  heruClock,
  heruGate,
  KEYS,
  keyP,
  poseHeru,
  roomInView,
  TAKE_SCREENS,
  whipTarget,
  type HeruState,
} from "./takes/home";
import { k3View, k4View, setSafeTop } from "./takes/home/counter";
import { B5, b5Relax, panelArrivals } from "./takes/home/outside";
import { SEG } from "./takes/home/timing";
import { outsideState, poseOutside, rightLeaf, scrollClock, stepOutClock } from "./takes/home/outsideCast";
import type { Row } from "./sets/row";
import {
  B4_SECONDS,
  beat4Clock,
  beatAt,
  dewiCloseHand,
  dewiPose3,
  heru3Clock,
  phase4,
  poseHeru3,
  type Beat3,
} from "./takes/home/counterCast";

/** Inertia of the camera on the scroll: critically damped, ω = 2 / smoothing time (±0.25 s). */
const OMEGA = 8;
/** Screens per second at most the camera catches up with the scroll after waiting for Heru at the door (issue #10). */
const CATCH_UP = 2;
/** Duration of the whip pan to K2.2 (s). */
const WHIP_S = 0.45;
/** Bu Dewi's nod at K4.1: where it starts (screens: the K4.1 hold), how long it takes (s), her face meanwhile. */
const keyHoldStart = (k: KeyName) =>
  segmentStart(
    SEG,
    SEG.findIndex((g) => g.from === k && g.type === "hold"),
  );
const NOD_AT = keyHoldStart("K4.1");
const NOD_S = 1.4;
const NOD_FACE = { browTilt: 0.04, browLift: 0.012, smile: 0.62 };

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
  /** Height (CSS px) at the top of the host covered by the page's floating header; the top views keep clear of it. */
  safeTop?: () => number;
  onFrame?: (f: FrameInfo) => void;
  onReady?: () => void;
  onError?: (error: unknown) => void;
  /** Share 0..1 of the boot done (sets, AO, cast, hands, shaders), for the loading bar. */
  onProgress?: (share: number) => void;
  onContextLost?: (count: number) => void;
};

export type FrameInfo = {
  p: number;
  key: KeyName;
  /** Screen quad per anchor in CSS px of the host, or null when it is off screen or behind the camera. */
  anchors: Record<string, Quad | null>;
  /**
   * Opacity of the copy on the props of beats 3–4 (leaflet, page; 0 hidden), and the size its box should have:
   * its size on screen at its hold, so the text is drawn at about 1:1 there and stays sharp.
   */
  fade: Record<string, number>;
  sizes: Record<string, { w: number; h: number }>;
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
  let disposed = false;
  const abort = new AbortController();
  const reportError = (error: unknown) => {
    if (!disposed) opts.onError?.(error);
  };
  // ---------- boot progress ----------
  // Each step of the boot weighs about what it took on a laptop (measured 10 Nov); each one counts once (a later
  // room rebuild or warm-up does not move the bar back). A performance mark per step, for profiling.
  const BOOT_STEPS: Record<string, number> = {
    sets: 2,
    aoExt: 0.5,
    aoRoom: 0.5,
    "cast:heru": 0.5,
    "cast:dewi": 0.4,
    "cast:sinta": 0.4,
    "cast:bayu": 0.4,
    "cast:nadia": 0.4,
    "cast:fajar": 0.4,
    hands: 0.5,
    props: 0.1,
    fonts: 0.1,
    compile: 3,
    blur: 1,
    draw: 1,
  };
  const bootTotal = Object.values(BOOT_STEPS).reduce((a, b) => a + b, 0);
  const bootDone = new Set<string>();
  let bootShare = 0;
  const bootStep = (name: string) => {
    if (disposed || bootDone.has(name) || !(name in BOOT_STEPS)) return;
    bootDone.add(name);
    performance.mark(`world:${name}`);
    bootShare += BOOT_STEPS[name] / bootTotal;
    opts.onProgress?.(Math.min(1, bootShare));
  };
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
  // the shaders are known good: skip reading back their logs on first use (it waits for the driver)
  renderer.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
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
  // the row of shophouses (beats 5a–5b): the fruit shop and the laundry are seen from K0 on and built with the
  // street; the rest of the row is its own chunk, built as the camera nears K4.1 (loadRow)
  const rowMats = rowMaterials(),
    rowOcc: THREE.BufferGeometry[] = [];
  for (const i of [0, 1]) scene.add(buildShop(kit, rowMats, SHOPS[i], i, extAO, rowOcc));
  let row: Row | null = null,
    rowLoading: Promise<void> | null = null;
  const buildRoom = createCompanyFront(kit);
  const anchors = billboardAnchors();
  // leaflet, binder and pencils of beats 3–4, laid out on the counter of the current layout
  const props = createCounterProps(kit, abort.signal);
  scene.add(props.group);

  // ---------- cast (own chunk, built after the sets; K0 does not need it) ----------
  // One member per idle slice so the build does not hold the main thread for long. Heru walks with the
  // take (sampled from the scroll); the others sit or stand in the room's spots, in their K2 poses, and act
  // over time while the room is on screen.
  let heru: CastMember | null = null;
  const crew: CastMember[] = [];
  let castMod: typeof import("./cast/roster") | null = null;
  let phone: ReturnType<typeof import("./cast/roster").createPhone> | null = null;
  let sweat: ReturnType<typeof import("./cast/roster").createSweat> | null = null;
  let thoughts: ReturnType<typeof import("./cast/roster").createThought> | null = null;
  let placeCrew = () => {};
  const castReady = import("./cast/roster").then(async (mod) => {
    if (disposed) return;
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
    if (disposed) return heru.dispose();
    scene.add(heru.mesh);
    bootStep("cast:heru");
    for (const name of ["dewi", "sinta", "bayu", "nadia", "fajar"] as const) {
      const m = await buildMemberSliced(CAST[name], { saver }, pause);
      if (disposed) return m.dispose();
      crew.push(m);
      scene.add(m.mesh);
      bootStep(`cast:${name}`);
    }
    phone = mod.createPhone();
    scene.add(phone.group);
    sweat = mod.createSweat(crew);
    thoughts = mod.createThought(crew);
    await pause();
    if (disposed) return;
    const hands = await mod.buildCloseHands({ saver }, pause);
    if (disposed) {
      for (const who of Object.values(hands)) for (const hand of Object.values(who)) disposeTree(hand.mesh);
      return;
    }
    props.setHands(hands);
    scene.add(thoughts.group);
    bootStep("hands");
    await pause();
    if (disposed) return;
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
      thoughts?.update(0);
      lastHeruKey = "";
      // Bu Dewi is back in her K2 pose and face: beats 3–4 repose her
      dewiFace = "";
      lastDewiKey = "";
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
  /** Beats 3–4: Heru on his beat-3 clock carries the leaflet to the counter (returns where it is). */
  let b3: Beat3 | null = null;
  const placeHeru3 = (shown: number, breath: number) => {
    if (!heru || !room) return false;
    const u = b4Time / B4_SECONDS,
      relax = b5Relax(shown * TAKE_SCREENS),
      body = `b3 ${heru3Time.toFixed(5)} ${room.step} ${fmtT.toFixed(3)} ${u.toFixed(5)} ${relax.toFixed(4)}`,
      key = `${body} ${breath.toFixed(4)}`;
    if (key === lastHeruKey) return false;
    const moved = !lastHeruKey.startsWith(body + " ");
    lastHeruKey = key;
    // beat 4 slides the leaflet aside under his hand (seen from above only)
    const slide = THREE.MathUtils.smootherstep(phase4(u, "slide"), 0, 1);
    b3 = poseHeru3(heru, heru3Time, room.step, fmtT, breath, slide, relax);
    if (opts.shot) heru.springs?.reset(1);
    else heru.springs?.poke(moved ? 1.5 : 0.5);
    return moved;
  };
  /** Bu Dewi's base pose for the scroll position (her K2 pose until beat 3), and the face it wants. */
  let dewiFace = "";
  const dewiBase = (shown: number) => {
    const m = crew.find((c) => c.name === "dewi");
    if (!castMod || !m || !room) return null;
    const k2 = castMod.K2_POSES.dewi as Pose,
      pose = {
        ...(beatAt(shown).on
          ? dewiPose3(m, k2, shown, room.step, b4Time / B4_SECONDS, b5Relax(shown * TAKE_SCREENS))
          : k2),
      };
    // K4.1: she smiles and nods once with her eyes closed (video k41 - k4, ±5.5 s)
    if (nodT > 0) {
      const n = Math.sin(Math.PI * nodT) ** 2,
        head = pose.head ?? [0, 0, 0];
      pose.head = [head[0] + 0.3 * n, head[1], head[2]];
      pose.lids = Math.max(pose.lids ?? 0, smoothstep(0.15, 0.4, nodT) * (1 - smoothstep(0.7, 0.9, nodT)));
      pose.face = NOD_FACE;
    }
    const face = JSON.stringify(pose.face);
    // the face is repainted only when it changes (it redraws the atlas)
    if (face !== dewiFace) {
      dewiFace = face;
      if (pose.face) m.express(pose.face);
    }
    return { m, pose };
  };
  /** The room's actions at time t (seconds); Bu Dewi turns her head toward Heru. */
  const actCrew = (t: number, shown: number) => {
    if (!castMod || !heru) return;
    const head = heru.rig.bone("head").getWorldPosition(new THREE.Vector3()),
      dewi = dewiBase(shown);
    for (const [i, m] of crew.entries()) {
      castMod.act(
        m,
        m.name === "dewi" && dewi ? dewi.pose : (castMod.K2_POSES[m.name] as Pose),
        t,
        i + 1,
        // she looks at Heru until he lays the leaflet down, then at the leaflet
        m.name === "dewi" ? castMod.lookYaw(m, head) * 0.8 * (1 - Math.min(1, beatAt(shown).s)) : 0,
      );
      if (m.name === "sinta") phone?.update(m, t);
    }
    sweat?.update(t);
    thoughts?.update(t);
  };

  /**
   * Beats 5a–5b: Heru and Bu Dewi out on the street, on their own clock (takes/home/outsideCast.ts). Returns true when
   * they moved (their shadows follow).
   */
  let outside = false,
    lastOutKey = "";
  const placeOutside = (c: number) => {
    const dewi = crew.find((m) => m.name === "dewi");
    const st = outsideState(c);
    if (!heru || !dewi || !st) return false;
    const key = c.toFixed(4);
    if (key === lastOutKey) return false;
    lastOutKey = key;
    poseOutside(heru, dewi, st);
    street.leafL.rotation.y = st.leftLeaf;
    if (row) row.doorHinge.rotation.y = st.kreLeaf;
    for (const m of [heru, dewi]) {
      if (opts.shot) m.springs?.reset(1);
      else m.springs?.poke(1.5);
    }
    return true;
  };

  // ---------- AO ----------
  let aoState = opts.noAO ? "mati" : "memuat";
  let aoJob: Generator<number, Map<string, Uint8Array>> | null = null;
  let aoJobTargets: AoTarget[] = [];
  let baking = false;
  const aoQueue: AoTarget[][] = [];
  const aoWaiters = new Set<() => void>();
  const waitForAO = () => (baking ? new Promise<void>((resolve) => aoWaiters.add(resolve)) : Promise.resolve());
  const baked = new Map<string, { data: Uint8Array; res: [number, number] }>();
  const occluders = () => {
    scene.updateMatrixWorld(true);
    const out = street.batch.occ.map((g) => g.clone().applyMatrix4(street.group.matrixWorld));
    out.push(...rowOcc, ...(row?.occ ?? []));
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
    if (disposed) return;
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
        void nextBake().catch(reportError);
        break;
      }
      aoState = `${Math.round(r.value * 100)}%`;
    }
  };
  /** Loads the baked maps of these planes; whatever is missing is computed in the browser. */
  const provideAO = async (targets: AoTarget[]) => {
    if (opts.noAO) return;
    if (opts.bake != null) return startBake(targets);
    const missing = await loadAO(targets, aoBase, abort.signal);
    if (disposed) return;
    needsRender = true;
    if (missing.length) await startBake(missing);
    else if (!baking) aoState = "siap";
  };

  /** Builds the rest of the row (its own chunk) once; its AO maps load, its shaders compile in the background. */
  const loadRow = () =>
    (rowLoading ??= import("./sets/row").then(async (mod) => {
      // the name on Kreatekno's band is drawn with the page's display font
      await document.fonts?.ready;
      if (disposed) return;
      const targets: AoTarget[] = [];
      row = mod.buildRow(kit, rowMats, targets);
      scene.add(row.group);
      renderer.shadowMap.needsUpdate = true;
      needsRender = true;
      await provideAO(targets);
      if (readyFired) await waitForAO().then(() => warm());
    }));

  // ---------- interior, rebuilt when the layout step changes ----------
  let room: CompanyFront | null = null;
  let roomAO: Promise<void> = Promise.resolve();
  const lamps = [0, 1, 2].map(() => {
    const l = new THREE.PointLight();
    scene.add(l);
    return l;
  });
  // beat 5 lets the room go from K5a.2 on (memory), and builds it again when the visitor scrolls back
  let roomReleased = false,
    roomStep = 0;
  const setRoom = (step: number) => {
    roomStep = step;
    if (roomReleased || room?.step === step) return;
    if (room) {
      scene.remove(room.group);
      disposeTree(room.group, kit.shared);
    }
    const targets: AoTarget[] = [];
    room = buildRoom(step, targets);
    props.place(step);
    // the pendant lamps' lights live in the world, not in the room: letting the room go (beat 5) or building it again
    // must not change the number of lights, which would recompile every material's shader (a stall on the scroll)
    room.group.updateMatrixWorld(true);
    room.lampLights.forEach((l, i) => {
      lamps[i].copy(l);
      lamps[i].position.setFromMatrixPosition(l.matrixWorld);
      l.removeFromParent();
    });
    room.lampLights = lamps;
    lamps.forEach((l) => (l.visible = !saver));
    // built again while the camera is still out on the street: it stays undrawn until the camera goes back in
    if (roomHidden) room.group.visible = room.group.matrixWorldAutoUpdate = false;
    scene.add(room.group);
    placeCrew();
    renderer.shadowMap.needsUpdate = true;
    roomAO = provideAO(targets);
    // a later rebuild (the phone turned) compiles its new parts in the background once its AO is on
    if (readyFired)
      void roomAO
        .then(waitForAO)
        .then(() => warm())
        .catch(reportError);
  };

  // ---------- sizing and format blend ----------
  let fmtT = 0;
  let dprCap = 9,
    shadowLow = false;
  const maxDpr = () => (saver ? 1 : Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2));
  let width = 1,
    height = 1;
  const resize = () => {
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    renderer.setPixelRatio(Math.min(maxDpr(), dprCap));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    setSafeTop((opts.safeTop?.() ?? 0) / height);
    sizesKey = "";
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
    light.setShadowSize(saver || coarse || shadowLow ? 1024 : 2048);
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
    assetsReady = false;
  let rowPreloadTimer: ReturnType<typeof setTimeout> | undefined;
  // the scroll position shown, with the camera's inertia (position and velocity of a critically damped spring)
  const view = { x: target, v: 0 };
  // where the camera heads for: the scroll, or while it waits for Heru at the door, as far as he lets it
  const gate = { goal: target, catching: false };
  // the whip pan: linear time 0..1 toward its target (0 before the whip point, 1 after), shown eased
  let whipT = whipTarget(target);
  // Heru's clock (seconds at his own pace), following the scroll no faster than he walks
  const heruClk = { x: heruClock(target, fmtT), v: 0 };
  // Counter choreography follows the same smoothed scroll as the camera (issue #4).
  let heru3Time = heru3Clock(target, layoutStep(fmtT), fmtT);
  let b4Time = beat4Clock(target);
  // Heru and Bu Dewi out on the street walk on their own clock (seconds), not waiting for the scroll
  const outClk = { x: scrollClock(target * TAKE_SCREENS), v: 0 };
  /** Whether Heru or Bu Dewi would be on screen at outside clock c (last frame's camera). */
  const frustum = new THREE.Frustum(),
    seenSphere = new THREE.Sphere(new THREE.Vector3(), 1.1);
  const seenAt = (c: number) => {
    const st = outsideState(c);
    if (!st) return false;
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
    );
    return [st.heru.body, st.dewi.body].some((b) => frustum.intersectsSphere(seenSphere.set(b.clone().setY(0.9), 1.1)));
  };
  // Bu Dewi's nod at K4.1 runs on time once the scroll reaches its hold (0..1, back when scrolled up)
  let nodT = 0;
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

  // ---------- warm-up ----------
  // Every material compiles its shader the first time it is drawn, and the frame waits for it: measured on an
  // Intel iGPU, the scroll stalled 0.2–1.5 s at the crane down into the room, at the whip and in beats 3–4. So the
  // whole scene is compiled in the background (KHR_parallel_shader_compile) before the world fades in, hidden
  // props and the whip's render-target variants included, and its textures uploaded; again once the cast is built
  // and when the room is rebuilt for another layout. Programs already compiled are reused, so a repeat is cheap.
  const uploadTextures = () => {
    const seen = new Set<THREE.Texture>();
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      if (!m) return;
      for (const mat of Array.isArray(m) ? m : [m])
        for (const v of Object.values(mat))
          if (v instanceof THREE.Texture && !seen.has(v)) {
            seen.add(v);
            renderer.initTexture(v);
          }
    });
  };
  // A compiled program still costs its first draw on some drivers (ANGLE on D3D11 builds the executable for the
  // vertex layout and the target there: ±100 ms each measured), so the warm-up ends with one frame that draws
  // everything once, culling off and hidden objects shown, into a 1-pixel scissor of the screen and of the whip's
  // target, shadows included. It runs while the camera is at rest, right before that frame's real render.
  let drawWarm: (() => void) | null = null,
    warmAsked = 0;
  const warmDraw = () => {
    const shown: THREE.Object3D[] = [],
      culled: THREE.Object3D[] = [];
    scene.traverse((o) => {
      if (!o.visible && !(o as THREE.Light).isLight) {
        shown.push(o);
        o.visible = true;
      }
      if (o.frustumCulled) {
        culled.push(o);
        o.frustumCulled = false;
      }
    });
    renderer.setScissorTest(true);
    renderer.setScissor(0, 0, 1, 1);
    renderer.shadowMap.needsUpdate = true;
    renderer.render(scene, camera);
    renderer.setScissorTest(false);
    if (!saver) {
      const rt = blur.target();
      rt.scissor.set(0, 0, 1, 1);
      rt.scissorTest = true;
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      rt.scissorTest = false;
      blur.warmPass();
    }
    for (const o of shown) o.visible = false;
    for (const o of culled) o.frustumCulled = true;
    // the real frame redraws the shadows without the hidden objects
    renderer.shadowMap.needsUpdate = true;
  };
  let warmChain: Promise<unknown> = Promise.resolve();
  // `final`: the warm-up of the complete K0–K4 scene, the last steps of the boot (an earlier one only gets ahead)
  const warm = (final = false) =>
    (warmChain = warmChain.then(async () => {
      if (lost || disposed) return;
      uploadTextures();
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      if (final) bootStep("compile");
      if (!saver) await blur.warm(scene, camera);
      if (disposed) return;
      if (final) bootStep("blur");
      await new Promise<void>((resolve) => {
        drawWarm = resolve;
        warmAsked = performance.now();
        needsRender = true;
      });
      if (final) bootStep("draw");
    }));
  let frames = 0,
    acc = 0,
    // the quality ladder: the display's refresh interval (the shortest frame seen), missed frames in a window
    vsync = 1 / 60,
    slow = 0,
    slowAt = 0,
    ladderDone = false;
  const slowWin = new Array<number>(60).fill(0);
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
  // on-screen size of the leaflet and the page at their holds (K3, K4), for the copy boxes
  let copySizes: Record<string, { w: number; h: number }> = {},
    sizesKey = "";
  const holdCam = new THREE.PerspectiveCamera(40, 1, 0.05, 600);
  // the customer journey's copy on the panels of the row (beat 5b), a little in from the panels' edges
  const journey = SHOPS.flatMap((s, i) => {
    if (!s.copy) return [];
    const f = panelFace(i);
    return [{ shop: i, anchor: rectAnchor(`journey-${s.copy}`, f.cx, f.cy, f.z + 0.004, f.hw - 0.08, f.hh - 0.08) }];
  });
  const measureCopy = () => {
    sizesKey = `${width} ${height} ${room?.step}`;
    copySizes = {};
    const views = { leaflet: k3View(fmtT, width / height), page: k4View(fmtT, width / height) };
    // the panels: each at the camera of the stop nearest to it (the truck faces the facades square on)
    const stops = panelArrivals(fmtT >= 0.5).map((at) =>
      cameraAt((at + 0.01) / TAKE_SCREENS, fmtT, { x: 0, z: 0 }, 1, width / height),
    );
    const near = (x: number) => stops.reduce((a, b) => (Math.abs(b.pos.x - x) < Math.abs(a.pos.x - x) ? b : a));
    const holds: [Anchor, { pos: THREE.Vector3; quat: THREE.Quaternion; fov: number }][] = [
      ...props.holdAnchors().map((a) => [a, views[a.name as keyof typeof views]] as [Anchor, (typeof views)["page"]]),
      ...journey.map(({ anchor: a }) => [a, near(a.corners[0].x)] as [Anchor, (typeof views)["page"]]),
    ];
    for (const [a, v] of holds) {
      holdCam.position.copy(v.pos);
      holdCam.quaternion.copy(v.quat);
      holdCam.fov = v.fov;
      holdCam.aspect = width / height;
      holdCam.updateProjectionMatrix();
      holdCam.updateMatrixWorld();
      const q = projectAnchor(a, holdCam, width, height);
      if (q)
        copySizes[a.name] = {
          w: Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]),
          h: Math.hypot(q[2][0] - q[0][0], q[2][1] - q[0][1]),
        };
    }
  };
  let topView = false,
    roomHidden = false,
    lastDewiKey = "";

  const frame = (ts: number) => {
    raf = requestAnimationFrame(frame);
    timer.update(ts);
    const dt = Math.min(timer.getDelta(), 0.1);
    if (lost) return;
    if (!opts.key) {
      // through the door the camera waits for Heru (issue #10): never more than a step ahead of his clock; then it
      // catches up with the scroll no faster than a quick scroll
      const gated = heruGate(target, heruClk.x, fmtT);
      if (gated !== target) gate.catching = true;
      if (gate.catching) {
        const max = (CATCH_UP / TAKE_SCREENS) * dt;
        gate.goal += Math.max(-max, Math.min(max, gated - gate.goal));
        if (Math.abs(gate.goal - target) < 1e-6) gate.catching = false;
      }
      const goal = gate.catching ? gate.goal : (gate.goal = target);
      dampStep(view, goal, OMEGA, dt);
      if (Math.abs(view.x - goal) < 1e-5 && Math.abs(view.v) < 1e-4) {
        view.x = goal;
        view.v = 0;
      }
    }
    const shown = Math.min(1, Math.max(0, view.x)),
      xs = shown * TAKE_SCREENS;
    // the rest of the row is built as the camera nears K4.1 (or straight away when the scroll jumps past it)
    if (!rowLoading && Math.max(xs, target * TAKE_SCREENS) > B5.rise - 1.5) void loadRow().catch(reportError);
    // the front room is let go out on the street from K5a.2 on, and built again on the way back (before K4.2)
    if (!roomReleased && room && xs > B5.release) {
      scene.remove(room.group);
      disposeTree(room.group, kit.shared);
      room = null;
      roomReleased = true;
    } else if (roomReleased && xs < B5.truck + 0.2) {
      roomReleased = false;
      setRoom(roomStep);
    }
    // the whip runs on time once the scroll has passed its point (and back when the visitor scrolls up)
    const wt = whipTarget(shown);
    if (whipT !== wt) {
      whipT = wt > whipT ? Math.min(wt, whipT + dt / WHIP_S) : Math.max(wt, whipT - dt / WHIP_S);
      needsRender = true;
    }
    // his clock follows the scroll itself (issue #6), the camera follows him
    const clockAt = heruClock(target, fmtT);
    if (heruClk.x !== clockAt) {
      if (opts.key || opts.shot) heruClk.x = clockAt;
      else followDoorClock(heruClk, clockAt, dt);
      needsRender = true;
    }
    const clock3 = heru3Clock(shown, room?.step ?? layoutStep(fmtT), fmtT);
    if (heru3Time !== clock3) {
      heru3Time = clock3;
      needsRender = true;
    }
    const outWas = outClk.x;
    if (opts.key || opts.shot) outClk.x = scrollClock(xs);
    // out on the street they follow the scroll as the camera shows it (along the row the camera follows them)
    else stepOutClock(outClk, xs, dt, seenAt);
    if (outClk.x !== outWas) needsRender = true;
    const nodTo = xs >= NOD_AT ? 1 : 0;
    if (opts.key || opts.shot) nodT = nodTo === 1 ? 0.5 : 0;
    else if (nodT !== nodTo) nodT = nodTo > nodT ? Math.min(1, nodT + dt / NOD_S) : Math.max(0, nodT - dt / NOD_S);
    const clock4 = beat4Clock(shown);
    if (b4Time !== clock4) {
      b4Time = clock4;
      needsRender = true;
    }
    stepAO(opts.bake != null ? 250 : coarse ? 6 : 10);
    if (!baking) {
      for (const resolve of aoWaiters) resolve();
      aoWaiters.clear();
    }
    if (Math.abs(shown - lastP) > 1e-6) {
      lastP = shown;
      needsRender = true;
    }
    // the room's actions stop in the top views of beats 3–4 (the room is out of sight)
    const inRoom = roomInView(shown) && !topView,
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
    const h = heruAt(shown, fmtT, heruClk.x),
      breath = ambient && inRoom ? 0.012 * Math.sin(Math.PI * 2 * 0.22 * time) : 0;
    const beat3 = beatAt(shown).on;
    if (!beat3) b3 = null;
    // in the top views Heru's and Bu Dewi's own forearms fold away into the close-up hands' sleeves (decided
    // from the last frame's camera); posed again when that changes, so their arm IK never runs folded
    const folds = [
      [heru, topView && beat3 && (b3?.lay ?? 0) > 0.99],
      [crew.find((x) => x.name === "dewi"), topView && beat3 && dewiCloseHand(beatAt(shown).s, b4Time / B4_SECONDS)],
    ] as const;
    for (const [m, folded] of folds) {
      const fold = folded ? 1e-3 : 1;
      if (m && m.rig.bone("lowerArmR").scale.x !== fold) {
        m.rig.bone("lowerArmR").scale.setScalar(fold);
        lastHeruKey = lastDewiKey = "";
        shadowDue = true;
      }
    }
    if (outClk.x > 0 !== outside) {
      outside = outClk.x > 0;
      lastOutKey = "";
      street.leafL.rotation.y = 0;
      // back inside: everyone to their spots and poses again
      if (!outside) placeCrew();
    }
    const moved = outside ? placeOutside(outClk.x) : beat3 ? placeHeru3(shown, breath) : placeHeru(h, whip, breath);
    // the right leaf, open since beat 1, swings shut once the camera has backed out past it (video k4.2 - k4.1), and
    // opens outward with the left one when they come out, so Bu Dewi walks out through it (issue #8)
    const door = h.door * (1 - smoothstep(B5.back + 0.3, B5.back + 0.5, xs)) + (outside ? rightLeaf(outClk.x) : 0);
    if (moved || street.hinge.rotation.y !== door) shadowDue = true;
    street.hinge.rotation.y = door;
    if (outside) {
      /* out on the street: the room is out of sight */
    } else if (ambient && inRoom) actCrew(time, shown);
    else if (castMod) {
      // stills and the top views: Bu Dewi still follows the scroll (her own pose, no breathing)
      // keyed on the pose itself, not the scroll: she is reposed (and the shadows redrawn) only when it changes,
      // not on every frame of the scroll (that redrew the shadow map on every frame of the take)
      const d = dewiBase(shown),
        key = d ? `${room?.step} ${JSON.stringify(d.pose)}` : "";
      if (d && key !== lastDewiKey) {
        lastDewiKey = key;
        castMod.applyPose(d.m, d.pose, false);
        shadowDue = true;
      }
    }
    // springs follow the poses of this frame
    heru?.springs?.update(rdt);
    for (const m of crew) m.springs?.update(rdt);
    // shadows of moving people at most 30 times a second (the shadow pass draws every caster of the street and
    // the room, more than the frame itself; the shadow map is otherwise drawn only on changes); the small actions
    // in the room leave it as it is
    if (shadowDue && ts - lastShadow >= 32) {
      renderer.shadowMap.needsUpdate = true;
      lastShadow = ts;
      shadowDue = false;
    }

    // the camera follows where the scroll puts Heru (his own clock may lag a little behind it)
    const c = cameraAt(shown, fmtT, heruAt(shown, fmtT), whip, width / height, outClk.x);
    // the close-up light of the top views comes in as the camera tilts down past 35° (full from 75°), and the
    // pendant lamps' warm light goes with it
    const close = THREE.MathUtils.smoothstep(-new THREE.Euler().setFromQuaternion(c.quat, "YXZ").x, 0.6, 1.3);
    // late morning outside from the moment the camera backs out through the door in beat 5
    const noon = THREE.MathUtils.smoothstep(xs, B5.back + 0.22, B5.back + 0.36);
    if (light.setInside(c.pos.z, close, noon)) shadowDue = true;
    // the sun's shadow box follows the camera along the row (snapped, so the shadows do not swim)
    if (light.follow(c.pos.x)) shadowDue = true;
    // (the lamps stay lit in the dark only while the room is drawn)
    lamps.forEach((l) => (l.intensity = roomHidden || !room ? 0 : 2.0 * (1 - close)));
    camera.position.copy(c.pos);
    camera.quaternion.copy(c.quat);
    camera.fov = c.fov;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // beat 5 backs out over the desks: the staff's thought bubbles right by the camera step aside
    thoughts?.clear(xs > B5.rise ? c.pos : null, 2.2);
    // out on the street (beat 5) the room is not drawn (behind the facade it only costs draw calls); the open
    // door shows a backdrop of it instead. Heru and Bu Dewi show again once they come out.
    const hide = xs > B5.back + 0.1 && c.pos.z > 0.6;
    if (hide !== roomHidden) {
      roomHidden = hide;
      if (room) room.group.visible = room.group.matrixWorldAutoUpdate = !hide;
      props.group.visible = props.group.matrixWorldAutoUpdate = !hide;
      street.backdrop.visible = hide;
      if (thoughts) thoughts.group.visible = !hide;
      if (phone) phone.group.visible = !hide;
      shadowDue = true;
    }
    // (a member out of sight is not updated either: its skeleton's matrices cost every frame)
    for (const m of [heru, ...crew])
      if (m) m.mesh.visible = m.mesh.matrixWorldAutoUpdate = !hide || (outside && (m === heru || m.name === "dewi"));
    // props of beats 3–4; the close-up hands show in the top views (their shadows need a redraw when they change)
    const pitch = new THREE.Euler().setFromQuaternion(c.quat, "YXZ").x;
    // a change of view is applied on the next frame (forearms, room actions)
    if (topView !== pitch < HANDS_PITCH) needsRender = true;
    topView = pitch < HANDS_PITCH;
    if (props.update(shown, pitch, b3, b4Time / B4_SECONDS)) {
      // the same 30-a-second cap; a change left over is drawn on a later frame
      if (ts - lastShadow >= 32) {
        renderer.shadowMap.needsUpdate = true;
        lastShadow = ts;
      } else shadowDue = true;
    }
    // blur along the whip pan: the angle turned since the last frame, as a share of the view's width
    const turn = 2 * Math.acos(Math.min(1, Math.abs(lastQuat.dot(c.quat))));
    lastQuat.copy(c.quat);
    const hfov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(c.fov) / 2) * camera.aspect),
      smear = whipT > 0 && whipT < 1 && !saver && rdt > 0 ? Math.min(0.08, ((turn / rdt) * (1 / 60)) / hfov) : 0;
    // at rest: the camera has caught up with the scroll (or is held on a keyframe: shots ignore the scroll)
    // (or after 1.5 s anyway, so a visitor scrolling all through the load does not hold the world back)
    const atRest = (opts.key || Math.abs(view.x - target) < 1e-3) && (whipT <= 0 || whipT >= 1);
    if (drawWarm && (atRest || ts - warmAsked > 1500)) {
      warmDraw();
      drawWarm();
      drawWarm = null;
    }
    renderer.info.reset();
    // a frame that also redraws the shadow map (people moving, layout or size changes) is counted apart
    const shadowFrame = renderer.shadowMap.needsUpdate;
    if (smear > 0.003) {
      blur.render(scene, camera, smear);
      needsRender = true;
    } else renderer.render(scene, camera);
    birdsVisible = sky.birdsInView(camera);

    frames++;
    // Quality ladder for GPUs that cannot keep up (measured: an Intel iGPU at 1440 × 810 missed 9–14 % of the
    // frames while scrolling, mostly sampling the 2048 shadow map): when 12 of the last 60 drawn frames missed the
    // display's refresh, the shadow map drops to 1024, then the pixel ratio by 0.25 down to 1. Never back up.
    // Counted only while the camera moves with the scroll and after the cast is built (its build slices delay
    // frames on any machine). Review shots and stills keep full quality.
    if (!opts.shot && !opts.key && !ladderDone && stats.cast.done && Math.abs(view.v) > 1e-4 && dt < 0.1) {
      vsync = Math.min(vsync, Math.max(dt, 1 / 250));
      const missed = dt > vsync * 1.6 ? 1 : 0;
      slow += missed - slowWin[slowAt];
      slowWin[slowAt] = missed;
      slowAt = (slowAt + 1) % slowWin.length;
      if (slow >= 12) {
        slowWin.fill(0);
        slow = 0;
        if (!shadowLow && !saver && !coarse) shadowLow = true;
        else if (renderer.getPixelRatio() > 1) dprCap = Math.max(1, renderer.getPixelRatio() - 0.25);
        else ladderDone = true;
        resize();
      }
    }
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
    for (const a of [...anchors, ...props.copyAnchors(), ...journey.map((j) => j.anchor)]) {
      const q = projectAnchor(a, camera, width, height);
      quads[a.name] = q && quadVisible(q, width, height) ? q : null;
    }
    if (sizesKey !== `${width} ${height} ${room?.step}`) measureCopy();
    // the panels' copy is printed on them: shown whenever a panel is on screen out on the street (its shop built)
    const fade: Record<string, number> = { ...props.fade };
    for (const j of journey) fade[j.anchor.name] = xs > B5.back + 0.3 && (j.shop < 2 || row) ? 1 : 0;
    opts.onFrame?.({ p: shown, key: c.key, anchors: quads, fade, sizes: copySizes });
    // Reveal only after the complete counter scene has been prepared and actually drawn.
    if (!readyFired && assetsReady && !disposed) {
      readyFired = true;
      opts.onReady?.();
      // Prepare the next set during the intro, instead of starting its download at the binder.
      if (!opts.shot) rowPreloadTimer = setTimeout(() => void loadRow().catch(reportError), 800);
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
  // The K0 still remains while all K0–K4 resources (including close-up hands) are prepared.
  // stills, review shots and the AO bake have the whole row from the start
  bootStep("sets");
  const setsAO = Promise.all([provideAO(extAO).then(() => bootStep("aoExt")), roomAO.then(() => bootStep("aoRoom"))]);
  // The sets' shaders (their AO maps change the programs, so after those) compile while the cast is still being
  // built; the final warm-up then only has the cast's own programs left (measured 10 Nov: the boot waited for both).
  if (!opts.shot)
    void setsAO
      .then(waitForAO)
      .then(() => (assetsReady ? undefined : warm()))
      .catch(reportError);
  void Promise.all([
    setsAO,
    castReady,
    props.ready.then(() => bootStep("props")),
    document.fonts.ready.then(() => bootStep("fonts")),
    opts.shot ? loadRow() : null,
  ])
    .then(waitForAO)
    .then(() => warm(true))
    .then(() => {
      if (disposed) return;
      assetsReady = true;
      needsRender = true;
    })
    .catch(reportError);
  raf = requestAnimationFrame(frame);

  return {
    /** Scroll position of the take, 0..1; the camera eases toward it. */
    setTarget(p: number) {
      target = Math.min(1, Math.max(0, p));
    },
    /** Jump without easing (keyframe links, tools). */
    jump(p: number) {
      target = view.x = gate.goal = Math.min(1, Math.max(0, p));
      view.v = 0;
      gate.catching = false;
      whipT = whipTarget(target);
      heruClk.x = heruClock(target, fmtT);
      heruClk.v = 0;
      heru3Time = heru3Clock(target, room?.step ?? layoutStep(fmtT), fmtT);
      b4Time = beat4Clock(target);
      outClk.x = scrollClock(target * TAKE_SCREENS);
      outClk.v = 0;
      nodT = target * TAKE_SCREENS >= NOD_AT ? 1 : 0;
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
      lamps.forEach((l) => (l.visible = !saver));
      resize();
    },
    stats: () => stats,
    /** Live objects, for dev tools (camera solve, review shots). */
    debug: () => ({
      scene,
      camera,
      heru,
      crew,
      room,
      fmtT,
      scroll: { shown: view.x, target },
      counter: { ...props.fade, clock3: heru3Time, clock4: b4Time },
    }),
    keyP,
    canvas,
    renderer,
    /** True once the AO maps are on (loaded, or computed in the browser). */
    aoDone: () => !baking && (aoState === "siap" || aoState === "mati"),
    /** Baked maps as grey PNG data URLs, for tools/render. */
    aoExport: () => [...baked].map(([id, { data, res }]) => ({ id, w: res[0], h: res[1], png: encodeMap(data, res) })),
    dispose() {
      if (disposed) return;
      disposed = true;
      abort.abort();
      clearTimeout(rowPreloadTimer);
      for (const resolve of aoWaiters) resolve();
      aoWaiters.clear();
      drawWarm?.();
      drawWarm = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      timer.dispose();
      disposeTree(scene);
      kit.dispose();
      light.dispose();
      blur.dispose();
      heru?.dispose();
      phone?.dispose();
      sweat?.dispose();
      thoughts?.dispose();
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
