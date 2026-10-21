import Image from "next/image";
import { BandEdge } from "../../borders/BandEdge";
import { listedCategories, universes } from "@/data/categories";
import { getProductsByCategory, primaryPackaging } from "@/data/products";
import { RANGE_LINKS, routes } from "../../routes";
import { RangePortfolio, type PortfolioGroup, type PortfolioTile } from "./RangePortfolio";

/** The filter: the catalogue's universes that hold at least one listed range. */
const GROUPS: PortfolioGroup[] = universes
  .filter((u) => listedCategories.some((c) => c.universe === u.id))
  .map((u) => ({ id: u.id, label: u.name }));

/**
 * Explorez nos gammes: the ranges in orbit around the TANTY logo, on a dark
 * band: TANTY Reine buckets in stock (company photo) under a deep green veil.
 */
export function Gammes() {
  const tiles: PortfolioTile[] = [...listedCategories]
    .sort((a, b) => a.order - b.order)
    .map((range) => {
      const products = getProductsByCategory(range.id);
      return {
        range,
        count: products.length,
        group: range.universe,
        packaging: products[0] ? primaryPackaging(products[0]) : undefined,
        href: RANGE_LINKS ? routes.range(range) : undefined,
      };
    });

  return (
    <section
      id="gammes"
      aria-labelledby="nid-ranges-title"
      className="nid-on-deep relative isolate scroll-mt-20 overflow-hidden pb-28 pt-32 lg:pb-36 lg:pt-44"
    >
      <Image
        src="/brand/photos/stock-seaux-reine.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_40%] grayscale"
      />
      <div aria-hidden="true" className="nid-portfolio-veil absolute inset-0 -z-10" />
      <BandEdge side="top" />
      <BandEdge side="bottom" />
      <div className="nid-wrap">
        <RangePortfolio
          groups={GROUPS}
          tiles={tiles}
          heading={
            <>
              <h2 data-reveal="" id="nid-ranges-title" className="nid-title">
                Explorez <span className="nid-accent">nos gammes</span><span className="nid-dot">.</span>
              </h2>
              <p data-reveal="" className="nid-lead mt-5">Des bouillies infantiles aux produits de cuisine, toutes nos gammes sont fabriquées au Cameroun.</p>
            </>
          }
        />
      </div>
    </section>
  );
}
