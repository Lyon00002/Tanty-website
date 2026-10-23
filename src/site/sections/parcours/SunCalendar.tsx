"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import type { Milestone } from "../histoire/milestones";

/**
 * The milestones on phones, as a tear-off calendar (an éphéméride): one leaf
 * per step, its year large under a yellow binding with two rings, the next
 * leaves showing underneath, askew like the photographs pinned above. The
 * visitor turns the leaves with a swipe (a scroll-snapping row) or the arrows;
 * the dots say where they are. The last leaf, 2018, carries the shining sun
 * of the desktop path.
 */
export function SunCalendar({ items }: { items: Milestone[] }) {
  const track = useRef<HTMLOListElement>(null);
  const [page, setPage] = useState(0);
  const n = items.length;

  const go = (to: number) => {
    const el = track.current;
    const k = Math.max(0, Math.min(n - 1, to));
    el?.scrollTo({ left: k * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="lg:hidden">
      <div className="nid-leaves relative">
        <ol
          ref={track}
          aria-label="Les grandes étapes de TANTY"
          onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
          className="nid-noscrollbar relative z-[1] flex snap-x snap-mandatory overflow-x-auto"
        >
          {items.map((m, i) => (
            <li key={m.year} className="w-full shrink-0 snap-center" aria-label={`${m.year}, étape ${i + 1} sur ${n}`}>
              <article className="nid-leaf">
                {/* The binding */}
                <div aria-hidden="true" className="nid-leaf-binding">
                  <span />
                  <span />
                </div>
                <div className="flex items-start justify-between gap-4 px-5 pb-6 pt-5">
                  <p className="nid-display nid-num text-[3.25rem] leading-[0.95] text-[var(--nid-green)]">
                    {m.year}
                    <span className="nid-dot">.</span>
                  </p>
                  <span aria-hidden="true" className={`nid-sun mt-2 shrink-0 ${i === n - 1 ? "nid-sun-high" : ""}`} />
                </div>
                <p className="-mt-2 px-5 pb-6 text-pretty text-[0.9375rem] leading-snug text-[var(--nid-ink)]">{m.text}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--nid-ink)]/15 text-[var(--nid-green)] transition-opacity disabled:opacity-30"
        >
          <ChevronLeft aria-hidden="true" className="size-5" />
          <span className="sr-only">Étape précédente</span>
        </button>
        <div className="flex gap-2" role="group" aria-label="Choisir une étape">
          {items.map((m, i) => (
            <button key={m.year} type="button" onClick={() => go(i)} aria-current={i === page} className="flex size-6 items-center justify-center">
              <span className={`block h-2 rounded-full transition-[width,background-color] duration-300 ${i === page ? "w-5 bg-[var(--nid-yellow)]" : "w-2 bg-[var(--nid-ink)]/20"}`} />
              <span className="sr-only">{m.year}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page === n - 1}
          className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--nid-ink)]/15 text-[var(--nid-green)] transition-opacity disabled:opacity-30"
        >
          <ChevronRight aria-hidden="true" className="size-5" />
          <span className="sr-only">Étape suivante</span>
        </button>
      </div>
    </div>
  );
}
