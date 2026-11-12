// Light of the K0 → K2 morning (approved in prototype tahap 2): low warm sun from the front left with shadows,
// lavender hemisphere, a dim room environment. Inside COMPANY the hemisphere and the environment are blended
// toward warmer, brighter values from the camera's depth behind the facade (exposure adaptation). The top views
// of beats 3–4 (K3, K4) blend to a close-up light: soft, even and cool white from above, as in the keyframes
// (white paper on a lilac desk, short soft shadows under the hands).
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { lerp } from "./kit";

const OUT = { sky: new THREE.Color("#b9adf0"), ground: new THREE.Color("#e6acb6"), i: 1.05, env: 0.3 };
const IN = { sky: new THREE.Color("#ece2f6"), ground: new THREE.Color("#ecc9c9"), i: 1.2, env: 0.35 };
const CLOSE = { sky: new THREE.Color("#f7f4ff"), ground: new THREE.Color("#efe9f6"), i: 1.55, env: 0.55 };
const SUN = { color: new THREE.Color("#ffd2b0"), i: 2.3 },
  SUN_CLOSE = { color: new THREE.Color("#fff6f0"), i: 1.15 };
const SUN_DIR = new THREE.Vector3(-0.5, 0.3, 0.81).normalize();
/**
 * Late morning out on the street (beats 5a–5b, the team's videos K4.2 → K5a.6): the sun higher and more neutral,
 * still from the left, a bluer sky light; blended in as the camera backs out through COMPANY's door.
 */
const NOON = { sky: new THREE.Color("#c6d3f2"), ground: new THREE.Color("#e6d8dc"), i: 1.15, env: 0.34 };
const SUN_NOON = { color: new THREE.Color("#fff2e4"), i: 2.45 };
const SUN_DIR_NOON = new THREE.Vector3(-0.42, 0.62, 0.66).normalize();
/**
 * Golden hour outside (tahap 7, video K8 - K9.1 and Master 10b; beat 9b of tahap 8 uses it again): the sun low
 * (18°) and orange from the street's left (−x, +z), so it shines into Kreatekno's facade and through the meeting
 * room's window; a warm sky light. Blended in while the camera faces away from the facade (K6–K8).
 */
export const GOLDEN = {
  sky: new THREE.Color("#f2c3a2"),
  ground: new THREE.Color("#e7b0a0"),
  i: 1.0,
  env: 0.3,
  sun: new THREE.Color("#ffa65c"),
  sunI: 2.9,
};
export const GOLDEN_DIR = new THREE.Vector3(-0.62, 0.32, 0.72).normalize();
/**
 * Inside Kreatekno's lobby (tahap 7): a neutral, pastel daylight from the facade and the ceiling panels, brighter
 * and cooler than COMPANY's warm room (the videos' lobby: white ceiling, clear sticky notes, lavender walls).
 */
const LOBBY = { sky: new THREE.Color("#fbf9ff"), ground: new THREE.Color("#f1ebf3"), i: 1.75, env: 0.62 };

export function createLight(renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene, 0.04).texture;
  envScene.dispose();
  pmrem.dispose();
  scene.environment = env;
  scene.environmentIntensity = OUT.env;

  const hemi = new THREE.HemisphereLight(OUT.sky, OUT.ground, OUT.i);
  const sun = new THREE.DirectionalLight(SUN.color, SUN.i);
  sun.target.position.set(-0.5, 2.5, -1);
  sun.position.copy(sun.target.position).addScaledVector(SUN_DIR, 45);
  sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -18, right: 18, top: 15, bottom: -15, near: 5, far: 90 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 4;
  scene.add(hemi, sun, sun.target);

  const dir = SUN_DIR.clone();
  let sunKey = "0 0";
  /**
   * 0 outside … 1 inside, from the camera's z (the facade is at z 0); `close` 0 … 1 toward the close-up light;
   * `noon` 0 … 1 toward late morning outside (beat 5); `lobby` 0 … 1 inside Kreatekno rather than COMPANY (tahap
   * 7); `golden` 0 … 1 toward golden hour outside. Returns true when the sun turned (the shadows follow).
   */
  const setInside = (cameraZ: number, close = 0, noon = 0, lobby = 0, golden = 0) => {
    const inside = THREE.MathUtils.smoothstep(-cameraZ, -0.6, 0.6);
    const outSky = OUT.sky.clone().lerp(NOON.sky, noon).lerp(GOLDEN.sky, golden),
      outGround = OUT.ground.clone().lerp(NOON.ground, noon).lerp(GOLDEN.ground, golden),
      inSky = IN.sky.clone().lerp(LOBBY.sky, lobby),
      inGround = IN.ground.clone().lerp(LOBBY.ground, lobby);
    hemi.color.copy(outSky).lerp(inSky, inside).lerp(CLOSE.sky, close);
    hemi.groundColor.copy(outGround).lerp(inGround, inside).lerp(CLOSE.ground, close);
    const outI = lerp(lerp(OUT.i, NOON.i, noon), GOLDEN.i, golden),
      outEnv = lerp(lerp(OUT.env, NOON.env, noon), GOLDEN.env, golden);
    hemi.intensity = lerp(lerp(outI, lerp(IN.i, LOBBY.i, lobby), inside), CLOSE.i, close);
    scene.environmentIntensity = lerp(lerp(outEnv, lerp(IN.env, LOBBY.env, lobby), inside), CLOSE.env, close);
    sun.color.copy(SUN.color).lerp(SUN_NOON.color, noon).lerp(GOLDEN.sun, golden).lerp(SUN_CLOSE.color, close);
    sun.intensity = lerp(lerp(lerp(SUN.i, SUN_NOON.i, noon), GOLDEN.sunI, golden), SUN_CLOSE.i, close);
    const key = `${noon} ${golden}`;
    if (key === sunKey) return false;
    sunKey = key;
    dir.copy(SUN_DIR).lerp(SUN_DIR_NOON, noon).lerp(GOLDEN_DIR, golden).normalize();
    sun.position.copy(sun.target.position).addScaledVector(dir, 45);
    followKey = "";
    return true;
  };
  /**
   * Moves the sun's shadow box along the street with the camera (beats 5a–5b); unchanged near COMPANY (x < 6).
   * The move is snapped in the light's own frame to whole steps of 28 shadow texels (±1 m, at both map sizes), so
   * the texel grid stays put on the static set (no shimmer) and the map is redrawn about once a metre. Returns
   * true when it moved.
   */
  const base = sun.target.position.clone(),
    ex = new THREE.Vector3(),
    ey = new THREE.Vector3(),
    step = (28 * (sun.shadow.camera.right - sun.shadow.camera.left)) / 1024,
    off = new THREE.Vector3();
  let followKey = "0 0";
  const follow = (cameraX: number) => {
    off.set(Math.max(0, cameraX - 6), 0, 0);
    ex.crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
    ey.crossVectors(dir, ex);
    const a = Math.round(off.dot(ex) / step),
      b = Math.round(off.dot(ey) / step),
      key = `${a} ${b}`;
    if (key === followKey) return false;
    followKey = key;
    // along the light's direction the box may move freely (it is deep enough): keep the target on the ground plane
    const p = base
      .clone()
      .addScaledVector(ex, a * step)
      .addScaledVector(ey, b * step);
    p.addScaledVector(dir, (base.y - p.y) / dir.y);
    sun.target.position.copy(p);
    sun.position.copy(p).addScaledVector(dir, 45);
    sun.target.updateMatrixWorld();
    return true;
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
  return { hemi, sun, setInside, follow, setShadowSize, dispose };
}
