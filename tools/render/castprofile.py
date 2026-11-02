# Width profile (front view) of the first figure in a turnaround and in a cast render: width / height per
# height fraction, to tune proportions by numbers. Review aid only; prints, writes nothing.
# Usage: python -I render/castprofile.py TURNAROUND.png RENDER_sheet.png [ref_x0 ref_x1]
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

def profile(path, x0=0, x1=None):
    a = np.asarray(Image.open(path).convert('RGB')).astype(int)
    a = a[:, x0:x1]
    bg = np.median(a[5:40, 5:40].reshape(-1, 3), 0)
    m = np.abs(a - bg).sum(2) > 45
    m = ndimage.binary_opening(m, iterations=2)
    lab, n = ndimage.label(m)
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    # leftmost large component = first figure
    big = [i + 1 for i, s in enumerate(sizes) if s > sizes.max() * 0.3]
    xs = {i: np.nonzero(lab == i)[1].min() for i in big}
    k = min(xs, key=xs.get)
    f = lab == k
    rows = np.nonzero(f.any(1))[0]
    top, bot = rows.min(), rows.max()
    # feet: drop the floor shadow by taking the lowest row that is not much wider than the shoes
    H = bot - top
    out = {}
    for frac in np.arange(0.0, 1.0001, 0.025):
        y = int(bot - frac * H)
        c = np.nonzero(f[y])[0]
        out[round(frac, 3)] = (c.max() - c.min()) / H if len(c) else 0
    return out, H

a, ha = profile(sys.argv[1], *(int(v) for v in sys.argv[3:5])) if len(sys.argv) > 4 else profile(sys.argv[1])
b, hb = profile(sys.argv[2])
print('frac  ref    render  diff')
for k in a:
    print(f'{k:5.3f} {a[k]:.3f}  {b[k]:.3f}  {b[k]-a[k]:+.3f}')
