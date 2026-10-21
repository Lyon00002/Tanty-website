import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, listedCategories } from "@/data/categories";
import { CorporateHeader } from "@/site/navigation/corporate/CorporateHeader";
import { OtherRanges } from "@/site/range/OtherRanges";
import { RangeHero } from "@/site/range/RangeHero";
import { RangeProducts } from "@/site/range/RangeProducts";
import { Commander } from "@/site/sections/commander/Commander";
import { Footer } from "@/site/sections/footer/Footer";

// Every slug is prerendered by generateStaticParams; params are read at the top
// of the page on purpose (the header logo depends on the range).
export const instant = false;

export function generateStaticParams() {
  return listedCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/gammes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const range = getCategoryBySlug(slug);
  if (!range) return {};
  return { title: range.name, description: range.summary };
}

export default async function RangePage({ params }: PageProps<"/gammes/[slug]">) {
  const { slug } = await params;
  const range = getCategoryBySlug(slug);
  if (!range) notFound();

  return (
    <>
      <CorporateHeader />
      <main id="contenu">
        <RangeHero range={range} />
        <RangeProducts range={range} />
        <OtherRanges current={range.id} />
        <Commander />
      </main>
      <Footer above="var(--nid-yellow)" />
    </>
  );
}
