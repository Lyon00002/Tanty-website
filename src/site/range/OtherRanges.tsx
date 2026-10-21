import Link from "next/link";
import { listedCategories, type CategoryId } from "@/data/categories";
import { getProductsByCategory, primaryPackaging } from "@/data/products";
import { RangeBubbleFace } from "../brand/RangeBubble";
import { routes } from "../routes";

/** Les autres gammes: the other ranges as the bubbles of the home page orbit, to keep exploring. */
export function OtherRanges({ current }: { current?: CategoryId }) {
  const others = [...listedCategories].filter((c) => c.id !== current).sort((a, b) => a.order - b.order);
  return (
    <section aria-labelledby="nid-other-ranges" className="nid-on-white pb-20 lg:pb-28">
      <div className="nid-wrap">
        <h2 data-reveal="" id="nid-other-ranges" className="nid-title">
          {current ? "Les autres " : "Nos "}
          <span className="nid-accent">gammes</span>
          <span className="nid-dot">.</span>
        </h2>
        <ul className="mt-10 grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-5 lg:gap-x-8">
          {others.map((range) => {
            const first = getProductsByCategory(range.id)[0];
            return (
              <li key={range.id} data-reveal="">
                <Link href={routes.range(range)} className="group flex flex-col items-center text-center">
                  <span className="nid-bubble relative block aspect-square w-full max-w-[9rem] rounded-full border border-[var(--nid-ink)]/10 bg-white">
                    <RangeBubbleFace range={range} packaging={first ? primaryPackaging(first) : undefined} sizes="9rem" />
                  </span>
                  <span className="mt-4 font-semibold leading-tight text-[var(--nid-ink)] transition-colors group-hover:text-[var(--nid-green)]">
                    {range.short}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
