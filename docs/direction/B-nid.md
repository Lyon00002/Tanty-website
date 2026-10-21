# Piste B : Le Nid du Tisserin

Slug : `nid` · route `/propositions/nid` · classe racine `.w-nid`

## Thèse

Le **tisserin gendarme**, l'oiseau jaune au masque noir qu'on voit dans tous les arbres du Cameroun, tisse des nids d'herbe verte fraîche pour abriter ses petits. Jaune, vert, et un œil rouge : les couleurs de TANTY existent déjà dans la nature. TANTY tisse chaque jour l'alimentation des petits avec le même soin. Le site est une **vannerie vivante** : bandes tressées, nids suspendus, brins d'herbe. Il refuse la page alimentaire générique (photo pleine largeur, cartes alignées, footer gris).

## Monde (palette et matières)

Stratégie de couleur **engagée** : des sections entièrement colorées, pas des accents sur fond neutre.

| Rôle | Valeur | Matière |
|---|---|---|
| Jaune TANTY | `#FECC00` | plumage, hero entièrement jaune |
| Vert herbe fraîche | `#4BA83D` | nid neuf, brins |
| Vert TANTY | `#1B6430` | titres, nid tressé |
| Vert profond | `#0F3A1E` | fond des sections sombres, pied de page |
| Paille | `#E9CF7A` (clair) et `#C8A047` (brins secs, jamais en couleur d'accent) | brins séchés |
| Masque | `#1A1C14` | masque et ailes du tisserin |
| Œil et action | `#E42A28` | œil rouge du tisserin, boutons d'action. **Le rouge ne sert qu'à ça.** |
| Blanc | `#FFFFFF` | cartes produits uniquement |
| Texte | `#11241A` sur clair, `#FFF6D6` sur vert profond |

## Typographie

- Titres : **Gluten** (graisses 700 à 900) : lettres rondes et souples comme des brins noués. Grands titres uniquement.
- Texte : **Hanken Grotesk** (400, 600, 700).

## Mascotte : Tisso

Un **tisserin gendarme** mâle (Ploceus cucullatus), stylisé.

- Corps : boule jaune TANTY (`#FFD83A` lumière, `#FECC00` milieu, `#E0A400` ombre), modelé par dégradé radial, ventre plus clair.
- **Masque noir** en forme de loup autour des yeux et sous le bec, nuque légèrement châtain (`#9A5A1E`).
- Œil : iris rouge-orangé chaud (`#E0482A`), grosse pupille noire, deux reflets blancs pour un regard doux et jamais inquiétant.
- Bec conique court gris-noir. Pattes orangées fines.
- Ailes jaunes à **chevrons noirs** (le motif d'aile devient un motif de marque).
- Accessoire : un **brin d'herbe verte** dans le bec ou les pattes.
- Poses : `perched` (perché sur le nid, hero), `fly` (ailes ouvertes, porte un brin), `peek` (tête qui sort de l'entrée du nid), `present` (aile tendue vers un produit). Expressions : `happy`, `wow`, `wink`.

## Bordures (famille vannerie)

1. **Tresse à trois brins** : bande horizontale de natte (vert frais, vert TANTY, paille) avec vrais entrelacs dessus-dessous ; séparateur majeur entre sections de couleurs différentes.
2. **Festons de nid** : bord fait de boucles d'herbe qui se chevauchent, en haut des sections vertes.
3. **Couture de raphia** : points croisés ou surpiqûre le long d'un bord, pour les cartes et le pied de page.
4. **Cadre goutte** : forme de nid suspendu (poire) avec entrée ronde, pour une illustration ou une photo.
5. **Brins libres** : quelques brins qui dépassent des bords, placés aux angles des sections, jamais partout.

Sections ouvertes : la section produits peut rester sans cadre, posée sur le jaune.

## Motifs et fonds

- Vannerie en damier (brins tissés), à faible contraste sur les fonds pleins.
- Chevrons de l'aile de Tisso.
- Brins d'herbe en lignes souples.
- Plumes isolées comme micro-illustrations près de certains titres.

## Composition de la page

Chaque section est un **rang de tissage** : bandes horizontales franches, séparées par des tresses, alternance de couleurs comme les rangs d'une natte.

1. **Navigation** : sur le jaune ; logo à gauche ; liens ; « Commander » en rouge.
2. **Hero** (jaune plein) : grand titre en Gluten vert TANTY à gauche ; à droite, une branche d'où pend un **nid vert tissé**, Tisso perché dessus avec un brin dans le bec. Une tresse ferme le hero vers la section suivante.
3. **La marque** (vert profond) : festons de nid en haut ; texte de la marque ; cadre goutte (illustration du tisserin qui tisse) ; repères vérifiés : depuis 2000, TANTY Parfumé créé en 2006.
4. **Produits phares** (jaune ou blanc chaud tissé) : cartes blanches à **couture de raphia** ; l'emplacement provisoire est une petite **natte tressée** sur laquelle se pose la silhouette du type d'emballage au trait vert, avec « Photo à venir ». Tisso `present` désigne la sélection.
5. **Les gammes** : **la colonie**. Comme les tisserins qui suspendent des dizaines de nids au même arbre, cinq nids pendent d'une grande branche, un par gamme (nom, nombre de produits). Survol et focus : le nid se balance doucement, Tisso `peek` sort la tête. Sur mobile, la branche devient verticale.
6. **Pour mieux grandir** (vert frais) : la bouillie Reine, faits vérifiés (dès 6 mois ; sur l'emballage : 10 vitamines, calcium, fer ; à cuire).
7. **Commander** : bande tressée avec action WhatsApp, téléphone, e-mail.
8. **Pied de page** (vert profond) : couture de raphia, Tisso endormi dans son nid, liens, coordonnées.

## Interaction signature

- **Le tissage** : les tresses de séparation se tissent au défilement (les brins glissent et s'entrelacent, scrub ScrollTrigger). Dans le hero, au chargement, le nid se tisse brin par brin (tracé de traits), puis Tisso s'y pose.
- **Le vol** : entre la section marque et la colonie, Tisso traverse l'écran en vol en portant un brin (MotionPathPlugin, gratuit dans GSAP 3.13+), une seule fois.
- **La colonie** : balancement physique des nids au survol (rotation depuis le point d'attache, ressort amorti).

## Disciplines empruntées aux mondes déclinés

- *Brocart jacquard* (décliné) : **le rang comme unité de mise en page**. Les sections sont des rangs de tissage, la page se lit rang après rang.
- *Tableau des départs* (décliné) : **une couleur réservée à l'action** (le rouge de l'œil).
- *Métropole en pixels* (décliné) : **des détails à découvrir** : une plume, un œuf de tisserin caché dans un nid de la colonie.
