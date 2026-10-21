import Image from "next/image";
import logoFull from "./assets/tanty-logo.png";
import logoWordmark from "./assets/tanty-logo-wordmark.png";

/**
 * The official TANTY logo.
 *
 * Source: TANTY's own banner published on tanty.cm
 * (wp-content/uploads/2023/09/Plan-de-travail-1xxxhdpi-scaled.jpg, 2560 px,
 * Wayback capture 20250314), the largest official version found on the web
 * (2026-10-20 search: job ads and directories only carry 160 to 200 px copies).
 * The yellow ground was removed by matting against its exact color
 * (scripts/extract-logo.py). Replace both PNGs with NTFoods' vector master
 * as soon as it is supplied: the component API does not change.
 *
 * - variant "full": with "Since 2000"; "wordmark": without it.
 * - tone "reverse": no official light version exists, so on dark grounds the
 *   logo sits on a TANTY-yellow plate, as on TANTY's own visuals.
 */

type LogoVariant = "full" | "wordmark";
type LogoTone = "color" | "reverse";

interface BrandLogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  /** Accessible name. Pass null when the logo sits inside a labelled link. */
  title?: string | null;
  /** Preload when the logo is above the fold (navigation). */
  preload?: boolean;
  /** Rendered width hint for responsive image selection. */
  sizes?: string;
  /** Load right away even when hidden (e.g. inside a hover bubble). */
  eager?: boolean;
}

export function BrandLogo({
  variant = "full",
  tone = "color",
  className,
  title = "TANTY",
  preload = false,
  sizes = "(min-width: 1024px) 260px, 200px",
  eager = false,
}: BrandLogoProps) {
  const src = variant === "full" ? logoFull : logoWordmark;
  const alt = title ?? "";

  if (tone === "reverse") {
    return (
      <span
        className={`inline-block rounded-[14%/28%] bg-[var(--tanty-yellow)] px-[7%] py-[5%] shadow-[0_6px_16px_-10px_rgb(0_0_0/0.45)] ${className ?? ""}`}
      >
        <Image src={src} alt={alt} sizes={sizes} preload={preload} loading={eager ? "eager" : undefined} className="block h-auto w-full" />
      </span>
    );
  }

  // Callers size the logo by width (w-*) or by height (h-full w-auto): keep the ratio either way.
  const sizing = /(^|\s)h-/.test(className ?? "") ? "" : "h-auto";
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      preload={preload}
      loading={eager ? "eager" : undefined}
      className={`block ${sizing} ${className ?? ""}`}
    />
  );
}
