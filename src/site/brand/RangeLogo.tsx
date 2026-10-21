import Image from "next/image";
import type { Category } from "@/data/categories";
import { BrandLogo } from "@/components/brand/BrandLogo";

interface RangeLogoProps {
  range: Category;
  /** "nav": height-bound in the header; "tile": fills a portfolio tile. */
  variant: "nav" | "tile";
  className?: string;
  preload?: boolean;
}

/**
 * A range's official logo, shown on the background it was designed on.
 * Ranges whose logo is still being designed (TANTY Reine, TANTY Piment de
 * table) fall back to the TANTY logo, with the range name set beside it on
 * tiles: no logo is ever improvised.
 */
export function RangeLogo({ range, variant, className, preload }: RangeLogoProps) {
  if (range.logo) {
    const file = variant === "nav" ? range.logo.nav : range.logo;
    return (
      <Image
        src={file.src}
        width={file.width}
        height={file.height}
        alt={range.name}
        preload={preload}
        sizes={variant === "nav" ? "160px" : "(min-width: 1024px) 380px, 90vw"}
        className={`block ${variant === "nav" ? "h-full w-auto rounded-[10px]" : "h-auto w-full"} ${className ?? ""}`}
      />
    );
  }

  if (variant === "nav") {
    return <BrandLogo variant="wordmark" title={range.name} preload={preload} className={`h-full w-auto ${className ?? ""}`} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 px-6 ${className ?? ""}`}>
      <BrandLogo variant="wordmark" title={null} className="w-[58%] max-w-56" />
      <p className="nid-display text-center text-[clamp(1.5rem,1.1rem+1.2vw,2.1rem)] text-[var(--nid-green-deep)]">
        {range.name.replace(/\s*TANTY\s*/g, " ").trim()}
      </p>
    </div>
  );
}
