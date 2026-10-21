/**
 * Milestones of TANTY, each from the official site (tanty.cm, archived):
 * naissance.php and faitmarquant.php (2011), article « Forum national de
 * l'industrie » (2018). See ~/projets/tanty-3d/references/INFOS-ENTREPRISE.md.
 */
export interface Milestone {
  year: string;
  text: string;
}

export const MILESTONES: Milestone[] = [
  { year: "1999", text: "Le premier produit est approuvé par le Centre Pasteur." },
  { year: "2000", text: "La marque TANTY voit officiellement le jour." },
  { year: "2003", text: "Prix spécial du Président de la République, meilleur projet agroalimentaire." },
  { year: "2006", text: "Naissance de TANTY Parfumé." },
  { year: "2007", text: "Naissance de TANTY Reine." },
  { year: "2010", text: "Création de NTFoods SARL et d'un site de production de 542 m²." },
  { year: "2018", text: "Intervenant au 1er Forum national de l'industrie du Cameroun." },
];
