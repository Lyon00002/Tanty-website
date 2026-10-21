"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useId, useMemo, useState, type KeyboardEvent } from "react";
import { PackagingIcon } from "../../icons/PackagingIcon";
import { NAVIGATION_START } from "../../motion/NavigationProgress";
import { Photo } from "../../ui/Photo";
import type { SearchEntry } from "./types";

const fold = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** A suggestion's preview: the range logo in its bubble, the product photo in its frame, or the packaging outline. */
function Thumb({ entry }: { entry: SearchEntry }) {
  if (entry.kind === "gamme") {
    return (
      <span
        className="nid-skeleton relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--nid-ink)]/10 bg-white"
        style={entry.ground ? { background: entry.ground } : undefined}
      >
        {entry.thumb ? (
          <Photo src={entry.thumb} alt="" fill sizes="48px" className="object-contain" />
        ) : (
          entry.packaging && <PackagingIcon kind={entry.packaging} className="h-7 w-auto" />
        )}
      </span>
    );
  }
  return (
    <span className="nid-skeleton relative flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[0_10px] bg-[#eef2f4]">
      {entry.thumb ? (
        <Photo src={entry.thumb} alt="" fill sizes="44px" className="object-cover" />
      ) : (
        entry.packaging && <PackagingIcon kind={entry.packaging} className="h-8 w-auto" />
      )}
    </span>
  );
}

/**
 * Search the ranges and products as you type (accents and case ignored):
 * up to six suggestions, each with its preview, arrow keys to move, Enter
 * to open, Escape to close. A combobox in the ARIA sense. `large`: the
 * taller field of the search panel.
 */
export function SearchBox({
  entries,
  autoFocus,
  onPick,
  className,
  large,
}: {
  entries: SearchEntry[];
  autoFocus?: boolean;
  onPick?: () => void;
  className?: string;
  large?: boolean;
}) {
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
    window.dispatchEvent(new Event(NAVIGATION_START));
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
      {/* The magnifier is placed on the field alone, not on the field and its suggestions. */}
      <div className="relative">
        <Search
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--nid-ink-soft)] ${large ? "left-5 size-6" : "left-4 size-5"}`}
        />
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
          className={`nid-search-input w-full rounded-[2px] border border-[var(--nid-ink)]/15 bg-white text-[var(--nid-ink)] transition-[border-color,box-shadow] placeholder:text-[var(--nid-ink-soft)]/70 ${
            large ? "h-14 pl-14 pr-6 text-lg" : "h-11 pl-12 pr-5 text-[0.9375rem]"
          }`}
        />
      </div>
      {showList && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label="Suggestions"
          // In the search panel the list sits in the flow, so the panel grows around it.
          className={`overflow-hidden rounded-[0_24px] bg-white py-2 text-left ring-1 ring-[var(--nid-ink)]/8 ${
            large ? "relative mt-3" : "absolute inset-x-0 top-[calc(100%+0.5rem)] z-[70] shadow-[0_24px_48px_-24px_rgb(17_36_26/0.45)]"
          }`}
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
                className={`flex cursor-pointer items-center gap-4 px-4 py-2.5 ${i === hi ? "bg-[rgb(254_204_0/0.14)]" : ""}`}
              >
                <Thumb entry={r} />
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
