import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { routes } from "../routes";
import { NAV_LINKS } from "./links";
import { MobileMenu } from "./MobileMenu";

/**
 * The hero's own menu (Olam-like): logo and links, no bar and no order
 * button. It belongs to the hero and scrolls away with it; the fixed
 * navigation bar (with "Commander") then drops in from the top.
 */
export function HeroMenu() {
  return (
    <div className="nid-wrap flex h-16 items-center gap-6 lg:h-[88px]">
      <Link href={routes.home} className="flex h-10 shrink-0 items-center lg:h-12" aria-label="TANTY, accueil">
        <BrandLogo variant="full" title={null} preload className="h-full w-auto" />
      </Link>
      <nav aria-label="Navigation principale" className="ml-8 hidden lg:block xl:ml-20">
        <ul className="flex items-center gap-6 xl:gap-11">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="nid-navlink inline-block">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="ml-auto lg:hidden">
        <MobileMenu orderUrl={whatsappContactUrl()} items={[]} homeHref={routes.home} />
      </div>
    </div>
  );
}
