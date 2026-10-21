import { getCategory, listedCategories } from "@/data/categories";
import { publishedProducts } from "@/data/products";
import { getProductPhotos } from "@/lib/product-media";
import { RANGE_LINKS, STORE_LINKS, routes } from "../../routes";
import { CorporateHeaderClient } from "./CorporateHeaderClient";
import type { HeaderData } from "./types";

/**
 * Proposal 3 header, inspired by nestle.com's: the logo row with the brand
 * signature, a search field and the contacts, then a light menu bar that
 * stays pinned when scrolling, with drop-down panels (ranges, products,
 * careers). Server part: it gathers the
 * ranges, the products and their photos for the panels and the search.
 */
export function CorporateHeader() {
  const ranges = [...listedCategories].sort((a, b) => a.order - b.order);
  const listed = publishedProducts.filter((p) => getCategory(p.category).listed);
  // A range: its own page; while closed, the catalogue, else the home page orbit.
  const rangeHref = (slug: string) => (RANGE_LINKS ? routes.range({ slug }) : STORE_LINKS ? routes.catalogue : routes.ranges);
  const productHref = (slug: string) => (STORE_LINKS ? routes.product({ slug }) : routes.featured);

  const data: HeaderData = {
    ranges: ranges.map((r) => ({
      id: r.id,
      name: r.name,
      short: r.short,
      href: rangeHref(r.slug),
      logo: r.logo ? { src: r.logo.src, width: r.logo.width, height: r.logo.height, ground: r.logo.ground } : undefined,
    })),
    products: listed
      .map((p) => ({ p, photo: getProductPhotos(p)[0]?.src }))
      .filter((x): x is { p: (typeof listed)[number]; photo: string } => Boolean(x.photo))
      .map(({ p, photo }) => ({ id: p.id, name: p.name, range: getCategory(p.category).short, href: productHref(p.slug), photo })),
    search: [
      ...ranges.map((r) => ({ kind: "gamme" as const, label: r.name, sub: "Gamme", href: rangeHref(r.slug) })),
      ...listed.map((p) => ({
        kind: "produit" as const,
        label: p.name,
        sub: `${getCategory(p.category).short} · ${p.formats.map((f) => f.label).join(", ")}`,
        href: productHref(p.slug),
        thumb: getProductPhotos(p)[0]?.src,
      })),
    ],
    storeHref: STORE_LINKS ? routes.catalogue : undefined,
  };

  return <CorporateHeaderClient data={data} />;
}
