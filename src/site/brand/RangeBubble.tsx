import Image from "next/image";
import type { Category } from "@/data/categories";
import type { PackagingKind } from "@/data/products";
import { PackagingIcon } from "../icons/PackagingIcon";

/**
 * A range's face in a bubble (fills its round, positioned parent): the range
 * logo on its own colours, or its packaging and short name on white while
 * the logo is being designed. Shared by the range orbit and the inner pages.
 */
export function RangeBubbleFace({ range, packaging, sizes = "10rem" }: { range: Category; packaging?: PackagingKind; sizes?: string }) {
  const logo = range.logo;
  if (logo) {
    return (
      <span
        className="absolute inset-[3.5%] flex items-center justify-center overflow-hidden rounded-full"
        style={{ background: `linear-gradient(${logo.ground[0]} 18.75%, ${logo.ground[1]} 81.25%)` }}
      >
        <Image src={logo.src} width={logo.width} height={logo.height} alt="" sizes={sizes} className="h-full w-full object-contain" />
      </span>
    );
  }
  return (
    <span className="absolute inset-[3.5%] flex flex-col items-center justify-center gap-[0.2em] rounded-full bg-white text-[clamp(0.7rem,0.55rem+0.4vw,1rem)]">
      {packaging && <PackagingIcon kind={packaging} className="h-[30%] w-auto" />}
      <span className="nid-display px-2 text-center leading-tight text-[var(--nid-green-deep)]">{range.short}</span>
    </span>
  );
}

/** Range titles in the site's two tones: "TANTY" in ink, the range's own words in green, then the full stop. */
export function RangeTitle({ range }: { range: Category }) {
  const [lead, accent] = range.name.startsWith("TANTY ")
    ? ["TANTY ", range.name.slice(6)]
    : range.name.endsWith(" TANTY")
      ? [range.name.slice(0, -5), "TANTY"]
      : ["", range.name];
  return (
    <>
      {lead}
      <span className="nid-accent">{accent}</span>
      <span className="nid-dot">.</span>
    </>
  );
}
