"use client";

import { MessageCircle } from "lucide-react";
import { useId, useState } from "react";
import type { Product } from "@/data/products";
import { whatsappOrderUrl } from "@/lib/whatsapp";
import { Price } from "../products/PriceTag";
import { Action } from "../ui/Action";

/**
 * Format choice + order: the formats are the rectangular tags of the home
 * page's range filter (TANTY yellow once chosen); the WhatsApp message is
 * pre-filled with the product and the format the visitor picked.
 */
export function FormatOrder({ product }: { product: Product }) {
  const [format, setFormat] = useState(product.formats[0]?.label ?? "");
  const price = product.formats.find((f) => f.label === format)?.price;
  const name = useId();
  const multiple = product.formats.length > 1;

  return (
    <div className="@container">
      <fieldset>
        <legend className="text-[0.75rem] font-semibold sm:text-base">{multiple ? "Choisissez un format" : "Format"}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5 sm:mt-3 sm:gap-2">
          {product.formats.map((f) => {
            const checked = f.label === format;
            return (
              <label
                key={f.label}
                className={`nid-num relative inline-flex min-h-8 cursor-pointer items-center rounded-[4px] border px-2 py-0.5 text-[0.75rem] transition-colors sm:min-h-11 sm:px-4 sm:py-2 sm:text-base duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--nid-green-deep)] ${
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
      {/* The price of the chosen format (its tag above already says which one) */}
      {price !== undefined && (
        <p className="mt-4 sm:mt-6">
          {/* Still the largest line of the column; the longest price (20 000 FCFA) fits a phone's narrow column */}
          <Price amount={price} className="text-[min(2.75rem,28cqi)] sm:text-[min(4.75rem,30cqi)]" />
        </p>
      )}
      <Action
        href={whatsappOrderUrl(product, format)}
        className={`max-sm:min-h-10 max-sm:w-full max-sm:px-3 max-sm:text-[0.8125rem] ${price !== undefined ? "mt-3 sm:mt-5" : "mt-4 sm:mt-8"}`}
      >
        <MessageCircle aria-hidden="true" className="size-5" />
        {/* Phones, in the narrow column: "Commander", as in the header (the rest still read aloud) */}
        <span>
          Commander<span className="max-sm:sr-only"> sur WhatsApp</span>
        </span>
      </Action>
      <p className="mt-1.5 text-[0.6875rem] leading-snug text-[var(--nid-ink-soft)] sm:mt-3 sm:text-sm">{price !== undefined ? "Prix indicatif. Prix et disponibilité confirmés sur WhatsApp." : "Prix et disponibilité : TANTY vous répond sur WhatsApp."}</p>
    </div>
  );
}
