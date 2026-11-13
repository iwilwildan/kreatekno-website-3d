import * as THREE from "three";

export function buildFlyingCard(scene: THREE.Scene) {
  const group = new THREE.Group();
  const side = new THREE.MeshBasicMaterial({ color: "#e9e4f5" });
  const top = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  const bottom = new THREE.MeshBasicMaterial({ color: "#9f0ed6" });
  const geometry = new THREE.BoxGeometry(0.72, 0.035, 0.98);
  const card = new THREE.Mesh(geometry, [side, side, top, bottom, side, side]);
  group.add(card);
  group.visible = false;
  scene.add(group);
  let start = 0;
  let active = false;

  const deal = (reduced: boolean) => {
    if (reduced) {
      active = false;
      group.visible = false;
      return;
    }
    start = performance.now() / 1000 + 0.36;
    active = true;
    group.visible = false;
  };
  const update = (now: number, phone: boolean) => {
    if (!active) return false;
    if (now < start) return true;
    const raw = THREE.MathUtils.clamp((now - start) / 0.62, 0, 1);
    const eased = 1 - (1 - raw) ** 3;
    const from = new THREE.Vector3(1.95, 0.5, -2.25);
    const to = new THREE.Vector3(phone ? 1.95 : 1.4, 1.08, phone ? -1.3 : -1);
    group.visible = true;
    group.position.lerpVectors(from, to, eased);
    group.position.y += Math.sin(Math.PI * raw) * 0.6;
    group.rotation.x = THREE.MathUtils.lerp(-1.1, 0, eased);
    group.rotation.z = Math.sin(Math.PI * raw) * 0.25;
    if (raw >= 1 && now - start >= 0.74) {
      active = false;
      group.visible = false;
    }
    return active;
  };
  return {
    deal,
    update,
    get active() {
      return active;
    },
    dispose() {
      geometry.dispose();
      side.dispose();
      top.dispose();
      bottom.dispose();
    },
  };
}
