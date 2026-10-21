/**
 * Home-only mode (client request, 2026-10-20): while the home page is being
 * reviewed, every link to another page is disabled, menu entries jump to the
 * sections of the home page, and the other routes redirect to "/".
 * WhatsApp, phone and e-mail actions stay active.
 *
 * Set to false to open the full site (ranges, product pages, catalogue).
 * next.config.ts reads the same flag for the redirects.
 */
export const HOME_ONLY = true;

/**
 * The store (client request, 2026-10-20): the catalogue (/produits) and the
 * product sheets (/produits/<slug>) stay open even in home-only mode, so the
 * home page's "Voir plus" leads to it. Range pages stay closed with HOME_ONLY.
 */
export const STORE_OPEN = true;

/**
 * The range pages (user request, 2026-10-21: "une page par gamme"): every
 * /gammes/<slug> is open even in home-only mode and linked from the home
 * page orbit and campaigns, the "Nos gammes" menu, the search, the footer,
 * the catalogue and the product sheets. Set to false to close them again.
 */
export const RANGES_OPEN = true;
