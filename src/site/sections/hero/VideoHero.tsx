"use client";

import Link from "next/link";
import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { company } from "@/data/company";
import { useSiteSound } from "../../audio/SiteAudio";
import { routes } from "../../routes";

const VIDEO = "/brand/hero/tanty-usine.mp4";
const POSTER = "/brand/hero/tanty-usine-poster.jpg";

/*
 * The film's lower edge, in a 0..1 box: an arc of the TANTY logo ellipse,
 * lowest right of centre and higher on the left, like the logo swoosh.
 */
const N = 80;
const edge = (x: number) => 0.491 + 0.509 * Math.sqrt(Math.max(0, 1 - ((x - 0.62) / 0.9) ** 2));
const f = (n: number) => n.toFixed(4);

/** Clip path of the film (objectBoundingBox): everything above the arc. */
const CLIP = (() => {
  const pts: string[] = [];
  for (let i = N; i >= 0; i--) {
    const x = i / N;
    pts.push(`${f(x)} ${f(edge(x))}`);
  }
  return `M0 0H1V${f(edge(1))}L${pts.join("L")}Z`;
})();

/** The logo ribbon just under the arc: thin at both ends, thickest right of centre. */
const RIBBON = (() => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= N; i++) {
    const x = i / N;
    const w = 0.024 * Math.pow(Math.sin(Math.PI * x), 0.9) * (0.35 + 0.65 * x);
    const y = edge(x) + 0.009;
    top.push(`${f(x)} ${f(y)}`);
    bottom.unshift(`${f(x)} ${f(y + w)}`);
  }
  return `M${top.join("L")}L${bottom.join("L")}Z`;
})();

/**
 * Proposal 3 hero: the client's factory film, alone and in a loop, as large
 * as the first screen allows: full width and nearly full height. Its lower
 * edge is cut by the arc of the TANTY logo, with the logo's yellow ribbon
 * running along it (as in proposal 1). On wide screens the words sit over
 * the film's lower left, in the site's own type: a bold title whose closing
 * words are TANTY yellow over the swoosh, the yellow "Découvrir" button.
 * Phones get the same composition in miniature: the words over the
 * film's lower part, smaller. The film plays muted; its soundtrack is the
 * site-wide music, which the sound button turns on and off; it stays still
 * under reduced motion.
 */
export function VideoHero() {
  const video = useRef<HTMLVideoElement>(null);
  // The film stays muted: its soundtrack is the site-wide music (SiteAudio), driven from here too.
  const { on: sound, toggle: toggleSound } = useSiteSound();
  const clipId = `hero-arc-${useId().replace(/:/g, "")}`;

  // Under reduced motion the film stays still.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    else v.play().catch(() => v.pause());
  }, []);

  return (
    <section aria-labelledby="nid-hero-title" className="nid-on-white relative isolate h-[min(calc(100svh-5rem),38rem)] min-h-[30rem] overflow-hidden lg:h-[calc(100svh-10.25rem)] lg:min-h-[36rem] lg:max-h-[62rem]">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={CLIP} />
        </clipPath>
      </svg>

      {/* The film, cut by the logo arc, with the ribbon under it */}
      <div data-reveal="fade" className="absolute inset-x-0 bottom-5 top-0 lg:bottom-8">
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${clipId})` }}>
          <video
            ref={video}
            src={VIDEO}
            poster={POSTER}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Deep TANTY green shade under the words: from the bottom on phones, from the lower left on desktop */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(0deg,rgb(9_34_18/0.9)_0%,rgb(9_34_18/0.62)_38%,rgb(9_34_18/0)_68%)] lg:bg-[linear-gradient(18deg,rgb(9_34_18/0.88)_0%,rgb(9_34_18/0.55)_36%,rgb(9_34_18/0)_64%)]"
          />
        </div>
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="nid-deco absolute inset-0 h-full w-full overflow-visible">
          <path d={RIBBON} fill="var(--nid-yellow)" />
        </svg>
        <div className="absolute right-3 top-3 z-10 flex items-center text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgb(0_0_0/0.6)] lg:bottom-[14%] lg:right-[6%] lg:top-auto">
          <button type="button" data-sound-toggle="" onClick={toggleSound} aria-pressed={sound} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2">
            {sound ? <Volume2 aria-hidden="true" className="size-5" /> : <VolumeX aria-hidden="true" className="size-5" />}
            {/* Phones: the icon alone (named for screen readers) */}
            <span className="sr-only lg:not-sr-only">{sound ? "Couper le son" : "Activer le son"}</span>
          </button>
        </div>
      </div>

      {/* The words: over the film's lower left, on phones as on desktop */}
      <div className="nid-wrap pointer-events-none absolute inset-x-0 bottom-[calc(15%+1rem)] lg:bottom-[calc(15%+2.5rem)]">
        <div className="nid-hero-copy pointer-events-auto max-w-[34rem] xl:max-w-[38rem]">
          <h1 data-reveal="" id="nid-hero-title" className="nid-display text-[clamp(2rem,1.1rem+3.3vw,4.25rem)] leading-[1.06] text-white">
            De la matière première aux <span className="nid-accent nid-swoosh">produits finis</span>
            <span className="nid-dot">.</span>
          </h1>
          <p data-reveal="" className="mt-3 max-w-[30rem] text-[0.875rem] leading-relaxed text-white/90 lg:mt-5 lg:text-lg">
            Depuis {company.since}, TANTY transforme à {company.city} le maïs, le soja et l&apos;arachide de chez nous.
          </p>
          <div data-reveal="" className="mt-5 flex gap-2.5 sm:flex-wrap sm:gap-3 lg:mt-8">
            <Link href={routes.ranges} className="nid-btn nid-btn-yellow flex-1 sm:flex-none">
              Découvrir nos gammes
            </Link>
            <Link href={routes.featured} className="nid-btn nid-hero-outline flex-1 sm:flex-none">
              Nos produits
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
