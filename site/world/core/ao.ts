// Ambient occlusion for big flat surfaces ("AO planes"). The maps are baked once by tools/render (see bake.ts)
// and shipped as small grey PNGs in public/world/ao/; the browser only decodes them. If a map is missing
// (a set changed and was not baked again), the world falls back to computing it in the browser.
import * as THREE from "three";

/** Texels per metre (before each plane's own `res` factor). */
export const AO_RES = 14;

export type AoTarget = {
  /** File name of the baked map, e.g. "ext-facade" or "int-2-floor". */
  id: string;
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  /** Three corners in the mesh's local XY plane: origin, +u end, +v end. */
  local: [[number, number], [number, number], [number, number]];
  res: [number, number];
  maxDist: number;
  strength: number;
  /** For a shape with holes: [x0, y0, w, h] of its bounding box in local units, so UVs map onto the AO map. */
  shapeUV?: [number, number, number, number];
  /** Texels inside openings are skipped (left white). */
  skip?: (x: number, y: number) => boolean;
};

/** A flat plane that gets a baked AO map. The material is cloned because each plane has its own map. */
export function aoPlane(
  targets: AoTarget[],
  id: string,
  parent: THREE.Object3D,
  w: number,
  h: number,
  material: THREE.MeshStandardMaterial,
  m: THREE.Matrix4,
  { res = 1, maxDist = 1.2, strength = 0.9, shadow = false } = {},
) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), material.clone());
  res *= AO_RES;
  if (shadow) mesh.material.shadowSide = THREE.DoubleSide;
  mesh.matrixAutoUpdate = false;
  mesh.matrix.copy(m);
  mesh.receiveShadow = true;
  mesh.castShadow = shadow;
  parent.add(mesh);
  targets.push({
    id,
    mesh,
    local: [
      [-w / 2, -h / 2],
      [w / 2, -h / 2],
      [-w / 2, h / 2],
    ],
    res: [Math.max(4, Math.round(w * res)), Math.max(4, Math.round(h * res))],
    maxDist,
    strength,
  });
  return mesh;
}

/** Puts a grey map (one byte per texel, row 0 = v 0) on its plane. */
export function applyAO(t: AoTarget, data: Uint8Array) {
  const [w, h] = t.res;
  const tex = new THREE.DataTexture(data, w, h, THREE.RedFormat, THREE.UnsignedByteType);
  tex.magFilter = tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  if (t.shapeUV) {
    tex.repeat.set(1 / t.shapeUV[2], 1 / t.shapeUV[3]);
    tex.offset.set(-t.shapeUV[0] / t.shapeUV[2], -t.shapeUV[1] / t.shapeUV[3]);
  }
  t.mesh.material.aoMap?.dispose();
  t.mesh.material.aoMap = tex;
  t.mesh.material.aoMapIntensity = 1;
  t.mesh.material.needsUpdate = true;
}

/** Decodes a baked PNG into one byte per texel (red channel), or null when it is missing or the wrong size. */
async function fetchMap(url: string, [w, h]: [number, number]) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const bmp = await createImageBitmap(await res.blob(), {
      colorSpaceConversion: "none",
      premultiplyAlpha: "none",
    });
    if (bmp.width !== w || bmp.height !== h) return null;
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.drawImage(bmp, 0, 0);
    bmp.close();
    const rgba = g.getImageData(0, 0, w, h).data,
      out = new Uint8Array(w * h);
    for (let i = 0; i < out.length; i++) out[i] = rgba[i * 4];
    return out;
  } catch {
    return null;
  }
}

/** Loads the baked maps; returns the targets that have none. */
export async function loadAO(targets: AoTarget[], base: string) {
  const missing: AoTarget[] = [];
  await Promise.all(
    targets.map(async (t) => {
      const data = await fetchMap(`${base}/${t.id}.png`, t.res);
      if (data) applyAO(t, data);
      else missing.push(t);
    }),
  );
  return missing;
}

/** Encodes a map as a grey PNG data URL (row 0 = v 0, as applyAO expects). Used by the bake tool. */
export function encodeMap(data: Uint8Array, [w, h]: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!,
    img = g.createImageData(w, h);
  for (let i = 0; i < data.length; i++) {
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = data[i];
    img.data[i * 4 + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL("image/png");
}
