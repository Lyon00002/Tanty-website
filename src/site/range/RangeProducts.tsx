import { ArrowRight } from "lucide-react";
import type { Category } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { ProductCard } from "../products/ProductCard";
import { ProductImage } from "../products/ProductImage";
import { formatList } from "../products/formats";
import { routes } from "../routes";
import { Action } from "../ui/Action";

/**
 * The products of a range, as the catalogue cards. A range with a single
 * product gets a spotlight instead of a one-card grid: its photo beside its
 * name, description and formats.
 */
export function RangeProducts({ range }: { range: Category }) {
  const products = getProductsByCategory(range.id);
  const single = products.length === 1 ? products[0] : undefined;

  return (
    <section id="produits" aria-labelledby="nid-range-products" className="nid-on-white scroll-mt-24 pb-20 pt-14 lg:pb-28 lg:pt-20">
      <div className="nid-wrap">
        <h2 data-reveal="" id="nid-range-products" className="nid-title">
          {single ? "Le " : "Les "}
          <span className="nid-accent">{single ? "produit" : "produits"}</span>
          <span className="nid-dot">.</span>
        </h2>

        {single ? (
          <article className="group mt-10 grid items-center gap-10 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
            <div data-reveal="clip">
              <ProductImage product={single} sizes="(min-width: 768px) 22rem, 90vw" />
            </div>
            <div data-reveal="">
              <h3 className="nid-display text-[clamp(1.75rem,1.35rem+1.3vw,2.4rem)] text-[var(--nid-ink)]">{single.name}</h3>
              {single.description && <p className="nid-lead mt-4">{single.description}</p>}
              <p className="nid-num mt-4 text-[var(--nid-ink-soft)]">{formatList(single)}</p>
              <Action href={routes.product(single)} className="mt-8">
                Voir la fiche
                <ArrowRight aria-hidden="true" className="size-5" />
              </Action>
            </div>
          </article>
        ) : (
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-7 lg:gap-y-14">
            {products.map((p) => (
              <li key={p.id} data-reveal="" className="flex">
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
