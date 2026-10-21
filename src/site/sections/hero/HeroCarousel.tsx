"use client";

import Image from "next/image";
import Link from "next/link";
import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP } from "../../motion/gsap";
import { BASE_RIBBON, DESKTOP_CLIP, DESKTOP_RIBBON, MOBILE_CLIP, MOBILE_RIBBON, WIPE_FROM, WIPE_RIBBON, WIPE_TO, wipeClip } from "./logoArc";
import type { HeroSlide } from "./slides";

const AUTOPLAY_S = 7;
const REVEAL_S = 1.5;
const REDUCE = "(prefers-reduced-motion: reduce)";


/**
 * Hero in the structure of olamagri.com, on a white ground, carrying its own
 * menu at the top (no navigation bar over the hero): two-tone title, text and a rectangular
 * button on the left; the photograph on the right, cut by an ellipse arc
 * taken from the TANTY logo, with a TANTY-yellow ribbon running along it;
 * outlined circle indicators. Transition ("le ruban"): the yellow ribbon
 * sweeps across the photo along the same ellipse, opening the next picture
 * behind it, while the previous one drifts aside and the new one settles
 * from a slow zoom; the title rises word by word. Autoplay pauses on
 * hover, keyboard focus and the pause button; under prefers-reduced-motion
 * nothing moves and slides swap instantly. The first slide is shown exactly
 * as rendered by the server (no flash before hydration).
 */
export function HeroCarousel({ slides, menu }: { slides: HeroSlide[]; menu?: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [away, setAway] = useState(false);
  const root = useRef<HTMLElement>(null);
  const first = useRef(true);
  const seq = useRef(0);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const clipId = `hero-arc-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const mq = window.matchMedia(REDUCE);
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // A hidden tab freezes animation frames but not timers: stop autoplay there so transitions never pile up.
  useEffect(() => {
    const sync = () => setAway(document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  const go = useCallback(
    (next: number) => {
      const target = (next + slides.length) % slides.length;
      if (target === index) return;
      if (!window.matchMedia(REDUCE).matches) setLeaving(index);
      setIndex(target);
    },
    [index, slides.length],
  );

  // Autoplay: one timer per slide, paused while held, stopped by the user or reduced motion.
  useEffect(() => {
    if (!playing || held || reduced || away) return;
    const t = window.setTimeout(() => go(index + 1), AUTOPLAY_S * 1000);
    return () => window.clearTimeout(t);
  }, [index, playing, held, reduced, away, go]);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || window.matchMedia(REDUCE).matches) return;
      const slide = el.querySelector<HTMLElement>(`[data-slide="${index}"]`);
      const text = el.querySelector<HTMLElement>(`[data-text="${index}"]`);
      if (!slide || !text) return;
      const zoom = slide.querySelector("[data-zoom]");
      gsap.fromTo(zoom, { scale: 1.08 }, { scale: 1, duration: AUTOPLAY_S + 2, ease: "sine.out", overwrite: "auto" });
      if (first.current) {
        first.current = false;
        return;
      }
      const id = ++seq.current;
      const oldText = leaving !== null ? el.querySelector(`[data-text="${leaving}"]`) : null;
      const oldZoom = leaving !== null ? el.querySelector(`[data-slide="${leaving}"] [data-zoom]`) : null;
      const ribbon = el.querySelector<SVGSVGElement>("[data-wipe-ribbon]");

      // Stop a transition still running, then put every slide back at rest: a text faded out
      // earlier must be visible again when its slide returns (it used to stay hidden).
      tl.current?.kill();
      el.querySelectorAll<HTMLElement>("[data-slide]").forEach((s) => {
        s.style.clipPath = "";
      });
      gsap.set(el.querySelectorAll("[data-zoom]"), { xPercent: 0 });
      el.querySelectorAll<HTMLElement>("[data-text]").forEach((t) => {
        if (t === oldText) return;
        gsap.set([t, ...t.querySelectorAll("[data-word], [data-fade], .nid-accent")], {
          clearProps: "opacity,visibility,transform,backgroundSize",
        });
      });
      const sweep = { dx: WIPE_FROM };
      const paint = () => {
        slide.style.clipPath = wipeClip(sweep.dx);
        if (ribbon) ribbon.style.transform = `translateX(${(sweep.dx * 100).toFixed(2)}%)`;
      };
      paint();
      tl.current = gsap
        .timeline()
        .to(oldText, { autoAlpha: 0, y: -12, duration: 0.3, ease: "power2.in" }, 0)
        .set(ribbon, { autoAlpha: 1 }, 0)
        .to(sweep, { dx: WIPE_TO, duration: REVEAL_S, ease: "power2.inOut", onUpdate: paint }, 0)
        .fromTo(oldZoom, { xPercent: 0 }, { xPercent: -4, duration: REVEAL_S, ease: "power2.inOut" }, 0)
        .fromTo(slide.querySelector("[data-zoom]"), { xPercent: 5 }, { xPercent: 0, duration: REVEAL_S + 0.4, ease: "power3.out" }, 0.1)
        .to(ribbon, { autoAlpha: 0, duration: 0.25 }, REVEAL_S - 0.2)
        .fromTo(text.querySelectorAll("[data-word]"), { yPercent: 115 }, { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.05 }, 0.45)
        .fromTo(
          text.querySelectorAll(".nid-accent"),
          { backgroundSize: "0% 0.5em" },
          { backgroundSize: "100% 0.5em", duration: 0.8, ease: "power3.inOut", clearProps: "backgroundSize" },
          0.9,
        )
        .fromTo(text.querySelectorAll("[data-fade]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 }, 0.75)
        .add(() => {
          slide.style.clipPath = "";
          if (oldZoom) gsap.set(oldZoom, { xPercent: 0 });
          if (seq.current === id) setLeaving(null);
        }, REVEAL_S);
    },
    { dependencies: [index], scope: root },
  );

  const running = playing && !held && !reduced;

  return (
    <section
      ref={root}
      aria-roledescription="carrousel"
      aria-label="À la une"
      className="relative isolate overflow-hidden bg-white lg:h-[100svh] lg:min-h-[43.75rem] lg:max-h-[62.5rem]"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocusCapture={() => setHeld(true)}
      onBlurCapture={() => setHeld(false)}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <clipPath id={`${clipId}-d`} clipPathUnits="objectBoundingBox">
          <path d={DESKTOP_CLIP} />
        </clipPath>
        <clipPath id={`${clipId}-m`} clipPathUnits="objectBoundingBox">
          <path d={MOBILE_CLIP} />
        </clipPath>
        <linearGradient id={`${clipId}-ribbon`} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#fecc00" />
          <stop offset="1" stopColor="#fecc00" />
        </linearGradient>
        <linearGradient id={`${clipId}-base`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fecc00" stopOpacity="0.25" />
          <stop offset="0.25" stopColor="#fecc00" />
          <stop offset="1" stopColor="#fecc00" />
        </linearGradient>
      </svg>

      {/* The hero's own menu: in flow on mobile, over the top of the hero on desktop */}
      {menu && <div className="relative z-[6] lg:absolute lg:inset-x-0 lg:top-0">{menu}</div>}

      {/* Photographs: right side on desktop, top on mobile */}
      <div className="relative h-[56svh] min-h-[340px] nid-hero-media lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto">
        <div
          className="nid-hero-photo absolute inset-0 overflow-hidden"
          style={{ ["--arc-d" as string]: `url(#${clipId}-d)`, ["--arc-m" as string]: `url(#${clipId}-m)` }}
        >
          {slides.map((slide, i) => {
            const shown = i === index || i === leaving;
            return (
              <div
                key={slide.id}
                data-slide={i}
                aria-hidden="true"
                className={`absolute inset-0 overflow-hidden ${shown ? "" : "invisible"}`}
                style={{ zIndex: i === index ? 2 : 1 }}
              >
                <div data-zoom="" className="absolute inset-0 will-change-transform">
                  <Image
                    src={slide.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    preload={i === 0}
                    loading="eager"
                    className="object-cover"
                    style={{ objectPosition: slide.image.position }}
                  />
                </div>
              </div>
            );
          })}
          {/* The ribbon that sweeps across during a transition */}
          <svg
            data-wipe-ribbon=""
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            className="nid-deco invisible absolute inset-0 z-[3] h-full w-full overflow-visible opacity-0"
          >
            <path d={WIPE_RIBBON} fill={`url(#${clipId}-ribbon)`} />
          </svg>
        </div>
        {/* The TANTY logo ribbon along the arc (desktop) and under the curve (mobile) */}
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="nid-deco absolute inset-0 z-[3] hidden h-full w-full overflow-visible lg:block">
          <path d={DESKTOP_RIBBON} fill={`url(#${clipId}-ribbon)`} />
        </svg>
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true" focusable="false" className="nid-deco absolute inset-0 z-[3] h-full w-full overflow-visible lg:hidden">
          <path d={MOBILE_RIBBON} fill={`url(#${clipId}-ribbon)`} />
        </svg>
      </div>

      {/* Desktop: the yellow border of the next section, glued to the hero, closing the photo at the bottom */}
      <div aria-hidden="true" className="nid-hero-base absolute bottom-0 right-0 z-[4] hidden h-3 lg:block">
        <svg viewBox="0 0 1000 12" preserveAspectRatio="none" focusable="false" className="nid-deco block h-full w-full">
          <path d={BASE_RIBBON} fill={`url(#${clipId}-base)`} />
        </svg>
      </div>

      {/* Text column */}
      <div className="nid-wrap relative z-[2] flex h-full flex-col justify-center pb-16 pt-12 lg:pb-24 lg:pt-[104px]">
        <div aria-live={running ? "off" : "polite"} className="grid lg:max-w-[44%] xl:max-w-[40%]">
          {slides.map((slide, i) => {
            const active = i === index;
            const shown = active || i === leaving;
            const Heading = i === 0 ? "h1" : "h2";
            const accentFrom = slide.title.split(" ").length - slide.accent.split(" ").length;
            return (
              <div
                key={slide.id}
                data-text={i}
                role="group"
                aria-roledescription="diapositive"
                aria-label={`${i + 1} sur ${slides.length} : ${slide.title}`}
                aria-hidden={!active}
                inert={!active}
                className={`[grid-area:1/1] self-center ${shown ? "" : "invisible"}`}
              >
                <Heading className="nid-display text-[clamp(2.25rem,1.2rem+2.4vw,3.5rem)] leading-[1.08] text-[var(--nid-ink)]">
                  {(() => {
                    const words = slide.title.split(" ");
                    // One rising mask per word; the accent words share one swoosh wrapper.
                    const word = (wd: string, w: number, last: boolean) => (
                      <span key={w} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                        <span data-word="" className="inline-block">
                          {wd}
                          {last ? "" : "\u00a0"}
                        </span>
                      </span>
                    );
                    const lead = words.slice(0, accentFrom);
                    const accent = words.slice(accentFrom);
                    return (
                      <>
                        {lead.map((wd, w) => word(wd, w, false))}
                        <span className="nid-accent nid-swoosh">{accent.map((wd, w) => word(wd, accentFrom + w, w === accent.length - 1))}</span>
                      </>
                    );
                  })()}
                </Heading>
                <p data-fade="" className="mt-6 max-w-[34rem] text-[1.0625rem] leading-relaxed text-[var(--nid-ink-soft)] lg:text-lg">
                  {slide.text}
                </p>
                <div data-fade="">
                  <Link href={slide.link.href} className="nid-btn nid-btn-primary mt-9">
                    {slide.link.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex items-center gap-5 lg:absolute lg:bottom-16 lg:mt-0">
          <ol className="flex items-center" aria-label="Choisir une diapositive">
            {slides.map((slide, i) => {
              const active = i === index;
              return (
                <li key={slide.id}>
                  <button type="button" onClick={() => go(i)} aria-current={active} className="group flex size-8 items-center justify-center">
                    <span
                      className={`block size-3.5 rounded-full border-2 border-[var(--nid-green)] transition-colors duration-300 ${
                        active ? "bg-[var(--nid-green)]" : "bg-transparent group-hover:bg-[rgb(27_100_48/0.25)]"
                      }`}
                    />
                    <span className="sr-only">
                      Diapositive {i + 1} : {slide.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex size-8 items-center justify-center text-[var(--nid-ink-soft)] transition-colors hover:text-[var(--nid-green)]"
            >
              {playing ? <Pause aria-hidden="true" className="size-4" /> : <Play aria-hidden="true" className="size-4" />}
              <span className="sr-only">{playing ? "Mettre en pause le défilement" : "Reprendre le défilement"}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
