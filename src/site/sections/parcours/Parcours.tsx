import { MILESTONES } from "../histoire/milestones";
import { SunPath } from "./SunPath";
import { Photo } from "../../ui/Photo";

/**
 * Two photographs TANTY published (public/brand/photos, see SOURCES.md),
 * hung on the wall slightly askew, as in the "Matin" proposal. Low
 * resolution originals (960 px): never shown wider than ~520 px. Captions
 * describe only what is visible or sourced.
 */
const PHOTOS = [
  {
    src: "/brand/photos/stand-degustation-enfants.jpg",
    width: 960,
    height: 720,
    alt: "Sur un stand TANTY, des enfants goûtent la bouillie dans de petits gobelets, entourés d'adultes souriants.",
    caption: "Dégustation de bouillie sur un stand TANTY",
  },
  {
    src: "/brand/photos/forum-industrie-2018-public.jpg",
    width: 960,
    height: 720,
    alt: "Dans le public du Forum national de l'industrie du Cameroun, en 2018, un homme porte une chemise aux couleurs TANTY.",
    caption: "Au Forum national de l'industrie, 2018",
  },
] as const;

/**
 * Notre parcours, after the whole "La marque" section of the "Matin"
 * proposal: title and text beside photographs hung on the wall (on the left
 * on wide screens, mirroring "Une marque d'ici" just above), then the
 * milestones on the path of the sun, each a little higher in the sky.
 */
export function Parcours() {
  return (
    <section id="parcours" aria-labelledby="nid-path-title" className="nid-on-white relative scroll-mt-20 overflow-x-clip pb-20 pt-6 lg:pb-28 lg:pt-10">
      <div className="nid-wrap">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <h2 data-reveal="" id="nid-path-title" className="nid-title">
              Une ascension <span className="nid-accent">grandissante</span>
              <span className="nid-dot">.</span>
            </h2>
            <p data-reveal="" className="nid-lead mt-6">
              Du premier produit approuvé par le Centre Pasteur au Forum national de l&apos;industrie, les étapes qui ont fait
              grandir TANTY.
            </p>
          </div>

          {/* Photos on the wall */}
          <div className="relative mx-auto w-full max-w-[34rem] pb-24 lg:order-first lg:ml-0">
            {PHOTOS.map((p, i) => (
              <figure
                key={p.src}
                data-reveal=""
                className={
                  i === 0
                    ? "relative ml-auto w-[88%] rotate-[-1.4deg] lg:ml-0 lg:rotate-[1.4deg]"
                    : "absolute bottom-0 left-0 w-[52%] rotate-[2.2deg] lg:left-auto lg:right-0 lg:rotate-[-2.2deg]"
                }
              >
                <div className="bg-white p-[6px] shadow-[0_22px_40px_-26px_rgb(17_36_26/0.55)]">
                  <div className="nid-skeleton relative">
                  <Photo
                    src={p.src}
                    width={p.width}
                    height={p.height}
                    alt={p.alt}
                    sizes={i === 0 ? "(min-width: 1024px) 30rem, 88vw" : "(min-width: 1024px) 18rem, 52vw"}
                    className="block h-auto w-full"
                  />
                  </div>
                </div>
                <figcaption
                  className={`mt-2 text-sm leading-snug text-[var(--nid-ink-soft)] ${i === 0 ? "ml-auto max-w-[46%] text-right lg:ml-0 lg:text-left" : "lg:text-right"}`}
                >
                  {p.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-20 lg:mt-24">
          <SunPath items={MILESTONES} />
        </div>
      </div>
    </section>
  );
}
