# Portrait variant of the interior: same furniture sizes, positions may move (pulled toward the pc layout).
import json, sys
import numpy as np
import os; sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import solve as S
d = json.load(open(sys.argv[1]))
ppc = d['int']['params']
TIGHT = {'dW', 'dD', 'dHt', 'ch', 'Hc', 'lr', 'dH', 's1H', 's2H'}
P = {}
for k, (v0, sg) in S.INT_P.items():
    P[k] = (ppc[k], 0.02 if k in TIGHT else sg * 0.6)
P['zLc3'] = (-4.0, 3.0); P['zRc3'] = (-4.0, 3.0)
best = None
for fh in (50, 60, 70):
    for zz in (0.0, 1.0):
        c0 = {'K2hp': S.cam_init([0, 1.66, zz], 0.03, -0.25, fh, S.SIZES['K2hp'][0])}
        p, cm, rep = S.solve(P, S.int_points, {'K2hp': S.INT_OBS['K2hp']}, c0)
        if best is None or rep['K2hp']['mean%'] < best[0]: best = (rep['K2hp']['mean%'], p, cm, rep)
_, p, cm, rep = best
moved = {k: round(p[k] - ppc[k], 3) for k in ppc if abs(p[k] - ppc[k]) > 0.05 and not k.startswith('z')}
d['int_hp'] = {'params': {k: round(float(v), 4) for k, v in p.items()}, 'cams': {'K2hp': S.cam_out(cm['K2hp'], S.SIZES['K2hp'])}, 'err': rep, 'moved': moved}
json.dump(d, open(sys.argv[2], 'w'), indent=1)
r = rep['K2hp']; print('K2hp mean', r['mean%'], 'max', r['max%'], r['worst']); print('cam', d['int_hp']['cams']['K2hp']); print('moved', moved)
