// Set E, the sky (K0): gradient dome, low-poly clouds and the pigeons (posed; they fly in tahap 4). The cloud
// shape is also used for the rain clouds over the staff in COMPANY (cast/acts.ts).
// One set of clouds and birds per keyframe format, matched to the team's 16:9 and 9:16 frames.
import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { clean, rng, type Kit } from "../core/kit";
import { DATA, type Fmt } from "../takes/home/data";

export function cloudGeo(seed: number) {
  const r = rng(seed),
    parts: THREE.BufferGeometry[] = [];
  const blobs = [
    [0, 0, 0, 1],
    [-0.85, -0.12, 0.05, 0.72],
    [0.85, -0.15, 0, 0.7],
    [-0.35, 0.42, -0.05, 0.62],
    [0.4, 0.35, 0.1, 0.58],
    [1.45, -0.28, 0, 0.42],
    [-1.45, -0.3, 0, 0.4],
  ];
  for (const [x, y, z, s] of blobs) {
    const g = new THREE.IcosahedronGeometry(s * (0.9 + r() * 0.2), 1);
    g.scale(1, 0.72, 0.8);
    g.translate(x, y, z);
    parts.push(clean(g));
  }
  const g = mergeGeometries(parts);
  g.translate(0, 0.2, 0);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) if (pos.getY(i) < -0.15) pos.setY(i, -0.15 + (pos.getY(i) + 0.15) * 0.25);
  g.computeVertexNormals();
  return g;
}

/** White dove as in the team's k0 - k1 video: round body and head, a fanned tail. */
function birdGeo() {
  const parts: THREE.BufferGeometry[] = [],
    body = new THREE.SphereGeometry(0.5, 16, 12);
  body.scale(1.15, 0.72, 0.72);
  parts.push(clean(body));
  const head = new THREE.SphereGeometry(0.32, 14, 10);
  head.translate(0.62, 0.24, 0);
  parts.push(clean(head));
  // tail: a flat fan, widening toward its end
  const tail = new THREE.SphereGeometry(0.5, 12, 6);
  tail.scale(0.62, 0.07, 0.5);
  const tp = tail.attributes.position;
  for (let i = 0; i < tp.count; i++) {
    const f = Math.max(0, -tp.getX(i)) / 0.31;
    tp.setZ(i, tp.getZ(i) * (0.45 + 0.75 * f));
  }
  tail.computeVertexNormals();
  tail.translate(-0.78, 0.06, 0);
  parts.push(clean(tail));
  return mergeGeometries(parts);
}

/** Two small black eyes on the sides of the head. */
function eyesGeo() {
  return mergeGeometries(
    [1, -1].map((s) => clean(new THREE.SphereGeometry(0.055, 8, 6).translate(0.78, 0.31, s * 0.235))),
  );
}

/** One wing, built around its shoulder joint (origin) and reaching out along +z (left) or -z (right). */
function wingGeo(s: 1 | -1) {
  const w = new THREE.SphereGeometry(0.5, 16, 8);
  w.scale(0.62, 0.09, 1.5);
  // taper toward the tip and sweep it back a little, like the team's pigeons
  const pos = w.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const f = (pos.getZ(i) + 0.75) / 1.5;
    pos.setX(i, pos.getX(i) * (1 - 0.45 * f) - 0.18 * f * f);
  }
  w.computeVertexNormals();
  w.translate(-0.04, 0, s * 0.7);
  return w;
}
const SHOULDER = new THREE.Vector3(-0.02, 0.26, 0.14);
/** Wing angle when nothing moves (stills, ?shot): tips down, folded along the body like a glide. */
const REST_ANGLE = 0.55;
/** Wingbeats per second, from the team's k0 - k1 video. */
const FLAP_HZ = 3.2;

/** Seconds a pigeon takes to cross the K0 frame from its left edge to its right edge. */
const CROSS_S = 11;
/** Flight direction: to the right, climbing a little (the way the flock heads in the k0 - k1 video). */
const FLIGHT_DIR = new THREE.Vector3(1, 0.12, 0).normalize();

type Bird = {
  g: THREE.Group;
  wings: [THREE.Group, THREE.Group];
  base: THREE.Vector3;
  size: number;
  i: number;
  /** Flight path along FLIGHT_DIR through `base`: s = 0 at the keyframe spot, wraps from sMax back to sMin. */
  sMin: number;
  sMax: number;
};

export function buildSky(kit: Kit) {
  const group = new THREE.Group();
  const skyTex = kit.canvasTex(8, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#3f8ff5");
    gr.addColorStop(0.38, "#5aa6fc");
    gr.addColorStop(0.444, "#6cadfd");
    gr.addColorStop(0.49, "#acccfb");
    gr.addColorStop(0.52, "#e4d8e6");
    gr.addColorStop(0.545, "#f0dcdc");
    gr.addColorStop(1, "#f0dcdc");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(400, 32, 16),
      new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false, toneMapped: false }),
    ),
  );

  // golden hour (tahap 7, seen through Kreatekno's facade at K9.1; again in tahap 8): a second dome over the first,
  // faded in (setGolden), drawn only while it shows
  const goldTex = kit.canvasTex(8, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#7c86d4");
    gr.addColorStop(0.34, "#a99ae0");
    gr.addColorStop(0.43, "#eda7b8");
    gr.addColorStop(0.475, "#ffbf8f");
    gr.addColorStop(0.5, "#ffdca3");
    gr.addColorStop(0.53, "#f7cbaa");
    gr.addColorStop(1, "#f2cdb4");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const goldMat = new THREE.MeshBasicMaterial({
    map: goldTex,
    side: THREE.BackSide,
    fog: false,
    toneMapped: false,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const goldDome = new THREE.Mesh(new THREE.SphereGeometry(399, 32, 16), goldMat);
  goldDome.visible = false;
  group.add(goldDome);
  /** Golden hour over the day's sky, 0 … 1. */
  const setGolden = (k: number) => {
    goldMat.opacity = k;
    goldDome.visible = k > 0.001;
  };
  // late afternoon (tahap 8: the sky after the plaque, over the row and COMPANY, the continuation video 13–20 s): purple
  // at the top through pink to orange at the horizon, no sun in sight; a third dome over the golden one
  const sunsetTex = kit.canvasTex(8, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#5e4b96");
    gr.addColorStop(0.3, "#8a64a6");
    gr.addColorStop(0.4, "#c07aa8");
    gr.addColorStop(0.45, "#e48fa5");
    gr.addColorStop(0.48, "#fb9f98");
    gr.addColorStop(0.5, "#ffb070");
    gr.addColorStop(0.53, "#ffc25a");
    gr.addColorStop(1, "#f6c09c");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const sunsetMat = goldMat.clone();
  sunsetMat.map = sunsetTex;
  const sunsetDome = new THREE.Mesh(new THREE.SphereGeometry(398, 32, 16), sunsetMat);
  sunsetDome.visible = false;
  group.add(sunsetDome);
  /** Late afternoon over the golden hour, 0 … 1. */
  const setSunset = (k: number) => {
    sunsetMat.opacity = k;
    sunsetDome.visible = k > 0.001;
  };

  // night (tahap 10, greybox: the continuation video 36–38.7 s): deep navy at the top to a violet glow at the
  // horizon; a fourth dome over the sunset's (the stars come in langkah 2)
  const nightTex = kit.canvasTex(8, 1024, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, "#060818");
    gr.addColorStop(0.3, "#0a0f2a");
    gr.addColorStop(0.44, "#121838");
    gr.addColorStop(0.49, "#1c2248");
    gr.addColorStop(0.5, "#252a56");
    gr.addColorStop(1, "#1f2148");
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  });
  const nightMat = goldMat.clone();
  nightMat.map = nightTex;
  const nightDome = new THREE.Mesh(new THREE.SphereGeometry(397, 32, 16), nightMat);
  nightDome.visible = false;
  group.add(nightDome);
  /** Night over the sunset, 0 … 1 (the K0 clouds go with the light: the billboard at K15.1 is framed as at K0). */
  let starry = false;
  const setNight = (k: number) => {
    nightMat.opacity = k;
    nightDome.visible = k > 0.001;
    if (starry !== k > 0.5) {
      starry = k > 0.5;
      setFormat(fmtNow === "pc" ? 0 : 1);
    }
  };

  const cloudMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.95,
    flatShading: true,
    emissive: "#cfcaf7",
    emissiveIntensity: 0.45,
  });
  const birdMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.7,
    emissive: "#e6e2f6",
    emissiveIntensity: 0.25,
  });
  const beakMat = new THREE.MeshStandardMaterial({ color: "#efb043", roughness: 0.5 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: "#141418", roughness: 0.2 });
  const eyes = eyesGeo();
  const bg = birdGeo(),
    beak = new THREE.ConeGeometry(0.08, 0.22, 8),
    wingL = wingGeo(1),
    wingR = wingGeo(-1);
  beak.rotateZ(-Math.PI / 2);
  beak.translate(0.95, 0.2, 0);

  const perFmt = {} as Record<Fmt, THREE.Group>;
  const birds: Record<Fmt, Bird[]> = { pc: [], hp: [] };
  const bounds: Record<Fmt, THREE.Sphere> = { pc: new THREE.Sphere(), hp: new THREE.Sphere() };
  for (const fmt of ["pc", "hp"] as const) {
    const grp = new THREE.Group();
    group.add(grp);
    perFmt[fmt] = grp;
    DATA.clouds[fmt].forEach(([x, y, z, w], i) => {
      const m = new THREE.Mesh(cloudGeo(11 + i), cloudMat);
      m.position.set(x, y, z);
      m.scale.setScalar(w / 3.4);
      grp.add(m);
    });
    const pts: THREE.Vector3[] = [];
    DATA.birds[fmt].forEach(([x, y, z, w], i) => {
      const b = new THREE.Group();
      b.add(new THREE.Mesh(bg, birdMat));
      b.add(new THREE.Mesh(beak, beakMat));
      b.add(new THREE.Mesh(eyes, eyeMat));
      const wings = ([1, -1] as const).map((s) => {
        const joint = new THREE.Group();
        joint.position.set(SHOULDER.x, SHOULDER.y, s * SHOULDER.z);
        joint.rotation.x = s * REST_ANGLE;
        joint.add(new THREE.Mesh(s === 1 ? wingL : wingR, birdMat));
        b.add(joint);
        return joint;
      }) as [THREE.Group, THREE.Group];
      b.position.set(x, y, z);
      b.scale.setScalar(w / 2.0);
      b.rotation.set(0, -0.15, 0.32);
      grp.add(b);
      birds[fmt].push({ g: b, wings, base: b.position.clone(), size: w, i, sMin: -w * 4, sMax: w * 4 });
      pts.push(b.position);
    });
    bounds[fmt].setFromPoints(pts);
    bounds[fmt].radius += Math.max(...DATA.birds[fmt].map((b) => b[3])) * 1.5;
  }
  let fmtNow: Fmt = "pc";

  // ---------- high clouds (tahap 8: K10, the sky over the row, video 13–15.5 s) ----------
  // Spread along the row 45–60 m behind it, 26–58 m up: from the camera rising over the roofs and looking up they
  // fill the frame about five at a time, a fifth of its width each. One merged mesh, drawn only in that part of the
  // take (they would otherwise sit in the hero's sky); they drift right over the hyperlapse (setHigh).
  const high = new THREE.Group();
  {
    const r = rng(907),
      parts: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 9; i++) {
      const g = cloudGeo(41 + i),
        x = -20 + i * 9.4 + (r() - 0.5) * 3,
        y = 26 + ((i * 5) % 9) * 3.6 + r() * 2,
        z = -44 - r() * 12,
        w = 17 + r() * 7;
      g.scale(w / 3.4, w / 3.4, w / 3.4);
      g.translate(x, y, z);
      parts.push(g);
    }
    const m = new THREE.Mesh(mergeGeometries(parts), cloudMat);
    m.frustumCulled = false;
    high.add(m);
  }
  high.visible = false;
  group.add(high);
  /** The high clouds: shown or not, and how far they have drifted (0 … 1 over the hyperlapse). */
  const setHigh = (on: boolean, drift = 0) => {
    high.visible = on;
    high.position.x = drift * 14;
  };
  /** The pigeons of K0 (they are gone once the take leaves the street's morning). */
  const setBirds = (on: boolean) => {
    for (const fmt of ["pc", "hp"] as const) for (const b of birds[fmt]) b.g.visible = on;
  };

  /** Shows the clouds and birds composed for the nearer keyframe format. */
  const setFormat = (t: number) => {
    fmtNow = t < 0.5 ? "pc" : "hp";
    perFmt.pc.visible = fmtNow === "pc" && !starry;
    perFmt.hp.visible = fmtNow === "hp" && !starry;
  };

  let speed = 0;
  /**
   * Measures each pigeon's flight path in the K0 view (`camera` posed on the K0 hold, with the screen's aspect):
   * where it leaves the frame on the right and where it must come back in on the left, both a little past the
   * edge so the jump between them is never seen. Call after setFormat and on every resize.
   */
  const setFlight = (camera: THREE.Camera) => {
    const v = new THREE.Vector3();
    const inFrame = (b: Bird, s: number) => {
      v.copy(b.base).addScaledVector(FLIGHT_DIR, s).project(camera);
      return Math.abs(v.x) <= 1 && Math.abs(v.y) <= 1 && v.z < 1;
    };
    const pts: THREE.Vector3[] = [];
    let total = 0;
    for (const b of birds[fmtNow]) {
      const step = b.size * 0.2,
        margin = b.size * 1.2;
      if (inFrame(b, 0)) {
        let s = 0;
        while (inFrame(b, s) && s < 400) s += step;
        b.sMax = s + margin;
        s = 0;
        while (inFrame(b, s) && s > -400) s -= step;
        b.sMin = s - margin;
      }
      total += b.sMax - b.sMin;
      pts.push(b.base.clone().addScaledVector(FLIGHT_DIR, b.sMin), b.base.clone().addScaledVector(FLIGHT_DIR, b.sMax));
    }
    const n = birds[fmtNow].length;
    // one speed for the whole flock, so it keeps its formation across the wrap
    speed = n ? total / n / CROSS_S : 0;
    bounds[fmtNow].setFromPoints(pts);
    bounds[fmtNow].radius += Math.max(...birds[fmtNow].map((b) => b.size)) * 1.5;
  };

  /**
   * The pigeons fly across the K0 frame to the right, leave it on the right and come back in on the left, over
   * and over: bursts of wingbeats with short glides between them, the body rising on each downstroke.
   * Time-based (seconds), not scroll-based; at time 0 every bird is on its keyframe spot. Each bird has its own
   * wingbeat phase so the flock doesn't flap in lockstep. `crane` (0..1, the crane down to K1, from the scroll)
   * sends the flock up and out of the frame on the right during the first third of the move, as in the
   * footage, and brings it back when the visitor scrolls up.
   */
  const animate = (time: number, crane = 0) => {
    const out = THREE.MathUtils.smoothstep(crane, 0, 0.35);
    const w = 2 * Math.PI * FLAP_HZ;
    for (const b of birds[fmtNow]) {
      const ph = b.i * 1.7,
        burst = 0.5 + 0.5 * Math.cos((2 * Math.PI * time) / 4.6 + b.i * 1.4),
        amp = 0.18 + 0.78 * THREE.MathUtils.smoothstep(burst, 0.25, 0.75),
        beat = Math.sin(w * time + ph),
        angle = 0.1 + amp * beat;
      b.wings[0].rotation.x = angle;
      b.wings[1].rotation.x = -angle;
      const L = b.sMax - b.sMin,
        s = b.sMin + ((((speed * time - b.sMin) % L) + L) % L),
        k = b.size;
      b.g.position.copy(b.base).addScaledVector(FLIGHT_DIR, s + (b.sMax - b.sMin) * 0.9 * out * out);
      b.g.position.y += k * 9 * out * out;
      b.g.position.y +=
        k * 0.08 * Math.sin((2 * Math.PI * time) / 7 + b.i * 1.3) + k * 0.035 * amp * Math.cos(w * time + ph);
      b.g.rotation.z = 0.32 + 0.05 * Math.sin(w * time + ph + 0.8);
    }
  };
  /** True when the visible flock is inside the camera's view (otherwise there is nothing to animate). */
  const frustum = new THREE.Frustum(),
    pv = new THREE.Matrix4();
  const birdsInView = (camera: THREE.Camera) => {
    pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    return frustum.setFromProjectionMatrix(pv).intersectsSphere(bounds[fmtNow]);
  };
  return { group, setFormat, setFlight, animate, birdsInView, setGolden, setSunset, setNight, setHigh, setBirds };
}
