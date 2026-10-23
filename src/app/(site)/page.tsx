import { blurFor } from "@/lib/blur";
import { Campagnes } from "@/site/sections/campagnes/Campagnes";
import { CAMPAIGNS } from "@/site/sections/campagnes/campaigns";
import { Parcours } from "@/site/sections/parcours/Parcours";
import { Actualites } from "@/site/sections/actualites/Actualites";
import { CorporateHeader } from "@/site/navigation/corporate/CorporateHeader";
import { Commander } from "@/site/sections/commander/Commander";
import { Footer } from "@/site/sections/footer/Footer";
import { Gammes } from "@/site/sections/gammes/Gammes";
import { VideoHero } from "@/site/sections/hero/VideoHero";
import { Histoire } from "@/site/sections/histoire/Histoire";
import { Featured } from "@/site/sections/produits/Featured";

/*
 * Proposal 3: the same home page as proposal 1 with a nestle.com-inspired
 * header (logo row with search, menu bar with drop-down panels) and a video hero.
 * Piste B, Le Nid: a company home page in the spirit of nestle.com.
 * Photographs lead, ranges are presented by their own logos, the woven
 * world lives in details; sections are separated by the ribbon of the TANTY logo.
 */
export default function NidHome() {
  return (
    <>
      <a
        href="#contenu"
        className="sr-only-focusable fixed left-4 top-4 z-[60] rounded-full bg-[var(--nid-green-deep)] px-5 py-3 font-bold text-[var(--nid-yellow)]"
      >
        Aller au contenu
      </a>
      <CorporateHeader />
      <main id="contenu">
        <VideoHero />
        <Campagnes blurs={Object.fromEntries(CAMPAIGNS.map((c) => [c.src, blurFor(c.src)]))} />
        <Histoire />
        <Parcours />
        <Gammes />
        <Featured />
        <Actualites />
        <Commander />
      </main>
      <Footer above="var(--nid-yellow)" />
    </>
  );
}
