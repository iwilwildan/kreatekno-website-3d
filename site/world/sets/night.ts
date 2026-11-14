// The night street (tahap 10, beats 14–16; the team's continuation video 35–38.7 s): what only shows after dark, in
// one group drawn only at night. The stars (one Points layer inside the sky dome: fixed positions, no per-pixel hash,
// so mediump GPUs draw them the same), the small warm lamps along the roofs' parapets, the light the shop window and
// the door spill on the pavement, a soft white halo round the lit billboard, the rolling doors shut over the row's
// shop openings, and the road's centre dashes where the K16 camera sees them. No bloom: the glows are additive quads.
import * as THREE from "three";
import { Batch, C, G, mtx, rng, type Kit } from "../core/kit";
import { DATA } from "../takes/home/data";
import { ROW, SHOPS, shopX } from "./rowLayout";
import { billboardFace } from "./street";

const E = DATA.ext;

/** A round soft dot (white, alpha falling off from the middle) for the roof lamps (no mipmaps: they are small). */
function dotTex(kit: Kit, hard: number) {
  const t = kit.canvasTex(64, 64, (g, w) => {
    const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    r.addColorStop(0, "rgba(255,255,255,1)");
    r.addColorStop(hard, "rgba(255,255,255,.9)");
    r.addColorStop(Math.min(1, hard + 0.12), "rgba(255,255,255,.28)");
    r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r;
    g.fillRect(0, 0, w, w);
  });
  t.generateMipmaps = false;
  t.minFilter = THREE.LinearFilter;
  return t;
}

/** Additive, unlit, no depth write: a glow drawn over what is behind it. */
const glowMat = (map: THREE.Texture, color: string) =>
  new THREE.MeshBasicMaterial({
    map,
    color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
    fog: false,
  });

export function buildNight(kit: Kit) {
  const group = new THREE.Group();
  group.name = "night";
  const R = rng(1607);

  // ---------- stars: on the sky the night shots look at (toward −z, low over the roofs: video 36–38.7 s) ----------
  {
    // (the K15.1 and K16 cameras face −z and see the sky from the roofs up to ±15°: most stars are low, in front)
    const n = 1700,
      pos = new Float32Array(n * 3),
      size = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const low = R() < 0.85,
        el = THREE.MathUtils.degToRad(low ? 0.5 + 24.5 * R() : 25 + 60 * R()),
        az = Math.PI + (R() - 0.5) * THREE.MathUtils.degToRad(low ? 170 : 360),
        r = 380;
      pos.set([r * Math.cos(el) * Math.sin(az), r * Math.sin(el), r * Math.cos(el) * Math.cos(az)], i * 3);
      const b = R();
      size[i] = b > 0.94 ? 5.5 : b > 0.7 ? 4.0 : 3.0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("size", new THREE.BufferAttribute(size, 1));
    const mat = new THREE.ShaderMaterial({
      // (the dot is drawn in the shader: a 64 px sprite on a 2 px point samples its smallest mip, nearly transparent)
      uniforms: { uOpacity: { value: 0 }, uScale: { value: 1 } },
      vertexShader: /* glsl */ `
        attribute float size;
        uniform float uScale;
        varying float vA;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * uScale;
          vA = clamp(size / 4.0, 0.7, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity;
        varying float vA;
        void main() {
          float a = (1.0 - smoothstep(0.12, 0.5, length(gl_PointCoord - 0.5))) * vA * uOpacity;
          gl_FragColor = vec4(vec3(1.0, 0.98, 0.93) * a, a);
        }`,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(geo, mat);
    stars.name = "stars";
    stars.frustumCulled = false;
    // (over the sky domes, under everything else: the domes draw without depth)
    stars.renderOrder = 1;
    group.add(stars);
  }

  // ---------- lamps along the parapets: COMPANY and the five shops (video 37–38.7 s: a warm dot every ±1.2 m) ----------
  {
    const pts: number[] = [];
    const line = (x0: number, x1: number, y: number, z: number) => {
      const n = Math.max(2, Math.round((x1 - x0) / 1.25));
      for (let i = 0; i <= n; i++) pts.push(x0 + ((x1 - x0) * i) / n, y, z);
    };
    line(E.xfL + 0.2, E.xfR - 0.2, E.yP + 0.12, E.zc - 0.1);
    SHOPS.forEach((_, i) => {
      const { x0, x1 } = shopX(i);
      line(x0 + 0.25, x1 - 0.25, ROW.h + 0.42, 0.12);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const lamps = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        map: dotTex(kit, 0.35),
        color: "#ffc65a",
        size: 0.85,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        fog: false,
      }),
    );
    lamps.name = "roof-lamps";
    group.add(lamps);
  }

  // ---------- light spilled on the pavement by the window and the door, and the billboard's halo ----------
  {
    const pool = kit.canvasTex(256, 64, (g, w, h) => {
      g.fillStyle = "#000";
      g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = "lighter";
      // the window's (x −6.19 … −1.95) and the door's (−1 … 1) pools on a strip x −7 … 2, brightest at the facade
      for (const [c, rw, a] of [
        [0.47, 0.32, 1],
        [0.89, 0.17, 1],
      ]) {
        const r = g.createRadialGradient(c * w, 0, 0, c * w, 0, rw * w);
        r.addColorStop(0, `rgba(205,196,255,${a})`);
        r.addColorStop(0.5, `rgba(170,160,250,${a * 0.7})`);
        r.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, w, h);
      }
    });
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.4), glowMat(pool, "#ffffff"));
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(-2.5, 0.015, 1.7);
    strip.renderOrder = 2;
    group.add(strip);
    // a soft white halo round the billboard's lit face
    const f = billboardFace();
    const halo = kit.canvasTex(128, 64, (g, w, h) => {
      const r = g.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w / 2);
      r.addColorStop(0, "rgba(235,232,255,.32)");
      r.addColorStop(0.45, "rgba(200,196,255,.08)");
      r.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, w, h);
    });
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(3 * f.hw, 3.6 * f.hh), glowMat(halo, "#ffffff"));
    glow.position.set(f.cx, f.cy, f.z - 0.2);
    glow.renderOrder = 2;
    group.add(glow);
  }

  // ---------- rolling doors over the shops' openings, and the road's centre dashes ----------
  {
    const B = new Batch(group);
    const slats = kit.canvasTex(64, 256, (g, w, h) => {
      g.fillStyle = "#d3d5e0";
      g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 8) {
        g.fillStyle = "#9da1b2";
        g.fillRect(0, y, w, 2);
        g.fillStyle = "#d6d8e3";
        g.fillRect(0, y + 2, w, 1);
      }
    });
    // (the box and the rail in the slats' material too: one draw call for all five)
    const door = new THREE.MeshStandardMaterial({ map: slats, roughness: 0.55, metalness: 0.25 }),
      dark = door,
      ow = ROW.opening.w + 0.08,
      oh = ROW.opening.h;
    SHOPS.forEach((_, i) => {
      const { cx } = shopX(i);
      B.add(G.box(ow, oh - 0.2, 0.03), door, mtx([cx, (oh - 0.2) / 2, 0.0]), { occ: false });
      // the box it rolls into, under the hood, and its bottom rail
      B.add(G.rbox(ow + 0.06, 0.24, 0.16, 0.03), dark, mtx([cx, oh - 0.11, 0.03]), { occ: false });
      B.add(G.box(ow, 0.06, 0.05), dark, mtx([cx, 0.03, 0.02]), { occ: false, shadow: false });
    });
    const dash = new THREE.MeshBasicMaterial({ color: "#a9aacb" });
    for (let x = -24; x < 46; x += 3.4) B.add(G.box(1.8, 0.01, 0.12), dash, mtx([x, -0.145, 7.2]), { shadow: false });
    B.build();
  }

  // the road darker at night (video 38.7 s: a deep blue-grey under the lit pavement); the material is the kit's one
  // shared by sets/street and sets/row
  const road = kit.mat(C.road, { roughness: 0.95 }),
    roadDay = road.color.clone(),
    roadNight = new THREE.Color("#4a4c66");
  const stars = group.getObjectByName("stars") as THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>,
    glows: THREE.Material[] = [];
  group.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.Material | undefined;
    if (m && m !== stars.material && m.blending === THREE.AdditiveBlending) glows.push(m);
  });
  group.visible = false;
  return {
    group,
    /** Night 0 … 1: shown from a little dusk on, the stars fading in with it; `pixelRatio` sizes them. */
    setNight(k: number, pixelRatio: number) {
      group.visible = k > 0.02;
      stars.material.uniforms.uOpacity.value = THREE.MathUtils.smoothstep(k, 0.4, 1);
      stars.material.uniforms.uScale.value = pixelRatio;
      for (const m of glows) m.opacity = k;
      road.color.copy(roadDay).lerp(roadNight, k);
    },
  };
}
export type Night = ReturnType<typeof buildNight>;
