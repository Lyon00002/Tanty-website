import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * Fil d'Ariane: the last crumb is the current page. In the colour of its
 * surface (ink on white, cream on the green band). Phones: one line, the
 * current page shortened with an ellipsis if it does not fit.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-[0.75rem] sm:text-sm">
      <ol className="flex items-center gap-x-1 gap-y-1 whitespace-nowrap text-current/75 sm:flex-wrap sm:gap-x-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className={`flex items-center gap-1 sm:gap-1.5 ${i === items.length - 1 ? "min-w-0" : "shrink-0"}`}>
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3 shrink-0 sm:size-3.5" />}
            {c.href ? (
              <Link href={c.href} className="font-semibold underline-offset-4 transition-colors hover:text-current hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-current">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
