import type { CategoryId } from "./categories";

/**
 * TANTY catalogue: the single source of product truth for every page.
 *
 * Sources: archived tanty.cm shop (Oct-Nov 2025) and older site (2014-2018),
 * retailer pages and packaging visuals, inventoried in
 * ~/projets/tanty-3d/references/INVENTAIRE.md and INFOS-ENTREPRISE.md; the
 * old shop's catalogue structure supplied by the user (2026-10-21,
 * catalogue_tanty_structure.csv: ranges, flavours, formats, official texts).
 * Left out from it on purpose: its prices (not confirmed), the rows it flags
 * itself as anomalies (Croquette "Grand 95 g" duplicate, a Reine 2 L bucket
 * without flavour) and the book "Né pour échouer" (not a food product).
 *
 * Rules:
 * - Only verified text goes into `description` and `facts`. When nothing is
 *   verified, leave the field undefined: the UI handles its absence.
 * - Prices are per format (`formats[].price`), taken from the old shop's
 *   catalogue (2025); the site shows them as indicative until NTFoods confirms.
 * - `image` stays undefined until the official photo is supplied; the UI then
 *   shows the branded placeholder sized for the packaging kind.
 */

export type PackagingKind =
  | "sachet"
  | "mini-sachet"
  | "etui"
  | "seau"
  | "doypack"
  | "flacon"
  | "bouteille"
  | "bidon"
  | "inconnu";

export interface ProductFormat {
  /** As printed or sold, e.g. "57 g", "2 L". */
  label: string;
  packaging: PackagingKind;
  /**
   * Price in FCFA, as displayed by the old tanty.cm shop (catalogue_tanty_structure.csv,
   * 2025: the promo price when there is one; the regular price where the shop showed 0).
   * Indicative until NTFoods confirms it.
   */
  price?: number;
}

export interface ProductImageAsset {
  /** Path under /public, e.g. "/products/reine-multi-cereales/main.webp". */
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductFact {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** Range or sub-brand printed on the pack, e.g. "TANTY Reine". */
  line: string;
  category: CategoryId;
  formats: readonly ProductFormat[];
  description?: string;
  facts?: readonly ProductFact[];
  image?: ProductImageAsset;
  gallery?: readonly ProductImageAsset[];
  /** false = known from older sources, availability to confirm with NTFoods. */
  published: boolean;
  featured?: boolean;
}

/** The old shop's text for every TANTY à Grignoter product. */
const GRIGNOTER =
  "Des amuse-gueules croustillants et riches en énergie, à partager en famille ou entre amis lors des pique-niques et des escapades improvisées.";

export const products: readonly Product[] = [
  // TANTY Reine: bouillies de soja infantiles (sachets, étuis)
  {
    id: "reine-multi-cereales",
    slug: "reine-multi-cereales",
    name: "Reine Multi-céréales",
    line: "TANTY Reine",
    category: "reine",
    formats: [
      { label: "Sachet 57 g", packaging: "sachet", price: 300 },
      { label: "Étui 200 g", packaging: "etui", price: 1000 },
    ],
    description: "Bouillie de soja infantile Reine aux multi-céréales, à base de maïs et de soja.",
    facts: [
      { label: "Âge", value: "Dès 6 mois" },
      { label: "Sur l'emballage", value: "10 vitamines, calcium, fer, sucré" },
      { label: "Préparation", value: "À cuire" },
    ],
    published: true,
  },
  {
    id: "reine-classic",
    slug: "reine-classic",
    name: "Reine Classic",
    line: "TANTY Reine",
    category: "reine",
    formats: [{ label: "Sachet 57 g", packaging: "sachet", price: 300 }],
    description: "Bouillie de soja infantile Reine, recette Classic, à base de maïs et de soja.",
    published: true,
  },
  {
    id: "reine-arachides",
    slug: "reine-arachides",
    name: "Reine Arachides",
    line: "TANTY Reine",
    category: "reine",
    formats: [{ label: "Sachet 57 g", packaging: "sachet", price: 300 }],
    description: "Bouillie de soja infantile Reine aux arachides, à base de maïs et de soja.",
    published: true,
  },
  {
    id: "reine-lactee-croissance",
    slug: "reine-lactee-croissance",
    name: "Reine Lactée Croissance",
    line: "TANTY Reine",
    category: "reine",
    formats: [
      { label: "Sachet 57 g", packaging: "sachet", price: 300 },
      { label: "Étui 200 g", packaging: "etui", price: 1000 },
    ],
    // Pack (official photo, 2026): "Bouillie de soja infantile", à cuire, dès 6 mois, format Prestige.
    description: "Bouillie de soja infantile Reine Lactée Croissance, à cuire, dès 6 mois.",
    published: true,
    featured: true,
  },
  {
    id: "reine-poisson",
    slug: "reine-poisson",
    name: "Reine Poisson",
    line: "TANTY Reine",
    category: "reine",
    formats: [
      { label: "Sachet 57 g", packaging: "sachet", price: 300 },
      { label: "Étui 200 g", packaging: "etui", price: 1000 },
    ],
    description: "Bouillie de soja infantile Reine au poisson, à base de maïs et de soja.",
    published: true,
  },
  // TANTY Prestige: the soy porridges in their 200 g "Prestige" box (texts from the boxes,
  // studio shoot 2026-10-20; Lactée and Parfumé from the old shop).
  {
    id: "tanty-nature",
    slug: "tanty-nature",
    name: "TANTY Nature",
    line: "TANTY Prestige",
    category: "prestige",
    formats: [{ label: "Étui Prestige 200 g", packaging: "etui" }],
    description:
      "Une bouillie de soja de haute valeur nutritive : un mélange de céréales, source d'énergie, et de fibres alimentaires qui facilitent la digestion.",
    facts: [
      { label: "Sur l'emballage", value: "15 vitamines et minéraux, riche en fer et calcium" },
      { label: "Pour", value: "Enfants et adultes" },
      { label: "Préparation", value: "À cuire" },
    ],
    published: true,
  },
  {
    id: "tanty-arachides",
    slug: "tanty-arachides",
    name: "TANTY Arachides",
    line: "TANTY Prestige",
    category: "prestige",
    formats: [{ label: "Étui Prestige 200 g", packaging: "etui" }],
    description:
      "Une bouillie de soja de haute valeur nutritive et riche en vitamines : un mélange de céréales, source d'énergie, et de protéines qui développent les muscles.",
    facts: [
      { label: "Sur l'emballage", value: "15 vitamines et minéraux, riche en fer et calcium" },
      { label: "Pour", value: "Enfants et adultes" },
      { label: "Préparation", value: "À cuire" },
    ],
    published: true,
  },
  {
    id: "tanty-poisson",
    slug: "tanty-poisson",
    name: "TANTY Poisson",
    line: "TANTY Prestige",
    category: "prestige",
    formats: [{ label: "Étui Prestige 200 g", packaging: "etui" }],
    description:
      "Une bouillie de soja de haute valeur nutritive : un mélange de céréales, source d'énergie, et de calcium qui fortifie les os.",
    facts: [
      { label: "Sur l'emballage", value: "15 vitamines et minéraux, riche en fer et calcium" },
      { label: "Pour", value: "Enfants et adultes" },
      { label: "Préparation", value: "À cuire" },
    ],
    published: true,
  },
  {
    id: "tanty-parfume",
    slug: "tanty-parfume",
    name: "TANTY Parfumé",
    line: "TANTY Prestige",
    category: "prestige",
    formats: [{ label: "Étui Prestige 200 g", packaging: "etui", price: 1000 }],
    description: "La bouillie de soja parfumée aux fruits, quatrième variété des bouillies TANTY, créée en 2006.",
    facts: [{ label: "Composition (2011)", value: "Maïs prégermé, soja, cocktail de fruits" }],
    published: true,
    featured: true,
  },
  {
    id: "tanty-lactee",
    slug: "tanty-lactee",
    name: "TANTY Lactée",
    line: "TANTY Prestige",
    category: "prestige",
    formats: [{ label: "Étui Prestige 200 g", packaging: "etui", price: 1000 }],
    // Old shop text (2025): third of the TANTY porridges, 2004, calcium from fish bones.
    description:
      "Créée en 2004, troisième des bouillies TANTY. Elle permet une meilleure croissance grâce au calcium contenu dans les arêtes de poisson.",
    facts: [
      { label: "Création", value: "2004" },
      { label: "Sur l'emballage", value: "15 vitamines et minéraux, riche en fer et calcium" },
      { label: "Pour", value: "Enfants et adultes" },
      { label: "Préparation", value: "À cuire" },
    ],
    published: true,
  },
  {
    id: "baby-vita",
    slug: "baby-vita",
    name: "Baby Vita",
    line: "Baby Vita",
    category: "babyvita",
    formats: [{ label: "Seau 1200 g", packaging: "seau", price: 2000 }],
    description: "Bouillie enrichie pour assurer une croissance et un éveil continu à vos enfants.",
    facts: [{ label: "Sur l'emballage", value: "Patate, moringa, multifruits" }],
    published: true,
  },

  // TANTY Reine Custard Powder: la bouillie de soja infantile Reine en seaux
  {
    id: "reine-custard-banane",
    slug: "reine-custard-powder-banane",
    name: "Reine Custard Powder Banane",
    line: "TANTY Reine",
    category: "reine",
    description: "Bouillie de soja infantile au parfum de la banane, 100 % naturelle et très économique.",
    formats: [
      { label: "1 L", packaging: "seau", price: 1500 },
      { label: "2 L", packaging: "seau", price: 2500 },
      { label: "5 L", packaging: "seau", price: 4500 },
    ],
    published: true,
  },
  {
    id: "reine-custard-fraise",
    slug: "reine-custard-powder-fraise",
    name: "Reine Custard Powder Fraise",
    line: "TANTY Reine",
    category: "reine",
    description: "Bouillie de soja infantile à la fraise, 100 % naturelle et très économique.",
    formats: [
      { label: "1 L", packaging: "seau", price: 1100 },
      { label: "2 L", packaging: "seau", price: 2500 },
      { label: "5 L", packaging: "seau", price: 4500 },
    ],
    published: true,
  },
  {
    id: "reine-custard-fruits-oeufs",
    slug: "reine-custard-powder-fruits-et-oeufs",
    name: "Reine Custard Powder Fruits et Œufs",
    line: "TANTY Reine",
    category: "reine",
    description: "Bouillie aux fruits et aux œufs, 100 % naturelle et très économique.",
    formats: [
      { label: "1 L", packaging: "seau", price: 1100 },
      { label: "2 L", packaging: "seau", price: 2500 },
      { label: "5 L", packaging: "seau", price: 4500 },
    ],
    published: true,
  },
  {
    id: "reine-custard-lacte-biscuite",
    slug: "reine-custard-powder-lacte-biscuite",
    name: "Reine Custard Powder Lacté Biscuité",
    line: "TANTY Reine",
    category: "reine",
    description: "Bouillie lactée biscuitée, 100 % naturelle et très économique.",
    formats: [
      { label: "1 L", packaging: "seau", price: 1100 },
      { label: "2 L", packaging: "seau", price: 2500 },
      { label: "5 L", packaging: "seau", price: 4500 },
    ],
    published: true,
  },

  // TANTY à Grignoter
  {
    id: "arachides-enrobees",
    slug: "arachides-enrobees",
    name: "Arachides enrobées",
    line: "TANTY à Grignoter",
    category: "grignoter",
    description: GRIGNOTER,
    formats: [
      { label: "Mini 45 g", packaging: "mini-sachet", price: 100 },
      { label: "Moyen 125 g", packaging: "doypack", price: 500 },
      { label: "Grand 273 g", packaging: "doypack", price: 1000 },
    ],
    published: true,
    featured: true,
  },
  {
    id: "caramel",
    slug: "arachides-caramel",
    name: "Arachides caramélisées",
    line: "TANTY à Grignoter",
    category: "grignoter",
    description: GRIGNOTER,
    formats: [
      { label: "Mini 45 g", packaging: "mini-sachet", price: 100 },
      { label: "Moyen 136 g", packaging: "doypack", price: 1000 },
    ],
    published: true,
  },
  {
    id: "croquettes",
    slug: "croquettes",
    name: "Croquettes",
    line: "TANTY à Grignoter",
    category: "grignoter",
    description: GRIGNOTER,
    formats: [
      { label: "Mini 30 g", packaging: "mini-sachet", price: 100 },
      { label: "Moyen 95 g", packaging: "doypack", price: 1000 },
      { label: "Grand 227 g", packaging: "doypack", price: 1000 },
    ],
    published: true,
  },
  {
    id: "chips-plantain",
    slug: "chips-de-plantain",
    name: "Chips de plantain",
    line: "TANTY à Grignoter",
    category: "grignoter",
    description: GRIGNOTER,
    formats: [{ label: "Moyen 80 g", packaging: "doypack", price: 1000 }],
    published: true,
  },
  {
    id: "beignet-souffle",
    slug: "beignet-souffle",
    name: "Beignet soufflé",
    line: "TANTY à Grignoter",
    category: "grignoter",
    description: GRIGNOTER,
    formats: [{ label: "36 g", packaging: "mini-sachet", price: 100 }],
    published: true,
  },

  // TANTY Chapelure, TANTY Piment de table, ingrédients culinaires (ancien catalogue)
  {
    id: "chapelure",
    slug: "chapelure",
    name: "Chapelure",
    line: "TANTY",
    category: "chapelure",
    formats: [{ label: "Étui 200 g", packaging: "etui", price: 700 }],
    description:
      "Pour paner et gratiner viandes et poissons, et préparer vos farces. Issue de pâtes levées, avec la note de l'arachide.",
    facts: [
      {
        label: "Ingrédients",
        value: "Farine de froment, son d'arachide, sel, matière grasse végétale, son et germes de maïs",
      },
      { label: "Sur l'emballage", value: "Dorée et croustillante" },
    ],
    published: true,
    featured: true,
  },
  {
    id: "piment-de-table",
    slug: "piment-de-table",
    name: "Piment de table",
    line: "TANTY",
    category: "piment",
    formats: [{ label: "200 ml", packaging: "flacon", price: 2000 }],
    description:
      "Le piment de table TANTY rehausse vos plats grâce à son goût unique. Facile à utiliser et à conserver, il accompagne aussi vos réceptions : mariages, baptêmes, anniversaires.",
    facts: [{ label: "Sur l'emballage", value: "Naturel" }],
    published: true,
    featured: true,
  },
  {
    id: "huile-arachide",
    slug: "huile-d-arachide",
    name: "Huile d'arachide vierge extra",
    line: "TANTY",
    category: "ingredients",
    formats: [
      { label: "1 L", packaging: "bouteille" },
      { label: "5 L", packaging: "bidon" },
    ],
    description:
      "Obtenue par première pression à froid des graines d'arachide, par procédés uniquement mécaniques, filtrée sur toile de coton, sans raffinage.",
    // Present on the 2014-2018 site, absent from the 2025 shop.
    published: false,
  },
  {
    id: "farine-soja",
    slug: "farine-de-soja",
    name: "Farine de soja",
    line: "TANTY",
    category: "ingredients",
    formats: [{ label: "Étui 200 g (2 × 100 g)", packaging: "etui" }],
    description: "Farine composée de soja à 100 %, pour enrichir bouillies, sauces, légumes et pâtisseries.",
    // Present on the 2014-2018 site, absent from the 2025 shop.
    published: false,
  },

  // TANTY Choco
  {
    id: "tanty-choco",
    slug: "tanty-choco",
    name: "TANTY Choco",
    line: "TANTY",
    category: "choco",
    formats: [
      { label: "1 L", packaging: "inconnu", price: 2000 },
      { label: "2 L", packaging: "inconnu", price: 5000 },
      { label: "5 L", packaging: "inconnu", price: 8000 },
      { label: "10 L", packaging: "inconnu", price: 20000 },
    ],
    description: "Chocolat à tartiner made in Cameroun, fabriqué avec les produits et la main-d'œuvre locale, à tartiner en toute sécurité.",
    published: true,
    featured: true,
  },
];

export const publishedProducts = products.filter((p) => p.published);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug && p.published);
}

export function getProductsByCategory(category: CategoryId): Product[] {
  return publishedProducts.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return publishedProducts.filter((p) => p.featured);
}

/** Main packaging of a product, used to size its placeholder. */
export function primaryPackaging(product: Product): PackagingKind {
  return product.formats[0]?.packaging ?? "inconnu";
}
