"use client";

import Link from "next/link";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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
 * Small screens: the film on top with the same arc, the words on white
 * below. The film plays muted; its soundtrack is the site-wide music, which
 * this button turns on and off, can be paused, and stays still under reduced
 * motion.
 */
export function VideoHero() {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  // The film stays muted: its soundtrack is the site-wide music (SiteAudio), driven from here too.
  const { on: sound, toggle: toggleSound } = useSiteSound();
  const clipId = `hero-arc-${useId().replace(/:/g, "")}`;

  // Under reduced motion the film stays still; the button state follows the film's own play/pause events.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    else v.play().catch(() => v.pause());
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <section aria-labelledby="nid-hero-title" className="nid-on-white relative isolate overflow-hidden lg:h-[calc(100svh-10.25rem)] lg:min-h-[36rem] lg:max-h-[62rem]">
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <clipPath id={clipId} clipPathUnits="objectBoundingBox">
          <path d={CLIP} />
        </clipPath>
      </svg>

      {/* The film, cut by the logo arc, with the ribbon under it */}
      <div data-reveal="fade" className="relative h-[60svh] min-h-[20rem] lg:absolute lg:inset-x-0 lg:bottom-8 lg:top-0 lg:h-auto lg:min-h-0">
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
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Deep TANTY green shade under the words (desktop) */}
          <span
            aria-hidden="true"
            className="absolute inset-0 hidden bg-[linear-gradient(18deg,rgb(9_34_18/0.88)_0%,rgb(9_34_18/0.55)_36%,rgb(9_34_18/0)_64%)] lg:block"
          />
        </div>
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="nid-deco absolute inset-0 h-full w-full overflow-visible">
          <path d={RIBBON} fill="var(--nid-yellow)" />
        </svg>
        <div className="absolute bottom-[14%] right-[6%] z-10 flex items-center gap-5 text-sm font-semibold text-white drop-shadow-[0_1px_6px_rgb(0_0_0/0.6)]">
          <button type="button" data-sound-toggle="" onClick={toggleSound} aria-pressed={sound} className="inline-flex min-h-11 items-center gap-2">
            {sound ? <Volume2 aria-hidden="true" className="size-5" /> : <VolumeX aria-hidden="true" className="size-5" />}
            {sound ? "Couper le son" : "Activer le son"}
          </button>
          <button type="button" onClick={toggle} className="inline-flex min-h-11 items-center gap-2">
            {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
            {playing ? "Pause" : "Lecture"}
            <span className="sr-only"> de la vidéo</span>
          </button>
        </div>
      </div>

      {/* The words: over the film's lower left (desktop), on white below it (small screens) */}
      <div className="nid-wrap relative pb-14 pt-8 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-[calc(15%+2.5rem)] lg:py-0">
        <div className="nid-hero-copy pointer-events-auto max-w-[34rem] xl:max-w-[38rem]">
          <h1 data-reveal="" id="nid-hero-title" className="nid-display text-[clamp(2.25rem,1.2rem+2.6vw,3.75rem)] leading-[1.06] text-[var(--nid-ink)] lg:text-white">
            De la matière première aux <span className="nid-accent nid-swoosh">produits finis</span>
            <span className="nid-dot">.</span>
          </h1>
          <p data-reveal="" className="mt-5 max-w-[30rem] text-[1.0625rem] leading-relaxed text-[var(--nid-ink-soft)] lg:text-lg lg:text-white/90">
            Depuis {company.since}, TANTY transforme à {company.city} le maïs, le soja et l&apos;arachide de chez nous.
          </p>
          <div data-reveal="" className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={routes.ranges} className="nid-btn nid-btn-yellow shrink-0">
              Découvrir nos gammes
            </Link>
            <Link href={routes.featured} className="nid-btn nid-hero-outline shrink-0">
              Nos produits
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
