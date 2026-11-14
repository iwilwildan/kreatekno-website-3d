import * as THREE from "three";
import { CSS3DObject, CSS3DRenderer, CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import type { CeritaLocale } from "@/content/solusi/cerita/schema";

type CameraTake = {
  look: [number, number, number];
  distance: number;
  yaw: number;
  pitch: number;
  narrow?: { look?: [number, number, number]; distance?: number };
};

type Label = CSS3DSprite | CSS3DObject;
type Refs = ReturnType<typeof buildWorld>;

const TAKES: CameraTake[] = [
  { look: [-6.5, 2.4, 0.1], distance: 10, yaw: 8, pitch: 11 },
  { look: [-6, 2.35, 0.1], distance: 8.3, yaw: 4, pitch: 9 },
  { look: [-1.3, 1.6, -0.2], distance: 8.4, yaw: 0, pitch: 12 },
  {
    look: [2, 1.6, -0.6],
    distance: 8,
    yaw: -4,
    pitch: 12,
    narrow: { look: [2.6, 1.8, -0.6], distance: 6.6 },
  },
  { look: [-4.1, 2.45, -0.1], distance: 9.6, yaw: 8, pitch: 9 },
  {
    look: [3.8, 1.6, 0.9],
    distance: 8.8,
    yaw: -14,
    pitch: 13,
    narrow: { look: [3.7, 1.6, 1.1], distance: 9.6 },
  },
  {
    look: [7.3, 1.8, -0.4],
    distance: 7.4,
    yaw: -10,
    pitch: 10,
    narrow: { look: [7.9, 2, -0.3], distance: 6 },
  },
  { look: [-5.6, 3, 0.4], distance: 13, yaw: 6, pitch: 12 },
  { look: [-0.4, 2, 0.6], distance: 19, yaw: 6, pitch: 28 },
];

const AREA_POSITIONS: Array<[number, number, number]> = [
  [-6.2, 0.02, 0.2],
  [-1.6, 0.02, -0.1],
  [2.5, 0.02, -0.6],
  [3.4, 0.02, 3],
  [6.9, 0.02, -0.4],
];
const AREA_COLORS = [0xe7e1fa, 0xf0e4fd, 0xe2f4e8, 0xfdebdd, 0xe3e6f8];
const CSS_SCALE = 0.0042;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const seg = (value: number, start: number, end: number) => clamp((value - start) / (end - start));
const ease = (value: number) => 1 - (1 - clamp(value)) ** 3;
const pop = (value: number) => {
  const x = clamp(value) - 1;
  return 1 + 2.6 * x ** 3 + 1.6 * x ** 2;
};

function standard(color: number, roughness = 0.72, emissive = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness,
    metalness: 0,
    emissive,
    emissiveIntensity: emissive ? 0.25 : 0,
  });
}

function box(size: [number, number, number], color: number, position: [number, number, number], roughness = 0.72) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), standard(color, roughness));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function figure(color: number, x: number, z: number) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.42, 6, 14), standard(color, 0.6));
  body.position.y = 0.52;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 18, 12), standard(0xc68b59, 0.7));
  head.position.y = 1.04;
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.176, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.48),
    standard(0x1b1b2e),
  );
  hair.position.set(0, 1.08, -0.01);
  group.add(body, head, hair);
  group.position.set(x, 0, z);
  return group;
}

function label(text: string, className: string, scale = 1) {
  const element = document.createElement("div");
  element.className = `story-world ${className}`;
  element.textContent = text;
  element.style.pointerEvents = "none";
  const object = new CSS3DSprite(element);
  object.scale.setScalar(CSS_SCALE * scale);
  return object;
}

function setLabel(labelObject: Label, visible: boolean, opacity = visible ? 1 : 0) {
  labelObject.visible = visible;
  labelObject.element.style.opacity = opacity.toFixed(3);
}

function arc(object: THREE.Object3D, from: THREE.Vector3, to: THREE.Vector3, amount: number, lift: number) {
  object.position.lerpVectors(from, to, amount);
  object.position.y += Math.sin(amount * Math.PI) * lift;
}

function buildWorld(scene: THREE.Scene, story: CeritaLocale) {
  const root = new THREE.Group();
  scene.add(root);
  const floor = box([24, 0.3, 11], 0xf4f1fc, [-0.5, -0.15, 0.8], 0.9);
  floor.castShadow = false;
  root.add(floor, box([24.2, 0.06, 11.2], 0x9f0ed6, [-0.5, -0.3, 0.8]));

  const areaMeshes: THREE.Mesh[] = [];
  const areaLabels: CSS3DSprite[] = [];
  AREA_POSITIONS.forEach((position, index) => {
    const radius = index === 0 ? 2.7 : index === 2 ? 2 : index === 4 ? 1.9 : 1.6;
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.04, 48), standard(AREA_COLORS[index], 0.9));
    pad.position.set(...position);
    pad.castShadow = false;
    pad.userData.areaIndex = index;
    areaMeshes.push(pad);
    const areaLabel = label(story.areas[index].label, "world-area", 1);
    areaLabel.position.set(position[0], 0.28, position[2] + radius * 0.92);
    areaLabels.push(areaLabel);
    root.add(pad, areaLabel);
  });

  const board = new THREE.Group();
  board.add(
    box([3.1, 4.2, 0.12], 0x131951, [0, 2.45, 0], 0.45),
    box([2.92, 4.02, 0.05], 0xf6f4fc, [0, 2.45, 0.08], 0.8),
  );
  board.position.set(-6, 0, -1.3);
  root.add(board);

  const people = [
    figure(0x3b6fe0, -7.5, 0.9),
    figure(0x3b6fe0, -6.3, 1.6),
    figure(0xe0a11b, -5.1, 1.4),
    figure(0xc2307a, -4.2, 0.7),
  ];
  const admin = figure(0x12b5a6, -8.7, 0.02);
  root.add(...people, admin, box([1.3, 0.08, 0.7], 0xe9c49b, [-8.7, 0.72, -0.6]));
  const laptopLid = box([0.7, 0.45, 0.05], 0x8f8a99, [0, 0.22, 0]);
  const laptopHinge = new THREE.Group();
  laptopHinge.position.set(-8.7, 0.78, -0.82);
  laptopHinge.add(laptopLid);
  root.add(laptopHinge);

  const messyPositions = [
    [-7.1, 2.7, 0.3],
    [-5, 3, 0.5],
    [-6.5, 1.9, 0.9],
    [-4.5, 2.1, 0.4],
    [-7.7, 1.6, 0.6],
    [-5.3, 1.3, 1.1],
  ] as const;
  const messyText = [
    "10 dus gelas 220ml, COD",
    "Pak Joko sudah dikirim?",
    "5 galon isi ulang",
    "Bukti transfer",
    "Jadi 12 dus ya",
    "2 dus 1500ml besok",
  ];
  const messages = messyText.map((text, index) => {
    const item = label(text, index % 2 ? "world-bubble is-alt" : "world-bubble", 0.9);
    const [x, y, z] = messyPositions[index];
    item.position.set(x, y, z);
    item.userData.home = messyPositions[index];
    root.add(item);
    return item;
  });
  const count = label("66 order hari ini · semua dibaca manual", "world-pill is-dark", 0.82);
  count.position.set(-6, 4.9, -1.1);
  root.add(count);

  const target = label(story.world.chat, "world-bubble is-focus", 0.88);
  const targetFrom = new THREE.Vector3(-6.3, 1.9, 1.6);
  const targetSlot = new THREE.Vector3(-6, 1.45, -1);
  const robotMouth = new THREE.Vector3(-1.6, 0.95, 0.15);
  root.add(target);

  const robot = new THREE.Group();
  const robotBase = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.7, 0.3, 32), standard(0x2a3277, 0.4));
  robotBase.position.y = 0.15;
  const robotBody = box([1, 1.05, 0.8], 0x9f0ed6, [0, 0.85, 0], 0.45);
  const faceMaterial = standard(0x0b0f3a, 0.3, 0x35eafe);
  const robotFace = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.5, 0.05), faceMaterial);
  robotFace.position.set(0, 0.92, 0.42);
  const antenna = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 12), standard(0x35eafe, 0.4, 0x35eafe));
  antenna.position.set(0, 1.65, 0);
  robot.add(robotBase, robotBody, robotFace, antenna);
  robot.position.set(-1.6, 0, -0.3);
  root.add(robot);
  const parsed = label(story.world.parsed, "world-fields", 0.83);
  parsed.position.set(-0.2, 2.45, 0.05);
  root.add(parsed);
  const fieldBlocks = [0xeadcfd, 0xd6f6fd, 0xffe2ee, 0xfff1c9, 0xfbd9df].map((color, index) => {
    const block = box([1.35, 0.25, 0.46], color, [-0.25, 0.62 + (4 - index) * 0.35, 0.05]);
    root.add(block);
    return block;
  });

  const table = new THREE.Group();
  table.add(box([3.7, 2.7, 0.12], 0xffffff, [0, 1.85, 0], 0.6));
  const tableLines = Array.from({ length: 4 }, (_, index) =>
    box([3.1, 0.12, 0.05], index === 0 ? 0x2e9e5b : 0xdceef1, [0, 2.7 - index * 0.55, 0.09]),
  );
  table.add(...tableLines);
  table.position.set(2.6, 0, -1.3);
  root.add(table);
  const tableText = label(story.world.table, "world-table", 0.83);
  tableText.position.set(2.6, 2.05, -1.05);
  root.add(tableText);
  const status = label("Baru", "world-status is-new", 0.82);
  status.position.set(3.35, 1.5, -1.02);
  root.add(status);

  const reply = label(story.world.reply, "world-bubble is-reply", 0.9);
  const replyFrom = new THREE.Vector3(-1.6, 1.05, 0.15);
  const replySlot = new THREE.Vector3(-5.95, 1.5, -0.98);
  root.add(reply);

  const van = new THREE.Group();
  van.add(box([1.3, 0.75, 0.8], 0xffffff, [-0.2, 0.62, 0], 0.5), box([0.55, 0.6, 0.8], 0xf2742f, [0.68, 0.5, 0], 0.5));
  for (const x of [-0.5, 0.6])
    for (const z of [-0.4, 0.4]) {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 20), standard(0x2d2c33));
      wheel.position.set(x, 0.17, z);
      wheel.rotation.x = Math.PI / 2;
      van.add(wheel);
    }
  van.position.set(4.1, 0, 2.8);
  van.rotation.y = -Math.PI / 2;
  const courier = figure(0xf2742f, 2.7, 3.3);
  root.add(van, courier);
  const courierText = label(story.world.courier, "world-bubble is-courier", 0.82);
  courierText.position.set(3.85, 1.9, 3.6);
  root.add(courierText);

  const home = new THREE.Group();
  home.add(box([1.6, 1.2, 1.2], 0xf6e19a, [0, 0.6, 0], 0.8));
  const roof = new THREE.Mesh(new THREE.ConeGeometry(1.25, 0.7, 4), standard(0x2a3277, 0.6));
  roof.position.y = 1.55;
  roof.rotation.y = Math.PI / 4;
  const windowMaterial = standard(0xbdeff8, 0.3, 0xffd983);
  windowMaterial.emissiveIntensity = 0;
  const homeWindow = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.04), windowMaterial);
  homeWindow.position.set(-0.35, 0.7, 0.62);
  home.add(roof, homeWindow, box([0.3, 0.6, 0.04], 0x9f0ed6, [0.35, 0.3, 0.62]));
  home.position.set(6.3, 0, -0.9);
  root.add(home, figure(0x2a3277, 7.6, -0.2));
  const phone = box([1.36, 2.36, 0.08], 0x0b0f3a, [8.65, 2.2, -0.5], 0.35);
  root.add(phone);
  const recap = label(story.world.recap, "world-recap", 0.9);
  recap.position.set(8.65, 2.2, -0.43);
  root.add(recap);
  const envelope = box([0.5, 0.32, 0.05], 0xffffff, [2.6, 1.8, -1.1]);
  root.add(envelope);
  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.35, 24, 16), standard(0xfff6d8, 0.5, 0xfff6d8));
  moon.position.set(5.2, 4.8, -2.6);
  root.add(moon);

  const metrics = [
    ["3 jam", -3.3, 5.1],
    ["120 order", -3.3, 3.85],
    ["1 pesan", -3.3, 2.6],
  ].map(([text, x, y]) => {
    const metric = label(String(text), "world-metric", 1.3);
    metric.position.set(Number(x), Number(y), 1.7);
    metric.userData.baseY = Number(y);
    root.add(metric);
    return metric;
  });
  return {
    root,
    areaMeshes,
    areaLabels,
    people,
    admin,
    laptopHinge,
    messages,
    count,
    target,
    targetFrom,
    targetSlot,
    robotMouth,
    robot,
    faceMaterial,
    antenna,
    parsed,
    fieldBlocks,
    table,
    tableText,
    status,
    reply,
    replyFrom,
    replySlot,
    van,
    courierText,
    homeWindow,
    phone,
    recap,
    envelope,
    moon,
    metrics,
  };
}

function pose(refs: Refs, scene: THREE.Scene, active: number, elapsed: number, now: number, reduced: boolean) {
  const u = reduced ? 99 : elapsed;
  const later = (index: number) => active > index;
  refs.messages.forEach((message, index) => {
    const visible = active === 0 || (index >= 3 && active < 8);
    setLabel(message, visible);
    if (active === 0) {
      message.position.set(...(message.userData.home as [number, number, number]));
      message.position.y += Math.sin(now * 0.0009 + index) * 0.04;
    }
    if (active > 0 && index >= 3) message.position.set(-6, 3.73 - (index - 3) * 0.62, -1.05);
  });
  setLabel(refs.count, active === 0);

  setLabel(refs.target, active === 1 || active === 2);
  if (active === 1) {
    const amount = ease(seg(u, 0.3, 1.5));
    arc(refs.target, refs.targetFrom, refs.targetSlot, amount, 0.6);
    refs.target.scale.setScalar(CSS_SCALE * 0.88 * (0.5 + amount * 0.5));
  } else if (active === 2) {
    const amount = ease(seg(u, 0.3, 1.5));
    arc(refs.target, refs.targetSlot, refs.robotMouth, amount, 1);
    refs.target.scale.setScalar(CSS_SCALE * 0.88 * (0.9 - amount * 0.72));
  }

  const reading = active === 2 && u >= 1.2;
  refs.faceMaterial.emissiveIntensity = reading ? 0.8 : 0.25;
  (refs.antenna.material as THREE.MeshStandardMaterial).color.setHex(reading ? 0xffd983 : 0x35eafe);
  refs.robot.position.y = reading && !reduced ? Math.abs(Math.sin(now * 0.008)) * 0.03 : 0;
  setLabel(refs.parsed, active === 2 && u >= 1.3);
  refs.fieldBlocks.forEach((block, index) => {
    const inRead = active === 2;
    const inSave = active === 3;
    block.visible = inRead || inSave;
    if (inRead) {
      const amount = pop(seg(u, 1.4 + index * 0.16, 2.1 + index * 0.16));
      block.position.set(-0.25, 0.62 + (4 - index) * 0.35, 0.05);
      block.scale.setScalar(amount);
    } else if (inSave) {
      const amount = ease(seg(u, 0.3 + index * 0.1, 1.3 + index * 0.1));
      const from = new THREE.Vector3(-0.25, 0.62 + (4 - index) * 0.35, 0.05);
      const to = new THREE.Vector3(2.2, 2.174 - index * 0.05, -1.1);
      arc(block, from, to, amount, 0.8);
      block.scale.setScalar(1 - amount * 0.65);
    }
  });

  const tableReady = active >= 3;
  setLabel(refs.tableText, tableReady && (active !== 3 || u >= 1.35));
  setLabel(refs.status, tableReady);
  const sent = active === 5 && u >= 1.15;
  const completed = later(5) || (active === 5 && u >= 2.55);
  refs.status.element.textContent = completed ? "Selesai" : sent ? "Dikirim" : "Baru";
  refs.status.element.className = `story-world world-status ${completed ? "is-done" : sent ? "is-sent" : "is-new"}`;

  setLabel(refs.reply, active >= 4 && active <= 6);
  if (active === 4) arc(refs.reply, refs.replyFrom, refs.replySlot, ease(seg(u, 0.3, 1.5)), 0.9);
  else refs.reply.position.copy(refs.replySlot);

  setLabel(refs.courierText, active === 5, active === 5 ? pop(seg(u, 0.2, 0.7)) : 0);
  refs.van.position.x = active < 5 ? 4.1 : active === 5 ? 4.1 + 1.6 * ease(seg(u, 1.2, 2.4)) : 5.7;

  const night = active === 6 ? ease(seg(u, 0, 1.5)) : 0;
  (scene.background as THREE.Color).lerpColors(new THREE.Color(0xe9e4f8), new THREE.Color(0x3b3f86), night);
  refs.homeWindow.material.emissiveIntensity = night * 1.2;
  refs.moon.visible = night > 0.05;
  const phoneAmount = active < 6 ? 0 : active === 6 ? pop(seg(u, 1.4, 2)) : 1;
  refs.phone.scale.setScalar(phoneAmount);
  setLabel(refs.recap, active >= 6 && phoneAmount > 0.02, phoneAmount);
  refs.recap.scale.setScalar(CSS_SCALE * 0.9 * phoneAmount);
  refs.envelope.visible = active === 6 && u >= 0.4 && u <= 1.6;
  if (refs.envelope.visible)
    arc(
      refs.envelope,
      new THREE.Vector3(2.6, 1.8, -1.1),
      new THREE.Vector3(8.65, 2.2, -0.5),
      ease(seg(u, 0.4, 1.6)),
      1.4,
    );

  const showMetrics = active >= 7;
  refs.metrics.forEach((metric, index) => {
    setLabel(metric, showMetrics, showMetrics ? 1 : 0);
    const amount = active === 7 ? ease(seg(u, 0.3, 1.8)) : 1;
    const values = [3, 120, 1];
    const units = ["jam", "order", "pesan"];
    metric.element.textContent = `${Math.round(values[index] * amount)} ${units[index]}`;
    metric.scale.setScalar(CSS_SCALE * 1.3 * (showMetrics ? pop(seg(u, 0, 0.55)) : 0));
    metric.position.y =
      Number(metric.userData.baseY) + (!reduced && showMetrics ? Math.sin(now * 0.0011 + index) * 0.04 : 0);
  });
  refs.laptopHinge.rotation.x = showMetrics ? 1.45 : -0.15;
}

export function mountOrderGroupStory(
  stage: HTMLElement,
  initialScene: number,
  story: CeritaLocale,
  onFailure: () => void = () => undefined,
) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe9e4f8);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.domElement.className = "story-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  stage.prepend(renderer.domElement);

  const cssRenderer = new CSS3DRenderer();
  cssRenderer.domElement.className = "story-css3d";
  cssRenderer.domElement.setAttribute("aria-hidden", "true");
  stage.append(cssRenderer.domElement);
  const hemisphere = new THREE.HemisphereLight(0xf6f2ff, 0xcfc6ee, 1.55);
  const sun = new THREE.DirectionalLight(0xfff7ee, 2.1);
  sun.position.set(-4, 9, 7);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -11;
  sun.shadow.camera.right = 11;
  sun.shadow.camera.top = 7;
  sun.shadow.camera.bottom = -7;
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.04;
  scene.add(hemisphere, sun);
  const refs = buildWorld(scene, story);

  const look = new THREE.Vector3();
  const targetLook = new THREE.Vector3();
  let distance = 10,
    yaw = 8,
    pitch = 11,
    targetDistance = 10,
    targetYaw = 8,
    targetPitch = 11;
  let active = initialScene,
    sceneStart = performance.now(),
    disposed = false,
    visible = true,
    first = true;
  let frameId = 0,
    last = performance.now(),
    oldWidth = 0,
    oldHeight = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  const resize = () => {
    const width = Math.max(1, stage.clientWidth),
      height = Math.max(1, stage.clientHeight);
    if (width === oldWidth && height === oldHeight) return;
    oldWidth = width;
    oldHeight = height;
    renderer.setSize(width, height, false);
    cssRenderer.setSize(width, height);
    camera.aspect = width / height;
    const narrow = matchMedia("(max-width: 759px), (max-width: 1023px) and (orientation: portrait)").matches;
    if (narrow) camera.setViewOffset(width, height, 0, -34, width, height);
    else {
      const cardRight = document.querySelector<HTMLElement>(".story-card")?.getBoundingClientRect().right ?? 402;
      const shiftX = (cardRight + width - 70) / 2 - width / 2;
      camera.setViewOffset(width, height, -shiftX, 0, width, height);
    }
    camera.updateProjectionMatrix();
  };

  const setScene = (index: number) => {
    active = Math.max(0, Math.min(TAKES.length - 1, index));
    sceneStart = performance.now();
    const take = TAKES[active];
    const narrow = matchMedia("(max-width: 759px), (max-width: 1023px) and (orientation: portrait)").matches;
    targetLook.set(...(narrow && take.narrow?.look ? take.narrow.look : take.look));
    targetDistance = narrow && take.narrow?.distance ? take.narrow.distance : take.distance;
    targetYaw = take.yaw;
    targetPitch = take.pitch;
    if (!frameId && visible) frameId = requestAnimationFrame(render);
  };

  const render = (now: number) => {
    frameId = 0;
    if (disposed || !visible) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    resize();
    const k = first || reduced.matches ? 1 : 1 - Math.exp(-2.2 * dt);
    look.lerp(targetLook, k);
    distance = THREE.MathUtils.lerp(distance, targetDistance, k);
    yaw = THREE.MathUtils.lerp(yaw, targetYaw, k);
    pitch = THREE.MathUtils.lerp(pitch, targetPitch, k);
    const yr = THREE.MathUtils.degToRad(yaw),
      pr = THREE.MathUtils.degToRad(pitch);
    camera.position.set(
      look.x + Math.sin(yr) * Math.cos(pr) * distance,
      look.y + Math.sin(pr) * distance,
      look.z + Math.cos(yr) * Math.cos(pr) * distance,
    );
    camera.lookAt(look);
    pose(refs, scene, active, (now - sceneStart) / 1000, now, reduced.matches);
    hemisphere.intensity = active === 6 ? 0.8 : 1.55;
    sun.intensity = active === 6 ? 0.6 : 2.1;
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
    stage.dataset.drawCalls = String(renderer.info.render.calls);
    stage.dataset.triangles = String(renderer.info.render.triangles);
    first = false;
    frameId = requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible && !frameId) {
        last = performance.now();
        frameId = requestAnimationFrame(render);
      } else if (!visible && frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    },
    { rootMargin: "200px 0px" },
  );
  observer.observe(stage);
  const onVisibility = () => {
    visible = !document.hidden;
    if (visible && !frameId) frameId = requestAnimationFrame(render);
  };
  document.addEventListener("visibilitychange", onVisibility);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const tooltip = document.createElement("div");
  tooltip.className = "story-tooltip";
  stage.append(tooltip);
  let hovered = -1;
  let pointerDown: [number, number] | null = null;
  const hit = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(refs.areaMeshes, false)[0]?.object.userData.areaIndex ?? -1;
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    hovered = hit(event);
    refs.areaMeshes.forEach((area, index) => {
      area.position.y = index === hovered ? 0.05 : 0.02;
    });
    renderer.domElement.style.cursor = hovered >= 0 ? "pointer" : "";
    tooltip.hidden = hovered < 0;
    if (hovered >= 0) {
      tooltip.textContent = story.areas[hovered].label;
      tooltip.style.left = `${Math.min(event.clientX + 14, innerWidth - 220)}px`;
      tooltip.style.top = `${event.clientY - 40}px`;
    }
  };
  const onPointerLeave = () => {
    hovered = -1;
    tooltip.hidden = true;
    renderer.domElement.style.cursor = "";
  };
  const onPointerDown = (event: PointerEvent) => {
    pointerDown = [event.clientX, event.clientY];
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!pointerDown || Math.hypot(event.clientX - pointerDown[0], event.clientY - pointerDown[1]) > 8) return;
    const area = hit(event);
    if (area >= 0) document.querySelectorAll<HTMLButtonElement>(".story-rail button")[story.areas[area].scene]?.click();
  };
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  const onContextLost = (event: Event) => {
    event.preventDefault();
    if (disposed) return;
    visible = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    onFailure();
  };
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);

  setScene(initialScene);
  return {
    setScene,
    dispose() {
      disposed = true;
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => item.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      cssRenderer.domElement.remove();
      tooltip.remove();
    },
  };
}
