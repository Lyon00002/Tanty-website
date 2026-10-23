import type { CategoryId } from "@/data/categories";

export interface Campaign {
  range: CategoryId;
  /** Wide visual. */
  src: string;
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
    focus: "80% 50%",
    alt: "Campagne TANTY Reine « Pour mieux grandir » : une mère donne la bouillie à son bébé, à côté d'un seau Reine Custard Powder Banane et des étuis Reine.",
  },
  {
    range: "grignoter",
    src: "/brand/campagnes/a-grignoter.webp",
    focus: "12% 50%",
    alt: "Campagne TANTY À Grignoter « … en toute sécurité ! » : deux amis partagent des arachides enrobées, des arachides caramélisées, des croquettes et des chips de plantain.",
  },
  {
    range: "chapelure",
    src: "/brand/campagnes/chapelure.webp",
    focus: "83% 50%",
    alt: "Campagne TANTY Chapelure « Dorée et croustillante » : une cheffe saupoudre de la chapelure sur des cuisses de poulet, à côté de l'étui TANTY Chapelure.",
  },
];
