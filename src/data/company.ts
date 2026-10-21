/**
 * Public company facts. Every value here is sourced; see
 * ~/projets/tanty-3d/references/INVENTAIRE.md and INFOS-ENTREPRISE.md
 * (official tanty.cm pages archived on the Wayback Machine, 2011-2026).
 * Leave a field undefined rather than guessing.
 */
export const company = {
  brand: "TANTY",
  legalName: "NTFoods SARL",
  city: "Yaoundé",
  country: "Cameroun",
  /** Logo "Since 2000"; official story: "La marque TANTY voit officiellement le jour en 2000". */
  since: 2000,
  siteUrl: "https://tanty.cm",
  email: "info@tanty.cm",
  shopEmail: "shoponline@tanty.cm",
  /** Customer service, calls and WhatsApp (official site footer 2024-2025). */
  phone: { display: "+237 690 79 62 40", e164: "+237690796240" },
  otherPhones: [
    { label: "Contact direct", display: "+237 691 35 94 03", e164: "+237691359403" },
    { label: "Service client (fixe)", display: "+237 222 30 70 76", e164: "+237222307076" },
    { label: "Agence de Douala", display: "+237 691 25 37 10", e164: "+237691253710" },
  ],
  /** "Appel / WhatsApp: +237 690 796 240" on the official site footer. */
  whatsapp: { e164: "237690796240", confirmed: true },
  address: {
    street: "Messamendongo, carrefour Cité de la Paix, entrée TANTY",
    city: "Yaoundé",
    country: "Cameroun",
    poBox: "BP 25046 Yaoundé",
  },
  /** Official one-line presentation (2017-2025). */
  activity:
    "Entreprise agroalimentaire camerounaise spécialisée dans la transformation des produits agricoles locaux (maïs, soja, arachides).",
  slogans: {
    /** Brand signature, used for the porridges. */
    signature: "Il suffit de goûter…",
    /** Printed on the Reine sachets and buckets. */
    growth: "Pour mieux grandir !",
    growthEn: "For a better growth!",
    /** Culinary ingredients and oil. */
    kitchen: "La santé dans vos plats !",
    /** TANTY à Grignoter. */
    snacks: "À chacun son sachet !",
    /** Baby Vita poster. */
    babyVita: "La vitalité de l'enfant !",
    /** Home banner 2024-2025. */
    madeIn: "100 % Made in Cameroun, de la matière première aux produits finis.",
    /** Older site header (2014) and current signature. */
    legacy: "Il suffit de goûter…",
  },
  /** Official values (2017-2025). */
  values: ["L'innovation", "Le professionnalisme", "L'intégrité", "La satisfaction client", "L'esprit d'équipe"],
  motto: "Discipline, Performance, Responsabilité",
} as const;

export type Company = typeof company;
