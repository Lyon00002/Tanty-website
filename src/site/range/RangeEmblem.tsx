"use client";

import { useRef } from "react";
import type { Category } from "@/data/categories";
import type { PackagingKind } from "@/data/products";
import { RangeBubbleFace } from "../brand/RangeBubble";
import { RibbonRing, WRAP_BOLD } from "../brand/RibbonRing";
import { useSeen } from "../motion/useSeen";

/**
 * A range's emblem: its bubble (as in the home page orbit) inside the TANTY
 * logo ribbon, like the globe and the ribbon of the logo. The back of the
 * ribbon passes behind the bubble, its front across its lower part; at
 * every visit it draws itself around (world.css, .nid-wrap-ring). Sized by
 * `className`; `onWhite` gives the bubble a hairline on white pages.
 */
export function RangeEmblem({
  range,
  packaging,
  className,
  onWhite,
  sizes = "22rem",
}: {
  range: Category;
  packaging?: PackagingKind;
  className?: string;
  onWhite?: boolean;
  sizes?: string;
}) {
  const emblem = useRef<HTMLDivElement>(null);
  const seen = useSeen(emblem, 0.4);
  // The front of the ribbon passes under the range logo, not across it.
  const ring = "absolute -left-[16%] top-[54%] h-[30%] w-[132%]";
  return (
    <div ref={emblem} data-seen={seen} className={`relative aspect-square ${className ?? ""}`}>
      <RibbonRing ring={WRAP_BOLD} part="back" className={ring} />
      <span className={`absolute inset-0 rounded-full border bg-white ${onWhite ? "border-[var(--nid-ink)]/10" : "border-white/60"}`}>
        <RangeBubbleFace range={range} packaging={packaging} sizes={sizes} />
      </span>
      <RibbonRing ring={WRAP_BOLD} part="front" className={ring} />
    </div>
  );
}
