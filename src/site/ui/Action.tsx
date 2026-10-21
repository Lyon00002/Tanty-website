import Link from "next/link";
import type { ReactNode } from "react";

/* Buttons of the site: rectangular, flat (see .nid-btn in world.css). */

type Variant = "primary" | "outline" | "light" | "yellow";

interface ActionProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** External links (WhatsApp, tel:, mailto:) use a plain anchor. */
  external?: boolean;
}

export function Action({ href, children, variant = "primary", className, external }: ActionProps) {
  const cls = `nid-btn nid-btn-${variant} ${className ?? ""}`;
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    const blank = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(blank && { target: "_blank", rel: "noopener noreferrer" })}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
