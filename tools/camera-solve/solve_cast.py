# K2 cameras re-solved with the cast at real scale (tahap 3, option c of the prototype HANDOFF).
# Heru is 1.80 m everywhere, so his head seen from behind in K2 pins the camera height; the room
# observations from solve.py still apply. Heru's head is measured on the last frame of the k1 - k2 footage,
# which matches the K2 keyframe points (checked 1 Nov 2026).
# Usage: python solve_cast.py solve2.json out.json [heru_weight]
import json, sys, os
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import solve as S

HERU_TOP, HERU_MID, HERU_HALF = 1.80, 1.59, 0.2  # hair top, widest row of the hair from behind, half width (site/world/cast/heru.ts)
# Hair silhouette on the k1 - k2 end frames (0..1000): top centre, left and right edge of the widest row
HERU_OBS = {'K2pc': {'hT': (485.0, 642.6), 'hL': (429.2, 781.5), 'hR': (554.7, 781.5)},
            'K2hp': {'hT': (536.1, 579.7), 'hL': (322.2, 681.2), 'hR': (676.4, 681.2)}}

def heru_pts(hx, hz):
    return {'hT': (hx, HERU_TOP, hz), 'hL': (hx - HERU_HALF, HERU_MID, hz), 'hR': (hx + HERU_HALF, HERU_MID, hz)}

def solve_cam(P, cam_name, cam0, hw, obs_room, hx0, hz0):
    """Room params P as (value, sigma); one camera; Heru head (hx, hz) free with weight hw on its points."""
    P = dict(P); P['hx'] = (hx0, 0.5); P['hz'] = (hz0, 1.0); names = list(P)
    n = len(names); W, H = S.SIZES[cam_name]; sig = 6.0 * max(W, H) / 2816
    x0 = np.concatenate([[P[k][0] for k in names], cam0])
    def pts(x):
        p = dict(zip(names, x[:n])); q = S.int_points(p); q.update(heru_pts(p['hx'], p['hz'])); return p, q
    def res(x):
        p, q = pts(x); cam = x[n:]; r = []
        for obs, w in ((obs_room, S.WEIGHT.get(cam_name, 1.0)), (HERU_OBS[cam_name], hw)):
            keys = list(obs); uv, z = S.project(cam, np.array([q[k] for k in keys]), (W, H))
            o = np.array([[obs[k][0] / 1000 * W, obs[k][1] / 1000 * H] for k in keys])
            r.append(((uv - o) / sig * w).ravel()); r.append(np.minimum(z - 0.3, 0) * 100)
        r.append(np.array([(p[k] - P[k][0]) / P[k][1] for k in names])); r.append(S.cam_prior(cam_name, cam))
        return np.concatenate(r)
    from scipy.optimize import least_squares
    sol = least_squares(res, x0, loss='soft_l1', f_scale=2.0, max_nfev=20000, x_scale='jac')
    p, q = pts(sol.x); cam = sol.x[n:]
    rep = {}
    for tag, obs in (('room', obs_room), ('heru', HERU_OBS[cam_name])):
        keys = list(obs); uv, _ = S.project(cam, np.array([q[k] for k in keys]), (W, H))
        o = np.array([[obs[k][0] / 1000 * W, obs[k][1] / 1000 * H] for k in keys])
        e = np.linalg.norm(uv - o, axis=1) / W * 100
        rep[tag] = {'mean%': round(float(e.mean()), 2), 'max%': round(float(e.max()), 2), 'worst': keys[int(e.argmax())]}
    return p, cam, rep

if __name__ == '__main__':
    d = json.load(open(sys.argv[1])); hw = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    ipc, ihp = d['int']['params'], d['int_hp']['params']
    out = {}
    for name, base, room in (('K2pc', ipc, S.INT_OBS['K2pc']), ('K2hp', ihp, S.INT_OBS['K2hp'])):
        # room held at its solved shape (it is shared with the master and the other format); camera and Heru free
        P = {k: (v, 1e-3) for k, v in base.items()}
        c = d['int']['cams']['K2pc'] if name == 'K2pc' else d['int_hp']['cams']['K2hp']
        best = None
        for dy in (0.0, 0.2, 0.4, 0.6):
            for hz in (-0.3, -0.8, -1.3):
                pos = np.array(c['pos']) + [0, dy, 0]; look = np.array(c['look'])
                fwd = look - pos; yaw = np.arctan2(-fwd[0], -fwd[2]); pitch = np.arcsin(fwd[1] / np.linalg.norm(fwd))
                fovh = c['fovH']
                cam0 = S.cam_init(pos.tolist(), yaw, pitch, fovh, S.SIZES[name][0])
                p, cam, rep = solve_cam(P, name, cam0, hw, room, pos[0], pos[2] + hz)
                score = rep['room']['mean%'] + rep['heru']['mean%']
                if best is None or score < best[0]: best = (score, p, cam, rep)
        _, p, cam, rep = best
        co = S.cam_out(cam, S.SIZES[name])
        out[name] = {'cam': co, 'heru': [round(float(p['hx']), 3), round(float(p['hz']), 3)], 'err': rep}
        print(f"{name} w={hw}: room mean {rep['room']['mean%']}% max {rep['room']['max%']}% ({rep['room']['worst']}) | "
              f"heru mean {rep['heru']['mean%']}% max {rep['heru']['max%']}% | cam y {co['pos'][1]:.3f} (was {c['pos'][1]:.3f}) "
              f"fovV {co['fovV']:.2f} (was {c['fovV']:.2f}) heru {out[name]['heru']} dist {np.hypot(p['hx'] - co['pos'][0], p['hz'] - co['pos'][2]):.2f}")
    json.dump(out, open(sys.argv[2], 'w'), indent=1)
