// Objects served on the desk, shared by the Solutions shop (boxes from under the counter, solusi/kotak.ts) and the
// Articles library (books from the wall bookcase, Pustaka P4): layout in one row (phones: two rows from four),
// the hop from where they come from to their spot, the way back, the number tags and the summary card that follow
// them on screen, and the raycast for hover and touch. What an object looks like comes from `make`.
import * as THREE from "three";

export type DeskObject<I> = {
  group: THREE.Group;
  /** What the pointer hits. */
  body: THREE.Mesh;
  /** Dresses the object for one result. */
  set: (input: I) => void;
};

export type DeskOptions<I> = {
  /** Size of one object at scale 1 (m). */
  size: { w: number; h: number; d: number };
  make: (index: number) => DeskObject<I>;
  /** Where object `index` comes from and where it goes back to. */
  from: (index: number) => THREE.Vector3;
  back: (index: number) => THREE.Vector3;
  /** Seconds before object `index` leaves, its flight time, the arc height (m); the same for the way back. */
  delay: (index: number) => number;
  duration: number;
  arc: number;
  backDuration: number;
  backArc: number;
  /** The HTML number tags and summary card. */
  tag: string;
  summary: string;
  dispose: () => void;
};

type State<I> = DeskObject<I> & {
  position: THREE.Vector3;
  from: THREE.Vector3;
  to: THREE.Vector3;
  scale: number;
  start: number;
  duration: number;
  returning: boolean;
  visible: boolean;
};

const GAP = 0.09;
const COUNTER_Y = 1.06;
// Phones (decision 17, 13 Nov): two rows from four results; the back row sits half a step aside.
const PHONE_BACK_LIFT = 0;
const MAX = 6;
const easeInOut = (value: number) => (value < 0.5 ? 2 * value * value : 1 - (-2 * value + 2) ** 2 / 2);

export function buildDeskObjects<I>(scene: THREE.Scene, o: DeskOptions<I>) {
  const BOX = o.size;
  const states: State<I>[] = [];
  for (let index = 0; index < MAX; index += 1) {
    const made = o.make(index);
    made.group.visible = false;
    made.group.userData.boxIndex = index;
    scene.add(made.group);
    const from = o.from(index);
    states.push({
      ...made,
      position: from.clone(),
      from: from.clone(),
      to: from.clone(),
      scale: 1,
      start: 0,
      duration: o.duration,
      returning: false,
      visible: false,
    });
  }

  let inputs: I[] = [];
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
    items: I[],
    camera: THREE.PerspectiveCamera,
    width: number,
    phone: boolean,
    animate: boolean,
    reduced: boolean,
  ) => {
    inputs = items.slice(0, MAX);
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
      state.set(inputs[index]);
      state.from.copy(animate && !reduced ? o.from(index) : target.position);
      state.position.copy(state.from);
      state.to.copy(target.position);
      state.scale = target.scale;
      state.start = now + (animate && !reduced ? o.delay(index) : 0);
      state.duration = reduced ? 0.001 : o.duration;
      state.returning = false;
      state.visible = true;
      state.group.visible = true;
    });
  };

  const takeBack = (reduced: boolean) => {
    const now = performance.now() / 1000;
    selected = null;
    states.forEach((state, index) => {
      if (!state.visible) return;
      state.from.copy(state.position);
      state.to.copy(o.back(index));
      state.start = now;
      state.duration = reduced ? 0.001 : o.backDuration;
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
    const tags = document.querySelectorAll<HTMLElement>(o.tag);
    let moving = false;
    states.forEach((state, index) => {
      const tag = tags[index];
      if (!state.visible) {
        if (tag) tag.hidden = true;
        return;
      }
      const raw = THREE.MathUtils.clamp((now - state.start) / state.duration, 0, 1);
      const eased = easeInOut(raw);
      state.position.lerpVectors(state.from, state.to, eased);
      if (raw > 0 && raw < 1) state.position.y += Math.sin(Math.PI * raw) * (state.returning ? o.backArc : o.arc);
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

    const summary = document.querySelector<HTMLElement>(o.summary);
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
      document.querySelectorAll<HTMLElement>(o.tag).forEach((tag) => (tag.hidden = true));
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
    /** QA: scale and screen-space layout of the objects on the counter. */
    get scale() {
      return states.find((state) => state.visible)?.scale ?? 0;
    },
    get rows() {
      return new Set(states.filter((state) => state.visible).map((state) => state.position.z)).size;
    },
    /** Where object `index` stands now (world), for the character to look at or reach for. */
    positionOf(index: number) {
      return states[index]?.visible ? states[index].position : null;
    },
    dispose: o.dispose,
  };
}
