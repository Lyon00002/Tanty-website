"""Crop official TANTY product photos to a 4:5 frame around the pack.

usage: python3 crop_products.py <src_dir> <out_dir> [--preview]
Pack boxes are measured by hand (see PLAN); the frame keeps a strip of the
table under the pack and never leaves the photo.
"""
import sys, os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
SRC, OUT = sys.argv[1], sys.argv[2]
PREVIEW = "--preview" in sys.argv

# slug -> [(file, view index, pack box as fractions of the photo (l, t, r, b))]
# Boxes read off the thumbnails against a 5 % grid: 1 = front, 2 = back.
PLAN = {
    "arachides-enrobees": [("tanty04192.tif", 1, (0.33, 0.21, 0.80, 0.83)), ("tanty04195_2.tif", 2, (0.33, 0.21, 0.85, 0.88))],
    "arachides-caramel": [("tanty04141.tif", 1, (0.37, 0.23, 0.82, 0.77)), ("tanty04142_1.tif", 2, (0.37, 0.26, 0.82, 0.80))],
    "croquettes": [("tanty04162.tif", 1, (0.42, 0.24, 0.88, 0.84)), ("tanty04171.tif", 2, (0.27, 0.25, 0.70, 0.83))],
    "chips-de-plantain": [("tanty04204.tif", 1, (0.13, 0.23, 0.96, 0.83)), ("tanty04208.tif", 2, (0.16, 0.25, 0.90, 0.79))],
    "chapelure": [("tanty04231_1.tif", 1, (0.22, 0.17, 0.86, 0.82))],
    "reine-poisson": [("tanty04219_1.tif", 1, (0.27, 0.25, 0.90, 0.83))],
    "reine-lactee-croissance": [("tanty04236_2.tif", 1, (0.26, 0.29, 0.82, 0.81)), ("tanty04237_1.tif", 2, (0.17, 0.21, 0.81, 0.82))],
}

def pack_box(im):
    small = im.copy(); small.thumbnail((600, 600))
    hsv = np.asarray(small.convert("HSV")).astype(np.int32)
    h, s, v = hsv[..., 0], hsv[..., 1], hsv[..., 2]
    mask = (h >= 30) & (h <= 46) & (s > 150) & (v > 195)
    rows = np.where(mask.sum(1) > mask.shape[1] * 0.04)[0]
    cols = np.where(mask.sum(0) > mask.shape[0] * 0.04)[0]
    k = im.width / small.width
    return (cols.min() * k, rows.min() * k, (cols.max() + 1) * k, (rows.max() + 1) * k)

def frame(box, W, H, fill=0.74):
    l, t, r, b = box
    bw, bh = r - l, b - t
    fh = max(bh / fill, bw / fill * 5 / 4)          # 4:5 frame tall enough for the pack
    fh = min(fh, H, W * 5 / 4)                       # never wider or taller than the photo
    fw = fh * 4 / 5
    cx = (l + r) / 2
    top = b - fh * 0.88                              # pack bottom at 88 % of the frame: a strip of table shows
    left = cx - fw / 2
    left = min(max(0, left), W - fw); top = min(max(0, top), H - fh)
    return tuple(int(round(x)) for x in (left, top, left + fw, top + fh))

os.makedirs(OUT, exist_ok=True)
for slug, shots in PLAN.items():
    for fname, view, manual in shots:
        im = Image.open(os.path.join(SRC, fname)).convert("RGB")
        l, t, r, b = manual
        box = (l * im.width, t * im.height, r * im.width, b * im.height)
        crop = im.crop(frame(box, im.width, im.height))
        crop.thumbnail((1280, 1600), Image.LANCZOS)
        d = os.path.join(OUT, slug); os.makedirs(d, exist_ok=True)
        if PREVIEW:
            crop.thumbnail((400, 500)); crop.save(os.path.join(d, f"{view}.jpg"), quality=80)
        else:
            crop.save(os.path.join(d, f"{view}.webp"), "WEBP", quality=82, method=6)
        print(slug, view, fname, [int(x) for x in box], crop.size)
