import Image from "next/image";
import { company } from "@/data/company";

/**
 * Une marque d'ici, depuis 2000: the company's story beside two of its own
 * advertising photographs nested. The milestones live in their own section (Parcours).
 * Facts from the official site, see INFOS-ENTREPRISE.md.
 */
export function Histoire() {
  return (
    <section id="histoire" aria-labelledby="nid-story-title" className="nid-on-white scroll-mt-20 pb-14 pt-20 lg:pb-[4.5rem] lg:pt-28">
      <div className="nid-wrap grid items-center gap-20 lg:grid-cols-[1fr_1fr] lg:gap-24">
        <div>
          <h2 data-reveal="" id="nid-story-title" className="nid-title">
            Une marque d&apos;ici,
            <br />
            <span className="nid-accent">depuis {company.since}</span><span className="nid-dot">.</span>
          </h2>
          <p data-reveal="" className="nid-lead mt-8 max-w-[34rem]">
            NTFoods transforme les produits agricoles de chez nous, le maïs, le soja et l&apos;arachide, et les commercialise
            sous la marque TANTY : des bouillies du matin aux en-cas croustillants, de la chapelure au chocolat à tartiner.
          </p>
          <p data-reveal="" className="mt-5 max-w-[34rem] leading-relaxed text-[var(--nid-ink-soft)]">
            Tout commence avec une machine conçue par Thierry Nyamen, docteur en mécanisation agricole, pour transformer
            l&apos;arachide.
          </p>
          <p data-reveal="" className="nid-display mt-10 text-[clamp(1.4rem,1.2rem+0.6vw,1.75rem)] text-[var(--nid-green-deep)]">
            {company.slogans.madeIn}
          </p>
        </div>

        {/* Two advertising photographs nested (not the hero's): the ambassador with her arms full (large), a
            second pose overlapping its lower corner.
            Corporate edges: barely rounded, a thin white cut where they overlap, no frame, no shadow. */}
        <figure className="relative mx-auto w-full max-w-[34rem] pb-20 pl-8 sm:pl-14">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
            <Image
              src="/brand/histoire/ambassadrice-bras-charges-sourire.webp"
              alt="Une ambassadrice TANTY, en casquette et t-shirt jaunes, les bras chargés de sachets TANTY À Grignoter."
              fill
              sizes="(min-width: 1024px) 30rem, 85vw"
              className="object-cover object-top"
            />
          </div>
          <div data-reveal="" className="absolute bottom-0 left-0 w-[44%] overflow-hidden rounded-[2px] border-[3px] border-white bg-white">
            <div className="relative aspect-[4/5]">
              <Image
                src="/brand/histoire/ambassadrice-deux-sachets.webp"
                alt="Une ambassadrice TANTY présente deux sachets TANTY À Grignoter."
                fill
                sizes="(min-width: 1024px) 15rem, 45vw"
                className="object-cover object-top"
              />
            </div>
          </div>
          <figcaption className="sr-only">Une ambassadrice TANTY présente la gamme À Grignoter.</figcaption>
        </figure>
      </div>

    </section>
  );
}
