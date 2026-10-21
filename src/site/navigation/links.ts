import { listedCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { PAGES_OPEN, routes } from "../routes";

export interface NavLink {
  href: string;
  label: string;
}

/**
 * Main navigation. Home-only mode: every entry jumps to a section of the
 * home page. Full site: "Nos gammes" opens the range menu, then pages.
 */
export const NAV_LINKS: readonly NavLink[] = PAGES_OPEN
  ? [
      { href: routes.catalogue, label: "Tous les produits" },
      { href: routes.story, label: "Notre histoire" },
      { href: routes.contact, label: "Contact" },
    ]
  : [
      { href: routes.ranges, label: "Nos gammes" },
      { href: routes.featured, label: "Nos produits" },
      { href: routes.story, label: "Notre histoire" },
      { href: routes.contact, label: "Contact" },
    ];

export interface RangeMenuItem {
  id: string;
  href: string;
  name: string;
  count: number;
  logo?: { src: string; width: number; height: number; background: string };
  light: string;
}

/** Serializable range entries for the client menus. */
export function rangeMenuItems(): RangeMenuItem[] {
  return [...listedCategories]
    .sort((a, b) => a.order - b.order)
    .map((c) => ({
      id: c.id,
      href: routes.range(c),
      name: c.name,
      count: getProductsByCategory(c.id).length,
      logo: c.logo,
      light: c.light,
    }));
}
