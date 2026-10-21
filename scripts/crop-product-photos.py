"""Crop official TANTY product photos to a 4:5 frame around the pack.

usage: python3 crop-product-photos.py <src_dir> <out_dir> [--preview] [--only=slug,slug]
Pack boxes are measured by hand (see PLAN); the frame keeps a strip of the
table under the pack and never leaves the photo.
"""
import sys, os
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
SRC, OUT = sys.argv[1], sys.argv[2]
PREVIEW = "--preview" in sys.argv

# slug -> [(file, view index, pack box as fractions of the photo (l, t, r, b) or None, fill)]
# Boxes read off the thumbnails against a 5 % grid; None = found by the yellow of
# the pack (pack_box). View 1 = front, 2 = back, then the other views: the
# formats side by side, the Mini sachet, the pack laid flat. `fill` = share of
# the frame the pack takes (0.74 by default; higher to keep neighbours out).
# Files: the studio shoot (tanty*.tif, 2026-10-20) and the bucket shots added
# on 2026-10-21 (DSC*.jpg.jpeg), all in the client's "Tanty" folder.
# Optional 5th item: {"rotate": 90} turns a pack photographed lying sideways
# upright first (counter-clockwise; boxes are then read on the turned photo);
# {"pad": True} keeps only the pack and sets it on the site's grey ground
# (#eef2f4), for a pack whose neighbours would show in a 4:5 frame.
PLAN = {
    "arachides-enrobees": [
        ("tanty04192.tif", 1, (0.33, 0.21, 0.80, 0.83), 0.74),
        ("tanty04195_2.tif", 2, (0.33, 0.21, 0.85, 0.88), 0.74),
        ("tanty04187.tif", 3, None, 0.86, {"rotate": 90}),
        ("tanty04202.tif", 4, None, 0.80),
    ],
    "arachides-caramel": [
        ("tanty04141.tif", 1, (0.37, 0.23, 0.82, 0.77), 0.74),
        ("tanty04142_1.tif", 2, (0.37, 0.26, 0.82, 0.80), 0.74),
        ("tanty04156.tif", 3, None, 0.80),
        ("tanty04153_1.tif", 4, (0.30, 0.30, 0.72, 0.82), 0.86),
    ],
    "croquettes": [
        ("tanty04162.tif", 1, (0.42, 0.24, 0.88, 0.84), 0.74),
        ("tanty04171.tif", 2, (0.27, 0.25, 0.70, 0.83), 0.74),
        ("tanty04181_2.tif", 3, None, 0.80),
        ("tanty04175.tif", 4, None, 0.86),
    ],
    "chips-de-plantain": [
        ("tanty04204.tif", 1, (0.13, 0.23, 0.96, 0.83), 0.74),
        ("tanty04208.tif", 2, (0.16, 0.25, 0.90, 0.79), 0.74),
        ("tanty04210_2.tif", 3, None, 0.86),
        ("tanty04209_1.tif", 4, None, 0.86),
    ],
    "chapelure": [
        ("tanty04231_1.tif", 1, (0.22, 0.17, 0.86, 0.82), 0.74),
        ("tanty04234.tif", 2, None, 0.74),
        ("tanty04233_1.tif", 3, None, 0.86, {"rotate": 90}),
    ],
    "reine-poisson": [
        ("tanty04219_1.tif", 1, (0.27, 0.25, 0.90, 0.83), 0.74),
        ("tanty04222.tif", 2, (0.17, 0.07, 0.88, 0.86), 0.86, {"rotate": 90}),
    ],
    "reine-lactee-croissance": [
        ("tanty04236_2.tif", 1, (0.26, 0.29, 0.82, 0.81), 0.74),
        ("tanty04237_1.tif", 2, (0.17, 0.21, 0.81, 0.82), 0.74),
        ("tanty04239_1.tif", 3, None, 0.86, {"rotate": 90}),
        ("tanty04238_2.tif", 4, None, 0.86, {"rotate": 90}),
    ],
    # TANTY Prestige (2026-10-21): front, back, then the box laid flat (face, back).
    "tanty-nature": [
        ("tanty04215_2.tif", 1, None, 0.74),
        ("tanty04216.tif", 2, None, 0.74),
        ("tanty04218_1.tif", 3, None, 0.86, {"rotate": 90}),
        ("tanty04217_1.tif", 4, None, 0.86, {"rotate": 90}),
    ],
    "tanty-arachides": [
        ("tanty04211.tif", 1, None, 0.74),
        ("tanty04212.tif", 2, None, 0.74),
        ("tanty04214.tif", 3, None, 0.86, {"rotate": 90}),
        ("tanty04213.tif", 4, None, 0.86, {"rotate": 90}),
    ],
    # Its front stands only in the group photo (top right), as Lactée's.
    "tanty-poisson": [
        ("tanty04241_2.tif", 1, (0.664, 0.300, 0.972, 0.588), 0.80, {"pad": True}),
        ("tanty04225.tif", 2, None, 0.74),
        ("tanty04223.tif", 3, None, 0.86, {"rotate": 90}),
        ("tanty04224_1.tif", 4, None, 0.86, {"rotate": 90}),
    ],
    # TANTY Prestige Lactée: its front only exists in the group photo (top middle).
    "tanty-lactee": [
        ("tanty04241_2.tif", 1, (0.347, 0.287, 0.656, 0.577), 0.80, {"pad": True}),
        ("tanty04228_1.tif", 2, None, 0.74),
        ("tanty04229_2.tif", 3, None, 0.86, {"rotate": 90}),
    ],
    "tanty-choco": [
        ("DSC04072.jpg.jpeg", 1, (0.23, 0.45, 0.74, 0.87), 0.74),
        ("DSC04070.jpg.jpeg", 2, None, 0.80),
    ],
    "reine-custard-powder-banane": [
        ("DSC04077.jpg.jpeg", 1, None, 0.74),
        ("DSC04081.jpg.jpeg", 2, None, 0.74),
    ],
    "reine-custard-powder-fraise": [
        ("DSC04073.jpg.jpeg", 1, (0.22, 0.43, 0.78, 0.90), 0.74),
    ],
    "reine-custard-powder-fruits-et-oeufs": [
        ("DSC04076.jpg.jpeg", 1, None, 0.74),
        ("DSC04075.jpg.jpeg", 2, None, 0.74),
        ("DSC04080.jpg.jpeg", 3, None, 0.74),
        # Not DSC04083: the stack also holds a Banane bucket.
    ],
    "reine-custard-powder-lacte-biscuite": [
        ("DSC04074.jpg.jpeg", 1, (0.22, 0.36, 0.78, 0.83), 0.74),
        ("DSC04079.jpg.jpeg", 2, (0.22, 0.30, 0.84, 0.78), 0.74),
    ],
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
ONLY = [a.split("=", 1)[1] for a in sys.argv if a.startswith("--only=")]
for slug, shots in PLAN.items():
    if ONLY and slug not in ONLY[0].split(","):
        continue
    for fname, view, manual, fill, *more in shots:
        opts = more[0] if more else {}
        im = Image.open(os.path.join(SRC, fname)).convert("RGB")
        if opts.get("rotate"):
            im = im.rotate(opts["rotate"], expand=True)
        if manual:
            l, t, r, b = manual
            box = (l * im.width, t * im.height, r * im.width, b * im.height)
        else:
            box = pack_box(im)
        if opts.get("pad"):
            # The pack alone, centred on the grey ground of the site's frames.
            pack = im.crop(tuple(int(round(x)) for x in box))
            fh = max(pack.height / fill, pack.width / fill * 5 / 4)
            crop = Image.new("RGB", (int(fh * 4 / 5), int(fh)), (0xEE, 0xF2, 0xF4))
            crop.paste(pack, ((crop.width - pack.width) // 2, (crop.height - pack.height) // 2))
        else:
            crop = im.crop(frame(box, im.width, im.height, fill))
        crop.thumbnail((1280, 1600), Image.LANCZOS)
        d = os.path.join(OUT, slug); os.makedirs(d, exist_ok=True)
        if PREVIEW:
            crop.thumbnail((400, 500)); crop.save(os.path.join(d, f"{view}.jpg"), quality=80)
        else:
            crop.save(os.path.join(d, f"{view}.webp"), "WEBP", quality=82, method=6)
        print(slug, view, fname, [int(x) for x in box], crop.size)
