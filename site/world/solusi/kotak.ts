import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { STATUS } from "@/content/solusi/taksonomi";

export type SearchBoxInput = { id: string; color: string; status: keyof typeof STATUS };
type BoxState = {
  group: THREE.Group;
  body: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  badge: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  position: THREE.Vector3;
  from: THREE.Vector3;
  to: THREE.Vector3;
  scale: number;
  start: number;
  duration: number;
  returning: boolean;
  visible: boolean;
};

// v1 13 Nov: same proportions as the shelf boxes (216 x 305 x 64 px). Site z = v1 z - 1.9.
export const BOX = { w: 0.5, h: 0.706, d: 0.148 };
const GAP = 0.09;
const COUNTER_Y = 1.06;
// Phones (decision 17, 13 Nov): two rows from four results; the back row sits half a step aside.
const PHONE_BACK_LIFT = 0;
const START = new THREE.Vector3(1.95, 0.45, -2.25);
const RETURN = new THREE.Vector3(1.95, 0.5, -2.3);
const easeInOut = (value: number) => (value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2);

/**
 * Status badge (white pill, coloured dot, label) drawn once per status on a canvas, at twice the v1
 * resolution (512 x 112) so it stays sharp on dense screens; redrawn once the web font is ready.
 */
function badgeTexture(label: string, dot: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 112;
  const g = c.getContext("2d");
  const texture = new THREE.CanvasTexture(c);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  const family =
    getComputedStyle(document.body).getPropertyValue("--font-jakarta").trim() || '"Plus Jakarta Sans", system-ui';
  const draw = () => {
    if (!g) return;
    g.clearRect(0, 0, 512, 112);
    g.fillStyle = "#fff";
    g.beginPath();
    g.roundRect(0, 0, 512, 112, 56);
    g.fill();
    g.fillStyle = dot;
    g.beginPath();
    g.arc(60, 56, 18, 0, Math.PI * 2);
    g.fill();
    // v1 draws 26 px on a 256 px pill; shrink only if a label would not fit the pill
    let size = 52;
    g.font = "700 " + size + "px " + family;
    const room = 512 - 100 - 24;
    if (g.measureText(label).width > room) {
      size = Math.floor((size * room) / g.measureText(label).width);
      g.font = "700 " + size + "px " + family;
    }
    g.fillStyle = "#131951";
    g.textBaseline = "middle";
    g.fillText(label, 100, 60);
    texture.needsUpdate = true;
  };
  draw();
  document.fonts?.load("700 52px " + family).then(draw, () => {});
  return texture;
}

export function buildSearchBoxes(scene: THREE.Scene) {
  const geometry = new RoundedBoxGeometry(BOX.w, BOX.h, BOX.d, 3, 0.014);
  const locale = document.documentElement.lang.startsWith("en") ? "en" : "id";
  const badgeTextures = {
    jalan: badgeTexture(STATUS.jalan[locale], "#06606C"),
    ide: badgeTexture(STATUS.ide[locale], "#5B1BB5"),
  };
  const badgeMaterials = {
    jalan: new THREE.MeshBasicMaterial({ map: badgeTextures.jalan, transparent: true }),
    ide: new THREE.MeshBasicMaterial({ map: badgeTextures.ide, transparent: true }),
  };
  const badgeW = BOX.w * 0.5;
  const badgeH = (badgeW * 56) / 256;
  const badgeGeometry = new THREE.PlaneGeometry(badgeW, badgeH);
  const states: BoxState[] = [];
  for (let index = 0; index < 6; index += 1) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: "#ad96dd", roughness: 0.6, metalness: 0 });
    const body = new THREE.Mesh(geometry, material);
    const badge = new THREE.Mesh(badgeGeometry, badgeMaterials.jalan);
    badge.position.set(-BOX.w / 2 + 0.037 + badgeW / 2, BOX.h / 2 - 0.037 - badgeH / 2, BOX.d / 2 + 0.002);
    group.add(body, badge);
    group.visible = false;
    group.userData.boxIndex = index;
    scene.add(group);
    states.push({
      group,
      body,
      badge,
      position: START.clone(),
      from: START.clone(),
      to: START.clone(),
      scale: 1,
      start: 0,
      duration: 0.56,
      returning: false,
      visible: false,
    });
  }

  let inputs: SearchBoxInput[] = [];
  let selected: number | null = null;
  let settleUntil = 0;

  const worldXAt = (camera: THREE.PerspectiveCamera, screenX: number, width: number, z: number) => {
    const ray = new THREE.Raycaster();
    const counterY = new THREE.Vector3(camera.position.x, 1.06, z).project(camera).y;
    ray.setFromCamera(new THREE.Vector2((screenX / width) * 2 - 1, counterY), camera);
    return ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 0, 1), -z), new THREE.Vector3())?.x ?? 0;
  };

  const layout = (camera: THREE.PerspectiveCamera, width: number, phone: boolean) => {
    const count = inputs.length;
    if (!count) return [];
    // v1 13 Nov: always one row. Phones keep two rows from four results (decision 17).
    const rows = phone && count > 3 ? 2 : 1;
    const perRow = Math.ceil(count / rows);
    const zFront = phone ? -1.45 : -0.95;
    const zBack = phone ? -2.2 : -1.8;
    const xL = worldXAt(camera, phone ? 22 : width * 0.1, width, zFront);
    const xR = worldXAt(camera, phone ? width - 22 : width * 0.9, width, zFront);
    const step1 = BOX.w + GAP;
    const need = perRow * BOX.w + (perRow - 1) * GAP + (rows > 1 ? step1 / 2 : 0);
    const boxScale = THREE.MathUtils.clamp((xR - xL) / need, 0.3, phone ? 0.72 : 0.9);
    const step = step1 * boxScale;
    const center = (xL + xR) / 2;
    const rowWidth = (perRow - 1) * step + (rows > 1 ? step / 2 : 0);
    return inputs.map((_, index) => {
      const row = index < perRow ? 0 : 1;
      const column = row ? index - perRow : index;
      return {
        position: new THREE.Vector3(
          center - rowWidth / 2 + column * step + (row ? step / 2 : 0),
          COUNTER_Y + (BOX.h * boxScale) / 2 + (row ? PHONE_BACK_LIFT * boxScale : 0),
          row ? zBack : zFront,
        ),
        scale: boxScale,
      };
    });
  };

  const setItems = (
    items: SearchBoxInput[],
    camera: THREE.PerspectiveCamera,
    width: number,
    phone: boolean,
    animate: boolean,
    reduced: boolean,
  ) => {
    inputs = items.slice(0, 6);
    selected = null;
    const targets = layout(camera, width, phone);
    const now = performance.now() / 1000;
    settleUntil = now + 0.16;
    states.forEach((state, index) => {
      const target = targets[index];
      if (!target) {
        state.group.visible = false;
        state.visible = false;
        return;
      }
      state.body.material.color.set(inputs[index].color);
      state.badge.material = badgeMaterials[inputs[index].status] ?? badgeMaterials.jalan;
      state.from.copy(animate && !reduced ? START : target.position);
      state.position.copy(state.from);
      state.to.copy(target.position);
      state.scale = target.scale;
      state.start = now + (animate && !reduced ? 0.42 + index * 0.15 : 0);
      state.duration = reduced ? 0.001 : 0.56;
      state.returning = false;
      state.visible = true;
      state.group.visible = true;
    });
  };

  const takeBack = (reduced: boolean) => {
    const now = performance.now() / 1000;
    selected = null;
    states.forEach((state) => {
      if (!state.visible) return;
      state.from.copy(state.position);
      state.to.copy(RETURN);
      state.start = now;
      state.duration = reduced ? 0.001 : 0.46;
      state.returning = true;
    });
  };

  const relayout = (camera: THREE.PerspectiveCamera, width: number, phone: boolean) => {
    const targets = layout(camera, width, phone);
    settleUntil = performance.now() / 1000 + 0.16;
    states.forEach((state, index) => {
      const target = targets[index];
      if (!target || !state.visible || state.returning) return;
      state.position.copy(target.position);
      state.from.copy(target.position);
      state.to.copy(target.position);
      state.scale = target.scale;
      state.start = performance.now() / 1000;
      state.duration = 0.001;
    });
  };

  const update = (
    now: number,
    camera: THREE.PerspectiveCamera,
    rect: DOMRect | { left: number; top: number; width: number; height: number },
  ) => {
    const tags = document.querySelectorAll<HTMLElement>("[data-box-tag]");
    let moving = false;
    states.forEach((state, index) => {
      const tag = tags[index];
      if (!state.visible) {
        if (tag) tag.hidden = true;
        return;
      }
      const raw = THREE.MathUtils.clamp((now - state.start) / state.duration, 0, 1);
      const eased = state.returning ? easeInOut(raw) : easeInOut(raw);
      state.position.lerpVectors(state.from, state.to, eased);
      if (raw > 0 && raw < 1) state.position.y += Math.sin(Math.PI * raw) * (state.returning ? 0.35 : 0.55);
      state.group.position.copy(state.position);
      state.group.scale.setScalar(state.scale);
      state.group.rotation.y = index % 2 === 0 ? 0.12 : -0.12;
      if (raw < 1) moving = true;
      if (state.returning && raw >= 1) {
        state.visible = false;
        state.group.visible = false;
        if (tag) tag.hidden = true;
        return;
      }
      if (tag) {
        const point = new THREE.Vector3(
          state.position.x,
          state.position.y + (BOX.h * state.scale) / 2 + 0.16,
          state.position.z,
        ).project(camera);
        tag.hidden = state.position.y <= COUNTER_Y + BOX.h * state.scale * 0.3;
        tag.style.left = `${rect.left + ((point.x + 1) / 2) * rect.width}px`;
        tag.style.top = `${rect.top + ((1 - point.y) / 2) * rect.height}px`;
      }
    });

    const summary = document.querySelector<HTMLElement>("[data-box-summary]");
    if (summary && selected != null && states[selected]?.visible) {
      const state = states[selected];
      const point = new THREE.Vector3(
        state.position.x,
        state.position.y + (BOX.h * state.scale) / 2 + 0.02,
        state.position.z,
      ).project(camera);
      // v1 placeSum: keep the card 16 px inside the stage; the arrow still points at the box (--ax)
      const boxX = rect.left + ((point.x + 1) / 2) * rect.width;
      const half = (summary.offsetWidth || 340) / 2;
      const x = Math.max(rect.left + 16 + half, Math.min(rect.left + rect.width - 16 - half, boxX));
      summary.style.setProperty("--box-x", `${x}px`);
      summary.style.setProperty("--ax", `${boxX - x}px`);
      summary.style.setProperty("--box-y", `${rect.top + ((1 - point.y) / 2) * rect.height - 30}px`);
    }
    return moving || now < settleUntil;
  };

  const hit = (raycaster: THREE.Raycaster) => {
    const visible = states.filter((state) => state.visible).map((state) => state.body);
    const match = raycaster.intersectObjects(visible, false)[0]?.object;
    return match ? states.findIndex((state) => state.body === match) : -1;
  };

  return {
    setItems,
    takeBack,
    relayout,
    update,
    hit,
    clear() {
      inputs = [];
      selected = null;
      for (const state of states) {
        state.visible = false;
        state.group.visible = false;
      }
      document.querySelectorAll<HTMLElement>("[data-box-tag]").forEach((tag) => (tag.hidden = true));
    },
    select(index: number | null) {
      selected = index;
    },
    get hasVisible() {
      return states.some((state) => state.visible);
    },
    get count() {
      return inputs.length;
    },
    /** QA: scale and screen-space layout of the boxes on the counter (`window.__solusi.boxes`). */
    get scale() {
      return states.find((state) => state.visible)?.scale ?? 0;
    },
    get rows() {
      return new Set(states.filter((state) => state.visible).map((state) => state.position.z)).size;
    },
    dispose() {
      geometry.dispose();
      badgeGeometry.dispose();
      for (const m of Object.values(badgeMaterials)) m.dispose();
      for (const t of Object.values(badgeTextures)) t.dispose();
      for (const state of states) state.body.material.dispose();
    },
  };
}
