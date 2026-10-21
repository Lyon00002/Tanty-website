"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import type { Category } from "@/data/categories";
import type { PackagingKind } from "@/data/products";
import { RangeBubbleFace } from "../../brand/RangeBubble";
import { useSeen } from "../../motion/useSeen";

export interface PortfolioGroup {
  id: string;
  label: string;
}

export interface PortfolioTile {
  range: Category;
  count: number;
  group: string;
  packaging?: PackagingKind;
  /** Range page; undefined while the other pages are closed. */
  href?: string;
}

/** The orbit drawn from the logo ribbon: an ellipse ring, thick at the front, thin at the back (viewBox 1000 x 900). */
const RIBBON = "M60 450a440 360 0 1 0 880 0a440 360 0 1 0 -880 0ZM63 446a437 354 0 1 1 874 0a437 354 0 1 1 -874 0Z";

/**
 * The ranges as an orbit around the TANTY logo, like the ribbon around the
 * word in the logo: the six range logos ride a yellow ellipse, the front ones
 * larger than the back ones. Choosing a category turns the orbit until its
 * ranges face the visitor, the others fade; the orbit turns into place each
 * time it comes into view. Title, subtitle and category filters on the left.
 * Positions come from CSS trigonometry on registered angles (world.css).
 */
export function RangePortfolio({ groups, tiles, heading }: { groups: PortfolioGroup[]; tiles: PortfolioTile[]; heading: ReactNode }) {
  // Ranges of one category sit next to each other on the orbit.
  const order = groups.flatMap((g) => tiles.filter((t) => t.group === g.id));
  const step = 360 / Math.max(1, order.length);
  /** Orbit turn that brings a category's ranges to the front (90deg = facing the visitor), read left to right. */
  const turnFor = (groupId: string) => {
    const idx = order.map((t, k) => (t.group === groupId ? k : -1)).filter((k) => k >= 0);
    const mid = idx.length ? (idx[0] + idx[idx.length - 1]) / 2 : 0;
    return step * mid;
  };
  const restTurn = groups[0] ? turnFor(groups[0].id) : 0;

  const [group, setGroup] = useState<string | null>(null);
  const [turn, setTurn] = useState(restTurn);
  const orbit = useRef<HTMLDivElement>(null);
  // The orbit turns into place at every visit: it settles once a third of it is in view and
  // steps back out of sight once it has left the screen, ready for the next visit.
  const seen = useSeen(orbit);

  /** Turn by the shortest way round. */
  const choose = (next: string | null) => {
    setGroup(next);
    const target = next === null ? restTurn : turnFor(next);
    setTurn((current) => target + 360 * Math.round((current - target) / 360));
  };

  return (
    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
      <div className="relative z-[1]">
        {heading}

        <p data-reveal="" className="mt-10 font-semibold text-white">Parcourir par catégorie&nbsp;:</p>
        <ul data-reveal="" className="mt-3 flex flex-wrap gap-2" aria-label="Filtrer les gammes par catégorie">
          {groups.map((g) => {
            const on = g.id === group;
            return (
              <li key={g.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(on ? null : g.id)}
                  className={`min-h-10 rounded-[4px] border px-3 py-2 text-sm transition-colors duration-200 ${
                    on
                      ? "border-[var(--nid-yellow)] bg-[var(--nid-yellow)] font-semibold text-[var(--nid-green-deep)]"
                      : "border-white text-white hover:bg-white/10"
                  }`}
                >
                  {g.label}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => choose(null)}
          className={`mt-3 text-xs text-white underline underline-offset-4 ${group === null ? "invisible" : ""}`}
        >
          Toutes les gammes
        </button>
      </div>

      {/* The orbit */}
      <div
        ref={orbit}
        data-seen={seen}
        className="nid-orbit relative mx-auto aspect-[10/9] w-full max-w-[36rem] lg:mr-0 lg:max-w-[44rem]"
        style={{ "--nid-orbit-turn": `${turn}deg` } as CSSProperties}
      >
        <svg viewBox="0 0 1000 900" aria-hidden="true" focusable="false" className="nid-deco nid-orbit-ribbon absolute inset-0 h-full w-full">
          <path d={RIBBON} fill="var(--nid-yellow)" fillRule="evenodd" />
        </svg>

        {/* TANTY at the heart of its ranges */}
        <span className="nid-orbit-core absolute left-1/2 top-1/2 flex aspect-square w-[28%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_-24px_rgb(0_0_0/0.6)]">
          <BrandLogo className="w-[78%]" title="TANTY" sizes="12rem" />
        </span>

        <ul aria-label="Nos gammes">
          {order.map((tile, k) => {
            const on = group === null || tile.group === group;
            const label = `${tile.range.name}, ${tile.count} produit${tile.count > 1 ? "s" : ""}`;
            const bubble = (
              <span className="nid-bubble relative block aspect-square rounded-full border border-white">
                <RangeBubbleFace range={tile.range} packaging={tile.packaging} />
              </span>
            );
            return (
              <li
                key={tile.range.id}
                data-on={on}
                aria-hidden={!on || undefined}
                className="nid-orbit-item"
                style={{ "--base": `${90 - step * k}deg`, "--i": k } as CSSProperties}
              >
                {tile.href && on ? (
                  <Link href={tile.href} aria-label={label} className="group block">
                    {bubble}
                  </Link>
                ) : (
                  <div role="img" aria-label={label}>
                    {bubble}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
