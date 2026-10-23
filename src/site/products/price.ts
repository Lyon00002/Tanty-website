import type { Product } from "@/data/products";

/** "1 000 FCFA", with the French thin space between thousands. */
export const formatPrice = (amount: number) => `${new Intl.NumberFormat("fr-FR").format(amount)} FCFA`;

/** A product's price at a glance: the lowest of its formats; undefined when none has one. */
export function priceOf(product: Product): number | undefined {
  const prices = product.formats.map((f) => f.price).filter((p): p is number => typeof p === "number");
  return prices.length > 0 ? Math.min(...prices) : undefined;
}
