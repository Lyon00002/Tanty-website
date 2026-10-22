import { primaryPackaging, type Product } from "@/data/products";
import { getMainProductPhoto } from "@/lib/product-media";
import { PACKAGING_LABEL, PackagingIcon } from "../icons/PackagingIcon";
import { Photo } from "../ui/Photo";

interface ProductImageProps {
  product: Product;
  className?: string;
  sizes?: string;
}

/**
 * Product media in the shared 4:5 frame, with the site's diagonal corners
 * on the light grey ground of the home page's product view. The official
 * photo (studio background kept) when it exists; otherwise a quiet
 * placeholder: the generic silhouette of the packaging in TANTY yellow and
 * "Photo à venir". Never a fake pack. Inside a `group`, the photo leans in on hover.
 */
export function ProductImage({ product, className, sizes = "(min-width: 1024px) 22vw, 50vw" }: ProductImageProps) {
  const frame = `relative aspect-[4/5] w-full overflow-hidden rounded-[0_1.25rem] bg-[#eef2f4] sm:rounded-[0_2rem] ${className ?? ""}`;
  // Official photo dropped in public/products/<slug>/1.webp (or set in products.ts).
  const photo = getMainProductPhoto(product);
  if (photo) {
    return (
      <div className={`nid-skeleton ${frame}`}>
        <Photo
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          className="object-cover transition-[scale] duration-500 ease-[var(--nid-ease-out)] group-hover:scale-[1.03]"
        />
      </div>
    );
  }
  const kind = primaryPackaging(product);
  return (
    <div className={`${frame} flex flex-col items-center justify-center gap-2 p-2 sm:gap-4 sm:p-4`}>
      <PackagingIcon kind={kind} className="h-auto w-[30%] max-w-24" />
      <p className="text-center text-[0.6875rem] text-[var(--nid-ink-soft)] sm:text-sm">
        Photo à venir<span className="sr-only">, emballage : {PACKAGING_LABEL[kind]}</span>
      </p>
    </div>
  );
}
