// Light of the K0 → K2 morning (approved in prototype tahap 2): low warm sun from the front left with shadows,
// lavender hemisphere, a dim room environment. Inside COMPANY the hemisphere and the environment are blended
// toward warmer, brighter values from the camera's depth behind the facade (exposure adaptation).
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { lerp } from "./kit";

const OUT = { sky: new THREE.Color("#b9adf0"), ground: new THREE.Color("#e6acb6"), i: 1.05, env: 0.3 };
const IN = { sky: new THREE.Color("#ece2f6"), ground: new THREE.Color("#ecc9c9"), i: 1.2, env: 0.35 };
const SUN_DIR = new THREE.Vector3(-0.5, 0.3, 0.81).normalize();

export function createLight(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  envScene.dispose();
  pmrem.dispose();
  scene.environment = env;
  scene.environmentIntensity = OUT.env;

  const hemi = new THREE.HemisphereLight(OUT.sky, OUT.ground, OUT.i);
  const sun = new THREE.DirectionalLight("#ffd2b0", 2.3);
  sun.target.position.set(-0.5, 2.5, -1);
  sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 45);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 15, bottom: -15, near: 5, far: 90 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(hemi, sun, sun.target);

  /** 0 outside … 1 inside, from the camera's z (the facade is at z 0). */
  const setInside = (cameraZ: number) => {
    const inside = THREE.MathUtils.smoothstep(-cameraZ, -0.6, 0.6);
    hemi.color.copy(OUT.sky).lerp(IN.sky, inside);
    hemi.groundColor.copy(OUT.ground).lerp(IN.ground, inside);
    hemi.intensity = lerp(OUT.i, IN.i, inside);
    scene.environmentIntensity = lerp(OUT.env, IN.env, inside);
  };
  const setShadowSize = (size: number) => {
    sun.shadow.mapSize.setScalar(size);
    sun.shadow.map?.dispose();
    sun.shadow.map = null;
  };
  const dispose = () => {
    env.dispose();
    sun.shadow.map?.dispose();
  };
  return { hemi, sun, setInside, setShadowSize, dispose };
}
