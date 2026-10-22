import Image from "next/image";
import type { ReactNode } from "react";
import { BandEdge } from "../../borders/BandEdge";
import { Breadcrumbs, type Crumb } from "../../range/Breadcrumbs";

interface PageBandProps {
  id: string;
  crumbs: Crumb[];
  /** The page title (h1), in the site's two tones. */
  title: ReactNode;
  lead?: ReactNode;
  /** A TANTY photograph (public/brand), shown in grey under the green veil. */
  photo: { src: string; position?: string };
  /** Actions or filters under the lead. */
  children?: ReactNode;
  /** Right column on wide screens (a range bubble, for instance). */
  aside?: ReactNode;
}

/**
 * Top of an inner page, in the language of "Explorez nos gammes" on the
 * home page: a deep green band over a TANTY photograph, its lower edge
 * curved like the home page bands, the title in white with its closing
 * words in TANTY yellow. Text on the left, an optional visual on the right.
 */
export function PageBand({ id, crumbs, title, lead, photo, children, aside }: PageBandProps) {
  return (
    <section aria-labelledby={id} className="nid-on-deep relative isolate overflow-hidden pb-16 pt-6 lg:pb-32 lg:pt-12">
      <Image
        src={photo.src}
        alt=""
        fill
        preload
        sizes="100vw"
        className="-z-20 object-cover grayscale"
        style={{ objectPosition: photo.position ?? "50% 50%" }}
      />
      <div aria-hidden="true" className="nid-page-veil absolute inset-0 -z-10" />
      <BandEdge side="bottom" />
      <div className="nid-wrap">
        <Breadcrumbs items={crumbs} />
      </div>
      <div className={`nid-wrap relative mt-5 grid items-center lg:mt-14 ${aside ? "grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] gap-x-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-16" : ""}`}>
        <div>
          <h1 data-reveal="" id={id} className="nid-title">
            {title}
          </h1>
          {lead && (
            <p data-reveal="" className="nid-lead nid-lead-compact mt-2 lg:mt-5">
              {lead}
            </p>
          )}
          {children && (
            <div data-reveal="" className="mt-4 lg:mt-9">
              {children}
            </div>
          )}
        </div>
        {/* The visual: its own column on the right, at every size */}
        {aside}
      </div>
    </section>
  );
}
