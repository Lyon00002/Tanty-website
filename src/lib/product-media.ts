import fs from "node:fs";
import path from "node:path";
import type { Product } from "@/data/products";

/**
 * Official product photos, discovered on disk at build time.
 *
 * Convention: public/products/<product-slug>/<n>.<ext>
 *   1.webp is the main photo, 2.webp, 3.webp… the gallery.
 *   Accepted extensions: webp, avif, jpg, jpeg, png.
 *
 * Dropping files there is enough: no component or data change is needed.
 * An explicit `product.image` in products.ts still wins when present.
 *
 * Server-only: import this module from Server Components only.
 */

export interface ProductPhoto {
  src: string;
  alt: string;
}

const ROOT = path.join(process.cwd(), "public", "products");
const EXTENSIONS = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png"]);

function readPhotoFiles(slug: string): string[] {
  const dir = path.join(ROOT, slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => EXTENSIONS.has(path.extname(file).toLowerCase()))
    .filter((file) => /^\d+$/.test(path.basename(file, path.extname(file))))
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
}

export function getProductPhotos(product: Product): ProductPhoto[] {
  const fromDisk = readPhotoFiles(product.slug).map((file, i) => ({
    src: `/products/${product.slug}/${file}`,
    alt: i === 0 ? `${product.name}, ${product.line}` : `${product.name}, vue ${i + 1}`,
  }));
  if (product.image) {
    return [{ src: product.image.src, alt: product.image.alt }, ...fromDisk.slice(1)];
  }
  return fromDisk;
}

export function getMainProductPhoto(product: Product): ProductPhoto | undefined {
  return getProductPhotos(product)[0];
}
