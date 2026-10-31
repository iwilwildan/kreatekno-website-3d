# Side-by-side and 50% overlay of render vs keyframe.
import sys
from PIL import Image, ImageDraw
REF = {'pc': {'K0': 'kf/K0_pc.png', 'K1': 'kf/K1_pc.png', 'K2': 'kf/K2_pc.png'}, 'hp': {'K0': 'kf/K0_hp.png', 'K1': 'kf/K1_hp.png', 'K2': 'kf/K2_hp.png'}}
out = sys.argv[1]
for fmt in ('pc', 'hp'):
    for k in ('K0', 'K1', 'K2'):
        r = Image.open(f'render/{fmt}_{k}.png').convert('RGB'); ref = Image.open(REF[fmt][k]).convert('RGB').resize(r.size, Image.LANCZOS)
        W, H = r.size; gap = 12
        sbs = Image.new('RGB', (W * 3 + gap * 2, H + 40), 'white'); d = ImageDraw.Draw(sbs)
        sbs.paste(ref, (0, 40)); sbs.paste(r, (W + gap, 40)); sbs.paste(Image.blend(ref, r, 0.5), (2 * (W + gap), 40))
        for i, t in enumerate(['Keyframe ' + k + ' ' + fmt, 'Render Three.js', 'Overlay 50%']): d.text((i * (W + gap) + 8, 12), t, fill=(30, 30, 40))
        s = 2400 / sbs.width if sbs.width > 2400 else 1
        sbs.resize((int(sbs.width * s), int(sbs.height * s))).save(f'{out}/{fmt}_{k}.jpg', quality=86)
