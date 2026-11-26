// The 3D library desk behind the Articles page hero (Pustaka P3): Andi the librarian at the circulation desk, set
// and camera composed like the Solutions shop (world/solusi), sharing its cameras and the character controller
// (world/meja). One fixed canvas, scissored to the hero; drawn at 30 fps while idle and every frame while something
// moves. Returns null when WebGL is unavailable; a lost context calls onLost so the page shows its CSS desk again.
import * as THREE from "three";
import { ANDI_PUSTAKAWAN_SPEC } from "../cast/andiPustakawan";
import { buildMember } from "../cast/member";
import { applyPose } from "../cast/poses";
import { PUSTAKAWAN_POSES, type PustakawanPoseName } from "../cast/pustakawanPose";
import {
  applyCamera,
  focusCameraTarget,
  heroCameraTarget,
  LIP_GAP,
  LIP_Y,
  pinHeroLip,
  servedPhoneCameraTarget,
} from "../meja/kamera";
import { buildRakPass, type RakOptions } from "../meja/rak";
import { createTokoh } from "../meja/tokoh";
import { buildPustaka } from "../sets/pustaka";
import { buildDeskBooks, type DeskBookInput } from "./buku";

export type PustakaMode = "shop" | "tanya";
export type PustakaWorld = {
  setMode: (mode: PustakaMode) => void;
  /** The loan card: typing in the keyword field (Andi leans in to listen), results served. */
  setAsking: (state: { typing: boolean; focused: boolean; served: boolean }) => void;
  /** Andi fetches these books from the wall bookcase; `empty`: nothing matched, he shrugs first (items = all). */
  search: (items: DeskBookInput[], empty: boolean) => void;
  /** "Ask again": the books go back to the bookcase. */
  askAgain: () => void;
  selectBook: (index: number | null) => void;
  render: () => void;
  dispose: () => void;
};

/** Andi stands where Heru stands; at 1.9 his head top and hips line up with Heru's (1.8 m at 1.77). */
const LIBRARIAN_SCALE = 1.9;
const LIBRARIAN_AT = new THREE.Vector3(1.95, -0.47, -2.85);
const EXCLUDED =
  "button,a,input,select,textarea,.pustaka-copy,.focus-heading,.kartu-pinjam,.result-bar,.result-grid,.tanya-all,[data-book-summary]";
/** Andi turns toward the wall bookcase on his left to fetch books (radians). */
const TURN = 1.25;

/** The article shelf below the hero: books instead of the etalase's boxes (world/meja/rak.ts). */
const SHELF: RakOptions = {
  section: ".rak-buku",
  frame: ".frame",
  plank: ".plank",
  item: ".buku[data-slot]",
  cover: ".sampul",
  slot: ".slot",
  track: ".track",
  depth: 40,
  radius: 3,
  coverRadius: 6,
  plankColor: "#B4A9D5",
  panelColor: "#fffdf6",
  fallbackColor: "#8a5cc8",
  pages: { board: 6, inset: 5, color: "#f4ecd6" },
};

export function mountPustakaWorld(
  stage: HTMLElement,
  opts: {
    sign: { title: string; sub: string };
    font: string;
    display: string;
    onReady: () => void;
    onLost: () => void;
  },
): PustakaWorld | null {
  const canvas = document.createElement("canvas");
  canvas.className = "pustaka-gl";
  canvas.setAttribute("aria-hidden", "true");
  // ask for the context ourselves first: without WebGL three.js would log errors before throwing
  const context = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "high-performance" });
  if (!context) return null;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  } catch {
    return null;
  }
  document.body.appendChild(canvas);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  renderer.shadowMap.enabled = false;
  renderer.info.autoReset = false;

  const scene = new THREE.Scene();
  const desk = buildPustaka(opts.sign);
  scene.add(desk.group);
  // the shop's lights
  scene.add(new THREE.HemisphereLight("#ffffff", "#b9b2dc", 1.7));
  const key = new THREE.DirectionalLight("#ffffff", 1.5);
  key.position.set(-3, 6, 5);
  const fill = new THREE.DirectionalLight("#c9f6ff", 0.5);
  fill.position.set(4, 2, 3);
  // Andi reads with his head down, turned away from the key light: a warm, low fill from the front (the desk lamp
  // and the pages bouncing light up) keeps his face as bright as Heru's at the till
  const reading = new THREE.DirectionalLight("#ffe2c4", 0.65);
  reading.position.set(0.5, 0.4, 6);
  reading.target.position.set(1.95, 2.2, -2.85);
  scene.add(key, fill, reading, reading.target);

  const buildStart = performance.now();
  const librarian = buildMember(ANDI_PUSTAKAWAN_SPEC);
  const buildMs = Math.round(performance.now() - buildStart);
  librarian.mesh.scale.setScalar(LIBRARIAN_SCALE);
  librarian.mesh.position.copy(LIBRARIAN_AT);
  applyPose(librarian, PUSTAKAWAN_POSES.idle);
  scene.add(librarian.mesh);
  const tokoh = createTokoh<PustakawanPoseName>(librarian, PUSTAKAWAN_POSES, LIBRARIAN_SCALE, "idle");
  tokoh.hitHead.name = "pustakawan-hit-head";
  tokoh.hitChest.name = "pustakawan-hit-chest";
  scene.add(tokoh.hitHead, tokoh.hitChest);
  const rakPass = buildRakPass(SHELF);
  const books = buildDeskBooks(scene, opts.display);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const layoutCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = matchMedia("(hover: hover) and (pointer: fine)");
  const root = stage.closest<HTMLElement>(".pustaka-page");

  let mode: PustakaMode = "shop";
  let focus = false;
  let asking = { typing: false, focused: false, served: false };
  let turnFrom = 0;
  let turnUntil = 0;
  let pending: { at: number; items: DeskBookInput[] } | null = null;
  let booksMoving = false;
  let hoveredBook = -1;
  let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;
  let mouse = { x: 0, y: 0, active: false };
  let disposed = false;
  let lastDpr = 0;
  let lastFrame = performance.now();
  let lastDraw = 0;
  let raf = 0;
  let force = true;
  let firstFrame = true;
  const initial = heroCameraTarget(stage.getBoundingClientRect().height || 700, innerWidth <= 760);
  const cameraState = { pos: initial.pos.clone(), look: initial.look.clone(), fov: initial.fov };

  const size = () => {
    const phone = innerWidth <= 760;
    const dpr = Math.min(devicePixelRatio, phone ? 1.5 : 2);
    if (canvas.width !== Math.round(innerWidth * dpr) || canvas.height !== Math.round(innerHeight * dpr)) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(innerWidth, innerHeight, false);
      lastDpr = dpr;
      force = true;
    }
    return { phone };
  };
  // the hero stage, or the whole window in the focus view of #tanya
  const rect = () =>
    focus
      ? { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight }
      : stage.getBoundingClientRect();
  const prepareLayoutCamera = (phone = innerWidth <= 760) => {
    applyCamera(layoutCamera, phone ? servedPhoneCameraTarget() : focusCameraTarget(false), innerWidth / innerHeight);
    layoutCamera.updateMatrixWorld(true);
    return layoutCamera;
  };
  const turnTarget = (now: number) => (!reducedQuery.matches && now >= turnFrom && now < turnUntil ? TURN : 0);

  // Fetching: turn to the bookcase and reach (ready, lift) while the books fly to the desk one after another,
  // then face the front again and hold them out (offer).
  const fetchBooks = (items: DeskBookInput[]) => {
    const phone = innerWidth <= 760;
    const reduced = reducedQuery.matches;
    const now = performance.now() / 1000;
    books.setItems(items, prepareLayoutCamera(phone), innerWidth, phone, true, reduced);
    const n = Math.max(1, items.length);
    turnFrom = now;
    turnUntil = now + 0.55 + 0.2 * (n - 1) + 0.5;
    tokoh.act(
      [
        ["ready", 0.35],
        ["lift", turnUntil - now - 0.35],
        ["offer", 0.7],
      ],
      reduced,
    );
    force = true;
  };
  const selectWorldBook = (index: number | null) => {
    books.select(index);
    window.dispatchEvent(new CustomEvent("pustaka-book-select", { detail: index }));
    force = true;
  };
  const cancelHoverClose = () => {
    if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
    hoverCloseTimer = undefined;
  };
  const closeHoverSoon = () => {
    if (hoveredBook < 0 || hoverCloseTimer) return;
    hoverCloseTimer = setTimeout(() => {
      hoveredBook = -1;
      selectWorldBook(null);
      hoverCloseTimer = undefined;
    }, 240);
  };
  /** The book under a screen point while books are served, or -1. */
  const bookAt = (x: number, y: number) => {
    if (mode !== "tanya" || !asking.served) return -1;
    pointerNdc.set((x / innerWidth) * 2 - 1, -(y / innerHeight) * 2 + 1);
    raycaster.setFromCamera(pointerNdc, camera);
    return books.hit(raycaster);
  };

  // The open book: between his hands while he reads (turned up toward his face), lying open on the desk while
  // his hands are busy; it glides between the two as the poses blend.
  const handL = new THREE.Vector3(),
    handR = new THREE.Vector3(),
    face = new THREE.Vector3();
  const signEdge = new THREE.Vector3();
  const inHands = new THREE.Object3D();
  const onDesk = new THREE.Object3D();
  onDesk.position.set(2.5, 1.075, -2.2);
  onDesk.rotation.set(-Math.PI / 2, 0, 0.25);
  onDesk.updateMatrixWorld();
  let bookBlend = 1;
  const placeBook = (dt: number, instant: boolean) => {
    const target = tokoh.pose === "idle" ? 1 : 0;
    bookBlend = instant ? target : THREE.MathUtils.lerp(bookBlend, target, 1 - Math.exp(-dt * 9));
    librarian.rig.bone("handL").getWorldPosition(handL);
    librarian.rig.bone("handR").getWorldPosition(handR);
    librarian.rig.bone("head").getWorldPosition(face);
    inHands.position.copy(handL).add(handR).multiplyScalar(0.5);
    inHands.position.y += 0.17;
    inHands.position.z += 0.04;
    inHands.lookAt(face);
    desk.book.position.lerpVectors(onDesk.position, inHands.position, bookBlend);
    desk.book.quaternion.slerpQuaternions(onDesk.quaternion, inHands.quaternion, bookBlend);
  };

  // The stamp: every 9-14 s while he reads in the shop view (never under reduced motion) he lifts it from its pad,
  // presses it on the loan card and puts it back. It rides in his right fist while the stamp poses play.
  const STAMPING: PustakawanPoseName[] = ["stampLift", "stamp"];
  const stampAct: Array<[PustakawanPoseName, number]> = [
    ["stampLift", 0.6],
    ["stamp", 0.3],
    ["stampLift", 0.35],
  ];
  const fist = new THREE.Vector3();
  let stampBlend = 0;
  let nextStamp = performance.now() / 1000 + 9 + Math.random() * 5;
  const placeStamp = (dt: number, instant: boolean) => {
    const target = STAMPING.includes(tokoh.pose) ? 1 : 0;
    stampBlend = instant ? target : THREE.MathUtils.lerp(stampBlend, target, 1 - Math.exp(-dt * 12));
    // the stamp's base sits this far below his wrist when it is in his fist
    librarian.rig.bone("handR").getWorldPosition(fist);
    fist.y -= 0.334;
    desk.stamp.position.lerpVectors(desk.stampRest, fist, stampBlend);
    if (tokoh.pose === "stamp" && stampBlend > 0.8) desk.mark.visible = true;
  };
  const stampNow = () => {
    tokoh.act(stampAct, reducedQuery.matches);
    force = true;
  };

  const draw = (timestamp = performance.now()) => {
    if (disposed || document.hidden) return;
    const now = timestamp / 1000;
    const dt = Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    const { phone } = size();
    const r = rect();
    renderer.setScissor(0, 0, innerWidth, innerHeight);
    renderer.setViewport(0, 0, innerWidth, innerHeight);
    renderer.clear(true, true, true);
    renderer.info.reset();
    const visible = r.bottom > 0 && r.top < innerHeight && r.width > 0 && r.height > 0;
    if (!visible) {
      root?.classList.remove("librarian-hit");
      booksMoving = false;
    } else {
      const target = focus
        ? phone && mode === "tanya" && books.hasVisible
          ? servedPhoneCameraTarget()
          : focusCameraTarget(phone)
        : heroCameraTarget(r.height, phone);
      const amount = firstFrame || reducedQuery.matches ? 1 : 1 - Math.exp(-dt * 3.4);
      cameraState.pos.lerp(target.pos, amount);
      cameraState.look.lerp(target.look, amount);
      cameraState.fov = THREE.MathUtils.lerp(cameraState.fov, target.fov, amount);
      applyCamera(camera, cameraState, r.width / r.height);
      if (!focus) pinHeroLip(camera, r.width, r.height);
      // turning toward the bookcase and back
      const yaw = turnTarget(now);
      librarian.mesh.rotation.y = reducedQuery.matches
        ? yaw
        : THREE.MathUtils.lerp(librarian.mesh.rotation.y, yaw, 1 - Math.exp(-dt * 6));
      librarian.mesh.updateMatrixWorld(true);
      desk.lamp.rotation.z = reducedQuery.matches ? 0 : Math.sin(now * 0.8) * 0.03;
      const restore = tokoh.update(now, dt, {
        first: firstFrame,
        reduced: reducedQuery.matches,
        camera,
        rect: r,
        mouse,
        finePointer: finePointerQuery.matches,
      });
      const x = Math.round(Math.max(0, r.left));
      const y = Math.round(Math.max(0, innerHeight - r.bottom));
      const width = Math.round(Math.min(innerWidth, r.right)) - x;
      const height = Math.round(Math.min(innerHeight, r.bottom)) - Math.round(Math.max(0, r.top));
      renderer.setScissor(x, y, width, height);
      renderer.setViewport(
        Math.round(r.left),
        Math.round(innerHeight - r.bottom),
        Math.round(r.width),
        Math.round(r.height),
      );
      booksMoving = books.update(now, camera, r);
      // the desk is cleared for the served books (as the till slides away in the shop)
      for (const thing of desk.clutter) thing.visible = !(focus && books.hasVisible);
      placeBook(dt, firstFrame || reducedQuery.matches);
      placeStamp(dt, firstFrame || reducedQuery.matches);
      // the sign shows whole or not at all: on phones the copy lies over it, on narrow tablets it runs off screen
      signEdge.set(desk.sign.position.x + 0.85, desk.sign.position.y, desk.sign.position.z).project(camera);
      desk.sign.visible = !phone && signEdge.x < 1 - 16 / (r.width / 2);
      renderer.render(scene, camera);
      restore();
    }
    const rackVisible = mode === "shop" && rakPass.render(renderer, innerWidth, innerHeight);
    const lip = new THREE.Vector3(camera.position.x, LIP_Y, 0).project(camera);
    const lipY = r.top + (1 - (lip.y + 1) / 2) * r.height;
    const at = (v: THREE.Vector3) => {
      const p = v.clone().project(camera);
      return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
    };
    Object.assign(window, {
      __pustaka: {
        ready: true,
        mode,
        reduced: reducedQuery.matches,
        dpr: lastDpr,
        camera: { pos: camera.position.toArray(), fov: camera.fov },
        stage: { width: r.width, height: r.height },
        lipGap: r.bottom - lipY,
        expectedLipGap: LIP_GAP,
        scale: LIBRARIAN_SCALE,
        buildMs,
        triangles: librarian.triangles,
        renderTriangles: renderer.info.render.triangles,
        drawCalls: renderer.info.render.calls,
        pose: tokoh.pose,
        hit: tokoh.hit,
        head: tokoh.head,
        librarianScreen: tokoh.chestOnScreen(r, camera),
        headScreen: at(tokoh.hitHead.position),
        focus,
        turn: librarian.mesh.rotation.y,
        books: {
          count: books.count,
          visible: books.hasVisible,
          moving: booksMoving,
          scale: books.scale,
          rows: books.rows,
        },
        rackVisible,
        rak: rakPass.stats,
        book: bookBlend,
        stampHeld: stampBlend,
        stampY: desk.stamp.position.y,
        marked: desk.mark.visible,
        nextStamp,
        /** For tools: stamp now (nothing under reduced motion). */
        stamp: stampNow,
        render: draw,
      },
    });
    firstFrame = false;
    lastDraw = timestamp;
    force = false;
  };

  const frame = (timestamp: number) => {
    raf = requestAnimationFrame(frame);
    if (disposed || document.hidden) return;
    const now = timestamp / 1000;
    if (pending && now >= pending.at) {
      const items = pending.items;
      pending = null;
      fetchBooks(items);
    }
    if (now >= nextStamp) {
      nextStamp = now + 9 + Math.random() * 5;
      if (mode === "shop" && !reducedQuery.matches && !tokoh.queued && !tokoh.hit && tokoh.pose === "idle") stampNow();
    }
    const moving =
      force ||
      tokoh.queued ||
      tokoh.hit ||
      booksMoving ||
      pending !== null ||
      Math.abs(librarian.mesh.rotation.y - turnTarget(now)) > 0.002 ||
      mouse.active ||
      librarian.springs?.busy ||
      Math.abs(bookBlend - (tokoh.pose === "idle" ? 1 : 0)) > 0.002 ||
      stampBlend > 0.002;
    if (reducedQuery.matches && !moving) return;
    if (!moving && timestamp - lastDraw < 1000 / 30) return;
    draw(timestamp);
  };

  let resizeTimer: ReturnType<typeof setTimeout> | undefined;
  const onResize = () => {
    force = true;
    draw();
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const phone = innerWidth <= 760;
      books.relayout(prepareLayoutCamera(phone), innerWidth, phone);
      force = true;
      draw();
    }, 250);
  };
  const onScroll = () => {
    force = true;
    draw();
  };
  const onVisibility = () => {
    if (!document.hidden) {
      lastFrame = performance.now();
      force = true;
      draw();
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    mouse = { x: event.clientX, y: event.clientY, active: event.pointerType === "mouse" };
    if ((event.target as Element).closest?.("[data-book-summary]")) {
      cancelHoverClose();
      return;
    }
    if (!finePointerQuery.matches || (event.target as Element).closest?.(EXCLUDED)) {
      root?.classList.remove("librarian-hit", "book-hit");
      closeHoverSoon();
      return;
    }
    const index = bookAt(event.clientX, event.clientY);
    root?.classList.toggle("book-hit", index >= 0);
    root?.classList.toggle(
      "librarian-hit",
      index < 0 && mode === "shop" && tokoh.hits(event.clientX, event.clientY, rect(), camera, raycaster, pointerNdc),
    );
    if (index >= 0) {
      cancelHoverClose();
      if (index !== hoveredBook) {
        hoveredBook = index;
        selectWorldBook(index);
      }
    } else closeHoverSoon();
  };
  const onPointerLeave = () => {
    mouse.active = false;
    root?.classList.remove("librarian-hit", "book-hit");
    closeHoverSoon();
  };
  const onPointerDown = (event: PointerEvent) => {
    if ((event.target as Element).closest?.(EXCLUDED)) return;
    const index = bookAt(event.clientX, event.clientY);
    if (index >= 0) {
      hoveredBook = index;
      cancelHoverClose();
      selectWorldBook(index);
      return;
    }
    if (mode === "tanya" && asking.served) selectWorldBook(null);
    if (mode !== "shop") return;
    if (!tokoh.hits(event.clientX, event.clientY, rect(), camera, raycaster, pointerNdc)) return;
    tokoh.poke(event.clientX, rect(), camera);
    force = true;
  };
  const onMotionChange = () => {
    mouse.active = false;
    tokoh.reset();
    force = true;
    draw();
  };
  const onLost = (event: Event) => {
    event.preventDefault();
    opts.onLost();
  };

  addEventListener("resize", onResize);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("pointermove", onPointerMove, { passive: true });
  addEventListener("pointerdown", onPointerDown);
  addEventListener("blur", onPointerLeave);
  document.documentElement.addEventListener("mouseleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", onMotionChange);
  canvas.addEventListener("webglcontextlost", onLost);

  // the sign in the page's mono font once it has loaded
  void document.fonts?.load(`900 112px ${opts.font}`).then(() => {
    if (disposed) return;
    desk.drawSign(opts.font);
    force = true;
  });

  draw();
  raf = requestAnimationFrame(frame);
  requestAnimationFrame(() => {
    draw();
    canvas.classList.add("is-ready");
    opts.onReady();
  });

  return {
    setMode(value) {
      const previous = mode;
      mode = value;
      focus = value !== "shop";
      if (value === "tanya" && previous !== "tanya") {
        tokoh.act([["wave", 1.3]], reducedQuery.matches);
        root?.classList.remove("librarian-hit");
      }
      if (value === "shop") {
        tokoh.clearQueue();
        asking = { typing: false, focused: false, served: false };
        pending = null;
        turnUntil = 0;
        hoveredBook = -1;
        cancelHoverClose();
        books.clear();
        books.select(null);
      }
      tokoh.setBase(mode === "tanya" && asking.typing && asking.focused && !asking.served ? "ready" : "idle");
      force = true;
    },
    setAsking(state) {
      asking = state;
      tokoh.setBase(mode === "tanya" && state.typing && state.focused && !state.served ? "ready" : "idle");
      force = true;
    },
    search(items, empty) {
      asking = { ...asking, served: true };
      tokoh.setBase("idle");
      hoveredBook = -1;
      books.select(null);
      if (empty && !reducedQuery.matches) {
        // nothing matched: a shrug, then he offers every book on the shelf
        books.clear();
        tokoh.act([["shrug", 1.1]], false);
        pending = { at: performance.now() / 1000 + 1.1, items };
        force = true;
      } else fetchBooks(items);
    },
    askAgain() {
      asking = { ...asking, served: false };
      pending = null;
      hoveredBook = -1;
      cancelHoverClose();
      books.takeBack(reducedQuery.matches);
      books.select(null);
      turnFrom = performance.now() / 1000;
      turnUntil = turnFrom + 0.6;
      tokoh.act([["lift", 0.6]], reducedQuery.matches);
      force = true;
    },
    selectBook(index) {
      books.select(index);
      force = true;
    },
    render() {
      force = true;
      draw();
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelHoverClose();
      if (resizeTimer) clearTimeout(resizeTimer);
      removeEventListener("resize", onResize);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("pointerdown", onPointerDown);
      removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onLost);
      root?.classList.remove("librarian-hit", "book-hit");
      rakPass.dispose();
      books.dispose();
      tokoh.dispose();
      desk.dispose();
      renderer.dispose();
      canvas.remove();
      delete (window as Window & { __pustaka?: unknown }).__pustaka;
    },
  };
}
