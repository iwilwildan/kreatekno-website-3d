# Build data.json for the scene: world params, cameras (world space, quaternion), interior offsets, placeholder figures.
import json, sys, os
import numpy as np
from scipy.spatial.transform import Rotation as Rot
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import solve as S
d = json.load(open(sys.argv[1])); glyphs = json.load(open(sys.argv[2]))
ext = d['ext']['params']; ipc = d['int']['params']; ihp = d['int_hp']['params']
def quat(c):
    pos, look, up = map(np.array, (c['pos'], c['look'], c['up']))
    z = pos - look; z /= np.linalg.norm(z); x = np.cross(up, z); x /= np.linalg.norm(x); y = np.cross(z, x)
    return Rot.from_matrix(np.stack([x, y, z], 1)).as_quat().round(6).tolist()
cams_i = {'pc': d['int']['cams']['K2pc'], 'hp': d['int_hp']['cams']['K2hp']}
K2_WORLD = np.array([0.0, 0.0, -0.89])  # K2 camera lands 0.6 m inside the front wall, on the door axis
off = {v: (K2_WORLD - np.array([cams_i[v]['pos'][0], 0, cams_i[v]['pos'][2]])).round(4).tolist() for v in cams_i}
def cam(c, o=(0, 0, 0)):
    o = np.array(o); return {'pos': (np.array(c['pos']) + o).round(4).tolist(), 'quat': quat(c), 'fov': c['fovV']}
cams = {'pc': {'K0': cam(d['ext']['cams']['K0pc']), 'K1': cam(d['ext']['cams']['K1pc']), 'K2': cam(cams_i['pc'], off['pc'])},
        'hp': {'K0': cam(d['ext']['cams']['K0hp']), 'K1': cam(d['ext']['cams']['K1hp']), 'K2': cam(cams_i['hp'], off['hp'])}}
# back-project an image point onto a plane y = h (world) or z = const
def ray(cm, size, u, v):
    p = S.cam_init([0, 0, 0])  # unused, keeps API symmetrical
    pos = np.array(cm['pos']); look = np.array(cm['look']); up = np.array(cm['up'])
    W, H = size; f = H / 2 / np.tan(np.radians(cm['fovV']) / 2)
    fwd = (look - pos) / np.linalg.norm(look - pos); right = np.cross(fwd, up); right /= np.linalg.norm(right); upv = np.cross(right, fwd)
    dirv = fwd * f + right * (u / 1000 * W - W / 2) - upv * (v / 1000 * H - H / 2)
    return pos, dirv / np.linalg.norm(dirv)
def hit_y(cm, size, u, v, h):
    o, r = ray(cm, size, u, v); t = (h - o[1]) / r[1]; return o + r * t
def hit_z(cm, size, u, v, z):
    o, r = ray(cm, size, u, v); t = (z - o[2]) / r[2]; return o + r * t
heru_k1 = hit_y(d['ext']['cams']['K1pc'], S.SIZES['K1pc'], 503.8, 897, 0.0)
heru_top = hit_z(d['ext']['cams']['K1pc'], S.SIZES['K1pc'], 509, 555.8, heru_k1[2])
P = S.int_abs(ipc)
def behind(k, back=0.5):  # seat position behind a desk (away from the entrance), interior frame
    r = P[k + 'r']; c, s = np.cos(r), np.sin(r)
    return np.array([P[k + 'x'] + s * (-back - P['dD'] / 2), 0, P[k + 'z'] + c * (-back - P['dD'] / 2)])
staff = {'sinta': ('D1', 132, 515), 'bayu': ('D2', 361, 457), 'nadia': ('D3', 650, 464), 'fajar': ('D4', 889, 464)}
figs = {}
cK2 = d['int']['cams']['K2pc']
for name, (k, u, v) in staff.items():
    seat = behind(k); hz = hit_z(cK2, S.SIZES['K2pc'], u, v, seat[2])
    figs[name] = {'x': round(float(hz[0]), 3), 'z': round(float(seat[2]), 3), 'head': round(float(hz[1]), 3), 'seated': True}
dz = P['czF'] - 0.55; hz = hit_z(cK2, S.SIZES['K2pc'], 498, 343, dz)
figs['dewi'] = {'x': round(float(hz[0]), 3), 'z': round(float(dz), 3), 'head': round(float(hz[1]), 3), 'seated': False}
def along(cm, size, u, v, dist):
    o, r = ray(cm, size, u, v); return o + r * dist
def world_cam(c, o):
    c = dict(c); c['pos'] = (np.array(c['pos']) + np.array(o)).tolist(); c['look'] = (np.array(c['look']) + np.array(o)).tolist(); return c
k2pc = world_cam(cams_i['pc'], off['pc']); k2hp = world_cam(cams_i['hp'], off['hp'])
heru_k2 = {'pc': along(k2pc, S.SIZES['K2pc'], 498.5, 780, 2.0).round(3).tolist(), 'hp': along(k2hp, S.SIZES['K2hp'], 510, 720, 1.44).round(3).tolist()}
def cloud_set(cm, size, items, z):
    out = []
    for it in items:
        u, v, w = it[:3]; zz = it[3] if len(it) > 3 else z
        c = hit_z(cm, size, u, v, zz); dist = np.linalg.norm(c - np.array(cm['pos']))
        f = size[1] / 2 / np.tan(np.radians(cm['fovV']) / 2)
        out.append([round(float(c[0]), 2), round(float(c[1]), 2), round(float(zz), 2), round(float(w * size[0] * dist / f), 2)])
    return out
clouds = {'pc': cloud_set(d['ext']['cams']['K0pc'], S.SIZES['K0pc'], [(730, 205, 0.18), (965, 215, 0.13), (820, 745, 0.21), (30, 440, 0.12)], -40.0),
          'hp': cloud_set(d['ext']['cams']['K0hp'], S.SIZES['K0hp'], [(920, 45, 0.24), (40, 500, 0.14), (850, 752, 0.3, 0.6), (900, 360, 0.26), (240, 205, 0.32)], -40.0)}
birds = {'pc': cloud_set(d['ext']['cams']['K0pc'], S.SIZES['K0pc'], [(530, 168, 0.058), (620, 133, 0.058), (712, 98, 0.056), (808, 60, 0.056)], -1.7),
         'hp': cloud_set(d['ext']['cams']['K0hp'], S.SIZES['K0hp'], [(430, 262, 0.09), (575, 228, 0.09), (720, 194, 0.09), (880, 158, 0.09)], -1.7)}
data = {'ext': ext, 'int': {'pc': ipc, 'hp': ihp}, 'intOffset': off, 'cams': cams,
        'heru': {'k1': heru_k1.round(3).tolist(), 'height': round(float(heru_top[1]), 3)},
        'figs': figs, 'heruK2': heru_k2, 'clouds': clouds, 'birds': birds, 'glyphs': glyphs}
json.dump(data, open(sys.argv[3], 'w'), separators=(',', ':'))
print(json.dumps({'heruK2': heru_k2, 'clouds': clouds, 'birds': birds}))
