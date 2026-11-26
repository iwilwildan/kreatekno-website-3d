import * as THREE from "three";
import { HERU_KASIR_SPEC } from "../cast/heruKasir";
import { buildMember } from "../cast/member";
import { type KasirPoseName, KASIR_POSES } from "../cast/kasirPose";
import { applyPose } from "../cast/poses";
import { buildToko } from "../sets/toko";
import { createTokoh } from "../meja/tokoh";
import { buildFlyingCard } from "./kartu3d";
import {
  applyCamera,
  focusCameraTarget,
  heroCameraTarget,
  LIP_GAP,
  LIP_Y,
  pinHeroLip,
  servedPhoneCameraTarget,
} from "../meja/kamera";
import { buildSearchBoxes, type SearchBoxInput } from "./kotak";
import { buildRakPass } from "../meja/rak";

export type SolusiMode = "shop" | "cari" | "kartu";
export type SolusiWorld = {
  setMode: (mode: SolusiMode) => void;
  setSearchState: (state: { typing: boolean; focused: boolean; served: boolean }) => void;
  search: (items: SearchBoxInput[]) => void;
  setSearchItems: (items: SearchBoxInput[]) => void;
  searchAgain: () => void;
  selectBox: (index: number | null) => void;
  cards: (action: "begin" | "yes" | "offer") => void;
  render: () => void;
  dispose: () => void;
};

type CameraTarget = ReturnType<typeof heroCameraTarget>;

const CASHIER_SCALE = 1.77;
const CASHIER_AT = new THREE.Vector3(1.95, -0.47, -2.85);
const EXCLUDED =
  "button,a,input,select,textarea,.toko-copy,.focus-heading,.receipt,.result-bar,.search-results,.deck-area,.solusi-nav,[data-box-summary]";

/** Shared S4/S5 shop renderer with orthographic catalogue and served-object passes. */
export function mountSolusiWorld(stage: HTMLElement, onReady: () => void): SolusiWorld {
  const canvas = document.createElement("canvas");
  canvas.className = "solusi-gl";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setScissorTest(true);
  renderer.shadowMap.enabled = false;
  renderer.info.autoReset = false;

  const scene = new THREE.Scene();
  const shop = buildToko();
  const rakPass = buildRakPass();
  const searchBoxes = buildSearchBoxes(scene);
  const flyingCard = buildFlyingCard(scene);
  scene.add(shop.group);
  scene.add(new THREE.HemisphereLight("#ffffff", "#b9b2dc", 1.7));
  const key = new THREE.DirectionalLight("#ffffff", 1.5);
  key.position.set(-3, 6, 5);
  const fill = new THREE.DirectionalLight("#c9f6ff", 0.5);
  fill.position.set(4, 2, 3);
  scene.add(key, fill);

  const cashier = buildMember(HERU_KASIR_SPEC);
  cashier.mesh.scale.setScalar(CASHIER_SCALE);
  cashier.mesh.position.copy(CASHIER_AT);
  applyPose(cashier, KASIR_POSES.idle);
  scene.add(cashier.mesh);

  const tokoh = createTokoh<KasirPoseName>(cashier, KASIR_POSES, CASHIER_SCALE, "idle");
  const { hitHead, hitChest } = tokoh;
  hitHead.name = "kasir-hit-head";
  hitChest.name = "kasir-hit-chest";
  scene.add(hitHead, hitChest);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const layoutCamera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointerQuery = matchMedia("(hover: hover) and (pointer: fine)");
  const root = stage.closest<HTMLElement>(".solusi-page");

  let mode: SolusiMode = "shop";
  let searchState = { typing: false, focused: false, served: false };
  let mouse = { x: 0, y: 0, active: false };
  let focus = false;
  let disposed = false;
  const measuredHeroHeight = stage.getBoundingClientRect().height;
  const fallbackHeroHeight =
    innerWidth <= 760 ? Math.max(680, innerHeight) : Math.min(800, Math.max(600, innerHeight * 0.88));
  let heroHeight = measuredHeroHeight || fallbackHeroHeight;
  let lastDpr = 0;
  let lastFrame = performance.now();
  let lastDraw = 0;
  let raf = 0;
  let force = true;
  let firstFrame = true;
  let fps = 0;
  let fpsFrames = 0;
  let fpsStarted = performance.now();
  let boxesMoving = false;
  let hoveredBox = -1;
  let hoverCloseTimer: ReturnType<typeof setTimeout> | undefined;
  let resizeTimer: ReturnType<typeof setTimeout> | undefined;

  const initial = heroCameraTarget(heroHeight, innerWidth <= 760);
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

  const currentRect = () =>
    focus
      ? { left: 0, top: 0, right: innerWidth, bottom: innerHeight, width: innerWidth, height: innerHeight }
      : stage.getBoundingClientRect();

  const prepareLayoutCamera = (phone = innerWidth <= 760) => {
    const target = phone ? servedPhoneCameraTarget() : focusCameraTarget(false);
    applyCamera(layoutCamera, target, innerWidth / innerHeight);
    layoutCamera.updateMatrixWorld(true);
    return layoutCamera;
  };

  const act = (items: Array<[KasirPoseName, number]>) => {
    tokoh.act(items, reducedQuery.matches);
    force = true;
  };

  const setBaseFromSearch = () => {
    tokoh.setBase(mode === "cari" && searchState.typing && searchState.focused ? "ready" : "idle");
    force = true;
  };

  const updateCamera = (target: CameraTarget, dt: number) => {
    const amount = firstFrame || reducedQuery.matches ? 1 : 1 - Math.exp(-dt * 3.4);
    cameraState.pos.lerp(target.pos, amount);
    cameraState.look.lerp(target.look, amount);
    cameraState.fov = THREE.MathUtils.lerp(cameraState.fov, target.fov, amount);
    applyCamera(camera, cameraState, camera.aspect);
    return (
      cameraState.pos.distanceToSquared(target.pos) > 1e-7 ||
      cameraState.look.distanceToSquared(target.look) > 1e-7 ||
      Math.abs(cameraState.fov - target.fov) > 1e-4
    );
  };

  const updateRegister = (phone: boolean, dt: number) => {
    let target = 0.55;
    if (mode === "cari" && (phone || searchState.served)) target = -4;
    else if (mode === "cari") {
      const receipt = document.querySelector<HTMLElement>(".receipt");
      if (receipt) {
        const rect = receipt.getBoundingClientRect();
        pointerNdc.set(((rect.left + rect.width * 0.42) / innerWidth) * 2 - 1, 0);
        raycaster.setFromCamera(pointerNdc, camera);
        const point = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), 2.02), point)) target = point.x;
      }
    }
    const amount = reducedQuery.matches ? 1 : 1 - Math.exp(-dt * 4);
    shop.register.position.x = THREE.MathUtils.lerp(shop.register.position.x, target, amount);
  };

  const rayHitsCashier = (x: number, y: number, rect = currentRect()) =>
    tokoh.hits(x, y, rect, camera, raycaster, pointerNdc);

  const updateCharacter = (now: number, dt: number) => {
    // the hanging lamp sways a little (held still under reduced motion)
    shop.lamp.rotation.z = reducedQuery.matches ? 0 : Math.sin(now * 0.8) * 0.03;
    return tokoh.update(now, dt, {
      first: firstFrame,
      reduced: reducedQuery.matches,
      camera,
      rect: currentRect(),
      mouse,
      finePointer: finePointerQuery.matches,
    });
  };

  const draw = (timestamp = performance.now()) => {
    if (disposed || document.hidden) return;
    const now = timestamp / 1000;
    const dt = Math.min(0.05, Math.max(0, (timestamp - lastFrame) / 1000));
    lastFrame = timestamp;
    const { phone } = size();
    const rect = currentRect();
    if (!focus) heroHeight = rect.height;

    renderer.setScissor(0, 0, innerWidth, innerHeight);
    renderer.setViewport(0, 0, innerWidth, innerHeight);
    renderer.clear(true, true, true);
    renderer.info.reset();
    const shopVisible = rect.bottom > 0 && rect.top < innerHeight && rect.width > 0 && rect.height > 0;
    if (!shopVisible) {
      root?.classList.remove("cashier-hit");
    }

    if (shopVisible) {
      const target = focus
        ? phone && mode === "cari" && searchBoxes.hasVisible
          ? servedPhoneCameraTarget()
          : focusCameraTarget(phone)
        : heroCameraTarget(heroHeight, phone);
      camera.aspect = rect.width / rect.height;
      updateCamera(target, dt);
      if (!focus) pinHeroLip(camera, rect.width, rect.height);
      updateRegister(phone, dt);
      const restoreCharacter = updateCharacter(now, dt);
      boxesMoving = searchBoxes.update(now, camera, rect);
      flyingCard.update(now, phone);

      // The viewport keeps the stage's whole size, even where it has scrolled off screen, so the picture keeps the
      // camera's aspect; the scissor alone trims it to the part on screen (it used to squash into that part).
      const x = Math.round(Math.max(0, rect.left));
      const y = Math.round(Math.max(0, innerHeight - rect.bottom));
      const width = Math.round(Math.min(innerWidth, rect.right)) - x;
      const height = Math.round(Math.min(innerHeight, rect.bottom)) - Math.round(Math.max(0, rect.top));
      renderer.setScissor(x, y, width, height);
      renderer.setViewport(
        Math.round(rect.left),
        Math.round(innerHeight - rect.bottom),
        Math.round(rect.width),
        Math.round(rect.height),
      );
      renderer.render(scene, camera);
      restoreCharacter();
    } else {
      boxesMoving = false;
    }
    const rackVisible = mode === "shop" && rakPass.render(renderer, innerWidth, innerHeight);

    const lip = new THREE.Vector3(camera.position.x, LIP_Y, 0).project(camera);
    const lipY = rect.top + (1 - (lip.y + 1) / 2) * rect.height;
    const cashierScreen = tokoh.chestOnScreen(rect, camera);
    fpsFrames += 1;
    if (timestamp - fpsStarted >= 1000) {
      fps = (fpsFrames * 1000) / (timestamp - fpsStarted);
      fpsFrames = 0;
      fpsStarted = timestamp;
    }
    Object.assign(window, {
      __solusi: {
        ready: true,
        focus,
        mode,
        reduced: reducedQuery.matches,
        dpr: lastDpr,
        camera: { pos: camera.position.toArray(), fov: camera.fov },
        stage: { width: rect.width, height: rect.height },
        lipGap: rect.bottom - lipY,
        expectedLipGap: LIP_GAP,
        cashierScale: CASHIER_SCALE,
        triangles: cashier.triangles,
        renderTriangles: renderer.info.render.triangles,
        drawCalls: renderer.info.render.calls,
        pose: tokoh.pose,
        hit: tokoh.hit,
        cashierScreen,
        head: tokoh.head,
        registerX: shop.register.position.x,
        lampAngle: shop.lamp.rotation.z,
        boxes: {
          count: searchBoxes.count,
          visible: searchBoxes.hasVisible,
          moving: boxesMoving,
          scale: searchBoxes.scale,
          rows: searchBoxes.rows,
        },
        rackVisible,
        rak: rakPass.stats,
        cardFlying: flyingCard.active,
        fps,
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
    const moving =
      force ||
      tokoh.queued ||
      tokoh.hit ||
      boxesMoving ||
      flyingCard.active ||
      mouse.active ||
      cashier.springs?.busy ||
      Math.abs(shop.register.position.x - (mode === "cari" && (innerWidth <= 760 || searchState.served) ? -4 : 0.55)) >
        0.002;
    if (reducedQuery.matches && !moving) return;
    if (!moving && timestamp - lastDraw < 1000 / 30) return;
    draw(timestamp);
  };

  const selectWorldBox = (index: number | null) => {
    searchBoxes.select(index);
    window.dispatchEvent(new CustomEvent("solusi-box-select", { detail: index }));
    force = true;
  };
  const cancelHoverClose = () => {
    if (hoverCloseTimer) clearTimeout(hoverCloseTimer);
    hoverCloseTimer = undefined;
  };
  const closeHoverSoon = () => {
    if (hoveredBox < 0 || hoverCloseTimer) return;
    hoverCloseTimer = setTimeout(() => {
      hoveredBox = -1;
      selectWorldBox(null);
      hoverCloseTimer = undefined;
    }, 240);
  };
  const onResize = () => {
    force = true;
    draw();
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const phone = innerWidth <= 760;
      searchBoxes.relayout(prepareLayoutCamera(phone), innerWidth, phone);
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
    if ((event.target as Element).closest?.("[data-box-summary]")) {
      cancelHoverClose();
      return;
    }
    if (!finePointerQuery.matches || (event.target as Element).closest?.(EXCLUDED)) {
      root?.classList.remove("cashier-hit", "box-hit");
      closeHoverSoon();
      return;
    }
    const cashierHovered = rayHitsCashier(event.clientX, event.clientY);
    const boxIndex = mode === "cari" && searchState.served ? searchBoxes.hit(raycaster) : -1;
    const boxHovered = boxIndex >= 0;
    root?.classList.toggle("cashier-hit", cashierHovered && !boxHovered);
    root?.classList.toggle("box-hit", boxHovered);
    if (boxHovered) {
      cancelHoverClose();
      if (boxIndex !== hoveredBox) {
        hoveredBox = boxIndex;
        selectWorldBox(boxIndex);
      }
    } else closeHoverSoon();
  };
  const onPointerLeave = () => {
    mouse.active = false;
    root?.classList.remove("cashier-hit", "box-hit");
    closeHoverSoon();
  };
  const onPointerDown = (event: PointerEvent) => {
    if ((event.target as Element).closest?.(EXCLUDED)) return;
    const cashierClicked = rayHitsCashier(event.clientX, event.clientY);
    const boxIndex = mode === "cari" && searchState.served ? searchBoxes.hit(raycaster) : -1;
    if (boxIndex >= 0) {
      hoveredBox = boxIndex;
      cancelHoverClose();
      selectWorldBox(boxIndex);
      return;
    }
    if (mode === "cari" && searchState.served) selectWorldBox(null);
    if (!cashierClicked) return;
    tokoh.poke(event.clientX, currentRect(), camera);
    force = true;
  };
  const onMotionChange = () => {
    mouse.active = false;
    tokoh.reset();
    force = true;
    draw();
  };

  addEventListener("resize", onResize);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("pointermove", onPointerMove, { passive: true });
  addEventListener("pointerdown", onPointerDown);
  addEventListener("blur", onPointerLeave);
  document.documentElement.addEventListener("mouseleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  reducedQuery.addEventListener("change", onMotionChange);

  draw();
  raf = requestAnimationFrame(frame);
  requestAnimationFrame(() => {
    draw();
    canvas.classList.add("is-ready");
    onReady();
  });

  return {
    setMode(value) {
      const previous = mode;
      mode = value;
      focus = value !== "shop";
      if (value === "cari" && previous !== "cari") act([["wave", 1.3]]);
      if (value === "shop") {
        searchState = { typing: false, focused: false, served: false };
        tokoh.clearQueue();
      }
      if (value !== "cari") {
        hoveredBox = -1;
        cancelHoverClose();
        searchBoxes.clear();
        searchBoxes.select(null);
      }
      setBaseFromSearch();
      force = true;
    },
    setSearchState(state) {
      searchState = state;
      setBaseFromSearch();
    },
    search(items) {
      searchState.served = true;
      tokoh.setBase("idle");
      const phone = innerWidth <= 760;
      searchBoxes.setItems(items, prepareLayoutCamera(phone), innerWidth, phone, true, reducedQuery.matches);
      act(
        items.length > 0
          ? [
              ["ready", 0.38],
              ["lift", 0.26 + Math.min(6, items.length) * 0.16],
            ]
          : [["shrug", 1.1]],
      );
      force = true;
    },
    setSearchItems(items) {
      const phone = innerWidth <= 760;
      searchBoxes.setItems(items, prepareLayoutCamera(phone), innerWidth, phone, false, reducedQuery.matches);
      searchBoxes.select(null);
      force = true;
    },
    searchAgain() {
      searchState.served = false;
      hoveredBox = -1;
      cancelHoverClose();
      searchBoxes.takeBack(reducedQuery.matches);
      searchBoxes.select(null);
      act([["lift", 0.52]]);
      force = true;
    },
    selectBox(index) {
      searchBoxes.select(index);
      force = true;
    },
    cards(action) {
      if (action === "begin" || action === "offer") flyingCard.deal(reducedQuery.matches);
      if (action === "yes") act([["nod", 1.1]]);
      else
        act([
          ["ready", 0.36],
          ["offer", 0.7],
        ]);
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
      root?.classList.remove("cashier-hit", "box-hit");
      rakPass.dispose();
      searchBoxes.dispose();
      flyingCard.dispose();
      tokoh.dispose();
      shop.dispose();
      renderer.dispose();
      canvas.remove();
      delete (window as Window & { __solusi?: unknown }).__solusi;
    },
  };
}
