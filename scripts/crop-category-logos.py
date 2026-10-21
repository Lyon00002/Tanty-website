"""Crop the client's range logos (3000 px squares in "tanty assets") to
16:10 badges centred on the logo, keeping the background they were designed on.
Usage: python3 scripts/crop-category-logos.py "<assets dir>" public/brand/gammes
"""
import sys, os
sys.path.append('/Users/lyon/Library/Python/3.9/lib/python/site-packages')
import numpy as np
from PIL import Image

SOURCES = {"grignoter": "A grinoter.png", "chapelure": "chapelur.png", "choco": "tanty choco.png"}
RATIO = 16 / 10
PAD = 0.22  # margin around the logo, relative to its size (tiles)

def crop(path, out_base, ratio=RATIO, pad=PAD, size=(1200, 750)):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32)
    H, W, _ = a.shape
    edge = np.concatenate([a[:, :120], a[:, -120:]], axis=1)
    rowbg = np.median(edge, axis=1)[:, None, :]
    mask = np.linalg.norm(a - rowbg, axis=2) > 38
    ys, xs = np.nonzero(mask)
    x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    if ratio == "auto":  # follow the logo's own proportions
        ratio = max(1.3, min(2.6, (x1 - x0) / (y1 - y0) * 1.1))
        size = (round(300 * ratio), 300)
    w = max((x1 - x0) * (1 + 2 * pad), (y1 - y0) * (1 + 2 * pad) * ratio)
    h = w / ratio
    box = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]
    # keep inside the image
    dx = max(0, -box[0]) - max(0, box[2] - W)
    dy = max(0, -box[1]) - max(0, box[3] - H)
    box = [box[0] + dx, box[1] + dy, box[2] + dx, box[3] + dy]
    out = im.crop(tuple(int(round(v)) for v in box)).resize(size, Image.LANCZOS)
    out.save(out_base + ".png", optimize=True)
    c = np.asarray(out).astype(int)
    print(os.path.basename(out_base), out.size, "top", c[3, out.width // 2].tolist(), "bottom", c[-4, out.width // 2].tolist())

src_dir, out_dir = sys.argv[1], sys.argv[2]
for name, file in SOURCES.items():
    crop(os.path.join(src_dir, file), os.path.join(out_dir, name))
    # Header badge: tighter margin, wider ratio, so the logo reads at 44 px high.
    crop(os.path.join(src_dir, file), os.path.join(out_dir, name + "-nav"), ratio="auto", pad=0.1)
