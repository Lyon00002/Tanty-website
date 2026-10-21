import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategory } from "@/data/categories";
import { getProductsByCategory, type Product } from "@/data/products";
import { ProductCard } from "../products/ProductCard";
import { RANGE_LINKS, routes } from "../routes";

/** Dans la même gamme: up to four sibling products, and the way to the whole range (as "Voir plus" on the home page). */
export function RelatedProducts({ product }: { product: Product }) {
  const siblings = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  if (siblings.length === 0) return null;
  const range = getCategory(product.category);
  const rangeHref = RANGE_LINKS ? routes.range(range) : routes.catalogue;
  return (
    <section aria-labelledby="nid-related" className="nid-on-white pb-20 lg:pb-28">
      <div className="nid-wrap">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <h2 data-reveal="" id="nid-related" className="nid-title">
            Dans la même <span className="nid-accent">gamme</span>
            <span className="nid-dot">.</span>
          </h2>
          <Link data-reveal="" href={rangeHref} className="nid-link inline-flex items-center gap-1.5 text-[var(--nid-green-deep)]">
            Toute la gamme {range.short}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-7">
          {siblings.map((p) => (
            <li key={p.id} data-reveal="" className="flex">
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
