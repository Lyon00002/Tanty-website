/**
 * TANTY news, newest first. Every item is an event TANTY published itself
 * (tanty.cm articles, archived; see ~/projets/tanty-3d/references/
 * INFOS-ENTREPRISE.md, section 3.3) and every photo is the one TANTY
 * published with it (public/brand/photos/SOURCES.md). Dates are as precise
 * as the source: a month when the article gives no day.
 */
export interface NewsItem {
  id: string;
  /** Machine-readable date (YYYY-MM or YYYY-MM-DD) and its French label. */
  date: string;
  dateLabel: string;
  title: string;
  image: { src: string; alt: string; position?: string; blur?: string };
}

export const NEWS: NewsItem[] = [
  {
    // Article 65, tanty.cm, juin 2018: invited by the Minister of Industry, beside SNH and ALUCAM.
    id: "forum-industrie-2018",
    date: "2018-06",
    dateLabel: "Juin 2018",
    title: "NTFoods intervient au 1er Forum national de l'industrie du Cameroun, aux côtés de la SNH et d'ALUCAM",
    image: {
      src: "/brand/photos/forum-industrie-2018-panel.jpg",
      alt: "La table des intervenants du 1er Forum national de l'industrie du Cameroun, en juin 2018.",
      position: "30% 50%",
    },
  },
  {
    // Article 64, tanty.cm, 1er mai 2018: « Fête du travail 2018 chez TANTY » (photos).
    id: "fete-du-travail-2018",
    date: "2018-05-01",
    dateLabel: "1er mai 2018",
    title: "Fête du travail 2018 chez TANTY : l'équipe pose en pagne aux couleurs de la marque",
    image: {
      src: "/brand/photos/equipe-tanty-pagne-2018.jpg",
      alt: "Une trentaine d'employés de TANTY en pagne jaune aux couleurs de la marque, Fête du travail 2018.",
      position: "50% 40%",
    },
  },
  {
    // Articles 60 and 61, tanty.cm, mars 2018: « Cfia Rennes 2018 Salon de l'agro-alimentaire ».
    id: "cfia-rennes-2018",
    date: "2018-03",
    dateLabel: "Mars 2018",
    title: "TANTY au CFIA de Rennes, salon de l'agroalimentaire, avec les couleurs du Cameroun",
    image: {
      src: "/brand/photos/cfia-rennes-2018-drapeau.jpg",
      alt: "Au CFIA de Rennes en 2018, un représentant de TANTY pose devant un drapeau du Cameroun.",
      position: "48% 40%",
    },
  },
  {
    // naissance.php (2011): « la récompense du chef de l'Etat au salon de l'entreprise en février 2003 ».
    id: "prix-president-2003",
    date: "2003-02",
    dateLabel: "Février 2003",
    title: "TANTY reçoit le Prix spécial du Président de la République pour le meilleur projet agroalimentaire",
    image: {
      src: "/brand/photos/usine-ensachage-seau-reine.jpg",
      alt: "Dans l'atelier TANTY, sous la bannière du Prix spécial du Président de la République, un responsable présente un seau TANTY Reine.",
      position: "56% 30%",
    },
  },
];
