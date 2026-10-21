"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { RangeMenuItem } from "./links";

interface RangesMenuProps {
  items: RangeMenuItem[];
  /** Server-rendered TANTY logo, used for ranges whose logo is not ready. */
  fallbackLogo: ReactNode;
  catalogueHref: string;
}

/** "Nos gammes": a full-width panel of range logos under the header (desktop). */
export function RangesMenu({ items, fallbackLogo, catalogueHref }: RangesMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((refocus: boolean) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  return (
    <div ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="nid-navlink inline-flex items-center gap-1 font-bold"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        Nos gammes
        <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-y border-[var(--nid-line)] bg-white"
      >
        <div className="nid-wrap py-8">
          <ul className="grid grid-cols-3 gap-4 xl:grid-cols-6">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => close(false)}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-[var(--nid-line)] transition-colors hover:border-[var(--nid-green)]"
                >
                  <span
                    className="flex aspect-[16/10] items-center justify-center"
                    style={{ background: item.logo?.background ?? item.light }}
                  >
                    {item.logo ? (
                      <Image
                        src={item.logo.src}
                        width={item.logo.width}
                        height={item.logo.height}
                        alt=""
                        sizes="200px"
                        className="h-full w-auto object-contain"
                      />
                    ) : (
                      <span className="block w-[62%]">{fallbackLogo}</span>
                    )}
                  </span>
                  <span className="flex flex-1 flex-col px-3 py-2.5">
                    <span className="text-sm font-bold leading-snug">{item.name}</span>
                    <span className="nid-num text-xs text-[var(--nid-ink-soft)]">
                      {item.count} produit{item.count > 1 ? "s" : ""}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={catalogueHref} onClick={() => close(false)} className="nid-link mt-6 inline-block">
            Voir tous les produits
          </Link>
        </div>
      </div>
    </div>
  );
}
