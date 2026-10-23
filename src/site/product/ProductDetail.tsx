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
import { ProductTitle } from "./ProductTitle";

/**
 * Product page body: the product's view (its photos, or its placeholder);
 * beside it what one buys by (the name, the format, its price, the WhatsApp
 * order), and the description and verified facts: on wide screens all in the
 * column beside the held photo, on phones and tablets below photo and order,
 * across the page. The media column is where the scroll-exploded 3D model
 * will live later.
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
        {/* Where each part stands, by screen size: world.css .nid-sheet */}
        <div className="nid-sheet mt-5 lg:mt-10">
          <div className="nid-sheet-photo lg:sticky lg:top-24">
            <ProductStage photos={getProductPhotos(product)} packaging={primaryPackaging(product)} name={product.name} />
          </div>

          <h1 data-reveal="" id="nid-product-title" className="nid-sheet-title nid-title nid-title-compact lg:pt-4">
            <ProductTitle product={product} />
          </h1>
          {product.description && (
            <p data-reveal="" className="nid-sheet-desc nid-lead mt-6 lg:mt-4">
              {product.description}
            </p>
          )}

          {/* The range first (its page, or its place in the catalogue), then the verified facts. */}
          <dl data-reveal="" className="nid-sheet-facts mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[var(--nid-ink)]/10 pt-4 text-[0.8125rem] sm:gap-x-10 sm:gap-y-4 sm:pt-5 sm:text-base lg:mt-7">
            <div>
              <dt className="text-[0.75rem] font-semibold text-[var(--nid-green)] sm:text-sm">Gamme</dt>
              <dd className="mt-0.5 font-semibold leading-snug sm:mt-1">
                <Link href={rangeHref} className="nid-link text-[var(--nid-green-deep)]">
                  {product.line}
                </Link>
              </dd>
            </div>
            {product.facts?.map((f) => (
              <div key={f.label}>
                <dt className="text-[0.75rem] font-semibold text-[var(--nid-green)] sm:text-sm">{f.label}</dt>
                <dd className="mt-0.5 font-semibold leading-snug sm:mt-1">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal="" className="nid-sheet-order mt-3 lg:mt-8">
            <FormatOrder product={product} />
          </div>
          <p data-reveal="" className="nid-sheet-service mt-5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[0.8125rem] text-[var(--nid-ink-soft)] sm:gap-x-2 sm:text-base lg:mt-6">
            <Phone aria-hidden="true" className="size-4 text-[var(--nid-green)]" />
            Service client&nbsp;:
            <a href={`tel:${company.phone.e164}`} className="nid-link nid-num text-[var(--nid-ink)]">
              {company.phone.display}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
