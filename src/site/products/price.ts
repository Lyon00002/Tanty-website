import type { Product } from "@/data/products";

/** "1 000 FCFA", with the French thin space between thousands. */
export const formatPrice = (amount: number) => `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;

/**
 * A product's price at a glance: the price when every format costs the same,
 * "dès …" (the lowest) when they differ; undefined when no format has one.
 */
export function priceLabel(product: Product): string | undefined {
  const prices = product.formats.map((f) => f.price).filter((p): p is number => typeof p === "number");
  if (prices.length === 0) return undefined;
  const low = Math.min(...prices);
  return prices.every((p) => p === low) && prices.length === product.formats.length ? formatPrice(low) : `dès ${formatPrice(low)}`;
}
