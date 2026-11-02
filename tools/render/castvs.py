# Puts a cast render under the team turnaround at the same figure height, for review in chat only.
# The turnaround comes from refs/ and the result must stay outside the repo.
# Usage: python -I render/castvs.py TURNAROUND.png RENDER_sheet.png OUT.png [x0 x1 of the views in the turnaround]
import sys
import numpy as np
from PIL import Image

def figure_box(im, bg_tol=28):
    a = np.asarray(im.convert('RGB')).astype(int)
    bg = np.median(a[5:40, 5:40].reshape(-1, 3), 0)
    m = np.abs(a - bg).sum(2) > bg_tol
    # ignore the soft floor shadow: keep rows/cols with enough foreground
    rows = np.nonzero(m.sum(1) > 6)[0]
    cols = np.nonzero(m.sum(0) > 6)[0]
    return cols.min(), rows.min(), cols.max(), rows.max()

ref = Image.open(sys.argv[1]).convert('RGB')
ren = Image.open(sys.argv[2]).convert('RGB')
x0, x1 = (int(sys.argv[4]), int(sys.argv[5])) if len(sys.argv) > 5 else (int(ref.width * 0.37), ref.width)
ref = ref.crop((x0, 0, x1, ref.height))
H = 640
out = []
for im in (ref, ren):
    l, t, r, b = figure_box(im)
    pad = int((b - t) * 0.04)
    c = im.crop((max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad)))
    out.append(c.resize((int(c.width * H / c.height), H), Image.LANCZOS))
W = max(o.width for o in out)
canvas = Image.new('RGB', (W, H * 2 + 10), (255, 255, 255))
for i, o in enumerate(out):
    canvas.paste(o, ((W - o.width) // 2, i * (H + 10)))
canvas.save(sys.argv[3])
print('saved', sys.argv[3], canvas.size)
