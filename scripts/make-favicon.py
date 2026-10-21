"""Favicon and app icons from the official TANTY logo (no redrawing).

Keeps the logo's "T" and Africa globe, on a white rounded tile so it reads on
light and dark browser tabs. Writes src/app/favicon.ico (16/32/48),
src/app/icon.png (512) and src/app/apple-icon.png (180).
Run from the project root: python3 scripts/make-favicon.py
"""
from PIL import Image, ImageChops, ImageDraw

logo = Image.open("src/components/brand/assets/tanty-logo.png").convert("RGBA")
keep = Image.new("L", logo.size, 0)
d = ImageDraw.Draw(keep)
d.rectangle((0, 0, 147, 200), fill=255)   # T crossbar
d.rectangle((0, 200, 135, 362), fill=255)  # T stem, clear of the "A" foot
d.rectangle((0, 0, 232, 93), fill=255)     # Africa globe, above the letters
mark = logo.copy()
mark.putalpha(ImageChops.multiply(logo.getchannel("A"), keep))
mark = mark.crop(mark.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox())


def tile(size: int, radius_ratio: float, fill_ratio: float) -> Image.Image:
    hi = size * 4
    canvas = Image.new("RGBA", (hi, hi), (0, 0, 0, 0))
    mask = Image.new("L", (hi, hi), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, hi - 1, hi - 1), radius=int(hi * radius_ratio), fill=255)
    canvas.paste((255, 255, 255, 255), (0, 0), mask)
    k = hi * fill_ratio / max(mark.size)
    m = mark.resize((round(mark.width * k), round(mark.height * k)), Image.LANCZOS)
    canvas.alpha_composite(m, ((hi - m.width) // 2, (hi - m.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


tile(512, 0.22, 0.84).save("src/app/icon.png")
tile(180, 0.0, 0.78).convert("RGB").save("src/app/apple-icon.png")
tile(256, 0.22, 0.9).save("src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
