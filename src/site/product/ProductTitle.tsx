import type { Product } from "@/data/products";

/**
 * Product titles, as the range titles (RangeTitle): two terms, two tones, the
 * brand or range word in ink and the product's own words in green ("TANTY /
 * Lactée", "Reine / Lactée Croissance"); a name of a single term
 * ("Chapelure", "Arachides enrobées", "Baby Vita") stays in one colour. Then
 * the yellow full stop.
 */
export function ProductTitle({ product }: { product: Product }) {
  // The brand, then the range word of its line ("TANTY Reine" gives "Reine").
  const words = ["TANTY", product.line.startsWith("TANTY ") ? product.line.slice(6) : ""].filter(Boolean);
  const lead = words.find((w) => product.name.startsWith(`${w} `));
  return (
    <>
      {lead ? (
        <>
          {lead} <span className="nid-accent">{product.name.slice(lead.length + 1)}</span>
        </>
      ) : (
        product.name
      )}
      <span className="nid-dot">.</span>
    </>
  );
}
