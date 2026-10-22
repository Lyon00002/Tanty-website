"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Mail, Menu, MessageCircle, Phone, Search, X } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { company } from "@/data/company";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { RibbonDivider } from "../../borders/RibbonDivider";
import { Photo } from "../../ui/Photo";
import { routes } from "../../routes";
import { SearchBox } from "./SearchBox";
import type { HeaderData, HeaderRange } from "./types";

type PanelKey = "gammes" | "produits" | "carrieres" | "recherche";

const SECTIONS = [
  { label: "Notre histoire", href: routes.story },
  { label: "Notre parcours", href: "/#parcours" },
  { label: "Actualités", href: "/#actualites" },
];

/** A range as a small round badge: its logo on its own colours, or its name on white. */
function RangeBadge({ range }: { range: HeaderRange }) {
  return (
    <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-full border border-[var(--nid-ink)]/12">
      {range.logo ? (
        <span className="absolute inset-[4%] overflow-hidden rounded-full" style={{ background: `linear-gradient(${range.logo.ground[0]} 18.75%, ${range.logo.ground[1]} 81.25%)` }}>
          <Image src={range.logo.src} width={range.logo.width} height={range.logo.height} alt="" sizes="7rem" className="h-full w-full object-contain" />
        </span>
      ) : (
        <span className="nid-display px-2 text-center text-sm leading-tight text-[var(--nid-green-deep)]">{range.short}</span>
      )}
    </span>
  );
}

/** Careers: only what TANTY published (INFOS-ENTREPRISE.md: stagiaires since 2004, 4 agencies). */
function CareersPanel({ onPick }: { onPick: () => void }) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <div>
        <p className="nid-display text-[1.75rem] text-[var(--nid-ink)]">
          Rejoindre TANTY<span className="nid-dot">.</span>
        </p>
        <p className="mt-3 max-w-[34rem] leading-relaxed text-[var(--nid-ink-soft)]">
          Depuis 2004, NTFoods accueille et forme des stagiaires chaque année dans ses ateliers de Yaoundé et ses agences
          commerciales.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3">
        <p className="font-semibold text-[var(--nid-ink)]">Candidature ou demande de stage</p>
        <a
          href={`mailto:${company.email}?subject=${encodeURIComponent("Candidature")}`}
          onClick={onPick}
          className="nid-btn nid-btn-primary"
        >
          <Mail aria-hidden="true" className="size-5" />
          Écrire à {company.email}
        </a>
      </div>
    </div>
  );
}

/**
 * Client part of the proposal 3 header (see CorporateHeader): two rows
 * (logo row + 48 px bar) so the hero film gets the room, dressed in the
 * site's theme: white bar, links underlined by the yellow swoosh, the
 * signature in green, the yellow "Commander" button, panels ending on the
 * logo ribbon. On the hero the logo row keeps its large logo. The menu bar
 * pins to the top while scrolling; once the logo row has gone the bar grows
 * to 64 px and brings the logo back at a readable size (44 px), with the
 * search and the order button, without moving the page. Panels open on hover
 * or click, close on Escape, on a click outside or after a choice. Small
 * screens: the logo row stays at the top, with search and menu buttons; the
 * menu opens full screen.
 */
export function CorporateHeaderClient({ data }: { data: HeaderData }) {
  const [panel, setPanel] = useState<PanelKey | null>(null);
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  // The small logo appears in the bar once the logo row has scrolled away.
  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { rootMargin: "0px 0px 0px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Escape and outside clicks close the panels and the menu.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPanel(null);
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (bar.current && !bar.current.contains(e.target as Node)) setPanel(null);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  // Opening the search from the pinned bar puts the cursor straight in its field.
  useEffect(() => {
    if (panel === "recherche") document.querySelector<HTMLInputElement>("#nid-panel-recherche input")?.focus();
  }, [panel]);

  // The full-screen menu keeps the page from scrolling behind it.
  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setPanel(null);
  const hoverOpen = (key: PanelKey) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPanel(key), 90);
  };
  const hoverClose = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setPanel(null), 160);
  };

  const trigger = (key: PanelKey, label: string, bold = false) => (
    <button
      type="button"
      aria-expanded={panel === key}
      aria-controls={`nid-panel-${key}`}
      onClick={() => setPanel((p) => (p === key ? null : key))}
      onMouseEnter={() => hoverOpen(key)}
      className={`nid-barlink inline-flex h-full items-center gap-1 whitespace-nowrap ${bold ? "font-bold" : "font-semibold"}`}
      data-open={panel === key}
    >
      {label}
      <ChevronDown aria-hidden="true" className={`size-4 shrink-0 transition-transform duration-200 ${panel === key ? "rotate-180" : ""}`} />
    </button>
  );

  const panels: Record<PanelKey, ReactNode> = {
    gammes: (
      <div>
        <ul className="grid max-w-[68rem] grid-cols-7 gap-6 xl:gap-8">
          {data.ranges.map((r) => (
            <li key={r.id}>
              <Link href={r.href} onClick={close} className="group block text-center">
                <span className="block transition-transform duration-300 group-hover:scale-[1.04]">
                  <RangeBadge range={r} />
                </span>
                <span className="mt-3 block text-sm font-semibold text-[var(--nid-ink)]">{r.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href={routes.ranges} onClick={close} className="nid-swoosh-link mt-8 inline-flex items-center gap-1.5 font-semibold text-[var(--nid-ink)]">
          Explorer nos gammes <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    ),
    produits: (
      <div>
        <ul className="grid grid-cols-7 gap-5">
          {data.products.map((p) => (
            <li key={p.id}>
              <Link href={p.href} onClick={close} className="group block">
                <span className="nid-skeleton relative block aspect-[4/5] overflow-hidden rounded-[0_20px]">
                  <Photo src={p.photo} alt="" fill sizes="10rem" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                </span>
                <span className="mt-2 block text-xs font-semibold uppercase tracking-[0.06em] text-[var(--nid-green)]">{p.range}</span>
                <span className="block text-sm font-semibold leading-snug text-[var(--nid-ink)]">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-8">
          <Link href={routes.featured} onClick={close} className="nid-swoosh-link inline-flex items-center gap-1.5 font-semibold text-[var(--nid-ink)]">
            Nos produits phares <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          {data.storeHref && (
            <Link href={data.storeHref} onClick={close} className="nid-swoosh-link inline-flex items-center gap-1.5 font-semibold text-[var(--nid-ink)]">
              Toute la boutique <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </div>
    ),
    carrieres: <CareersPanel onPick={close} />,
    // Search: centred under its own title, a taller field, suggestions with their previews.
    recherche: (
      <div className="mx-auto max-w-[42rem] pb-4 text-center">
        <p className="nid-title text-[clamp(1.75rem,1.4rem+1.1vw,2.4rem)]">
          Que recherchez-vous<span className="nid-dot">&nbsp;?</span>
        </p>
        <p className="mt-3 text-[var(--nid-ink-soft)]">Le nom d&apos;un produit ou d&apos;une gamme TANTY.</p>
        <SearchBox entries={data.search} autoFocus onPick={close} large className="mt-7" />
      </div>
    ),
  };

  return (
    <>
      <header
        data-stuck={stuck}
        className="nid-on-white relative z-[45] transition-shadow duration-300 max-lg:sticky max-lg:top-0 max-lg:data-[stuck=true]:shadow-[0_10px_30px_-22px_rgb(15_40_20/0.45)]"
      >
        {/* Logo row: logo and signature, search, then the contacts */}
        <div className="nid-wrap flex items-center justify-between gap-6 py-4 lg:py-5">
          {/* Logo and signature */}
          <Link href={routes.home} className="flex min-w-0 items-end gap-4 lg:gap-6" aria-label="TANTY, accueil">
            <BrandLogo className="h-12 w-auto shrink-0 sm:h-14 lg:h-[4.75rem]" title={null} preload sizes="12rem" />
            <span className="nid-display hidden pb-1.5 text-[1.2rem] leading-none text-[var(--nid-green)] sm:block xl:text-[1.45rem]">
              {company.slogans.signature}
            </span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            <SearchBox entries={data.search} className="w-[min(22rem,24vw)]" />
            <a href={`tel:${company.phone.e164}`} className="nid-swoosh-link nid-num hidden items-center gap-2 whitespace-nowrap text-sm text-[var(--nid-ink-soft)] xl:inline-flex">
              <Phone aria-hidden="true" className="size-4 shrink-0" />
              {company.phone.display}
            </a>
            <a
              href={whatsappContactUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="nid-btn nid-btn-yellow min-h-11 min-w-0 shrink-0 px-5 py-2 text-[0.9375rem]"
            >
              <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
              Commander
            </a>
          </div>
          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((o) => !o)}
              className="inline-flex size-12 items-center justify-center text-[var(--nid-green)]"
            >
              {searchOpen ? <X aria-hidden="true" className="size-6" /> : <Search aria-hidden="true" className="size-6" />}
              <span className="sr-only">{searchOpen ? "Fermer la recherche" : "Rechercher"}</span>
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="nid-mobile-menu"
              onClick={() => setMenuOpen(true)}
              className="-mr-2 inline-flex size-12 items-center justify-center text-[var(--nid-green)]"
            >
              <Menu aria-hidden="true" className="size-7" />
              <span className="sr-only">Ouvrir le menu</span>
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="nid-wrap pb-4 lg:hidden">
            <SearchBox entries={data.search} autoFocus onPick={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      <div ref={sentinel} aria-hidden="true" />

      {/* Menu bar, pinned while scrolling (desktop). Its place in the page stays 48 px tall;
          the white bar itself grows to 64 px once pinned (no layout jump). */}
      <nav ref={bar} aria-label="Navigation principale" onMouseLeave={hoverClose} className="sticky top-0 z-40 hidden h-12 lg:block">
        <div
          data-stuck={stuck}
          className={`nid-bar absolute inset-x-0 top-0 border-t border-[var(--nid-ink)]/8 bg-white shadow-[0_10px_30px_-22px_rgb(15_40_20/0.45)] transition-[height] duration-300 ease-[var(--nid-ease-out)] ${
            stuck ? "h-16" : "h-12"
          }`}
        >
          <div className="nid-wrap flex h-full items-stretch justify-between gap-6 text-[0.9375rem] text-[var(--nid-ink)]">
            <ul className="flex items-stretch gap-6 xl:gap-8">
              {/* The logo, at a readable size, slides in once the logo row has gone */}
              <li
                className={`flex items-center overflow-hidden transition-[max-width,opacity,margin] duration-300 ease-[var(--nid-ease-out)] ${
                  stuck ? "mr-2 max-w-32 opacity-100" : "-mr-6 max-w-0 opacity-0 xl:-mr-8"
                }`}
              >
                <Link href={routes.home} tabIndex={stuck ? 0 : -1} aria-hidden={!stuck} className="block">
                  <BrandLogo className="h-11 w-auto" title="TANTY, accueil" sizes="8rem" />
                </Link>
              </li>
              <li className="flex">{trigger("gammes", "Nos gammes")}</li>
              <li className="flex">{trigger("produits", "Nos produits")}</li>
              {SECTIONS.map((s) => (
                <li
                  key={s.href}
                  className={
                    // Pinned, the bar also carries the logo, the search and the order button: the anchors give way first.
                    s.href === "/#parcours"
                      ? stuck
                        ? "hidden"
                        : "hidden xl:flex"
                      : stuck
                        ? "hidden xl:flex"
                        : "flex"
                  }
                >
                  <Link href={s.href} onMouseEnter={hoverClose} className="nid-barlink inline-flex h-full items-center whitespace-nowrap font-semibold">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex items-stretch gap-6 xl:gap-8">
              <li className="flex">{trigger("carrieres", "Carrières", true)}</li>
              {data.storeHref && (
                <li className="flex">
                  <Link href={data.storeHref} onMouseEnter={hoverClose} className="nid-barlink inline-flex h-full items-center font-bold">
                    Boutique
                  </Link>
                </li>
              )}
              <li className="flex">
                <Link href={routes.contact} onMouseEnter={hoverClose} className="nid-barlink inline-flex h-full items-center font-bold">
                  Contact
                </Link>
              </li>
              {/* Once pinned, the search and the order button come back into reach */}
              <li
                className={`flex items-center gap-3 overflow-hidden transition-[max-width,opacity] duration-300 ease-[var(--nid-ease-out)] ${
                  stuck ? "max-w-72 opacity-100" : "-ml-6 max-w-0 opacity-0 xl:-ml-8"
                }`}
                aria-hidden={!stuck}
              >
                <button
                  type="button"
                  tabIndex={stuck ? 0 : -1}
                  aria-expanded={panel === "recherche"}
                  aria-controls="nid-panel-recherche"
                  onClick={() => setPanel((p) => (p === "recherche" ? null : "recherche"))}
                  className="inline-flex size-10 shrink-0 items-center justify-center text-[var(--nid-green)] transition-colors hover:text-[var(--nid-green-deep)]"
                >
                  {panel === "recherche" ? <X aria-hidden="true" className="size-5" /> : <Search aria-hidden="true" className="size-5" />}
                  <span className="sr-only">{panel === "recherche" ? "Fermer la recherche" : "Rechercher"}</span>
                </button>
                <a
                  href={whatsappContactUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={stuck ? 0 : -1}
                  className="nid-btn nid-btn-yellow min-h-10 min-w-0 shrink-0 whitespace-nowrap px-4 py-2 text-[0.9375rem]"
                >
                  <MessageCircle aria-hidden="true" className="size-4 shrink-0" />
                  Commander
                </a>
              </li>
            </ul>
          </div>

          {/* Drop-down panels, under the bar whatever its height */}
          {(Object.keys(panels) as PanelKey[]).map((key) => (
            <div
              key={key}
              id={`nid-panel-${key}`}
              hidden={panel !== key}
              onMouseEnter={() => window.clearTimeout(hoverTimer.current)}
              className="nid-panel absolute inset-x-0 top-full border-t border-[var(--nid-ink)]/8 bg-white pb-4 shadow-[0_30px_40px_-34px_rgb(17_36_26/0.5)]"
            >
              <div className="nid-wrap pb-8 pt-10">{panels[key]}</div>
              <RibbonDivider />
            </div>
          ))}
        </div>
      </nav>

      {/* Small screens: full-screen menu */}
      {menuOpen && (
        <div id="nid-mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[80] flex flex-col overflow-y-auto bg-white lg:hidden">
          <div className="nid-wrap flex h-[4.5rem] shrink-0 items-center justify-between">
            <BrandLogo className="h-11 w-auto" title="TANTY" sizes="8rem" />
            <button type="button" onClick={() => setMenuOpen(false)} className="-mr-2 inline-flex size-12 items-center justify-center text-[var(--nid-green)]">
              <X aria-hidden="true" className="size-7" />
              <span className="sr-only">Fermer le menu</span>
            </button>
          </div>
          <div className="nid-wrap flex flex-1 flex-col gap-8 pb-10 pt-2">
            <SearchBox entries={data.search} onPick={() => setMenuOpen(false)} />
            {/* Pages only, no jumps to the home page's sections (user request): contact is in the buttons below. */}
            <nav aria-label="Navigation principale">
              <ul>
                {[{ label: "Accueil", href: routes.home }, ...(data.storeHref ? [{ label: "Boutique", href: data.storeHref }] : [])].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} onClick={() => setMenuOpen(false)} className="nid-display block py-2.5 text-[1.6rem] text-[var(--nid-ink)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {data.ranges.some((r) => !r.href.includes("#")) && (
                <>
                  <p className="nid-display mt-5 text-[1.6rem] text-[var(--nid-ink)]">Nos gammes</p>
                  <ul className="mt-2 grid grid-cols-2 gap-x-4">
                    {data.ranges
                      .filter((r) => !r.href.includes("#"))
                      .map((r) => (
                        <li key={r.id}>
                          <Link href={r.href} onClick={() => setMenuOpen(false)} className="block py-2 font-semibold text-[var(--nid-ink-soft)]">
                            {r.short}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              )}
            </nav>
            <RibbonDivider className="!px-0" />
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold text-[var(--nid-ink)]">
                Carrières
                <ChevronDown aria-hidden="true" className="size-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-4">
                <CareersPanel onPick={() => setMenuOpen(false)} />
              </div>
            </details>
            <div className="mt-auto flex flex-col gap-3">
              <a href={whatsappContactUrl()} target="_blank" rel="noopener noreferrer" className="nid-btn nid-btn-yellow">
                <MessageCircle aria-hidden="true" className="size-5" />
                Commander
              </a>
              <a href={`tel:${company.phone.e164}`} className="nid-btn nid-btn-outline nid-num">
                <Phone aria-hidden="true" className="size-5" />
                {company.phone.display}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
