import Image from "next/image";
import type { Category } from "@/data/categories";
import { BrandLogo } from "@/components/brand/BrandLogo";

/**
 * Compact range logo (header crop) for bubbles and labels. Ranges whose logo
 * is being designed (TANTY Reine, Piment de table) show the TANTY logo.
 * Loaded eagerly: it often sits in a hover bubble that starts hidden.
 */
export function RangeMark({ range, className }: { range: Category; className?: string }) {
  if (range.logo) {
    return (
      <Image
        src={range.logo.nav.src}
        width={range.logo.nav.width}
        height={range.logo.nav.height}
        alt=""
        sizes="160px"
        loading="eager"
        className={`w-auto rounded-[10px] ${className ?? ""}`}
      />
    );
  }
  return <BrandLogo variant="wordmark" title={null} eager className={`w-auto ${className ?? ""}`} />;
}
