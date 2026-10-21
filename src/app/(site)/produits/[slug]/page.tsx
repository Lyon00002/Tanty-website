import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/categories";
import { getProductBySlug, publishedProducts } from "@/data/products";
import { CorporateHeader } from "@/site/navigation/corporate/CorporateHeader";
import { ProductDetail } from "@/site/product/ProductDetail";
import { RelatedProducts } from "@/site/product/RelatedProducts";
import { OtherRanges } from "@/site/range/OtherRanges";
import { RANGE_LINKS } from "@/site/routes";
import { Commander } from "@/site/sections/commander/Commander";
import { Footer } from "@/site/sections/footer/Footer";

// Every slug is prerendered by generateStaticParams; params are read at the top
// of the page on purpose (the header logo depends on the range).
export const instant = false;

export function generateStaticParams() {
  return publishedProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produits/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: product.name, description: product.description ?? `${product.name}, ${product.line}.` };
}

export default async function ProductPage({ params }: PageProps<"/produits/[slug]">) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();
  const range = getCategory(product.category);

  return (
    <>
      <CorporateHeader />
      <main id="contenu">
        <ProductDetail product={product} />
        <RelatedProducts product={product} />
        {RANGE_LINKS && <OtherRanges current={range.id} />}
        <Commander />
      </main>
      <Footer above="var(--nid-yellow)" />
    </>
  );
}
