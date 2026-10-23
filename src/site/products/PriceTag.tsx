import { formatPrice } from "./price";

/**
 * A price, the figure the visitor looks for: the amount in the title face,
 * extra bold, in TANTY green, underlined with the titles' yellow swoosh,
 * "FCFA" smaller so the amount leads. Sized by `className` (the font size
 * sets the scale of the whole).
 */
export function Price({ amount, className }: { amount: number; className?: string }) {
  const [figure] = formatPrice(amount).split(" FCFA");
  return (
    <span className={`nid-display nid-price nid-swoosh nid-num inline-flex items-baseline whitespace-nowrap leading-none text-[var(--nid-green)] ${className ?? ""}`}>
      {figure}
      <span className="ml-[0.25em] text-[0.55em]">FCFA</span>
    </span>
  );
}
