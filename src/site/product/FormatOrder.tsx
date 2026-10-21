"use client";

import { MessageCircle } from "lucide-react";
import { useId, useState } from "react";
import type { Product } from "@/data/products";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { Action } from "../ui/Action";

/**
 * Format choice + order: the formats are the rectangular tags of the home
 * page's range filter (TANTY yellow once chosen); the WhatsApp message is
 * pre-filled with the product and the format the visitor picked.
 */
export function FormatOrder({ product }: { product: Product }) {
  const [format, setFormat] = useState(product.formats[0]?.label ?? "");
  const name = useId();
  const multiple = product.formats.length > 1;

  return (
    <div>
      <fieldset>
        <legend className="font-semibold">{multiple ? "Choisissez un format" : "Format"}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.formats.map((f) => {
            const checked = f.label === format;
            return (
              <label
                key={f.label}
                className={`nid-num relative inline-flex min-h-11 cursor-pointer items-center rounded-[4px] border px-4 py-2 transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--nid-green-deep)] ${
                  checked
                    ? "border-[var(--nid-yellow)] bg-[var(--nid-yellow)] font-semibold text-[var(--nid-green-deep)]"
                    : "border-[var(--nid-ink)]/25 text-[var(--nid-ink)] hover:border-[var(--nid-green)]"
                }`}
              >
                <input type="radio" name={name} value={f.label} checked={checked} onChange={() => setFormat(f.label)} className="sr-only" />
                {f.label}
              </label>
            );
          })}
        </div>
      </fieldset>
      <Action href={whatsappOrderUrl(product, format)} className="mt-8">
        <MessageCircle aria-hidden="true" className="size-5" />
        Commander sur WhatsApp
      </Action>
      <p className="mt-3 text-sm text-[var(--nid-ink-soft)]">Prix et disponibilité : TANTY vous répond sur WhatsApp.</p>
    </div>
  );
}
