import { company } from "@/data/company";
import type { Product } from "@/data/products";

/** wa.me link with a pre-filled order message for one product. */
export function whatsappOrderUrl(product: Product, formatLabel?: string): string {
  const format = formatLabel ?? product.formats[0]?.label;
  const message = `Bonjour TANTY, je souhaite commander : ${product.name}${
    format ? ` (${format})` : ""
  }.`;
  return `https://wa.me/${company.whatsapp.e164}?text=${encodeURIComponent(message)}`;
}

/** wa.me link for a general question. */
export function whatsappContactUrl(): string {
  const message = "Bonjour TANTY, j'ai une question.";
  return `https://wa.me/${company.whatsapp.e164}?text=${encodeURIComponent(message)}`;
}
