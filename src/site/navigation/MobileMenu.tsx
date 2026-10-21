"use client";

import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { NAV_LINKS, type RangeMenuItem } from "./links";

interface MobileMenuProps {
  orderUrl: string;
  items: RangeMenuItem[];
  homeHref: string;
}

export function MobileMenu({ orderUrl, items, homeHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a, button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const focusables = Array.from(panel.querySelectorAll<HTMLElement>("a, button"));
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className="-mr-2 inline-flex size-12 items-center justify-center text-[var(--nid-green)]"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" className="size-7" />
        <span className="sr-only">Ouvrir le menu</span>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-open={open}
        className="nid-menu fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white px-[var(--nid-gutter)] pb-10"
        inert={!open}
      >
        <div className="flex h-[72px] shrink-0 items-center justify-between">
          <Link href={homeHref} className="font-bold text-[var(--nid-green)]" onClick={() => setOpen(false)}>
            Accueil
          </Link>
          <button
            type="button"
            className="-mr-2 inline-flex size-12 items-center justify-center text-[var(--nid-green)]"
            onClick={close}
          >
            <X aria-hidden="true" className="size-7" />
            <span className="sr-only">Fermer le menu</span>
          </button>
        </div>

        <nav aria-label="Navigation principale" className="mt-4">
          {items.length > 0 && (
            <>
            <p className="nid-display text-2xl text-[var(--nid-green-deep)]">Nos gammes</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {items.map((item, i) => (
                <li key={item.id} className="nid-menu-item" style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-full flex-col rounded-xl border-2 border-[var(--nid-line)] px-3 py-2.5"
                  >
                    <span className="text-sm font-bold leading-snug">{item.name}</span>
                    <span className="nid-num text-xs text-[var(--nid-ink-soft)]">
                      {item.count} produit{item.count > 1 ? "s" : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            </>
          )}
          <ul className="mt-6 flex flex-col">
            {NAV_LINKS.map(
              (l) => (
                <li key={l.href} className="border-b border-[var(--nid-line)]">
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-3.5 text-lg font-bold text-[var(--nid-ink)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <a
          href={orderUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--nid-action)] px-6 py-3 font-bold text-white"
        >
          <MessageCircle aria-hidden="true" className="size-5" />
          Commander sur WhatsApp
        </a>
      </div>
    </>
  );
}
