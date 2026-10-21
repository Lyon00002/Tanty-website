import type { Metadata } from "next";
import Link from "next/link";
import { listedCategories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { RangeHashRedirect } from "@/site/catalogue/RangeHashRedirect";
import { CorporateHeader } from "@/site/navigation/corporate/CorporateHeader";
import { ProductCard } from "@/site/products/ProductCard";
import { RANGE_LINKS, routes } from "@/site/routes";
import { Commander } from "@/site/sections/commander/Commander";
import { Footer } from "@/site/sections/footer/Footer";
import { PageBand } from "@/site/sections/page/PageBand";

export const metadata: Metadata = {
  title: "Tous les produits",
  description: "Le catalogue TANTY : bouillies de soja, en-cas à grignoter, chapelure, piment de table et chocolat à tartiner.",
};

/**
 * The store's catalogue, built like the home page: a green band over a TANTY
 * stand photograph, from which a range opens its own page; then every
 * product in one list (range order, each card naming its range); then the
 * yellow contact band and the footer.
 */
export default function CataloguePage() {
  const ranges = [...listedCategories].sort((a, b) => a.order - b.order);
  const products = ranges.flatMap((r) => getProductsByCategory(r.id));
  return (
    <>
      <CorporateHeader />
      <main id="contenu">
        <PageBand
          id="nid-catalogue-title"
          crumbs={[{ label: "Accueil", href: routes.home }, { label: "Nos produits" }]}
          photo={{ src: "/brand/photos/stand-rayonnages-degustation.jpg", position: "50% 35%" }}
          title={
            <>
              Tous nos <span className="nid-accent">produits</span>
              <span className="nid-dot">.</span>
            </>
          }
          lead={
            <>
              <span className="nid-num">{products.length}</span> produits dans <span className="nid-num">{ranges.length}</span> gammes, fabriqués
              au Cameroun et disponibles à la commande sur WhatsApp.
            </>
          }
        >
          {RANGE_LINKS && (
            <>
              <p className="font-semibold text-white">Voir une gamme&nbsp;:</p>
              <nav aria-label="Nos gammes" className="mt-3">
                <ul className="flex flex-wrap gap-2">
                  {ranges.map((r) => (
                    <li key={r.id}>
                      <Link
                        href={routes.range(r)}
                        className="inline-flex min-h-10 items-center rounded-[4px] border border-white px-3 py-2 text-sm text-white transition-colors duration-200 hover:border-[var(--nid-yellow)] hover:bg-[var(--nid-yellow)] hover:text-[var(--nid-green-deep)]"
                      >
                        {r.short}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}
        </PageBand>

        <section aria-label="Tous les produits" className="nid-on-white pb-20 pt-14 lg:pb-28 lg:pt-20">
          <ul className="nid-wrap grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">
            {products.map((p) => (
              <li key={p.id} data-reveal="" className="flex">
                <ProductCard product={p} showRange />
              </li>
            ))}
          </ul>
        </section>

        <Commander />
      </main>
      <Footer above="var(--nid-yellow)" />
      {RANGE_LINKS && <RangeHashRedirect ranges={ranges.map((r) => ({ slug: r.slug, href: routes.range(r) }))} />}
    </>
  );
}
