# K2.1 and K2.2 cameras (tahap 4): camera-only solves on the end frames of the footage `k2 - k2.1` and
# `k2.1 - k2.2` (pc 1280x720, hp 720x1280). The room is held as built (data.json int params + intOffset);
# the footage room is an AI recomposition that does not keep its proportions, so the solve frames what matters:
# the two staff in each shot (crown of the head, measured on the site's cast at its K2 pose) and the front top
# corners of their desks, plus one counter corner. Error is reported in % of the frame width.
# Usage: python solve_k2x.py ../../site/world/takes/home/data.json out.json
import json, sys, os
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation as Rot
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import solve as S

SIZE = {'pc': (1280, 720), 'hp': (720, 1280)}
# crown of each seated member (top vertex of the skinned mesh at the K2 pose, world metres), from the site
CROWN = {'pc': {'sinta': (-3.132, 1.481, -5.385), 'bayu': (-1.586, 1.573, -6.413),
                'nadia': (1.138, 1.557, -6.632), 'fajar': (2.672, 1.661, -5.669)},
         'hp': {'sinta': (-2.78, 1.481, -7.752), 'bayu': (-1.684, 1.573, -8.818),
                'nadia': (0.951, 1.557, -8.864), 'fajar': (1.87, 1.661, -7.961)}}
# footage end frames, 0..1000 of width and height
OBS = {
    'K2.1pc': {'D1tFL': (111, 881), 'D1tFR': (441, 884), 'D2tFL': (559, 864), 'D2tFR': (871, 870),
               'sinta': (366, 503), 'bayu': (750, 531), 'ctL': (879, 714)},
    'K2.2pc': {'D3tFL': (100, 877), 'D3tFR': (424, 879), 'D4tFL': (544, 870), 'D4tFR': (919, 889),
               'nadia': (293, 496), 'fajar': (689, 484), 'ctR': (107, 750)},
    'K2.1hp': {'D1tFL': (51, 591), 'D1tFR': (422, 590), 'D2tFL': (555, 584), 'D2tFR': (905, 587),
               'sinta': (337, 454), 'bayu': (766, 466), 'ctL': (911, 530)},
    'K2.2hp': {'D3tFL': (44, 588), 'D3tFR': (404, 587), 'D4tFL': (540, 589), 'D4tFR': (956, 594),
               'nadia': (260, 452), 'fajar': (699, 449), 'ctR': (51, 543)},
}
# crowns are measured on characters, desks on furniture the footage moved: crowns count a little more
W_PT = {'sinta': 1.5, 'bayu': 1.5, 'nadia': 1.5, 'fajar': 1.5}

def world_points(d, fmt):
    q = S.int_points(d['int'][fmt]); off = np.array(d['intOffset'][fmt])
    w = {k: tuple(np.array(v) + off) for k, v in q.items()}
    w.update(CROWN[fmt]); return w

# the footage keeps the K2 lens (a dolly, not a zoom) and stays near seated eye height; the whip pan to K2.2 turns
# the camera where it is, so K2.2 stays near K2.1
PRIOR = {'h': (1.5, 0.3), 'x': (0.0, 0.4), 'fov': 8.0, 'near': 0.3}

def solve_one(name, d, anchor=None):
    fmt = name[-2:]; W, H = SIZE[fmt]; obs = OBS[name]; P = world_points(d, fmt)
    keys = list(obs); X = np.array([P[k] for k in keys]); o = np.array([[obs[k][0] / 1000 * W, obs[k][1] / 1000 * H] for k in keys])
    w = np.array([W_PT.get(k, 1.0) for k in keys]); sig = 6.0 * max(W, H) / 2816
    def res(c):
        uv, z = S.project(c, X, (W, H)); R = Rot.from_rotvec(c[:3]).as_matrix()
        right = R.T @ np.array([1.0, 0, 0]); roll = np.arcsin(np.clip(right[1], -1, 1))
        fov = np.degrees(2 * np.arctan(H / 2 / np.exp(c[6])))
        pr = [roll / 0.01, (c[4] - PRIOR['h'][0]) / PRIOR['h'][1], (c[3] - PRIOR['x'][0]) / PRIOR['x'][1], (fov - d['cams'][fmt]['K2']['fov']) / PRIOR['fov']]
        if anchor is not None: pr += list((c[3:6] - anchor) / PRIOR['near'])
        # the camera has passed over Heru (he stands at his K2 spot): keep it 0.5 m clear of his head
        hk = np.array(d['heruK2'][fmt]); pr.append(min(np.linalg.norm(c[3:6] - hk) - 0.5, 0) * 50)
        # priors in the same units as a point a few pixels off, so they hold against the recomposed footage room
        return np.concatenate([((uv - o) / sig * w[:, None]).ravel(), np.minimum(z - 0.3, 0) * 100, np.array(pr) * 6])
    best = None
    tgt = np.mean(X, 0)
    for dist in (1.6, 2.4, 3.4):
        for fov in (25, 40, 55):
            for dy in (-0.2, 0.3):
                yaw = 0.0
                C = tgt + np.array([0, 0.3 + dy, dist]); fwd = tgt - C
                yaw = np.arctan2(-fwd[0], -fwd[2]); pitch = np.arcsin(fwd[1] / np.linalg.norm(fwd))
                c0 = S.cam_init(C.tolist(), yaw, pitch, fov, W)
                sol = least_squares(res, c0, loss='linear', max_nfev=5000, x_scale='jac')
                if best is None or sol.cost < best.cost: best = sol
    c = best.x; uv, _ = S.project(c, X, (W, H)); e = np.linalg.norm(uv - o, axis=1) / W * 100
    co = S.cam_out(c, (W, H))
    return co, {'mean%': round(float(e.mean()), 2), 'max%': round(float(e.max()), 2), 'worst': keys[int(e.argmax())],
                'per': {k: round(float(v), 2) for k, v in zip(keys, e)}}

def quat(c):
    pos, look, up = map(np.array, (c['pos'], c['look'], c['up']))
    z = pos - look; z /= np.linalg.norm(z); x = np.cross(up, z); x /= np.linalg.norm(x); y = np.cross(z, x)
    return Rot.from_matrix(np.stack([x, y, z], 1)).as_quat().round(6).tolist()

if __name__ == '__main__':
    d = json.load(open(sys.argv[1], encoding='utf-8')); out = {'pc': {}, 'hp': {}}; err = {}
    for name in OBS:
        fmt = name[-2:]; key = name[:-2]
        anchor = np.array(out[fmt]['K2.1']['pos']) if key == 'K2.2' else None
        co, rep = solve_one(name, d, anchor)
        out[fmt][key] = {'pos': [round(float(v), 4) for v in co['pos']], 'quat': quat(co), 'fov': co['fovV']}
        err[name] = rep
        print(f"{name:7s} mean {rep['mean%']:5.2f}% max {rep['max%']:5.2f}% ({rep['worst']}) pos {out[fmt][key]['pos']} fovV {co['fovV']}")
    json.dump({'cams': out, 'err': err}, open(sys.argv[2], 'w'), indent=1)
