"use client";

import { useState } from "react";
import type { PackagingKind } from "@/data/products";
import { PACKAGING_LABEL, PackagingIcon } from "../icons/PackagingIcon";
import { Photo } from "../ui/Photo";

export interface StagePhoto {
  src: string;
  alt: string;
  blur?: string;
}

/**
 * The product's view: the official photos (studio background kept) in the
 * home page's diagonal frame, opening from the top as it comes in; with
 * several photos, small frames switch the view (below it, or in a column on
 * its left on wide screens). Without a photo, the
 * packaging outline and "Photo à venir". This is also the place of the
 * future 3D model.
 */
export function ProductStage({ photos, packaging, name }: { photos: StagePhoto[]; packaging: PackagingKind; name: string }) {
  const [active, setActive] = useState(0);
  const current = photos[active];

  return (
    // Wide screens: the small frames in a column on the left of the large one, so both can be large and still show on arrival.
    <div className="mx-auto w-full max-w-[34rem] lg:mx-0 lg:flex lg:w-auto lg:max-w-none lg:flex-row-reverse lg:items-start lg:gap-3">
      <div data-reveal="clip" className="lg:w-[var(--stage-photo)]">
        <div className="nid-skeleton relative aspect-[4/5] overflow-hidden rounded-[0_1.5rem] bg-[#eef2f4] sm:rounded-[0_48px]">
          {current ? (
            <Photo
              key={current.src}
              src={current.src}
              blur={current.blur}
              alt={current.alt}
              fill
              preload={active === 0}
              sizes="(min-width: 1024px) 34rem, 45vw"
              className="nid-swap-in object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <PackagingIcon kind={packaging} strokeWidth={2} className="h-auto w-[34%] max-w-36" />
              <span className="text-[0.75rem] text-[var(--nid-ink-soft)] sm:text-base">
                Photo à venir<span className="sr-only">, emballage : {PACKAGING_LABEL[packaging]}</span>
              </span>
            </span>
          )}
        </div>
      </div>

      {photos.length > 1 && (
        <div className="mt-2.5 flex justify-center gap-1.5 sm:mt-6 sm:gap-3 lg:mt-0 lg:flex-col lg:justify-start" role="group" aria-label={`Photos de ${name}`}>
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`nid-skeleton relative h-11 w-9 overflow-hidden rounded-[0_0.5rem] border-2 sm:h-20 sm:w-16 sm:rounded-[0_0.875rem] lg:h-[6.25rem] lg:w-20 transition-colors duration-200 ${
                i === active ? "border-[var(--nid-yellow)]" : "border-transparent hover:border-[var(--nid-ink)]/25"
              }`}
            >
              <Photo src={photo.src} blur={photo.blur} alt="" fill sizes="80px" className="object-cover" />
              <span className="sr-only">
                Photo {i + 1} sur {photos.length}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
