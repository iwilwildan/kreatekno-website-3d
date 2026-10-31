# Joint camera + world solve for the K0..K2 keyframes.
# World: metres, x along the street (right), y up, z out of the facade toward the street.
# Exterior origin: centre of the COMPANY door at ground level on the outer facade plane.
# Interior is solved in its own frame (origin under the K2 pc camera) and placed later.
import json, sys
import numpy as np
from scipy.optimize import least_squares
from scipy.spatial.transform import Rotation as Rot

SIZES = {'EXT': (2816, 1584), 'K1pc': (2816, 1584), 'K1hp': (1584, 2816), 'K0pc': (1672, 941), 'K0hp': (1584, 2816),
         'INT': (2816, 1584), 'K2pc': (2816, 1584), 'K2hp': (1125, 2000)}
WEIGHT = {'EXT': 0.35, 'INT': 0.35}  # masters count less than keyframes (keyframe > video > master)

# ---------------------------------------------------------------- exterior
EXT_P = {  # name: (init, prior sigma) ; door height 2.2 m is the fixed scale anchor
    'dw': (1.03, 0.08), 'xwR': (-1.98, 0.15), 'ywT': (2.33, 0.12), 'ywB': (0.51, 0.12), 'xwL': (-6.17, 0.3),
    'xsL': (-3.74, 0.3), 'xsR': (1.63, 0.3), 'ysT': (4.2, 0.25), 'ysB': (3.0, 0.25), 'zs': (0.1, 0.02),
    'xaL': (-1.70, 0.25), 'xaR': (4.57, 0.25), 'yaT': (2.89, 0.2), 'yaB': (2.38, 0.2), 'za': (0.5, 0.04),
    'xfL': (-6.88, 0.35), 'xfR': (4.77, 0.25),
    'xu1L': (-5.96, 0.3), 'xu1R': (-2.47, 0.25), 'xu2L': (0.69, 0.25), 'xu2R': (3.82, 0.25), 'yuB': (4.36, 0.25), 'yuT': (5.85, 0.25),
    'yP': (7.07, 0.25), 'zc': (0.12, 0.03),
    'xrL': (-1.63, 0.25), 'xrR': (4.51, 0.3), 'yrT': (7.61, 0.2), 'zr': (-0.8, 0.15), 'drb': (2.5, 0.5),
    'xbL': (-6.36, 0.3), 'xbR': (-2.38, 0.3), 'ybB': (8.24, 0.3), 'ybT': (10.3, 0.35), 'zb': (-0.5, 0.15),
}

def ext_points(p):
    d = p
    return {
        'dTL': (-d['dw'], 2.2, 0), 'dTR': (d['dw'], 2.2, 0), 'dBL': (-d['dw'], 0, 0), 'dBR': (d['dw'], 0, 0),
        'wTR': (d['xwR'], d['ywT'], 0), 'wBR': (d['xwR'], d['ywB'], 0), 'wTL': (d['xwL'], d['ywT'], 0), 'wBL': (d['xwL'], d['ywB'], 0),
        'sTL': (d['xsL'], d['ysT'], d['zs']), 'sTR': (d['xsR'], d['ysT'], d['zs']), 'sBL': (d['xsL'], d['ysB'], d['zs']), 'sBR': (d['xsR'], d['ysB'], d['zs']),
        'aTL': (d['xaL'], d['yaT'], d['za']), 'aTR': (d['xaR'], d['yaT'], d['za']), 'aBL': (d['xaL'], d['yaB'], d['za']), 'aBR': (d['xaR'], d['yaB'], d['za']),
        'u1TL': (d['xu1L'], d['yuT'], 0), 'u1TR': (d['xu1R'], d['yuT'], 0), 'u1BL': (d['xu1L'], d['yuB'], 0), 'u1BR': (d['xu1R'], d['yuB'], 0),
        'u2TL': (d['xu2L'], d['yuT'], 0), 'u2TR': (d['xu2R'], d['yuT'], 0), 'u2BL': (d['xu2L'], d['yuB'], 0), 'u2BR': (d['xu2R'], d['yuB'], 0),
        'fBL': (d['xfL'], 0, 0), 'fBR': (d['xfR'], 0, 0), 'pTL': (d['xfL'], d['yP'], d['zc']), 'pTR': (d['xfR'], d['yP'], d['zc']),
        'rTL': (d['xrL'], d['yrT'], d['zr']), 'rTR': (d['xrR'], d['yrT'], d['zr']), 'rTLb': (d['xrL'], d['yrT'], d['zr'] - d['drb']),
        'bTL': (d['xbL'], d['ybT'], d['zb']), 'bTR': (d['xbR'], d['ybT'], d['zb']), 'bBL': (d['xbL'], d['ybB'], d['zb']), 'bBR': (d['xbR'], d['ybB'], d['zb']),
    }

EXT_OBS = {  # normalized (0..1000) image coords; optional 3rd value = sigma in px
    'EXT': {'dTL': (518.5, 655.8), 'dTR': (600.7, 655.8), 'dBL': (518.5, 820.7), 'dBR': (600.7, 820.7),
            'wTR': (480.7, 643.7), 'wBR': (480.7, 782.3), 'wTL': (313, 643.7), 'wBL': (313, 782.3),
            'sTL': (410.2, 503.2), 'sTR': (625, 503.2), 'sBL': (410.2, 590.9), 'sBR': (625, 590.9),
            'aTL': (491.6, 604), 'aTR': (742.6, 604), 'aBL': (491.6, 642.4), 'aBR': (742.6, 642.4),
            'u1TL': (321.4, 382.6), 'u1TR': (460.9, 382.6), 'u1BL': (321.4, 493.7), 'u1BR': (460.9, 493.7),
            'u2TL': (587.4, 383.2), 'u2TR': (712.4, 383.2), 'u2BL': (587.4, 493.7), 'u2BR': (712.4, 493.7),
            'fBL': (284.6, 822), 'fBR': (748.3, 822), 'pTL': (284.6, 291.1), 'pTR': (748.3, 291.1),
            'rTL': (494.7, 250.7), 'rTR': (740, 250.7), 'bTL': (305.4, 70.4), 'bTR': (464.4, 70.4), 'bBL': (305.4, 203.6), 'bBR': (464.4, 203.6)},
    'K1pc': {'dTL': (325.1, 478.6), 'dTR': (539.6, 478.6), 'dBL': (325.1, 886.7), 'dBR': (539.6, 886.7),
             'wTR': (228, 457.7), 'wBR': (228, 792.9),
             'sTL': (45.5, 126.9), 'sTR': (603.7, 126.9), 'sBL': (45.5, 320), 'sBR': (603.7, 320),
             'aTL': (255, 364.7), 'aTR': (904.8, 358), 'aBR': (904.8, 454.5), 'aBL': (255, 452),
             'u1BR': (176.1, 108), 'u2BL': (504.3, 107.3), 'u2BR': (828.8, 107.3), 'fBR': (930, 894)},
    'K1hp': {'dTL': (505.7, 546.4), 'dTR': (851, 546.4), 'dBL': (505.7, 762.9), 'dBR': (851, 762.9),
             'wTR': (345.3, 534.1), 'wBR': (345.3, 709.2),
             'sTL': (49.2, 364.3), 'sTR': (952.7, 364.3), 'sBL': (49.2, 466), 'sBR': (952.7, 466),
             'aTL': (390.2, 489), 'aBL': (390.2, 530),
             'u1BR': (260.7, 354), 'u1TR': (260.7, 219.1), 'u2BL': (791.7, 353), 'u2TL': (791.7, 218.8),
             'rTL': (396.4, 60.7)},
    'K0pc': {'bTL': (102, 257.9), 'bTR': (577, 257.9), 'bBL': (102, 704.6), 'bBR': (577, 704.6),
             'rTL': (668, 898.7), 'rTLb': (668, 855.6)},
    'K0hp': {'bTL': (102.3, 420), 'bTR': (892.3, 420), 'bBL': (102.3, 648.5), 'bBR': (892.3, 648.5),
             'u1TL': (178, 932.5), 'u1TR': (889.7, 932.5)},
}

# ---------------------------------------------------------------- interior (own frame: camera K2pc near origin, looking -z)
INT_P = {  # depths are relative to the back wall so the furniture stays where a shop keeps it
    'ixL': (-5.0, 0.8), 'ixR': (5.0, 0.8), 'izB': (-8.6, 1.2), 'Hc': (3.4, 0.25),
    'lx1': (-3.1, 1.0), 'lx2': (-0.6, 1.0), 'lx3': (1.9, 1.0), 'ld1': (4.2, 1.2), 'ld2': (3.6, 1.2), 'ld3': (4.2, 1.2),
    'ly1': (2.35, 0.3), 'ly2': (2.35, 0.3), 'ly3': (2.35, 0.3), 'lr': (0.3, 0.05),
    'cxL': (-1.2, 0.6), 'cxR': (0.6, 0.6), 'cd': (2.9, 0.7), 'ch': (1.0, 0.05),
    'dxL': (-0.9, 0.6), 'dxR': (0.0, 0.6), 'dH': (2.2, 0.12),
    's1xL': (-3.2, 0.8), 's1xR': (-1.2, 0.8), 's1H': (1.9, 0.25), 's1d': (0.3, 0.08),
    's2xL': (2.3, 0.8), 's2xR': (3.4, 0.8), 's2H': (2.0, 0.25), 's2d': (0.3, 0.08),
    'dW': (1.2, 0.06), 'dD': (0.6, 0.05), 'dHt': (0.75, 0.025),
    'D1x': (-3.2, 1.0), 'D1d': (5.0, 1.0), 'D1r': (0.0, 0.5),
    'D2x': (-1.4, 0.8), 'D2d': (4.6, 0.8), 'D2r': (0.3, 0.4),
    'D3x': (0.8, 0.8), 'D3d': (4.6, 0.8), 'D3r': (-0.3, 0.4),
    'D4x': (2.6, 1.0), 'D4d': (5.0, 1.0), 'D4r': (0.0, 0.5),
    'zLc': (-4.0, 3.0), 'zRc': (-4.0, 3.0), 'zLc2': (-4.0, 3.0), 'zRc2': (-4.0, 3.0), 'zLc3': (-4.0, 3.0), 'zRc3': (-4.0, 3.0),
}

def int_abs(p):
    q = dict(p); B = p['izB']
    for i in (1, 2, 3): q[f'lz{i}'] = B + p[f'ld{i}']
    q['czF'] = B + p['cd']; q['s1z'] = B + p['s1d']; q['s2z'] = B + p['s2d']
    for k in ('D1', 'D2', 'D3', 'D4'): q[k + 'z'] = B + p[k + 'd']
    return q

def desk_pt(p, k, lx, ly, lz):
    c, s = np.cos(p[k + 'r']), np.sin(p[k + 'r'])
    # local x right, local z toward the camera (+z); yaw about +y
    return (p[k + 'x'] + c * lx + s * lz, ly, p[k + 'z'] - s * lx + c * lz)

def int_points(p):
    p = int_abs(p)
    W, D, H, ins = p['dW'], p['dD'], p['dHt'], 0.07
    lxo, lzo = W / 2 - ins, D / 2 - ins
    q = {
        'wTL': (p['ixL'], p['Hc'], p['izB']), 'wTR': (p['ixR'], p['Hc'], p['izB']), 'wBL': (p['ixL'], 0, p['izB']),
        'cL': (p['ixL'], p['Hc'], p['zLc']), 'cR': (p['ixR'], p['Hc'], p['zRc']),
        'cL2': (p['ixL'], p['Hc'], p['zLc2']), 'cR2': (p['ixR'], p['Hc'], p['zRc2']),
        'cL3': (p['ixL'], p['Hc'], p['zLc3']), 'cR3': (p['ixR'], p['Hc'], p['zRc3']),
        'ctL': (p['cxL'], p['ch'], p['czF']), 'ctR': (p['cxR'], p['ch'], p['czF']),
        'cbL': (p['cxL'], 0.1, p['czF']), 'cbR': (p['cxR'], 0.1, p['czF']),
        'bdL': (p['dxL'], p['dH'], p['izB']), 'bdR': (p['dxR'], p['dH'], p['izB']),
        's1L': (p['s1xL'], p['s1H'], p['s1z']), 's1R': (p['s1xR'], p['s1H'], p['s1z']),
        's2L': (p['s2xL'], p['s2H'], p['s2z']), 's2R': (p['s2xR'], p['s2H'], p['s2z']), 's2B': (p['s2xL'], 0, p['s2z']),
    }
    for i in (1, 2, 3):
        x, y, z = p[f'lx{i}'], p[f'ly{i}'], p[f'lz{i}']
        q[f'L{i}t'] = (x, p['Hc'], z); q[f'L{i}b'] = (x, y, z)
        q[f'L{i}l'] = (x - p['lr'], y, z); q[f'L{i}r'] = (x + p['lr'], y, z)
    for k in ('D1', 'D2', 'D3', 'D4'):
        q[k + 'FL'] = desk_pt(p, k, -lxo, 0, lzo); q[k + 'FR'] = desk_pt(p, k, lxo, 0, lzo)
        q[k + 'BL'] = desk_pt(p, k, -lxo, 0, -lzo); q[k + 'BR'] = desk_pt(p, k, lxo, 0, -lzo)
        q[k + 'tFL'] = desk_pt(p, k, -W / 2, H, D / 2); q[k + 'tFR'] = desk_pt(p, k, W / 2, H, D / 2)
    return q

INT_OBS = {
    'INT': {'wTL': (222.8, 212.5), 'wTR': (817.8, 212.5), 'wBL': (231.5, 574.3), 'cL': (0, 77.6), 'cR': (994.8, 100.7),
            'L1t': (178.7, 53.3), 'L2t': (434.6, 91.4), 'L3t': (683.7, 49.3), 'L1b': (180.5, 261.8), 'L2b': (434.6, 263), 'L3b': (683.7, 261.8),
            'L1l': (140.4, 261.8), 'L1r': (221, 261.8), 'L2l': (403.3, 263), 'L2r': (466.5, 263), 'L3l': (643.7, 261.8), 'L3r': (719.6, 261.8),
            'ctL': (410.5, 507), 'ctR': (584.9, 507), 'cbL': (413.4, 665.1), 'cbR': (581.4, 665.1),
            'bdL': (435.3, 317.8), 'bdR': (517, 317.8), 's1L': (266.2, 337.5), 's1R': (413.2, 337.5),
            's2L': (743.6, 325), 's2R': (840.4, 323.8), 's2B': (742.2, 622.5),
            'D1FR': (168.6, 839.5), 'D1BR': (144.5, 800), 'D2FL': (271.5, 815), 'D2FR': (420.4, 780.3), 'D2BR': (405.6, 747.4), 'D2BL': (261.2, 773.7),
            'D3FL': (555.9, 772.4), 'D3FR': (694.8, 811.8), 'D3BR': (704, 739.5), 'D3BL': (570.7, 732.9), 'D4FL': (787.4, 840), 'D4BL': (809.6, 798.7),
            'D1tFR': (177, 661.8), 'D2tFL': (253.8, 632), 'D2tFR': (429.7, 625.7), 'D3tFL': (546.7, 624.3), 'D3tFR': (715.2, 630.9), 'D4tFL': (780, 660.5)},
    'K2pc': {'wTL': (225.7, 221), 'wTR': (824.4, 222.4), 'cL2': (0, 90.8), 'cR2': (994.8, 123.7),
             'L1t': (181.6, 69), 'L2t': (437.9, 104.6), 'L3t': (688.1, 67.8), 'L1b': (182.6, 270.4), 'L2b': (438.2, 271.7), 'L3b': (686.3, 271.7),
             'L1l': (142.3, 270.4), 'L1r': (222.8, 270.4), 'L2l': (405.1, 271.7), 'L2r': (471.3, 271.7), 'L3l': (647, 271.7), 'L3r': (725.6, 271.7),
             'ctL': (408.8, 518), 'ctR': (585.6, 518), 'bdL': (438.2, 324.3), 's1L': (267.3, 347.4), 's1R': (420.6, 347.4),
             's2L': (743, 326.3), 's2R': (841.1, 326.3), 's2B': (742, 622.4),
             'D1FR': (169.5, 842.8), 'D2FL': (270.6, 819.7), 'D2FR': (419.5, 783.6), 'D2BR': (404, 755.3),
             'D3FR': (700.4, 816.4), 'D3BR': (709.6, 777), 'D3BL': (576.3, 744.1), 'D4FL': (791.9, 841.4), 'D4BL': (814.1, 803.3),
             'D1tFR': (180.5, 661.8), 'D2tFL': (250, 632.2), 'D2tFR': (430.9, 625.7), 'D3tFL': (552.2, 625.7), 'D3tFR': (721.5, 632.2), 'D4tFL': (780.7, 661.8)},
    'K2hp': {'wTL': (217.9, 249.7), 'wTR': (867.9, 249.7), 'cL3': (0, 200.2), 'cR3': (1000, 202.3),
             'L1t': (176.4, 184.2), 'L2t': (450, 198.2), 'L3t': (727, 184.2), 'L1b': (177.2, 290.7), 'L2b': (450, 291.5), 'L3b': (725.5, 291.5),
             'L1l': (131.4, 290.7), 'L1r': (222.9, 290.7), 'L2l': (408.6, 291.5), 'L2r': (491.4, 291.5), 'L3l': (682, 291.5), 'L3r': (769, 291.5),
             'ctL': (412.9, 420.6), 'ctR': (607, 420.6), 'cbL': (420, 527.1), 'cbR': (600, 527.1), 'bdL': (444.3, 314.8),
             's1L': (255.7, 340.9), 's1R': (418, 340.9), 's2L': (780, 336.9), 's2R': (884.3, 336.9), 's2B': (780, 470),
             'D2tFL': (234.3, 473.6), 'D2tFR': (448.6, 473.6), 'D2FL': (255, 555.2), 'D2FR': (435.7, 541.2),
             'D3tFL': (573.6, 470.8), 'D3tFR': (755.7, 473.6), 'D3FL': (585.7, 543.2), 'D3FR': (735.7, 555.2),
             'D1tFR': (180, 488.9), 'D1FR': (167.9, 565.3), 'D4tFL': (815.7, 493.7), 'D4FL': (827.1, 567.3)},
}

# ---------------------------------------------------------------- cameras
# camera params: rotvec (3, OpenCV world->cam), position C (3, world), log f
R0 = np.diag([1.0, -1.0, -1.0])  # looking along -z world, y up

def cam_init(C, yaw=0.0, pitch=0.0, fov_h=60.0, W=1):
    r = Rot.from_euler('yx', [yaw, pitch]).as_matrix()   # world-space turn of the camera
    R = R0 @ r.T
    f = W / 2 / np.tan(np.radians(fov_h) / 2)
    return np.concatenate([Rot.from_matrix(R).as_rotvec(), C, [np.log(f)]])

def project(cam, X, size):
    R = Rot.from_rotvec(cam[:3]).as_matrix(); C = cam[3:6]; f = np.exp(cam[6])
    Xc = (R @ (np.asarray(X, float) - C).T).T
    W, H = size
    return np.stack([f * Xc[:, 0] / Xc[:, 2] + W / 2, f * Xc[:, 1] / Xc[:, 2] + H / 2], 1), Xc[:, 2]

CAM_PRIOR = {  # (height y, sigma), (fovV deg, sigma); pitch/roll held near level
    'EXT': ((4.5, 3.0), (16, 10)), 'K1pc': ((2.0, 0.4), (34, 8)), 'K1hp': ((2.6, 0.6), (58, 10)),
    'K0pc': ((8.6, 1.0), (34, 8)), 'K0hp': ((8.6, 1.0), (58, 10)),
    'INT': ((1.66, 0.4), (54, 12)), 'K2pc': ((1.66, 0.4), (54, 12)), 'K2hp': ((1.66, 0.5), (75, 15)),
}

def cam_prior(c, cam):
    (h, hs), (fv, fs) = CAM_PRIOR[c]
    R = Rot.from_rotvec(cam[:3]).as_matrix(); f = np.exp(cam[6]); W, H = SIZES[c]
    fwd = R.T @ np.array([0, 0, 1.0]); right = R.T @ np.array([1.0, 0, 0])
    pitch = np.arcsin(np.clip(fwd[1], -1, 1)); roll = np.arcsin(np.clip(right[1], -1, 1))
    fov = np.degrees(2 * np.arctan(H / 2 / f))
    return np.array([(cam[4] - h) / hs, (fov - fv) / fs, pitch / (0.35 if c == 'K2hp' else 0.2), roll / 0.03])

def solve(P, pts_fn, OBS, cam0, px_sigma=6.0):
    names = list(P); n = len(names); cams = list(cam0)
    x0 = np.concatenate([[P[k][0] for k in names]] + [cam0[c] for c in cams])
    def unpack(x):
        p = dict(zip(names, x[:n])); cm = {c: x[n + 7 * i: n + 7 * i + 7] for i, c in enumerate(cams)}
        return p, cm
    def res(x):
        p, cm = unpack(x); q = pts_fn(p); r = []
        for c in cams:
            W, H = SIZES[c]; w = WEIGHT.get(c, 1.0); obs = OBS[c]
            keys = list(obs); X = np.array([q[k] for k in keys])
            uv, z = project(cm[c], X, SIZES[c])
            o = np.array([[obs[k][0] / 1000 * W, obs[k][1] / 1000 * H] for k in keys])
            sig = px_sigma * max(W, H) / 2816
            r.append(((uv - o) / sig * w).ravel())
            r.append(np.minimum(z - 0.3, 0) * 100)  # keep points in front of the camera
        r.append(np.array([(p[k] - P[k][0]) / P[k][1] for k in names]))
        for c in cams: r.append(cam_prior(c, cm[c]))
        return np.concatenate(r)
    sol = least_squares(res, x0, loss='soft_l1', f_scale=2.0, max_nfev=20000, x_scale='jac')
    p, cm = unpack(sol.x)
    report = {}
    q = pts_fn(p)
    for c in cams:
        W, H = SIZES[c]; obs = OBS[c]; keys = list(obs)
        uv, _ = project(cm[c], np.array([q[k] for k in keys]), SIZES[c])
        o = np.array([[obs[k][0] / 1000 * W, obs[k][1] / 1000 * H] for k in keys])
        e = np.linalg.norm(uv - o, axis=1) / W * 100  # % of frame width
        report[c] = {'mean%': round(float(e.mean()), 2), 'max%': round(float(e.max()), 2), 'worst': keys[int(e.argmax())],
                     'per': {k: round(float(v), 2) for k, v in zip(keys, e)}}
    return p, cm, report

def cam_out(cam, size):
    R = Rot.from_rotvec(cam[:3]).as_matrix(); C = cam[3:6]; f = np.exp(cam[6]); W, H = size
    fwd = R.T @ np.array([0, 0, 1.0]); up = R.T @ np.array([0, -1.0, 0])
    return {'pos': [round(float(v), 4) for v in C], 'look': [round(float(v), 4) for v in C + fwd * 5], 'up': [round(float(v), 4) for v in up],
            'fovV': round(float(np.degrees(2 * np.arctan(H / 2 / f))), 3), 'fovH': round(float(np.degrees(2 * np.arctan(W / 2 / f))), 3)}

if __name__ == '__main__':
    out = {}
    ext_cam0 = {
        'EXT': cam_init([-0.6, 4.5, 40], 0, 0, 16, SIZES['EXT'][0]),
        'K1pc': cam_init([1.8, 1.7, 9], 0, 0.05, 45, SIZES['K1pc'][0]),
        'K1hp': cam_init([1.0, 2.5, 11], 0, 0.05, 40, SIZES['K1hp'][0]),
        'K0pc': cam_init([-2.6, 8.6, 7], 0, -0.05, 45, SIZES['K0pc'][0]),
        'K0hp': cam_init([-4.2, 8.6, 7], 0, -0.05, 45, SIZES['K0hp'][0]),
    }
    p, cm, rep = solve(EXT_P, ext_points, EXT_OBS, ext_cam0)
    out['ext'] = {'params': {k: round(float(v), 4) for k, v in p.items()}, 'cams': {c: cam_out(cm[c], SIZES[c]) for c in cm}, 'err': rep}
    vp = dict(C=[0, 1.66, 0], yaw=np.radians(3.0), pitch=np.radians(-6.4), fov=2 * np.degrees(np.arctan(1408 / 1455)))
    int_cam0 = {'INT': cam_init(vp['C'], vp['yaw'], vp['pitch'], vp['fov'], SIZES['INT'][0]),
                'K2pc': cam_init(vp['C'], vp['yaw'], vp['pitch'] + 0.03, vp['fov'], SIZES['K2pc'][0])}
    obs2 = {k: INT_OBS[k] for k in ('INT', 'K2pc')}
    p, cm, rep = solve(INT_P, int_points, obs2, int_cam0)
    # K2 hp: camera only, world held fixed (its keyframe is a recomposition of the same room)
    fixed = {k: (p[k], 1e-4) for k in p}
    fixed['zLc3'] = (-4.0, 3.0); fixed['zRc3'] = (-4.0, 3.0)
    best = None
    for fh in (45, 55, 65, 75, 85):
        for zz in (-0.5, 0.5, 1.5):
            for pt in (-0.1, -0.2, -0.3):
                c0 = {'K2hp': cam_init([0, 1.66, zz], 0.03, pt, fh, SIZES['K2hp'][0])}
                p2, cm2, rep2 = solve(fixed, int_points, {'K2hp': INT_OBS['K2hp']}, c0)
                sc = rep2['K2hp']['mean%']
                if best is None or sc < best[0]: best = (sc, cm2, rep2)
    cm['K2hp'] = best[1]['K2hp']; rep['K2hp'] = best[2]['K2hp']
    out['int'] = {'params': {k: round(float(v), 4) for k, v in p.items()}, 'cams': {c: cam_out(cm[c], SIZES[c]) for c in cm}, 'err': rep}
    json.dump(out, open(sys.argv[1], 'w'), indent=1)
    for part in ('ext', 'int'):
        for c, r in out[part]['err'].items():
            cam = out[part]['cams'][c]
            print(f"{c:5s} mean {r['mean%']:5.2f}%  max {r['max%']:5.2f}% ({r['worst']})  pos {cam['pos']}  fovV {cam['fovV']}")
