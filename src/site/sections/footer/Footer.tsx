import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { listedCategories } from "@/data/categories";
import { company } from "@/data/company";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { NAV_LINKS } from "../../navigation/links";
import { RANGE_LINKS, routes } from "../../routes";

/** White footer. `above`: colour of the section above, shown around the curved top edge. */
export function Footer({ above }: { above?: string }) {
  const ranges = [...listedCategories].sort((a, b) => a.order - b.order);
  const heading = "nid-display text-xl text-[var(--nid-ink)]";
  // Plain footer links: nothing at rest; on hover or keyboard focus, the hero's yellow swoosh draws in.
  const link = "nid-swoosh-link font-semibold text-[var(--nid-ink-soft)] transition-colors hover:text-[var(--nid-ink)]";
  return (
    <footer className="relative overflow-x-clip" style={{ background: above }}>
      {/* Curved top edge, dipping in the middle */}
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="nid-deco block h-10 w-full lg:h-16">
        <path d="M0 64V24Q720 88 1440 24V64Z" fill="#ffffff" />
      </svg>
      <div className="nid-on-white">
        <div className="nid-wrap relative grid gap-12 pb-14 pt-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.9fr_1.2fr] lg:gap-10 lg:pt-14">
          <div data-reveal="">
            <Link href={routes.home} className="block w-[180px]">
              <BrandLogo className="w-full" title="TANTY, accueil" />
            </Link>
            <p className="mt-5 max-w-xs text-[var(--nid-ink-soft)]">
              Une marque de {company.legalName}, à {company.city}, depuis <span className="nid-num">{company.since}</span>.
            </p>
            <p className="mt-2 font-bold text-[var(--nid-green)]">{company.slogans.signature}</p>
          </div>
          <nav data-reveal="" aria-labelledby="nid-footer-ranges">
            <h2 id="nid-footer-ranges" className={heading}>
              Nos gammes
            </h2>
            <ul className="mt-3 space-y-2">
              {ranges.map((r) => (
                <li key={r.id}>
                  {RANGE_LINKS ? (
                    <Link href={routes.range(r)} className={link}>
                      {r.short}
                    </Link>
                  ) : (
                    <span className="font-semibold text-[var(--nid-ink-soft)]">{r.short}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav data-reveal="" aria-labelledby="nid-footer-site">
            <h2 id="nid-footer-site" className={heading}>
              Le site
            </h2>
            <ul className="mt-3 space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={link}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div data-reveal="">
            <h2 className={heading}>Nous joindre</h2>
            <address className="mt-3 space-y-2 not-italic text-[var(--nid-ink-soft)]">
              <p>
                {company.legalName}
                <br />
                {company.address.street}
                <br />
                {company.address.poBox}, {company.country}
              </p>
              <p>
                <a href={`tel:${company.phone.e164}`} className={`${link} nid-num`}>
                  {company.phone.display}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className={link}>
                  {company.email}
                </a>
              </p>
              <p>
                <a href={whatsappContactUrl()} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="nid-wrap relative">
          <p className="border-t border-[var(--nid-ink)]/10 py-5 text-sm text-[var(--nid-ink-soft)]">
            © {company.brand}, {company.legalName}, {company.city}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
