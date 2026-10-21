import { PAGES_OPEN, routes } from "../../routes";

/**
 * Hero slides. The photographs are TANTY's own advertising shoot (an
 * ambassador with the À Grignoter range, public/brand/hero, provenance in
 * SOURCES.md) and every text relies on facts TANTY published
 * (INFOS-ENTREPRISE.md). To replace one, drop the new file in
 * public/brand/hero/ and change `image.src`; adjust `position` to keep the
 * face and the packs in view.
 */
export interface HeroSlide {
  id: string;
  /** Full title (for assistive tech); its last `accent` words are set in green. */
  title: string;
  accent: string;
  text: string;
  link: { href: string; label: string };
  image: { src: string; alt: string; position: string };
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "famille",
    title: "Les saveurs du Cameroun, à votre table depuis 2000",
    accent: "depuis 2000",
    text: "Bouillies de soja, en-cas, chapelure, piment de table et chocolat à tartiner, fabriqués à Yaoundé.",
    link: { href: routes.ranges, label: "Découvrir nos gammes" },
    image: {
      src: "/brand/hero/ambassadrice-sachet-tendu.webp",
      alt: "Une ambassadrice TANTY, en casquette et t-shirt jaunes, tend un sachet TANTY À Grignoter Arachides caramélisées.",
      position: "50% 12%",
    },
  },
  {
    // Source: naissance.php (2011), "la palme d'or du meilleur projet dans le domaine agroalimentaire", février 2003.
    id: "prix",
    title: "Une marque primée par le chef de l'État dès ses débuts",
    accent: "dès ses débuts",
    text: "Prix spécial du Président de la République au Salon de création d'entreprise, en 2003, pour le meilleur projet agroalimentaire.",
    link: { href: routes.story, label: "Notre histoire" },
    image: {
      src: "/brand/hero/ambassadrice-presentation.webp",
      alt: "Une ambassadrice TANTY présente deux sachets TANTY À Grignoter.",
      position: "50% 12%",
    },
  },
  {
    // Source: article « Forum national de l'industrie » (tanty.cm, juin 2018).
    id: "forum",
    title: "Une voix du made in Cameroun au Forum national de l'industrie",
    accent: "de l'industrie",
    text: "En 2018, NTFoods est invitée à intervenir au 1er Forum national de l'industrie du Cameroun, aux côtés de la SNH et d'ALUCAM.",
    link: { href: routes.story, label: "Notre histoire" },
    image: {
      src: "/brand/hero/ambassadrice-bras-charges.webp",
      alt: "Les bras chargés de sachets TANTY À Grignoter, une ambassadrice TANTY sourit.",
      position: "50% 24%",
    },
  },
  {
    // Source: article « Cfia Rennes 2018 Salon de l'agro-alimentaire » (tanty.cm, mars 2018).
    id: "rennes",
    title: "Le made in Cameroun présenté au salon CFIA, jusqu'en France",
    accent: "jusqu'en France",
    text: "En 2018, TANTY se rend au CFIA de Rennes, salon de l'agroalimentaire, avec les couleurs du Cameroun.",
    link: { href: routes.story, label: "Notre histoire" },
    image: {
      src: "/brand/hero/ambassadrice-gourmandise.webp",
      alt: "Une ambassadrice TANTY goûte un en-cas TANTY À Grignoter, sachet en main.",
      position: "50% 22%",
    },
  },
  {
    id: "partage",
    // Official À Grignoter copy: « à partager en famille ou entre amis ».
    title: "À goûter et à partager, en famille comme entre amis",
    accent: "entre amis",
    text: "Dans les foires, les supermarchés et les boutiques, TANTY se découvre en famille.",
    link: { href: routes.catalogue, label: PAGES_OPEN ? "Tous les produits" : "Nos produits" },
    image: {
      src: "/brand/hero/ambassadrice-degustation.webp",
      alt: "Une ambassadrice TANTY croque un en-cas TANTY À Grignoter.",
      position: "50% 22%",
    },
  },
];
