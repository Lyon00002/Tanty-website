// Blurred placeholders for the site's photographs, shown while each photo loads.
//
// usage: node scripts/make-blur-placeholders.mjs
// Writes src/data/blur-placeholders.json: { "/products/croquettes/1.webp": "data:image/webp;base64,…" }.
// Each entry is a tiny (16 px wide) WebP of the photo, a few hundred bytes, inlined in
// the page so it shows at once, with no request. Run it again after adding photos.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
/** Folders of photographs (logos and icons are drawn, they need no placeholder). */
const FOLDERS = ["products", "brand/campagnes", "brand/histoire", "brand/photos"];
const EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".avif"]);

const files = FOLDERS.flatMap(function walk(dir) {
  const abs = path.join(PUBLIC, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return EXTENSIONS.has(path.extname(entry.name).toLowerCase()) ? [rel] : [];
  });
});

const out = {};
for (const rel of files.sort()) {
  const buffer = await sharp(path.join(PUBLIC, rel)).resize(16).webp({ quality: 50 }).toBuffer();
  out[`/${rel}`] = `data:image/webp;base64,${buffer.toString("base64")}`;
}

const target = path.join(ROOT, "src/data/blur-placeholders.json");
fs.writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);
const bytes = Object.values(out).reduce((n, v) => n + v.length, 0);
console.log(`${files.length} photos, ${Math.round(bytes / 1024)} Ko de miniatures floues → ${path.relative(ROOT, target)}`);
