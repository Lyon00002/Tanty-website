import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import type { Product } from "@/data/products";
import { STORE_LINKS, routes } from "../routes";
import { formatList } from "./formats";
import { Price } from "./PriceTag";
import { priceOf } from "./price";
import { ProductImage } from "./ProductImage";

/**
 * Product card: the photo in its diagonal frame, the name, the formats on
 * sale. `showRange` adds the range under the name, for lists that mix the
 * ranges (the catalogue); among its own range it is not repeated. The whole
 * card opens the product sheet (when the store is open); on hover the photo
 * leans in, the name turns green and the arrow steps forward.
 */
export function ProductCard({ product, showRange }: { product: Product; showRange?: boolean }) {
  const price = priceOf(product);
  return (
    <article className="nid-card group relative flex w-full flex-col">
      <ProductImage product={product} />
      <div className="flex flex-1 flex-col pt-2 sm:pt-4">
        <h3 className="text-[0.8125rem] font-semibold leading-tight text-[var(--nid-ink)] sm:text-lg sm:leading-snug">
          {STORE_LINKS ? (
            <Link href={routes.product(product)} className="after:absolute after:inset-0">
              {product.name}
            </Link>
          ) : (
            product.name
          )}
        </h3>
        {price !== undefined && (
          <p className="mt-1.5 sm:mt-2">
            <Price amount={price} className="text-[1.125rem] sm:text-[1.625rem]" />
          </p>
        )}
        {showRange && <p className="mt-1 text-[0.6875rem] font-semibold text-[var(--nid-ink-soft)] sm:mt-1.5 sm:text-sm">{getCategory(product.category).short}</p>}
        <p className="nid-num mt-1 hidden text-sm leading-snug text-[var(--nid-ink-soft)] sm:block">{formatList(product)}</p>
        {STORE_LINKS && (
          <p className="mt-auto hidden items-center gap-1.5 pt-3 text-sm font-bold text-[var(--nid-green)] sm:flex" aria-hidden="true">
            Voir la fiche
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--nid-ease-out)] group-hover:translate-x-1" />
          </p>
        )}
      </div>
    </article>
  );
}
