"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * The catalogue used to hold one section per range (/produits#<range slug>).
 * Those links now lead to the range's own page, which lists its products.
 */
export function RangeHashRedirect({ ranges }: { ranges: { slug: string; href: string }[] }) {
  const router = useRouter();
  useEffect(() => {
    const slug = decodeURIComponent(window.location.hash.slice(1));
    const range = ranges.find((r) => r.slug === slug);
    if (range) router.replace(range.href);
  }, [ranges, router]);
  return null;
}
