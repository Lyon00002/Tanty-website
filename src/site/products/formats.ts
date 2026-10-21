import type { Product } from "@/data/products";

/** The formats on sale, "Mini 45 g, Moyen 125 g": the unit never wraps away from its number. */
export const formatList = (p: Product) => p.formats.map((f) => f.label.replace(/(\d) (?=\S)/g, "$1 ")).join(", ");
