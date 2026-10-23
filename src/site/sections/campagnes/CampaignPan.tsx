"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Photo } from "../../ui/Photo";
import { CAMPAIGNS, campaignLink } from "./campaigns";

/**
 * À l'affiche on phones and tablets: the title, then the campaign visuals in
 * a row the visitor scrolls sideways (swipe, one card at a time), each card
 * in its visual's own proportions (nothing cropped), the next one peeking at
 * the edge. The yellow mark under the row says which card is in view. No
 * hold and no slide driven by the page's scroll (user request).
 */
export function CampaignPan({ head, blurs }: { head: ReactNode; blurs: Record<string, string | undefined> }) {
  const view = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // The card in view: the one most inside the row.
  useEffect(() => {
    const root = view.current;
    if (!root) return;
    const cards = [...root.querySelectorAll("[data-card]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(cards.indexOf(e.target));
      },
      { root, threshold: 0.6 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <div className="nid-pan">
      {head}
      <div ref={view} className="nid-pan-view nid-noscrollbar lg:hidden">
        <ul className="flex w-max gap-[var(--pan-gap)]">
          {CAMPAIGNS.map((c) => {
            const { href, label } = campaignLink(c);
            return (
              <li key={c.range} data-card="" className="nid-pan-card">
                <Link
                  href={href}
                  aria-label={label}
                  className="relative block overflow-hidden rounded-xl bg-[var(--nid-green-deep)] shadow-lg sm:rounded-2xl"
                  style={{ aspectRatio: `${c.width} / ${c.height}` }}
                >
                  <span className="nid-skeleton absolute inset-0">
                    <Photo src={c.src} blur={blurs[c.src]} alt="" fill sizes="(min-width: 1024px) 1px, 86vw" className="object-cover" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      {/* Which card is in view */}
      <div aria-hidden="true" className="nid-wrap flex gap-1.5 lg:hidden">
        {CAMPAIGNS.map((c, k) => (
          <span
            key={c.range}
            data-current={k === current || undefined}
            className="h-1 w-4 rounded-full bg-[var(--nid-ink)]/15 transition-[width,background-color] duration-300 data-current:w-8 data-current:bg-[var(--nid-yellow)]"
          />
        ))}
      </div>
    </div>
  );
}
