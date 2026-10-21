# Brief commun aux trois propositions de page d'accueil

> **Décisions client du 20/10/2026, prioritaires sur les fiches de piste :**
> - **Boutons et actions en vert TANTY**, jamais en rouge. Le rouge ne reste que dans le logo et, pour le Cahier, la marge du papier.
> - **Logo officiel uniquement** (`BrandLogo`), extrait de la bannière publiée par TANTY ; aucune version redessinée. Sur fond sombre, il se pose sur une plaque jaune, comme sur les visuels de TANTY.

Chaque proposition est une **vraie page d'accueil complète**, servie en local, construite dans son propre monde. Le client choisira une piste ; le site complet sera ensuite construit sur celle-ci. Le code de la piste retenue sera conservé : il doit donc être propre, typé et découpé dès maintenant.

## Contenu (identique pour les trois, composé différemment)

Ordre conseillé, chaque piste peut le réorganiser si sa narration l'exige :

1. **Navigation** : logo, liens (Produits, Notre histoire, Qualité, Contact), une action « Commander » (WhatsApp). Menu mobile complet, accessible au clavier, avec transition d'ouverture. Hauteur desktop ≤ 80 px, une seule ligne.
2. **Hero** : titre ≤ 2 lignes, sous-titre ≤ 20 mots, une action principale « Voir les produits » et au plus une secondaire. Mascotte présente. Tient dans la première fenêtre (desktop et mobile).
3. **La marque** : qui est TANTY (marque camerounaise de NTFoods, Yaoundé, depuis 2000 ; soja, maïs, arachide ; une gamme pour toute la famille).
4. **Produits phares** : les produits `featured` de `getFeaturedProducts()` avec leur image ou leur emplacement provisoire, lien vers la fiche (route prévue `/produits/[slug]`) et vers le catalogue (`/produits`).
5. **Les gammes** : les 5 catégories de `categories` (nom, résumé, nombre de produits), lien `/produits?gamme=<slug>`.
6. **Pour mieux grandir** : la bouillie Reine, avec uniquement les faits vérifiés de `products.ts` (dès 6 mois, mentions de l'emballage, à cuire).
7. **Commander / contact** : WhatsApp (`whatsappContactUrl()`), téléphone, e-mail depuis `company`.
8. **Pied de page illustré** : logo, navigation, coordonnées, mentions.

Les liens vers des pages pas encore construites (`/produits`, `/a-propos`, `/qualite`, `/contact`) restent de vrais liens : ils seront créés après le choix.

## Données et code partagés (ne pas modifier, ne pas dupliquer)

- `src/data/company.ts`, `src/data/categories.ts`, `src/data/products.ts` : toute donnée produit ou entreprise vient de là. Aucun nom de produit ni fait codé en dur dans les composants.
- `src/lib/whatsapp.ts` : liens de commande.
- `src/components/brand/BrandLogo.tsx` : le logo redessiné (`variant="full" | "wordmark"`, `tone="color" | "reverse"`). Ne jamais redessiner le logo.
- `src/styles/tokens.css` : couleurs mesurées du logo (`--tanty-yellow`, `--tanty-green`, `--tanty-green-deep`, `--tanty-red`, `--tanty-red-orange`).

## Organisation du code de chaque piste

```
src/app/propositions/<slug>/layout.tsx   polices (next/font/google) + import des tokens de la piste
src/app/propositions/<slug>/page.tsx     composition des sections uniquement (court)
src/propositions/<slug>/
  tokens.css                             variables du monde, toutes préfixées et portées par la classe racine .w-<slug>
  mascot/                                le personnage : composant principal, poses, expressions
  borders/                               bordures et séparateurs propriétaires (SVG réutilisables)
  patterns/                              motifs et fonds
  icons/                                 icônes de marque (formats d'emballage, gammes…)
  navigation/                            barre, menu mobile
  sections/<section>/                    une section = un dossier si elle a plusieurs responsabilités (contenu, illustration, bordure, animation)
  products/                              ProductCard, ProductImage (photo ou emplacement provisoire), grille
  motion/                                hooks et composants GSAP isolés ('use client')
  ui/                                    boutons et liens propres à ce monde
```

Composants serveur par défaut ; `'use client'` seulement pour les feuilles interactives ou animées. Pas de fichier de plus de ~250 lignes ; pas de composant vide ou inutilisé.

## Règles de contenu (non négociables)

- Français. Ton chaleureux, simple, jamais publicitaire creux.
- **Zéro tiret cadratin (—) ni demi-cadratin (–)** dans tout texte visible ou alternatif.
- Pas de surtitre (petite ligne en capitales espacées au-dessus d'un titre), pas de numérotation de section, pas d'indication « scroll ».
- Aucun chiffre, certification, témoignage, prix ou date non sourcé. Faits vérifiés : depuis 2000, NTFoods SARL, Yaoundé, TANTY Parfumé créé en 2006, mentions d'emballage listées dans `products.ts`, slogans de `company.slogans`.
- Pas d'emoji. Icônes fonctionnelles : `lucide-react`. Icônes de marque : SVG propres au monde.

## Images produits : emplacements provisoires

- Composant `ProductImage` : si `product.image` existe, `next/image` en `object-contain` dans le cadre ; sinon l'emplacement provisoire du monde.
- Cadre unique pour toutes les cartes : ratio **4:5** (photo finale contenue dedans), quelle que soit la forme de l'emballage.
- L'emplacement provisoire montre la **silhouette générique du type d'emballage** (`primaryPackaging(product)` : sachet à soudures dentelées, étui, seau à anse, doypack avec trou de suspension, flacon, bouteille, bidon, inconnu) dessinée en trait dans le langage du monde, le nom du produit, et la mention « Photo à venir ». Jamais de faux emballage, de faux texte d'étiquette ou de simulation de photo.

## Mascotte

- **Une famille, pas un personnage seul** (demande client, 20/10/2026) : 2 à 4 personnages du même type, même ADN graphique, personnalités distinctes lisibles en silhouette. Le personnage principal mène le hero ; les autres enrichissent les scènes où ils servent la composition. Construits comme variantes d'un même composant de base.
- SVG dessiné à la main dans le code, volumes doux par dégradés (radiaux et linéaires), reflets, ombre portée douce. Qualité « personnage de marque premium », pas clipart.
- Silhouette lisible à 48 px comme à 600 px. Proportions et couleurs strictement constantes d'une pose à l'autre.
- Composant typé `pose` + `expression`, au moins trois poses réellement utilisées sur la page (dont une pour le hero et une pour présenter un produit), parties nommées en groupes pour l'animation (yeux, bras, accessoire…).
- `aria-hidden` quand décoratif, sinon un `<title>`.
- Itérer avec des captures (grand format et petit format) jusqu'à ce qu'elle soit vraiment attachante. C'est le cœur de la proposition.

## Bordures

Chaque piste a sa famille de bordures (voir sa fiche). Elles sont la signature : variées selon le rôle de la section, jamais le même cadre partout, certaines sections restent ouvertes. Techniques : SVG léger (`preserveAspectRatio="none"` pour les bords étirables, ou motif répété), `mask-image`, pseudo-éléments. Elles ne recouvrent jamais un élément cliquable (`pointer-events: none`), ne créent aucun débordement horizontal, sont `aria-hidden`.

## Mouvement

- GSAP + ScrollTrigger via `useGSAP` (`@gsap/react`) dans des composants clients isolés ; nettoyage automatique par le contexte. CSS pour les survols simples.
- Contenu visible par défaut (le rendu serveur montre l'état final) ; l'animation part de cet état.
- `gsap.matchMedia()` : sous `prefers-reduced-motion: reduce`, aucun mouvement automatique, état final immédiat.
- Une interaction signature orchestrée, pas des apparitions identiques partout. Pas d'écouteur `scroll` manuel. Ne jamais bloquer le défilement.

## Qualité

- Responsive vérifié à 375, 768, 1280 et 1440 px. Aucun débordement horizontal.
- Contraste AA, focus visible thémé, `::selection` thémée, liens soulignés avec décalage soigné.
- Thème clair unique (usage : parents sur téléphone en journée). Pas de mode sombre pour ces propositions.
- `npx tsc --noEmit` et `npx eslint` propres sur les fichiers de la piste.
- Captures : `node scripts/shot.mjs <url> <fichier.png> <largeur> <hauteur> <full|viewport>` (mouvement réduit par défaut ; `MOTION=1` devant la commande pour capturer avec mouvement). Le serveur de dev tourne déjà sur http://localhost:3210 ; ne pas en lancer un autre.
