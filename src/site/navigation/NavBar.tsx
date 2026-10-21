import Link from "next/link";
import type { CSSProperties } from "react";
import { MessageCircle } from "lucide-react";
import type { Category } from "@/data/categories";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { RangeLogo } from "../brand/RangeLogo";
import { PAGES_OPEN, routes } from "../routes";
import { NAV_LINKS, rangeMenuItems } from "./links";
import { MobileMenu } from "./MobileMenu";
import { NavShell } from "./NavShell";
import { RangesMenu } from "./RangesMenu";

interface NavBarProps {
  /** Inside a range (range or product page), the header carries that range's logo. */
  range?: Category;
  /**
   * Home (Olam-like): the hero carries its own menu; this bar stays hidden
   * and drops in from the top once that menu has scrolled away.
   */
  reveal?: boolean;
}

/**
 * Main navigation bar (Olam-like): logo, links grouped beside it, the order
 * action on the right. On the home page it only appears once the hero's own
 * menu has scrolled away (see HeroMenu); its links then come in one by one.
 */
export function NavBar({ range, reveal = false }: NavBarProps) {
  const orderUrl = whatsappContactUrl();
  const items = rangeMenuItems();
  const fallbackLogo = <BrandLogo variant="wordmark" title={null} className="w-full" />;
  const order = (i: number) => ({ "--i": i }) as CSSProperties;

  return (
    <NavShell reveal={reveal}>
      <div className="nid-nav-row nid-wrap relative flex items-center gap-6">
        <Link
          href={range ? routes.range(range) : routes.home}
          className={`flex shrink-0 items-center ${range?.logo ? "h-11" : "h-10"}`}
          aria-label={range ? `${range.name}, page de la gamme` : "TANTY, accueil"}
        >
          {range ? (
            <RangeLogo range={range} variant="nav" preload />
          ) : (
            <BrandLogo variant="full" title={null} preload className="h-full w-auto" />
          )}
        </Link>
        {range?.logo && (
          <Link
            href={routes.home}
            className="hidden items-center gap-2 border-l border-[rgb(15_58_30/0.25)] pl-5 md:flex"
          >
            <span className="block h-6">
              <BrandLogo variant="wordmark" title={null} className="h-full w-auto" />
            </span>
            <span className="sr-only">Retour à l&apos;accueil TANTY</span>
          </Link>
        )}

        <nav aria-label={reveal ? "Navigation rapide" : "Navigation principale"} className="ml-10 hidden lg:block xl:ml-20">
          <ul className="flex items-center gap-8 xl:gap-11">
            {PAGES_OPEN && (
              <li className="nid-nav-item" style={order(0)}>
                <RangesMenu items={items} fallbackLogo={fallbackLogo} catalogueHref={routes.catalogue} />
              </li>
            )}
            {NAV_LINKS.map((l, i) => (
              <li key={l.href} className="nid-nav-item" style={order(i + (PAGES_OPEN ? 1 : 0))}>
                <Link href={l.href} className="nid-navlink inline-block">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wrapper carries the visibility: .nid-btn sets its own display. */}
        <div className="ml-auto hidden lg:block">
          <a
            href={orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nid-btn nid-btn-yellow min-h-10 min-w-0 px-5 py-2 text-[0.9375rem]"
          >
            <MessageCircle aria-hidden="true" className="size-4" />
            Commander
          </a>
        </div>
        <div className="ml-auto lg:hidden">
          <MobileMenu orderUrl={orderUrl} items={PAGES_OPEN ? items : []} homeHref={routes.home} />
        </div>
      </div>
    </NavShell>
  );
}
