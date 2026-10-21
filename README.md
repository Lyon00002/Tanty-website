# TANTY · site vitrine et catalogue

Nouveau site de TANTY (NTFoods SARL, Yaoundé, depuis 2000). Direction **« Le Nid »**, rendue corporate et minimaliste sur le modèle d'olamagri.com : fond blanc, police Libre Franklin (famille Franklin Gothic du logo), titres bicolores, boutons rectangulaires, sections très aérées séparées par le ruban rouge du logo. Next.js 16 (App Router), React 19, TypeScript strict, Tailwind CSS 4, GSAP 3.15.

**Mode « accueil seul »** : tant que `HOME_ONLY` vaut `true` dans `src/site/config.ts`, tous les liens vers d'autres pages sont désactivés, le menu renvoie aux sections de l'accueil et les autres URL redirigent vers `/`. Passer à `false` pour ouvrir le site complet.

Les mascottes ont été retirées du site à la demande du client ; leur code est conservé dans `~/projets/tanty-propositions-archive-2026-10-20/mascottes-retirees-2026-10-20/`.

Les deux autres propositions (Le Cahier, Le Matin) sont archivées hors du projet, dans `~/projets/tanty-propositions-archive-2026-10-20` (voir son `A-LIRE.md`).

## Lancer le projet

```bash
npm install
npm run dev -- --port 3210   # http://localhost:3210
npm run build && npm start   # version de production
npm run lint
npx tsc --noEmit
```

## Pages

| URL | Contenu |
|---|---|
| `/` | Accueil : carrousel photo, histoire, gammes (bento), produits phares, contact |
| `/produits` | Catalogue complet, par gamme |
| `/gammes/<slug>` | Page d'une gamme : le logo de l'en-tête devient celui de la gamme |
| `/produits/<slug>` | Fiche produit : choix du format, commande WhatsApp pré-remplie, produits de la même gamme |

Les pages autres que `/` sont fermées tant que `HOME_ONLY` vaut `true`.

## Où se trouve quoi

```
src/app/(site)/          routes du site (layout = polices + univers du Nid)
src/site/
  routes.ts              toutes les URL internes, à un seul endroit
  tokens.css, world.css  couleurs, typographie, styles des composants
  config.ts              HOME_ONLY (mode accueil seul)
  navigation/            barre principale (transparente sur le hero, compacte au défilement), menu mobile
  sections/              sections de l'accueil (hero, histoire, gammes, produits, commander, footer)
  range/, product/       pages de gamme et fiches produit
  products/              carte produit, image produit (photo officielle ou emplacement provisoire)
  motion/                GSAP, révélation des bentos
  borders/, patterns/    ruban TANTY (séparateur), cadre natte des photos, couture de raphia, natte
  brand/                 logos de gamme
src/components/brand/    logo officiel TANTY
src/data/                company.ts, categories.ts, products.ts : seule source de vérité
```

## Remplacer un emplacement provisoire par la photo officielle

1. Exporter la photo (fond uni ou détouré, cadrage vertical, idéalement 1600 px de haut, `.webp` ou `.jpg`).
2. La déposer dans `public/products/<slug-du-produit>/1.webp` (le slug est dans `src/data/products.ts`).
3. Photos supplémentaires : `2.webp`, `3.webp`…
4. Aucune modification de code : l'emplacement provisoire disparaît dès qu'une photo existe.

## Remplacer les photos du carrousel

Déposer les visuels de branding (au moins 2400 px de large) dans `public/brand/hero/`, puis changer `image.src` (et au besoin `position`) dans `src/site/sections/hero/slides.ts`.

## Logos de gamme

- Fournis : À Grignoter, Chapelure, Choco (`public/brand/gammes/`, recadrés par `scripts/crop-category-logos.py` depuis le dossier « tanty assets »).
- En cours de création : TANTY Reine et TANTY Piment de table. En attendant, le logo TANTY les remplace. Pour les ajouter : recadrer avec le script, puis renseigner `logo` dans `src/data/categories.ts`.

## Ajouter un produit ou une gamme

- **Produit** : une entrée dans `src/data/products.ts` (identifiant et slug uniques, `category`, `formats`, `published: true`). Seules des informations vérifiées dans `description` et `facts`.
- **Gamme** : une entrée dans `src/data/categories.ts` (avec `short`, le nom sans « TANTY ») et l'identifiant dans `CategoryId` ; ajouter sa cellule dans `CELLS` (`src/site/sections/gammes/Gammes.tsx`).

## Éléments de marque

- **Logo** : `src/components/brand/BrandLogo.tsx`, extrait de la bannière officielle publiée par TANTY (aucune version vectorielle ou haute définition en ligne). Remplacer les deux PNG de `src/components/brand/assets/` par le fichier vectoriel de NTFoods dès réception.
- **Couleurs du logo** : `src/styles/tokens.css` (mesurées, à confirmer avec la charte).
- **Photos institutionnelles** : `public/brand/photos/` (provenance dans `SOURCES.md`, basse résolution).

## Points à confirmer avec NTFoods

- Prix actuels (laissés vides) ; noms définitifs des mascottes.
- Âge recommandé des bouillies Reine (« Dès 6 mois » sur l'emballage, « 04 mois » dans un texte de 2013).
- Dates (1999 ou 2000) ; distinctions et « 1500 points de vente » (anciens, non affichés).
- Logos Reine et Piment, logo vectoriel, photos haute définition.
