"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import type { SearchEntry } from "./types";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/**
 * Search the ranges and products as you type (accents and case ignored):
 * up to six suggestions, arrow keys to move, Enter to open, Escape to close.
 * A combobox in the ARIA sense.
 */
export function SearchBox({ entries, autoFocus, onPick, className }: { entries: SearchEntry[]; autoFocus?: boolean; onPick?: () => void; className?: string }) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);

  const results = useMemo(() => {
    const needle = fold(q.trim());
    if (!needle) return [];
    return entries.filter((e) => fold(`${e.label} ${e.sub}`).includes(needle)).slice(0, 6);
  }, [q, entries]);

  const go = (entry: SearchEntry) => {
    setOpen(false);
    setQ("");
    onPick?.();
    router.push(entry.href);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHi((h) => Math.min(results.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHi((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter" && results[hi]) {
      e.preventDefault();
      go(results[hi]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && q.trim().length > 0;

  return (
    <div className={`relative ${className ?? ""}`}>
      <label htmlFor={`${id}-q`} className="sr-only">
        Rechercher un produit ou une gamme
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[var(--nid-ink-soft)]" />
      <input
        id={`${id}-q`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[hi] ? `${id}-opt-${hi}` : undefined}
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder="Rechercher un produit, une gamme…"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setHi(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKey}
        className="h-11 w-full rounded-[2px] border border-[var(--nid-ink)]/15 bg-white pl-12 pr-5 text-[0.9375rem] text-[var(--nid-ink)] outline-none transition-colors placeholder:text-[var(--nid-ink-soft)]/70 focus:border-[var(--nid-green)]"
      />
      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Suggestions"
          className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-[70] overflow-hidden rounded-[0_24px] bg-white py-2 shadow-[0_24px_48px_-24px_rgb(17_36_26/0.45)] ring-1 ring-[var(--nid-ink)]/8"
        >
          {results.length === 0 ? (
            <li className="px-5 py-3 text-sm text-[var(--nid-ink-soft)]">Aucun résultat pour « {q.trim()} ».</li>
          ) : (
            results.map((r, i) => (
              <li
                key={`${r.kind}-${r.href}-${r.label}`}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={i === hi}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHi(i)}
                onClick={() => go(r)}
                className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 ${i === hi ? "bg-[rgb(254_204_0/0.14)]" : ""}`}
              >
                <span className="relative flex h-11 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[0_8px] bg-[rgb(254_204_0/0.18)]">
                  {r.thumb ? (
                    <Image src={r.thumb} alt="" fill sizes="36px" className="object-cover" />
                  ) : (
                    r.kind === "gamme" && <span className="text-[0.625rem] font-bold text-[var(--nid-green-deep)]">Gamme</span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-[var(--nid-ink)]">{r.label}</span>
                  <span className="block truncate text-xs text-[var(--nid-ink-soft)]">{r.sub}</span>
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
