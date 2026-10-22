import Link from "next/link";
import { Phone } from "lucide-react";
import { getCategory } from "@/data/categories";
import { company } from "@/data/company";
import { primaryPackaging, type Product } from "@/data/products";
import { getProductPhotos } from "@/lib/product-media";
import { Breadcrumbs } from "../range/Breadcrumbs";
import { RANGE_LINKS, routes } from "../routes";
import { FormatOrder } from "./FormatOrder";
import { ProductStage } from "./ProductStage";

/**
 * Product page body: the product's view (its photos, or
 * its placeholder), held in view on wide screens; beside it, the range, the
 * name, the verified facts and the WhatsApp order with the format chosen.
 * The media column is where the scroll-exploded 3D model will live later.
 */
export function ProductDetail({ product }: { product: Product }) {
  const range = getCategory(product.category);
  // The range: its own page, or the catalogue while the range pages are closed.
  const rangeHref = RANGE_LINKS ? routes.range(range) : routes.catalogue;
  return (
    <section aria-labelledby="nid-product-title" className="nid-on-white relative overflow-x-clip">
      <div className="nid-wrap pb-20 pt-8 lg:pb-28">
        <Breadcrumbs
          items={[
            { label: "Accueil", href: routes.home },
            { label: "Nos produits", href: routes.catalogue },
            { label: range.short, href: rangeHref },
            { label: product.name },
          ]}
        />
        {/* Phones: photo and name side by side, the details below; desktop: photo left (held), all the rest right */}
        <div className="mt-5 grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] items-start gap-x-4 gap-y-6 lg:mt-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-0">
          <div className="lg:sticky lg:top-24 lg:row-span-2">
            <ProductStage photos={getProductPhotos(product)} packaging={primaryPackaging(product)} name={product.name} />
          </div>

          <div className="lg:pt-8">
            <h1 data-reveal="" id="nid-product-title" className="nid-title">
              {product.name}
            </h1>
            {product.description && (
              <p data-reveal="" className="nid-lead mt-2.5 lg:mt-5">
                {product.description}
              </p>
            )}
          </div>

          <div className="col-span-2 lg:col-span-1 lg:col-start-2">
            {/* The range first (its page, or its place in the catalogue), then the verified facts. */}
            <dl data-reveal="" className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-[var(--nid-ink)]/10 pt-5 text-[0.875rem] sm:gap-x-10 sm:gap-y-5 sm:pt-6 sm:text-base lg:mt-9">
              <div>
                <dt className="text-[0.8125rem] text-[var(--nid-ink-soft)] sm:text-sm">Gamme</dt>
                <dd className="mt-1 font-semibold leading-snug">
                  <Link href={rangeHref} className="nid-link text-[var(--nid-green-deep)]">
                    {product.line}
                  </Link>
                </dd>
              </div>
              {product.facts?.map((f) => (
                <div key={f.label}>
                  <dt className="text-[0.8125rem] text-[var(--nid-ink-soft)] sm:text-sm">{f.label}</dt>
                  <dd className="mt-1 font-semibold leading-snug">{f.value}</dd>
                </div>
              ))}
            </dl>

            <div data-reveal="" className="mt-7 sm:mt-10">
              <FormatOrder product={product} />
            </div>
            <p data-reveal="" className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.875rem] text-[var(--nid-ink-soft)] sm:mt-8 sm:text-base">
              <Phone aria-hidden="true" className="size-4 text-[var(--nid-green)]" />
              Service client&nbsp;:
              <a href={`tel:${company.phone.e164}`} className="nid-link nid-num text-[var(--nid-ink)]">
                {company.phone.display}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
