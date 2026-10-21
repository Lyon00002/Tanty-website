import sys
sys.path.append('/Users/lyon/Library/Python/3.9/lib/python/site-packages')
import numpy as np
from PIL import Image, ImageFilter

src, out_dir = sys.argv[1], sys.argv[2]
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.float32)
x0, y0, x1, y1 = 60, 70, 1210, 660
crop = a[y0:y1, x0:x1]
bg = np.array([255., 204., 0.])
d = np.linalg.norm(crop - bg, axis=2)
alpha = np.clip((d - 28.0) / (110.0 - 28.0), 0, 1)

# Globe: find the green disc above the letters (top-left region) and keep it fully opaque,
# with its original colors (Africa is printed yellow on the green globe).
H, W = alpha.shape
r, g, b = crop[..., 0], crop[..., 1], crop[..., 2]
green = (g > r + 25) & (g > b + 25) & (r < 140)
region = np.zeros_like(green); region[:132, 180:340] = True
ys, xs = np.nonzero(green & region)
cx, cy = (xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2
rad = max(xs.max() - xs.min(), ys.max() - ys.min()) / 2
print('globe', cx, cy, rad)
yy, xx = np.mgrid[0:H, 0:W]
dist = np.hypot(xx - cx, yy - cy)
inside = dist <= rad - 1.0
edge = (dist > rad - 1.0) & (dist <= rad + 1.5)
alpha[inside] = 1.0
alpha[edge] = np.maximum(alpha[edge], np.clip((rad + 1.5 - dist[edge]) / 2.5, 0, 1))

# Clean isolated dither speckles in the alpha channel.
A = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(3))
alpha = np.maximum(np.asarray(A).astype(np.float32) / 255, inside.astype(np.float32))

safe = np.maximum(alpha, 1e-3)[..., None]
fg = np.clip(bg + (crop - bg) / safe, 0, 255)
fg[inside] = crop[inside]
rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
logo = Image.fromarray(rgba)
bbox = logo.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
m = 8
bbox = (max(0, bbox[0]-m), max(0, bbox[1]-m), min(logo.width, bbox[2]+m), min(logo.height, bbox[3]+m))
logo = logo.crop(bbox)

# Wordmark: everything above the "Since 2000" line (first empty band from the bottom up).
Aa = np.asarray(logo.getchannel('A'))
rows = (Aa > 60).sum(axis=1)
h = logo.height
last = max(y for y in range(h) if rows[y] > 0)
y = last
while y > h // 2 and rows[y] > 0: y -= 1          # climb through the "Since 2000" line
while y > h // 2 and rows[y] == 0: y -= 1         # then through the gap above it
cut = y + m
# The (R) sits low on the right; keep rows down to the cut only.
word = logo.crop((0, 0, logo.width, cut))
wb = word.getchannel('A').point(lambda v: 255 if v > 24 else 0).getbbox()
word = word.crop((max(0, wb[0]-m), max(0, wb[1]-m), min(word.width, wb[2]+m), min(word.height, wb[3]+m)))

def save(img, name, width):
    h2 = round(img.height * width / img.width)
    out = img.resize((width, h2), Image.LANCZOS)
    out.save(f'{out_dir}/{name}.png', optimize=True)
    out.save(f'{out_dir}/{name}.webp', quality=92, method=6)
    print(name, out.size)

save(logo, 'tanty-logo', 900)
save(word, 'tanty-logo-wordmark', 900)
