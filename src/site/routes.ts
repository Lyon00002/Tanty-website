import type { Category } from "@/data/categories";
import type { Product } from "@/data/products";
import { HOME_ONLY, RANGES_OPEN, STORE_OPEN } from "./config";

/** Every internal URL of the site, in one place. */
export const routes = {
  home: "/",
  /** Sections of the home page. */
  ranges: "/#gammes",
  featured: "/#produits",
  story: "/#histoire",
  contact: "/#contact",
  /** The store: catalogue and product sheets (open with STORE_OPEN). */
  catalogue: STORE_OPEN || !HOME_ONLY ? "/produits" : "/#produits",
  /** Other pages (disabled while HOME_ONLY is true). */
  range: (category: Pick<Category, "slug">) => `/gammes/${category.slug}`,
  product: (product: Pick<Product, "slug">) => `/produits/${product.slug}`,
} as const;

/** Links to other pages are rendered only when the full site is open. */
export const PAGES_OPEN = !HOME_ONLY;

/** Links to the store (catalogue, product sheets) are rendered when it is open. */
export const STORE_LINKS = STORE_OPEN || !HOME_ONLY;

/** Links to the range pages are rendered when they are open. */
export const RANGE_LINKS = RANGES_OPEN || !HOME_ONLY;
