// Glass without `transmission` (tahap 7 research: an extra render pass per object and broken on some Android GPUs):
// a plain transparent, unlit material whose map carries a soft reflection gradient and thin highlight streaks, as in
// the team's videos K8 and K9.1. Shared by Kreatekno's facade seen from inside (sets/row) and the lobby (sets/lobby).
import * as THREE from "three";
import type { Kit } from "../core/kit";

/**
 * One glass material. `sheen` scales the reflection (0 clear … 1 the meeting room's glass at K8), `tint` its colour.
 * Each pane maps the texture once (its own 0..1 UVs), so every pane gets the same streaks.
 */
export function glassMaterial(kit: Kit, { sheen = 1, tint = "#eef2ff", side = THREE.FrontSide as THREE.Side } = {}) {
  const tex = kit.canvasTex(256, 256, (g, w, h) => {
    // the reflection: stronger at the top, a lilac haze
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, `rgba(236,232,255,${0.2 * sheen})`);
    gr.addColorStop(0.55, `rgba(228,226,250,${0.09 * sheen})`);
    gr.addColorStop(1, `rgba(240,236,255,${0.13 * sheen})`);
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
    // two broad diagonal bands and a thin bright line (the videos' streaks), leaning right
    const band = (x: number, width: number, a: number) => {
      g.save();
      g.translate(x * w, h / 2);
      g.transform(1, 0, -0.45, 1, 0, 0);
      const b = g.createLinearGradient(-width * w, 0, width * w, 0);
      b.addColorStop(0, "rgba(255,255,255,0)");
      b.addColorStop(0.5, `rgba(255,255,255,${a * sheen})`);
      b.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = b;
      g.fillRect(-width * w, -h, 2 * width * w, 2 * h);
      g.restore();
    };
    band(0.18, 0.1, 0.16);
    band(0.33, 0.035, 0.12);
    band(0.78, 0.07, 0.12);
    band(0.86, 0.008, 0.45);
  });
  return new THREE.MeshBasicMaterial({
    map: tex,
    color: tint,
    transparent: true,
    depthWrite: false,
    side,
  });
}

/** A pane w × h facing +z with its own 0..1 UVs (merged with others, each keeps the whole texture). */
export const pane = (w: number, h: number) => new THREE.PlaneGeometry(w, h);
