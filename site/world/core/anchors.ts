// Anchors put real HTML (the copy, rendered on the server) onto a rectangle in the 3D scene. Each frame the four
// corners are projected to the screen and the element gets the CSS matrix3d that maps its own box onto that
// quad (a projective transform), so the text sits on the surface with the camera's perspective.
import * as THREE from "three";
import type { Vec3 } from "./kit";

export type Quad = [[number, number], [number, number], [number, number], [number, number]];

export type Anchor = {
  name: string;
  /** Corners in world space: top-left, top-right, bottom-left, bottom-right. */
  corners: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
};

/** A rectangle facing +z, centred on (cx, cy, z), half-size hw × hh. */
export function rectAnchor(name: string, cx: number, cy: number, z: number, hw: number, hh: number): Anchor {
  return {
    name,
    corners: [
      new THREE.Vector3(cx - hw, cy + hh, z),
      new THREE.Vector3(cx + hw, cy + hh, z),
      new THREE.Vector3(cx - hw, cy - hh, z),
      new THREE.Vector3(cx + hw, cy - hh, z),
    ],
  };
}

/**
 * A flat rectangle in an object's frame (matrix m): `tl` and `br` are its top-left and bottom-right corners as
 * read, in that frame; the other two share their x and z (the rectangle lies on the frame's x–z plane, at tl's y).
 */
export function rectAnchorFrom(name: string, m: THREE.Matrix4, tl: Vec3, br: Vec3): Anchor {
  const P = (x: number, z: number) => new THREE.Vector3(x, tl[1], z).applyMatrix4(m);
  return { name, corners: [P(tl[0], tl[2]), P(br[0], tl[2]), P(tl[0], br[2]), P(br[0], br[2])] };
}

const _v = new THREE.Vector3();
/**
 * Projects an anchor to CSS pixels of a viewport w × h. Returns null when any corner is behind the camera
 * (the copy is hidden then, because HTML can't be clipped by the near plane).
 */
export function projectAnchor(a: Anchor, camera: THREE.Camera, w: number, h: number): Quad | null {
  const out: [number, number][] = [];
  for (const c of a.corners) {
    _v.copy(c).applyMatrix4(camera.matrixWorldInverse);
    if (_v.z > -0.05) return null;
    _v.applyMatrix4(camera.projectionMatrix);
    out.push([(_v.x * 0.5 + 0.5) * w, (-_v.y * 0.5 + 0.5) * h]);
  }
  return out as Quad;
}

/** True when the quad overlaps the viewport. */
export function quadVisible(q: Quad, w: number, h: number) {
  const xs = q.map((p) => p[0]),
    ys = q.map((p) => p[1]);
  return Math.max(...xs) > 0 && Math.min(...xs) < w && Math.max(...ys) > 0 && Math.min(...ys) < h;
}

/**
 * CSS matrix3d that maps an element box of w × h (origin top-left) onto the quad (TL, TR, BL, BR).
 * Square-to-quad homography (Heckbert), composed with the box-to-unit-square scale.
 */
export function quadToMatrix3d(q: Quad, w: number, h: number) {
  const [[x0, y0], [x1, y1], [x3, y3], [x2, y2]] = q; // TL, TR, BL, BR → 0,1,3,2 around the square
  const dx1 = x1 - x2,
    dx2 = x3 - x2,
    dy1 = y1 - y2,
    dy2 = y3 - y2;
  const sx = x0 - x1 + x2 - x3,
    sy = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1 || 1e-9;
  const g = (sx * dy2 - dx2 * sy) / den,
    hh = (dx1 * sy - sx * dy1) / den;
  const a = x1 - x0 + g * x1,
    b = x3 - x0 + hh * x3,
    c = x0;
  const d = y1 - y0 + g * y1,
    e = y3 - y0 + hh * y3,
    f = y0;
  // unit square → quad: [a b c; d e f; g hh 1]; prescale by 1/w, 1/h
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${m.map((v) => +v.toFixed(9)).join(",")})`;
}

/** Linear blend between two quads (used while the still crossfades into the live canvas). */
export function mixQuad(a: Quad, b: Quad, t: number): Quad {
  return a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]) as Quad;
}
