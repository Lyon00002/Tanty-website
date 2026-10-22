import { MessageCircle } from "lucide-react";
import type { Category, CategoryId } from "@/data/categories";
import { getProductsByCategory, primaryPackaging } from "@/data/products";
import { whatsappContactUrl } from "@/lib/whatsapp";
import { RangeTitle } from "../brand/RangeBubble";
import { routes } from "../routes";
import { PageBand } from "../sections/page/PageBand";
import { Action } from "../ui/Action";
import { RangeEmblem } from "./RangeEmblem";

/** The band's photograph, when TANTY has one of the range (public/brand); otherwise its stand. */
const PHOTOS: Partial<Record<CategoryId, { src: string; position?: string }>> = {
  reine: { src: "/brand/photos/stock-seaux-reine.jpg", position: "50% 40%" },
  grignoter: { src: "/brand/hero/ambassadrice-gourmandise.webp", position: "50% 30%" },
};
const STAND = { src: "/brand/photos/stand-rayonnages-degustation.jpg", position: "50% 35%" };

/** Top of a range page: the green band of the inner pages, the range's name and promise, its emblem on the right. */
export function RangeHero({ range }: { range: Category }) {
  const products = getProductsByCategory(range.id);
  const count = products.length;
  return (
    <PageBand
      id="nid-range-title"
      crumbs={[
        { label: "Accueil", href: routes.home },
        { label: "Nos gammes", href: routes.ranges },
        { label: range.name },
      ]}
      photo={PHOTOS[range.id] ?? STAND}
      title={<RangeTitle range={range} />}
      lead={range.summary}
      aside={
        <div data-reveal="fade">
          <RangeEmblem
            range={range}
            packaging={products[0] ? primaryPackaging(products[0]) : undefined}
            sizes="(min-width: 1024px) 22rem, 6rem"
            className="w-full lg:ml-auto lg:mr-[8%] lg:max-w-[22rem]"
          />
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 lg:gap-x-8 lg:gap-y-4">
        <Action href={whatsappContactUrl()} variant="yellow" className="max-sm:min-h-9 max-sm:px-3 max-sm:py-2 max-sm:text-[0.75rem]">
          <MessageCircle aria-hidden="true" className="size-4 sm:size-5" />
          Commander sur WhatsApp
        </Action>
        <a href="#produits" className="nid-link nid-num text-[0.75rem] text-white sm:text-base">
          Voir {count > 1 ? `les ${count} produits` : "le produit"}
        </a>
      </div>
    </PageBand>
  );
}
