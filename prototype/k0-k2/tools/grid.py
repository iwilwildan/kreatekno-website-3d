# Crop a keyframe region and draw a labelled grid in normalized coords (0..1000 on x and y of the full image).
import sys
from PIL import Image, ImageDraw, ImageFont
src, out, x0, y0, x1, y1 = sys.argv[1], sys.argv[2], *map(float, sys.argv[3:7])
step = float(sys.argv[7]) if len(sys.argv) > 7 else 10
im = Image.open(src).convert('RGB'); W, H = im.size
box = (int(x0 / 1000 * W), int(y0 / 1000 * H), int(x1 / 1000 * W), int(y1 / 1000 * H))
c = im.crop(box); cw, ch = c.size
scale = min(1400 / cw, 1400 / ch); c = c.resize((int(cw * scale), int(ch * scale)), Image.LANCZOS)
d = ImageDraw.Draw(c); f = ImageFont.load_default()
def X(v): return (v / 1000 * W - box[0]) * scale
def Y(v): return (v / 1000 * H - box[1]) * scale
v = (int(x0 / step) + 1) * step
while v < x1:
    major = abs(v / (step * 5) - round(v / (step * 5))) < 1e-6
    d.line([(X(v), 0), (X(v), c.size[1])], fill=(255, 0, 255) if major else (0, 220, 255), width=1)
    if major: d.text((X(v) + 2, 2), f'{v:g}', fill=(255, 0, 255), font=f)
    v += step
v = (int(y0 / step) + 1) * step
while v < y1:
    major = abs(v / (step * 5) - round(v / (step * 5))) < 1e-6
    d.line([(0, Y(v)), (c.size[0], Y(v))], fill=(255, 0, 255) if major else (0, 220, 255), width=1)
    if major: d.text((2, Y(v) + 2), f'{v:g}', fill=(255, 0, 255), font=f)
    v += step
c.save(out, quality=88)
