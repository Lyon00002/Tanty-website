/** Data the corporate header needs, gathered on the server (photos are found on disk). */

export interface SearchEntry {
  kind: "produit" | "gamme";
  label: string;
  /** Range and formats for a product; "Gamme" for a range. */
  sub: string;
  href: string;
  thumb?: string;
}

export interface HeaderRange {
  id: string;
  name: string;
  short: string;
  href: string;
  logo?: { src: string; width: number; height: number; ground: readonly [string, string] };
}

export interface HeaderProduct {
  id: string;
  name: string;
  range: string;
  href: string;
  photo: string;
}

export interface HeaderData {
  ranges: HeaderRange[];
  products: HeaderProduct[];
  search: SearchEntry[];
  storeHref?: string;
}
