"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { PackagingKind } from "@/data/products";
import { PackagingIcon } from "../../icons/PackagingIcon";

export interface ShowcasePhoto {
  src: string;
  alt: string;
}

export interface ShowcaseItem {
  id: string;
  name: string;
  /** Range short name, shown only when it differs from the product name. */
  range?: string;
  formats: string;
  packaging: PackagingKind;
  orderUrl: string;
  /** Product sheet in the store; undefined while the store is closed. */
  href?: string;
  /** Official photos (cut out), front first; empty when none has been dropped in public/products/<slug>/. */
  photos: ShowcasePhoto[];
}

/** How long each photo stays while a product is hovered, before the next one fades in. */
const FRAME_MS = 1400;

/**
 * Our products, laid out like olamagri.com's "Our Products & Services": the
 * title and text on the left with, below them, the product being pointed at,
 * shown large (its cut-out photo); on the right, a "Voir plus" link (the
 * store) at the top right, then the products in two columns, each with a
 * small preview of its photo, its range, name and formats. On desktop the
 * stack stays pinned while the large view scrolls past. Hovering a product
 * shows it large, and the longer the pointer stays, the more of its photos
 * (front, back…) fade in turn; clicking it, or the large view, opens its sheet
 * in the store. Small screens: one column, each product opens its sheet (or
 * orders on WhatsApp while the store is closed).
 */
export function ProductsShowcase({
  items,
  heading,
  catalogueHref,
}: {
  items: ShowcaseItem[];
  heading: ReactNode;
  /** The store; undefined while it is closed. */
  catalogueHref?: string;
}) {
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState(0);
  const [hovering, setHovering] = useState(false);
  const current = items[active];
  const count = current?.photos.length ?? 0;

  // While the pointer rests on a product, its photos follow one another.
  useEffect(() => {
    if (!hovering || count < 2) return;
    const timer = window.setInterval(() => setFrame((f) => (f + 1) % count), FRAME_MS);
    return () => window.clearInterval(timer);
  }, [hovering, count, active]);

  if (!current) return null;

  // Pointer gone: the sequence stops and the front of the pack comes back.
  const rest = () => {
    setHovering(false);
    setFrame(0);
  };

  const point = (i: number) => {
    if (i !== active) {
      setActive(i);
      setFrame(0);
    }
  };

  const media = (
    <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-[0_48px] bg-[#eef2f4]">
      {count > 0 ? (
        <>
          {/* The studio photo with its own background (client requirement) */}
          {current.photos.map((photo, k) => (
            <Image
              key={photo.src}
              src={photo.src}
              alt={current.href || k !== frame ? "" : photo.alt}
              fill
              sizes="24rem"
              className={`object-cover transition-[opacity,scale] duration-500 ease-[var(--nid-ease-out)] group-hover:scale-[1.03] ${
                k === frame ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center">
          <PackagingIcon kind={current.packaging} strokeWidth={2} className="h-[55%] w-auto" />
        </span>
      )}
    </span>
  );

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-0 xl:grid-cols-[minmax(0,34fr)_minmax(0,30fr)]">
      <div className="lg:pr-10 xl:pr-16">
        {heading}

        {/* The product pointed at, large (desktop); it opens the product sheet */}
        <div data-reveal="clip">
          <div
            key={current.id}
            className="nid-swap-in mt-10 hidden max-w-[24rem] lg:block"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={rest}
          >
            {current.href ? (
              <Link href={current.href} className="group block" aria-label={`${current.name} : voir la fiche produit`}>
                {media}
              </Link>
            ) : (
              media
            )}
            {count > 1 && (
              <span aria-hidden="true" className="mt-4 flex justify-center gap-2">
                {current.photos.map((photo, k) => (
                  <span
                    key={photo.src}
                    className={`h-1 rounded-full transition-[width,background-color] duration-300 ${
                      k === frame ? "w-6 bg-[var(--nid-green)]" : "w-3 bg-[var(--nid-ink)]/20"
                    }`}
                  />
                ))}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: the stack stays in view (under the 64 px bar) while the large view scrolls past */}
      <div className="flex flex-col lg:sticky lg:top-24 lg:self-start">
        {catalogueHref && (
          <div data-reveal="" className="flex justify-end">
            <Link href={catalogueHref} className="nid-link inline-flex items-center gap-1.5 text-[var(--nid-green-deep)]">
              Voir plus
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}

        <ul className="mt-8 grid content-start gap-3 sm:grid-cols-2 lg:gap-4" aria-label="Nos produits">
          {items.map((item, i) => {
            const on = i === active;
            // A small portrait of the studio photo (background kept); the packaging outline only when there is no photo.
            const thumb = (
              <span
                className="relative flex h-[88px] w-[70px] shrink-0 items-center justify-center overflow-hidden rounded-[0_0.875rem] xl:h-[96px] xl:w-[76px]"
              >
                {item.photos[0] ? (
                  <Image src={item.photos[0].src} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <PackagingIcon kind={item.packaging} className="h-14 w-auto xl:h-16" />
                )}
              </span>
            );
            // What a buyer needs at a glance: the range, the name, the formats on sale.
            const label = (
              <span className="min-w-0">
                {item.range && <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-[var(--nid-green)]">{item.range}</span>}
                <span
                  className={`mt-0.5 block text-lg font-semibold leading-snug transition-colors duration-200 ${
                    on ? "lg:text-[var(--nid-green)]" : "text-[var(--nid-ink)] group-hover:text-[var(--nid-green)]"
                  }`}
                >
                  {item.name}
                </span>
                <span className="nid-num mt-1 block text-sm leading-snug text-[var(--nid-ink-soft)]">{item.formats}</span>
              </span>
            );
            const preview = {
              onMouseEnter: () => {
                point(i);
                setHovering(true);
              },
              onMouseLeave: rest,
              onFocus: () => point(i),
            };
            return (
              <li key={item.id} data-reveal="">
                {item.href ? (
                  <Link href={item.href} {...preview} data-on={on} className="nid-product-card group flex w-full items-center gap-4 text-left">
                    {thumb}
                    {label}
                  </Link>
                ) : (
                  <>
                    {/* Store closed: desktop previews, small screens order on WhatsApp */}
                    <button type="button" {...preview} onClick={() => point(i)} aria-pressed={on} data-on={on} className="nid-product-card group hidden w-full items-center gap-4 text-left lg:flex">
                      {thumb}
                      {label}
                    </button>
                    <a href={item.orderUrl} target="_blank" rel="noopener noreferrer" className="nid-product-card group flex items-center gap-4 lg:hidden">
                      {thumb}
                      {label}
                      <MessageCircle aria-hidden="true" className="ml-auto size-6 shrink-0 text-[var(--nid-green)]" />
                      <span className="sr-only">Commander {item.name} sur WhatsApp</span>
                    </a>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
