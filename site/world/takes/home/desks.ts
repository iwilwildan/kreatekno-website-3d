// Issue #30: the plaques on the front panels of the four staff desks (copy v3, docs/HOME-V1-COPY.md parts 2 and 10).
// "Before" while the camera reads the desks in beat 2: Sinta's and Bayu's as the dolly settles on them (K2 → K2.1),
// Nadia's and Fajar's after the whip pan (K2.2) until the camera tilts down to the counter. "After" from the moment
// the camera is through COMPANY's door behind Bu Dewi to the K11.1 stop (the staff are already in the classroom),
// and again at the K13 stop at dusk, both on K2's view. One anchor per desk and phase, on the same panel: each is
// boxed at its size where it is read.
import * as THREE from "three";
import type { Anchor } from "../../core/anchors";
import { segmentStart, smoothstep } from "../../core/segments";
import { DESK_OF, deskPanelCorners, type DeskMember } from "../../sets/companyFront";
import { SEG } from "./timing";

const seg = (from: string, type: "move" | "hold") => {
  const i = SEG.findIndex((s) => s.from === from && s.type === type);
  return { s: segmentStart(SEG, i), len: SEG[i].screens };
};
const k2hold = seg("K2", "hold"),
  k111 = seg("K11.1", "hold"),
  k21 = seg("K2.1", "move"),
  k22 = seg("K2.2", "hold"),
  k22out = seg("K2.2", "move"),
  k13 = seg("K13", "hold");

/**
 * Screens where the after copy comes in on the way in to K11.1 (Bu Dewi stepping in, the camera in the doorway with
 * all four panels clear of its frame) and goes after the stop, as the camera moves on over her head.
 */
const K111 = {
  in: k111.s - 0.33,
  // (9:16: Bu Dewi walks in at the middle of the frame, in front of Bayu's and Nadia's panels, until just before
  // the stop; HTML can't be hidden behind her)
  inPortrait: k111.s - 0.1,
  out: k111.s + k111.len,
};

/** Screens where the before copy comes in: the camera following Heru is through COMPANY's door (K1 → K2). */
const K2_ENTER = k2hold.s - 0.48;

export const DESK_WHO = Object.keys(DESK_OF) as DeskMember[];
export type DeskPhase = "before" | "after";
/** Sinta's and Bayu's desks are read at K2.1, Nadia's and Fajar's at K2.2. */
const FIRST: Record<DeskMember, boolean> = { sinta: true, bayu: true, nadia: false, fajar: false };

export type DeskCopy = { anchor: Anchor; who: DeskMember; phase: DeskPhase; full: Anchor["corners"] };
/** The eight copy boxes (4 desks × before, after) of layout step `step`. */
export function deskAnchors(step: number): DeskCopy[] {
  return (["before", "after"] as const).flatMap((phase) =>
    DESK_WHO.map((who) => {
      const full = deskPanelCorners(step, who);
      return { who, phase, full, anchor: { name: `desk-${phase}-${who}`, corners: [...full] as Anchor["corners"] } };
    }),
  );
}

/** Screens where each box is framed as it is read (its size is measured there): K2.1, the K2.2 hold, the K13 hold. */
export function deskReadAt(c: DeskCopy) {
  if (c.phase === "after") return k13.s + k13.len / 2;
  return FIRST[c.who] ? k21.s : k22.s + k22.len / 2;
}
/**
 * K2's wide view (K11.1, K13) cuts the outer desks at the screen's sides on some formats (16:9: Sinta's at the
 * left edge): the after copy then sits on the part of the panel in view, `margin` px clear of the edges, as seen by
 * `camera` (the K13 stop) on a screen `width` px wide. Back to the whole panel when less than half of it is in view
 * (9:16: the outer desks), the copy then cut by the screen's side with it. The before copy is read close up and
 * keeps the whole panel.
 */
export function fitDeskToView(c: DeskCopy, camera: THREE.Camera, width: number, margin = 8) {
  if (c.phase !== "after") return;
  const [tl, tr, bl, br] = c.full,
    m = (2 * margin) / width,
    v = new THREE.Vector3();
  const inside = (p: THREE.Vector3) => {
    v.copy(p).project(camera);
    return v.z < 1 && v.x > -1 + m && v.x < 1 - m;
  };
  const N = 60;
  let best = [0, -1],
    run = -1;
  for (let i = 0; i <= N; i++) {
    const u = i / N,
      ok = inside(tl.clone().lerp(tr, u)) && inside(bl.clone().lerp(br, u));
    if (ok && run < 0) run = i;
    if ((!ok || i === N) && run >= 0) {
      const end = ok ? i : i - 1;
      if (end - run > best[1] - best[0]) best = [run, end];
      run = -1;
    }
  }
  const span = (best[1] - best[0]) / N,
    [u0, u1] = span >= 0.5 ? [best[0] / N, best[1] / N] : [0, 1];
  const at = (a: THREE.Vector3, b: THREE.Vector3, u: number) => a.clone().lerp(b, u);
  c.anchor.corners = [at(tl, tr, u0), at(tl, tr, u1), at(bl, br, u0), at(bl, br, u1)];
}

/** The whip (0 at K2.1, 1 at K2.2) at the screens deskReadAt gives. */
export const deskReadWhip = (c: DeskCopy) => (c.phase === "before" && FIRST[c.who] ? 0 : 1);

/**
 * Opacity of a desk's copy at screens x and whip pan `whip` (0..1), before the on-screen check: in as the dolly
 * comes down to Sinta's and Bayu's desks and out as the whip starts; Nadia's and Fajar's in as the whip settles and
 * out as the camera tilts down to the counter; the after copy over the K13 stop.
 */
export function deskCopyFade(c: DeskCopy, x: number, whip: number, portrait = false) {
  if (c.phase === "after")
    return Math.max(
      // in once the camera is through COMPANY's door behind Bu Dewi, out as it moves on over her head (K11.1)
      smoothstep(portrait ? K111.inPortrait : K111.in, (portrait ? K111.inPortrait : K111.in) + 0.06, x) *
        (1 - smoothstep(K111.out, K111.out + 0.06, x)),
      smoothstep(k13.s - 0.12, k13.s - 0.01, x) * (1 - smoothstep(k13.s + k13.len + 0.01, k13.s + k13.len + 0.08, x)),
    );
  // all four from the moment the camera is through COMPANY's door behind Heru; Nadia's and Fajar's leave the frame
  // as the dolly pans left and come back after the whip
  const enter = smoothstep(K2_ENTER, K2_ENTER + 0.06, x) * (1 - smoothstep(0.02, 0.25, whip));
  if (FIRST[c.who]) return enter;
  return Math.max(enter, smoothstep(0.75, 0.98, whip)) * (1 - smoothstep(k22out.s, k22out.s + 0.1, x));
}
