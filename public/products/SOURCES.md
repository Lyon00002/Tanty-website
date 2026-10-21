# Photos produits

Photos officielles TANTY fournies par le client (dossier « Tanty » du bureau) :
la séance studio (TIFF 6000 × 4000, 2026-10-20) et les photos de seaux ajoutées
le 2026-10-21 (JPEG DSC040xx). Recadrées en 4:5 autour de l'emballage par
`scripts/crop-product-photos.py` et exportées en WebP (1280 × 1600 au plus,
qualité 82). Proposition 3 : le fond de la photo (studio, table) est conservé,
à la demande du client. Aucune retouche de l'emballage lui-même.

`1.webp` = face, puis les autres vues (dos, formats côte à côte, sachet Mini,
emballage posé à plat). Le site les détecte seul (src/lib/product-media.ts) et
les montre en vignettes sur la fiche du produit.

| Produit (slug) | Vues (fichier source) |
|---|---|
| arachides-enrobees | 1 face (tanty04192), 2 dos (tanty04195_2), 3 formats à plat (tanty04187), 4 sachet Mini à plat (tanty04202) |
| arachides-caramel | 1 face (tanty04141), 2 dos (tanty04142_1), 3 formats (tanty04156), 4 sachet Mini à plat (tanty04153_1) |
| croquettes | 1 face (tanty04162), 2 dos (tanty04171), 3 formats (tanty04181_2), 4 sachet Mini à plat (tanty04175) |
| chips-de-plantain | 1 face (tanty04204), 2 dos (tanty04208), 3 face à plat (tanty04210_2), 4 dos à plat (tanty04209_1) |
| chapelure | 1 face (tanty04231_1), 2 trois-quarts (tanty04234), 3 dos à plat (tanty04233_1) |
| reine-poisson | 1 face (tanty04219_1), 2 face à plat (tanty04222) |
| reine-lactee-croissance | 1 face (tanty04236_2), 2 dos (tanty04237_1), 3 face à plat (tanty04239_1), 4 dos à plat (tanty04238_2) |
| tanty-lactee | 1 face, isolée de la photo de groupe tanty04241_2 et posée sur le fond gris des cadres du site ; 2 dos (tanty04228_1), 3 dos à plat (tanty04229_2) |
| tanty-nature | 1 face (tanty04215_2), 2 dos (tanty04216), 3 face à plat (tanty04218_1), 4 dos à plat (tanty04217_1) |
| tanty-arachides | 1 face (tanty04211), 2 dos (tanty04212), 3 face à plat (tanty04214), 4 dos à plat (tanty04213) |
| tanty-poisson | 1 face, isolée de la photo de groupe tanty04241_2 (en haut à droite) ; 2 dos (tanty04225), 3 face à plat (tanty04223), 4 dos à plat (tanty04224_1) |
| tanty-choco | 1 seau (DSC04072), 2 deux formats (DSC04070) |
| reine-custard-powder-banane | 1 (DSC04077), 2 autre format (DSC04081) |
| reine-custard-powder-fraise | 1 (DSC04073) |
| reine-custard-powder-fruits-et-oeufs | 1 (DSC04076), 2 et 3 autres formats (DSC04075, DSC04080) |
| reine-custard-powder-lacte-biscuite | 1 (DSC04074), 2 autre format (DSC04079) |

Les vues à plat des étuis et du groupe d'arachides, photographiées couchées,
sont remises droites (rotation de 90°) avant recadrage.

Non utilisées : DSC04082 et DSC04083 (seaux de plusieurs parfums ensemble) et les
photos de groupe des étuis (tanty04242_1, 04244, 04245_2, 04247, 04248_1, 04249_2).

Sans photo : Reine Multi-céréales, Reine Classic, Reine Arachides, TANTY
Parfumé, Baby Vita, Beignet soufflé, Piment de table.
