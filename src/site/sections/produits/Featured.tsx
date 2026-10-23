import { getCategory } from "@/data/categories";
import { primaryPackaging, publishedProducts } from "@/data/products";
import { getProductPhotos } from "@/lib/product-media";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { formatList } from "../../products/formats";
import { priceOf } from "../../products/price";
import { STORE_LINKS, routes } from "../../routes";
import { ProductsShowcase, type ShowcaseItem } from "./ProductsShowcase";

/**
 * The stack holds four rows, as many as stay pinned beside the large view
 * while it scrolls past (a taller stack has no room left to stick).
 */
const SHOWN = 8;

/**
 * Nos produits, in the layout of olamagri.com's "Our Products & Services":
 * only the products that already have their official photos (client request),
 * picked in turn from each range (flagships first) so that every range shows,
 * then laid out in range order; each opens its sheet in the store, "Voir
 * plus" opens the store with all of them.
 */
export function Featured() {
  const withPhotos = publishedProducts
    .filter((p) => getCategory(p.category).listed)
    .map((p) => ({ product: p, photos: getProductPhotos(p) }))
    .filter(({ photos }) => photos.length > 0)
    .sort(
      (a, b) =>
        getCategory(a.product.category).order - getCategory(b.product.category).order ||
        Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured)),
    );
  // One product per range, round after round, until the stack is full.
  const byRange = Map.groupBy(withPhotos, ({ product }) => product.category);
  const picked: typeof withPhotos = [];
  for (let round = 0; picked.length < SHOWN && picked.length < withPhotos.length; round++) {
    for (const list of byRange.values()) {
      if (list[round] && picked.length < SHOWN) picked.push(list[round]);
    }
  }
  const items: ShowcaseItem[] = withPhotos
    .filter((entry) => picked.includes(entry))
    .map(({ product: p, photos }) => {
      const range = getCategory(p.category).short;
      return {
        id: p.id,
        name: p.name,
        range: range !== p.name ? range : undefined,
        formats: formatList(p),
        price: priceOf(p),
        packaging: primaryPackaging(p),
        orderUrl: whatsappOrderUrl(p),
        href: STORE_LINKS ? routes.product(p) : undefined,
        photos: photos.map((ph) => ({ src: ph.src, alt: ph.alt, blur: ph.blur })),
      };
    });

  return (
    <section id="produits" aria-labelledby="nid-featured-title" className="nid-on-white scroll-mt-20 pb-14 pt-14 lg:pb-16 lg:pt-[4.5rem]">
      <div className="nid-wrap">
        <ProductsShowcase
          items={items}
          catalogueHref={STORE_LINKS ? routes.catalogue : undefined}
          heading={
            <>
              <h2 data-reveal="" id="nid-featured-title" className="nid-title">
                Nos produits
                <span className="nid-dot">.</span>
              </h2>
              <p data-reveal="" className="nid-lead mt-5">
                Des bouillies infantiles TANTY Reine aux en-cas À Grignoter et à la chapelure, tous fabriqués à Yaoundé et
                disponibles à la commande sur WhatsApp.
              </p>
            </>
          }
        />
      </div>
    </section>
  );
}
