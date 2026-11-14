import * as THREE from "three";
import { SCENE_Z_SHIFT } from "../solusi/kamera";

const protoZ = (z: number) => z - SCENE_Z_SHIFT;

export type TokoSet = {
  group: THREE.Group;
  register: THREE.Group;
  lamp: THREE.Group;
  dispose: () => void;
};

/** The final S4 shop set. Coordinates and materials follow SOLUSI-V1-VISUAL 7.1–7.2. */
export function buildToko(): TokoSet {
  const group = new THREE.Group();
  group.name = "toko";
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const basic = (color: string, options: THREE.MeshBasicMaterialParameters = {}) => {
    const value = new THREE.MeshBasicMaterial({ color, ...options });
    materials.push(value);
    return value;
  };
  const standard = (color: string, options: THREE.MeshStandardMaterialParameters = {}) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness: 0.8, metalness: 0, ...options });
    materials.push(value);
    return value;
  };

  const wall = basic("#131951");
  const wainscot = basic("#131951");
  const rail = basic("#232b77");
  const counterTop = standard("#cfc5e8", { roughness: 0.45 });
  const counterFront = basic("#c2b8df");
  const counterLip = basic("#afa4d2");

  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, parent = group) => {
    geometries.push(geometry);
    const value = new THREE.Mesh(geometry, material);
    parent.add(value);
    return value;
  };
  const box = (
    size: [number, number, number],
    at: [number, number, number],
    material: THREE.Material,
    parent = group,
  ) => {
    const value = mesh(new THREE.BoxGeometry(...size), material, parent);
    value.position.set(...at);
    return value;
  };

  const wallMesh = mesh(new THREE.PlaneGeometry(40, 14), wall);
  wallMesh.position.set(0, 4, protoZ(-2.3));
  const wainscotMesh = mesh(new THREE.PlaneGeometry(40, 1.5), wainscot);
  wainscotMesh.position.set(0, 0.95, protoZ(-2.29));
  box([40, 0.05, 0.05], [0, 1.72, protoZ(-2.27)], rail);
  box([40, 0.12, 2.6], [0, 1, protoZ(0.6)], counterTop);
  box([40, 6, 2.5], [0, -2.07, protoZ(0.6)], counterFront);
  box([40, 0.06, 0.04], [0, 0.91, protoZ(1.851)], counterLip);

  const register = new THREE.Group();
  register.name = "mesin-kasir";
  register.position.set(0.55, 1.06, protoZ(-0.12));
  register.rotation.y = 0.32;
  group.add(register);
  const registerBody = standard("#1a2160", { roughness: 0.5 });
  const registerTrim = standard("#2a3277", { roughness: 0.55 });
  const registerScreen = standard("#0b0f3a", {
    roughness: 0.35,
    emissive: new THREE.Color("#35eafe"),
    emissiveIntensity: 0.35,
  });
  box([0.78, 0.34, 0.58], [0, 0.17, 0], registerBody, register);
  const keys = box([0.6, 0.04, 0.3], [0, 0.36, 0.1], registerTrim, register);
  keys.rotation.x = -0.25;
  const pole = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.34, 12), registerTrim, register);
  pole.position.set(0, 0.5, -0.16);
  const screen = box([0.5, 0.3, 0.04], [0, 0.72, -0.14], registerScreen, register);
  screen.rotation.x = -0.15;

  const shelf = new THREE.Group();
  shelf.name = "rak-dinding";
  shelf.position.set(3.75, 0, protoZ(-2.05));
  group.add(shelf);
  const shelfMaterial = standard("#b8add9", { roughness: 0.58 });
  const stockColors = ["#87cfd7", "#94a2d9", "#dc96c4", "#90ccb7", "#ad96dd", "#c894db", "#87cfd7", "#df9dae"];
  for (const boardY of [2.75, 2.05]) box([2.1, 0.06, 0.4], [0, boardY, 0], shelfMaterial, shelf);
  stockColors.forEach((color, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    const stock = box(
      [0.32, 0.42, 0.26],
      [-0.75 + column * 0.5, (row ? 2.05 : 2.75) + 0.24, 0.02],
      standard(color, { roughness: 0.6 }),
      shelf,
    );
    stock.rotation.y = column % 2 === 0 ? 0.1 : -0.12;
  });

  const lamp = new THREE.Group();
  lamp.name = "lampu-gantung";
  lamp.position.set(-0.6, 3.65, protoZ(-0.5));
  group.add(lamp);
  const cableMaterial = basic("#2a2f5e");
  const shadeMaterial = standard("#9f0ed6", { roughness: 0.4, side: THREE.DoubleSide });
  const bulbMaterial = basic("#fff6d8");
  const cable = mesh(new THREE.CylinderGeometry(0.01, 0.01, 2.2, 8), cableMaterial, lamp);
  cable.position.y = 1.1;
  const shade = mesh(new THREE.ConeGeometry(0.32, 0.3, 24, 1, true), shadeMaterial, lamp);
  shade.position.y = 0;
  const bulb = mesh(new THREE.SphereGeometry(0.09, 16, 10), bulbMaterial, lamp);
  bulb.position.y = -0.12;

  return {
    group,
    register,
    lamp,
    dispose() {
      for (const geometry of geometries) geometry.dispose();
      for (const item of materials) item.dispose();
    },
  };
}
