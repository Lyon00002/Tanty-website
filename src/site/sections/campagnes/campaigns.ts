import { getCategory, type CategoryId } from "@/data/categories";
import { RANGE_LINKS, STORE_LINKS, routes } from "../../routes";

export interface Campaign {
  range: CategoryId;
  /** Wide visual. */
  src: string;
  /** Its size in px: phones show it whole, in these proportions. */
  width: number;
  height: number;
  /**
   * Framing while the visuals are wider than the card (2.38:1 in a 2:1
   * card): the visual fills the card and this keeps its key part in view
   * (CSS object-position).
   */
  focus: string;
  alt: string;
}

/** The client's three campaign visuals (public/brand/campagnes, see SOURCES.md); their headlines are part of the images. */
export const CAMPAIGNS: Campaign[] = [
  {
    range: "reine",
    src: "/brand/campagnes/reine.webp",
    width: 2400,
    height: 1009,
    focus: "80% 50%",
    alt: "Campagne TANTY Reine « Pour mieux grandir » : une mère donne la bouillie à son bébé, à côté d'un seau Reine Custard Powder Banane et des étuis Reine.",
  },
  {
    range: "grignoter",
    src: "/brand/campagnes/a-grignoter.webp",
    width: 2400,
    height: 1009,
    focus: "12% 50%",
    alt: "Campagne TANTY À Grignoter « … en toute sécurité ! » : deux amis partagent des arachides enrobées, des arachides caramélisées, des croquettes et des chips de plantain.",
  },
  {
    range: "chapelure",
    src: "/brand/campagnes/chapelure.webp",
    width: 2400,
    height: 1009,
    focus: "83% 50%",
    alt: "Campagne TANTY Chapelure « Dorée et croustillante » : une cheffe saupoudre de la chapelure sur des cuisses de poulet, à côté de l'étui TANTY Chapelure.",
  },
];

/** Where a campaign card leads (its range page, while those are open) and what it says to screen readers. */
export function campaignLink(c: Campaign) {
  const range = getCategory(c.range);
  return {
    href: RANGE_LINKS ? routes.range(range) : STORE_LINKS ? routes.catalogue : routes.ranges,
    label: `${c.alt} Voir les produits ${range.name}.`,
  };
}
