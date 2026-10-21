/**
 * TANTY ranges ("gammes"), organised by sub-brand as the client presents them
 * (logos supplied in "tanty assets", 2026-10-20).
 *
 * `logo` is the range's official logo when the client has supplied it.
 * TANTY Reine and TANTY Piment de table logos are being designed: leave
 * `logo` undefined until the files arrive, the UI shows the TANTY logo instead.
 * Range colors are taken from the supplied logo backgrounds when they exist,
 * otherwise from the packaging (approximations).
 */

export type CategoryId = "reine" | "bouillies" | "grignoter" | "chapelure" | "piment" | "choco" | "ingredients";

export interface CategoryLogo {
  /** 16:10 tile crop, path under /public (scripts/crop-category-logos.py). */
  src: string;
  width: number;
  height: number;
  /** Background color the logo was designed on. */
  background: string;
  /** Tighter crop for the site header. */
  nav: { src: string; width: number; height: number };
  /** Top and bottom colours of the logo's own background (it is a vertical gradient). */
  ground: readonly [string, string];
}

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  /** Name without the brand, for places where TANTY is already obvious. */
  short: string;
  summary: string;
  order: number;
  /** false = not shown in navigation (only unpublished products). */
  listed: boolean;
  logo?: CategoryLogo;
  /** Range accent color and its light tint, for range pages. */
  color: string;
  light: string;
}

export const categories: readonly Category[] = [
  {
    id: "reine",
    slug: "tanty-reine",
    name: "TANTY Reine",
    short: "Reine",
    summary: "Les bouillies de soja infantiles Reine, en sachets de 57 g, en étuis de 200 g et en seaux Custard Powder.",
    order: 1,
    listed: true,
    color: "#e5780f",
    light: "#fff1d6",
  },
  {
    id: "bouillies",
    slug: "bouillies-tanty",
    name: "Bouillies TANTY",
    short: "Bouillies",
    summary: "TANTY Lactée, TANTY Parfumé et Baby Vita, les bouillies de soja de la famille TANTY.",
    order: 2,
    listed: true,
    color: "#1b6430",
    light: "#e8f3e3",
  },
  {
    id: "grignoter",
    slug: "tanty-a-grignoter",
    name: "TANTY à Grignoter",
    short: "À Grignoter",
    summary: "Des amuse-gueules croustillants : arachides, croquettes, chips de plantain, beignets soufflés.",
    order: 3,
    listed: true,
    logo: {
      src: "/brand/gammes/grignoter.png",
      width: 1200,
      height: 750,
      background: "#f5951e",
      nav: { src: "/brand/gammes/grignoter-nav.png", width: 419, height: 300 },
      ground: ["#fab01b", "#ef7b22"],
    },
    color: "#e2581a",
    light: "#ffe9d6",
  },
  {
    id: "chapelure",
    slug: "tanty-chapelure",
    name: "TANTY Chapelure",
    short: "Chapelure",
    summary: "La chapelure TANTY pour paner, gratiner et préparer vos farces.",
    order: 4,
    listed: true,
    logo: {
      src: "/brand/gammes/chapelure.png",
      width: 1200,
      height: 750,
      background: "#fddb6b",
      nav: { src: "/brand/gammes/chapelure-nav.png", width: 614, height: 300 },
      ground: ["#fdd12f", "#fee7a4"],
    },
    color: "#c9232a",
    light: "#fff6d1",
  },
  {
    id: "piment",
    slug: "tanty-piment-de-table",
    name: "TANTY Piment de table",
    short: "Piment de table",
    summary: "Le piment de table TANTY, naturel, pour relever vos plats.",
    order: 5,
    listed: true,
    color: "#c93229",
    light: "#fbe4e1",
  },
  {
    id: "choco",
    slug: "tanty-choco",
    name: "TANTY Choco",
    short: "Choco",
    summary: "Le chocolat à tartiner made in Cameroun, de 1 à 10 litres.",
    order: 6,
    listed: true,
    logo: {
      src: "/brand/gammes/choco.png",
      width: 1200,
      height: 750,
      background: "#4d281d",
      nav: { src: "/brand/gammes/choco-nav.png", width: 780, height: 300 },
      ground: ["#4d281d", "#4d281d"],
    },
    color: "#4d281d",
    light: "#f4e9e3",
  },
  {
    id: "ingredients",
    slug: "ingredients-culinaires",
    name: "Ingrédients culinaires",
    short: "Ingrédients culinaires",
    summary: "Huile d'arachide et farine de soja (ancien catalogue, disponibilité à confirmer).",
    order: 7,
    listed: false,
    color: "#1b6430",
    light: "#e8f3e3",
  },
];

export const listedCategories = categories.filter((c) => c.listed);

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug && c.listed);
}
