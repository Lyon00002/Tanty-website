"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { NewsItem } from "./news";

/**
 * News carousel laid out like olamagri.com's "Latest News": two cards across
 * the content width, the next one peeking past the right edge of the screen;
 * each card is a wide photo with two diagonally rounded corners, then the
 * date and the title. Round TANTY yellow arrows sit on the photos' midline;
 * dots below. A native scroll-snap track, so touch, trackpad and keyboard
 * scrolling all work; one card per view on small screens. The track only
 * scrolls sideways (a vertical wheel goes to the page), with room below for
 * the cards' rising entrance (pb-6, given back by -mb-6).
 */
export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || "0");
    const perView = Math.max(1, Math.round(el.clientWidth / step));
    const count = Math.max(1, items.length - perView + 1);
    setPages(count);
    setPage(Math.min(count - 1, Math.round(el.scrollLeft / step)));
  }, [items.length]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const go = (to: number) => {
    const el = track.current;
    const card = el?.querySelectorAll("li")[Math.max(0, Math.min(items.length - 1, to))];
    if (!el || !card) return;
    el.scrollTo({ left: (card as HTMLElement).offsetLeft - el.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: "smooth" });
  };

  const arrow =
    "absolute top-[calc(var(--news-img-h)/2)] z-[2] hidden size-[3.75rem] -translate-y-1/2 items-center justify-center rounded-full bg-[var(--nid-yellow)] text-[var(--nid-green-deep)] transition-colors hover:bg-[var(--nid-green-deep)] hover:text-[var(--nid-yellow)] disabled:pointer-events-none disabled:opacity-0 lg:flex";

  return (
    <div className="nid-news relative">
      <button type="button" onClick={() => go(page - 1)} disabled={page === 0} className={`${arrow} -left-[1.75rem]`}>
        <ChevronLeft aria-hidden="true" className="size-6" />
        <span className="sr-only">Actualités précédentes</span>
      </button>
      <button type="button" onClick={() => go(page + 1)} disabled={page >= pages - 1} className={`${arrow} right-[calc(1rem-var(--nid-bleed))]`}>
        <ChevronRight aria-hidden="true" className="size-6" />
        <span className="sr-only">Actualités suivantes</span>
      </button>

      <ul
        ref={track}
        aria-label="Actualités TANTY"
        className="nid-noscrollbar nid-news-track -mr-[var(--nid-bleed)] -mb-6 flex snap-x snap-mandatory gap-[1.875rem] overflow-x-auto overflow-y-hidden pb-6 pr-[var(--nid-bleed)]"
      >
        {items.map((item) => (
          <li key={item.id} data-reveal="" className="nid-news-card w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.875rem)/2)]">
            <article>
              <div className="relative h-[var(--news-img-h)] overflow-hidden rounded-[0_80px]">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(min-width: 640px) 40rem, 85vw"
                  className="object-cover"
                  style={{ objectPosition: item.image.position }}
                />
              </div>
              <div className="px-5 pt-10">
                <time dateTime={item.date} className="block text-base text-[var(--nid-ink-soft)]">
                  {item.dateLabel}
                </time>
                <h3 className="mt-4 text-[clamp(1.25rem,1.1rem+0.45vw,1.5rem)] font-medium leading-[1.42] text-[var(--nid-ink)]">{item.title}</h3>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="mt-10 flex justify-center gap-4" role="group" aria-label="Choisir une page d'actualités">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-current={i === page} className="flex size-6 items-center justify-center">
              <span
                className={`block size-3 rounded-full border-2 border-[var(--nid-ink)] transition-colors ${i === page ? "bg-[var(--nid-ink)]" : "bg-transparent"}`}
              />
              <span className="sr-only">Page {i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
