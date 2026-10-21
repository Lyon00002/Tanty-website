import { getCategory } from "@/data/categories";
import { primaryPackaging, publishedProducts } from "@/data/products";
import { getProductPhotos } from "@/lib/product-media";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { formatList } from "../../products/formats";
import { STORE_LINKS, routes } from "../../routes";
import { ProductsShowcase, type ShowcaseItem } from "./ProductsShowcase";

/**
 * Nos produits, in the layout of olamagri.com's "Our Products & Services":
 * only the products that already have their official photos (client request),
 * in range order, flagships first; each opens its sheet in the store, "Voir
 * plus" opens the store.
 */
export function Featured() {
  const items: ShowcaseItem[] = publishedProducts
    .filter((p) => getCategory(p.category).listed)
    .map((p) => ({ product: p, photos: getProductPhotos(p) }))
    .filter(({ photos }) => photos.length > 0)
    .sort(
      (a, b) =>
        getCategory(a.product.category).order - getCategory(b.product.category).order ||
        Number(Boolean(b.product.featured)) - Number(Boolean(a.product.featured)),
    )
    .map(({ product: p, photos }) => {
      const range = getCategory(p.category).short;
      return {
        id: p.id,
        name: p.name,
        range: range !== p.name ? range : undefined,
        formats: formatList(p),
        packaging: primaryPackaging(p),
        orderUrl: whatsappOrderUrl(p),
        href: STORE_LINKS ? routes.product(p) : undefined,
        photos: photos.map((ph) => ({ src: ph.src, alt: ph.alt })),
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
                Nos <span className="nid-accent">produits</span>
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
