// Dev-only turnaround stage for the cast (/?lab=heru): the character on a grey studio floor in the four
// turnaround views (front, three-quarter, side, back), or a close-up (&view=face), or walking past the camera
// (&walk, tahap 4: the gait and the springs, seen from the side). Loaded with import() only
// when ?lab is in the URL, so it never ships to visitors. window.__lab tells tools when the frame is ready.
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CAST } from "./roster";
import { buildMember } from "./member";
import { Walk, walkPose } from "./walk";

export function mountLab(params: URLSearchParams) {
  const name = params.get("lab") || "heru",
    view = params.get("view") || "sheet",
    saver = params.has("hemat");
  const canvasEl = document.createElement("canvas");
  Object.assign(canvasEl.style, { position: "fixed", inset: "0", width: "100%", height: "100%", zIndex: "60" });
  document.body.appendChild(canvasEl);
  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#dcdbe3");
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;
  const key = new THREE.DirectionalLight("#fff6ee", 2.2);
  key.position.set(-3, 6, 7);
  key.castShadow = true;
  key.shadow.mapSize.setScalar(2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 3, bottom: -1, near: 1, far: 20 });
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.02;
  scene.add(key, new THREE.HemisphereLight("#f4f2fa", "#b9b4c4", 0.9));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.ShadowMaterial({ opacity: 0.18 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  // &flat: no floor shadow, so tools can measure silhouettes
  if (!params.has("flat")) scene.add(floor);

  const spec = CAST[name as keyof typeof CAST] ?? CAST.heru,
    build = (o: { saver: boolean }) => buildMember(spec, o);
  const walking = params.has("walk");
  const views = walking ? [0] : view === "sheet" ? [0, -0.5, -Math.PI / 2, Math.PI] : [Number(params.get("rot") ?? 0)];
  const gap = 0.75;
  let triangles = 0;
  let buildMs = 0,
    stages = {};
  const members = views.map((r, i) => {
    const t0 = performance.now();
    const m = build({ saver });
    buildMs = performance.now() - t0;
    stages = m.ms;
    m.mesh.position.x = (i - (views.length - 1) / 2) * gap;
    m.mesh.rotation.y = r;
    scene.add(m.mesh);
    triangles = m.triangles;
    return m;
  });

  const camera = new THREE.PerspectiveCamera(view === "face" ? 14 : 10, 1, 0.1, 100);
  const resize = () => {
    const w = innerWidth,
      h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (view === "face") {
      // framed on this character's face (the warp puts it lower on shorter people)
      const eye = members[0].point([0, 1.55, 0]);
      camera.position.set(0, eye[1] + 0.03, 2.4);
      camera.lookAt(0, eye[1] - 0.03, 0);
    } else {
      // fit the row of figures
      const half = ((views.length - 1) * gap) / 2 + 0.45,
        dist = Math.max(
          1.0 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)),
          half / camera.aspect / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)),
        );
      camera.position.set(0, 0.95, dist);
      camera.lookAt(0, 0.9, 0);
    }
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  addEventListener("resize", resize);
  resize();
  // &walk: back and forth along a straight line, 0.9 m/s, rendered every frame; __lab.walkAt(d) for tools
  let raf = 0;
  const walk = walking
    ? new Walk([new THREE.Vector3(-1.6, 0, 0), new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.6, 0, 0)])
    : null;
  const walkAt = (d: number) => {
    if (!walk) return;
    walkPose(members[0], walk.at(d));
    members[0].springs?.update(1 / 60);
    renderer.render(scene, camera);
  };
  if (walk) {
    camera.position.set(0, 0.95, 13);
    camera.lookAt(0, 0.9, 0);
    walkAt(0);
  }
  // &walk=tool: no loop, tools pose it with __lab.walkAt
  if (walk && params.get("walk") !== "tool") {
    const t0 = performance.now();
    let last = t0;
    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      const t = (ts - t0) / 1000,
        L = walk.length,
        x = (t * 0.9) % (2 * L);
      members[0].springs?.update(Math.min(0.1, (ts - last) / 1000));
      last = ts;
      walkPose(members[0], walk.at(x < L ? x : 2 * L - x));
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);
  }
  const info = {
    triangles,
    calls: renderer.info.render.calls,
    buildMs: Math.round(buildMs),
    stages,
    parts: members[0].partTris,
  };
  Object.assign(window, {
    __lab: {
      ready: true,
      info,
      members,
      render: () => renderer.render(scene, camera),
      png: () => canvasEl.toDataURL("image/png"),
      walkAt,
    },
  });
  return () => {
    cancelAnimationFrame(raf);
    removeEventListener("resize", resize);
    for (const m of members) m.dispose();
    renderer.dispose();
    canvasEl.remove();
  };
}
