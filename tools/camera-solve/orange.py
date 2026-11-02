# Find orange connected components; print bbox in normalized 0..1000 coords and save an annotated image.
import sys, cv2, numpy as np
src, out = sys.argv[1], sys.argv[2]
minarea = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0004
im = cv2.imread(src); H, W = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
m = cv2.inRange(hsv, (5, 120, 120), (22, 255, 255))
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
n, lab, st, cen = cv2.connectedComponentsWithStats(m, 8)
vis = im.copy(); vis[m > 0] = (vis[m > 0] * 0.4 + np.array([255, 0, 255]) * 0.6).astype(np.uint8)
rows = []
for i in range(1, n):
    x, y, w, h, a = st[i]
    if a < minarea * W * H: continue
    rows.append((x, y, w, h, a))
rows.sort(key=lambda r: (r[1], r[0]))
for k, (x, y, w, h, a) in enumerate(rows):
    cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 2)
    cv2.putText(vis, str(k), (x + 4, y + 30), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
    print(f'{k}: x {x/W*1000:.1f}-{(x+w)/W*1000:.1f}  y {y/H*1000:.1f}-{(y+h)/H*1000:.1f}  area {a/(W*H)*100:.2f}%')
s = 1400 / max(W, H); cv2.imwrite(out, cv2.resize(vis, (int(W * s), int(H * s))), [cv2.IMWRITE_JPEG_QUALITY, 85])
