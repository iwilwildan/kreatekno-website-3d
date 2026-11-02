# Pixel difference between the site's renders and the prototype's (output of shots.mjs compare).
# Prints the mean absolute difference (0-255) and the share of pixels that differ by more than 16, and writes a
# side-by-side with a difference map per shot. Usage: python render/diff.py <shots folder>
import sys
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw

out = Path(sys.argv[1])
for fmt in ("pc", "hp"):
    for k in ("K0", "K1", "K2"):
        a = Image.open(out / f"proto_{fmt}_{k}.png").convert("RGB")
        b = Image.open(out / f"site_{fmt}_{k}.png").convert("RGB").resize(a.size)
        d = ImageChops.difference(a, b).convert("L")
        hist = d.histogram()
        n = sum(hist)
        mean = sum(i * c for i, c in enumerate(hist)) / n
        over = sum(hist[17:]) / n * 100
        print(f"{fmt} {k}: mean {mean:.2f}/255, {over:.2f}% pixels > 16")
        W, H = a.size
        sheet = Image.new("RGB", (W * 3 + 24, H + 36), "white")
        sheet.paste(a, (0, 36))
        sheet.paste(b, (W + 12, 36))
        sheet.paste(d.point(lambda v: min(255, v * 4)).convert("RGB"), (2 * (W + 12), 36))
        g = ImageDraw.Draw(sheet)
        for i, t in enumerate(["Prototype", "Situs", "Selisih x4"]):
            g.text((i * (W + 12) + 8, 10), t, fill=(30, 30, 40))
        s = min(1, 2400 / sheet.width)
        sheet.resize((int(sheet.width * s), int(sheet.height * s))).save(out / f"diff_{fmt}_{k}.jpg", quality=85)
