# Tools (local only, not shipped)

`npm ci` here installs Playwright 1.64.1. It drives the locally installed Edge (or Chrome), so no browser download is needed. Renders use SwiftShader, so they match on every machine.

Start the site first (`preview_start` `site` on port 3000, or `site-prod` on 3100 for a production build), then:

| Command | What it does |
|---|---|
| `npm run bake-ao` | Bakes the AO maps of every AO plane into `site/public/world/ao/` (exterior from layout step 0, interior per layout step 0–4). Run after changing a set |
| `npm run stills` | Renders K0, K1, K2 for pc (1600×900) and hp (720×1280) into `site/public/stills/`, and writes the billboard quads to `site/components/home/stills.json`. Run after `bake-ao` or a camera change |
| `node render/shots.mjs compare OUT` | Canvas renders of the site and of `prototype/k0-k2-3d.html` at each keyframe; then `python -I render/diff.py OUT` for the pixel difference |
| `node render/shots.mjs page OUT` | Full-page review shots with the HTML copy (1280×720, 375×812) |
| `node render/keys.mjs OUT [K1,K2] [pc,hp]` | Canvas renders of the site at keyframe holds, with draw calls and triangles |
| `node render/cast.mjs NAME OUT [hemat]` | Turnaround sheet, close-up and shadowless sheet of a cast member from the dev lab (`/?lab=NAME`; names in `site/world/cast/roster.ts`) |
| `python -I render/castvs.py TURNAROUND SHEET OUT [x0 x1]` | Team turnaround above the render at the same figure height (chat only) |
| `python -I render/castprofile.py TURNAROUND FLAT [x0 x1]` | Front silhouette width per 2.5% of height, turnaround vs render |
| `node render/motion.mjs OUT [pc\|hp] [K1] [K2.2] [n]` | Tahap 4: frames from scrolling the page between two keyframes, the whip pan every 60 ms, and how far Heru's planted feet slide; `FPS=1` (and `CPU=4`) also scrolls K1 → K2.2 in 6 s and reports the frame rate |
| `node render/walk.mjs OUT [NAME] [n]` | Side view of a cast member walking in the dev lab (`/?lab=NAME&walk`), with the springs |
| `BASE=http://localhost:3100 node render/perf.mjs` | First load on a throttled phone profile: LCP, JS bytes, AO and still bytes, time until the 3D crossfades in |

Review shots go to a temp folder or the scratchpad, never into the repo (keyframes and team masters must not be committed).

`camera-solve/` is a copy of the camera solver from `prototype/k0-k2/tools/`. The solve itself needs only SciPy (OpenCV was used for measuring). `solve_cast.py` re-solves the K2 cameras with Heru's head at 1.8 m (tahap 3); feed its output to `prep.py` as the 4th argument:

```
python solve.py solve.json && python solve_hp.py solve.json solve2.json
python solve_cast.py solve2.json cast.json 3
python prep.py solve2.json ../../prototype/k0-k2/data/company_glyphs.json data.json cast.json
```

Then copy `data.json` to `site/world/takes/home/` and run Prettier on it. `solve_k2x.py` (tahap 4) solves the K2.1 and K2.2 cameras on the end frames of the footage, camera only, with priors (the footage room is recomposed): `python solve_k2x.py ../../site/world/takes/home/data.json out.json`, then copy its `cams` into `data.json`. Inputs and outputs stay outside the repo; see `prototype/k0-k2/HANDOFF.md`.
