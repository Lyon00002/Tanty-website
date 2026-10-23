"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { getCategory } from "@/data/categories";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import { RANGE_LINKS, STORE_LINKS, routes } from "../../routes";
import { Photo } from "../../ui/Photo";
import { CAMPAIGNS } from "./campaigns";

/** Name of the scroll timeline that follows card k's approach. */
const rise = (k: number) => `--nid-rise-${k}`;

/**
 * À l'affiche: the three campaign visuals as a pile of cards laid one on
 * the other. Each card owns a screen of scroll and sticks near the top
 * (phones and tablets: the same wide card in miniature, owning a little scroll).
 *
 * The landing: every card has its own timeline, from the moment it
 * enters at the bottom of the screen to the moment it settles on the pile
 * (an invisible marker at its place in the flow, so the timeline is not
 * frozen by sticky). On the way up the card comes in smaller and grows as
 * it settles onto the top of the pile: full size only once in place (no 3D
 * rotation). The cards already on the pile
 * keep their size and only darken a little, their edges showing above.
 *
 * Fluidity: all of it is CSS scroll-driven animation (world.css, .nid-stack),
 * run by the browser off the main thread, with no script per frame. Browsers
 * without named view timelines get the same motion from GSAP ScrollTrigger.
 * Nothing moves under reduced motion.
 */
/** `blurs`: the visuals' blurred placeholders, by src (given by the server page). */
export function Campagnes({ blurs = {} }: { blurs?: Record<string, string | undefined> }) {
  const stack = useRef<HTMLDivElement>(null);
  const n = CAMPAIGNS.length;

  // Fallback only: browsers without CSS named view timelines.
  useGSAP(
    () => {
      const el = stack.current;
      if (!el || (CSS.supports("timeline-scope", "--a") && CSS.supports("animation-timeline", "view()"))) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, sm: "(min-width: 640px)" }, (ctx) => {
        if (!ctx.conditions?.motion) return;
        // Where the cards stick: the stack's --top (rem), as in the CSS.
        const top = parseFloat(getComputedStyle(el).getPropertyValue("--top")) * parseFloat(getComputedStyle(document.documentElement).fontSize) || 80;
        const marks = gsap.utils.toArray<HTMLElement>("[data-mark]", el);
        const lands = gsap.utils.toArray<HTMLElement>("[data-land]", el);
        const dims = gsap.utils.toArray<HTMLElement>("[data-dim]", el);
        marks.forEach((mark, k) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: mark, start: "top 90%", end: `top ${top}px`, scrub: 0.35 } });
          tl.fromTo(
            lands[k],
            { scale: 0.92, transformOrigin: "50% 0%" },
            { scale: 1, ease: "none", duration: 1 },
            0,
          );
          if (k > 0) tl.fromTo(dims[k - 1], { opacity: 0 }, { opacity: 0.38, ease: "none", duration: 1 }, 0);
        });
      });
    },
    { scope: stack },
  );

  return (
    <section id="campagnes" aria-labelledby="nid-campaigns-title" className="nid-on-white relative scroll-mt-20">
      <div className="nid-wrap pb-10 pt-20 lg:pb-12 lg:pt-24">
        <h2 data-reveal="" id="nid-campaigns-title" className="nid-title">
          À l&apos;affiche
          <span className="nid-dot">.</span>
        </h2>
        <p data-reveal="" className="nid-lead mt-5 max-w-[38rem] text-[var(--nid-ink-soft)]">
          Les campagnes de nos gammes : trois univers, trois façons de goûter TANTY.
        </p>
      </div>

      <div
        ref={stack}
        className="nid-stack relative"
        style={{ timelineScope: CAMPAIGNS.map((_, k) => rise(k)).join(", ") } as CSSProperties}
      >
        {/* One marker per card, at the card's place in the flow: the timelines of the landings */}
        {CAMPAIGNS.map((c, k) => (
          <span
            key={`mark-${c.range}`}
            data-mark=""
            aria-hidden="true"
            className="nid-stack-mark"
            style={{ "--k": k, viewTimelineName: rise(k) } as CSSProperties}
          />
        ))}

        {CAMPAIGNS.map((c, k) => {
          const range = getCategory(c.range);
          const href = RANGE_LINKS ? routes.range(range) : STORE_LINKS ? routes.catalogue : routes.ranges;
          const hasNext = k < n - 1;
          return (
            <div
              key={c.range}
              className="pointer-events-none sticky top-[var(--top)] flex min-h-[var(--h)] flex-col items-center justify-center"
              style={{ zIndex: k + 1 }}
            >
              {/* As wide as the section's content: only its side padding around (as the title above) */}
              <div className="nid-wrap">
                {/* Lands on the pile along its own approach */}
                <div data-land="" className="nid-stack-land" style={{ "--k": k, animationTimeline: rise(k) } as CSSProperties}>
                    <Link
                      href={href}
                      aria-label={`${c.alt} Voir les produits ${range.name}.`}
                      className="pointer-events-auto relative block h-[var(--card)] overflow-hidden rounded-xl bg-[var(--nid-green-deep)] shadow-lg sm:rounded-2xl sm:shadow-xl lg:rounded-3xl lg:shadow-2xl"
                    >
                      <span className="nid-skeleton absolute inset-0">
                        <Photo
                          src={c.src}
                          blur={blurs[c.src]}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 80rem, 100vw"
                          style={{ objectPosition: c.focus }}
                          className="object-cover"
                        />
                      </span>
                      {/* Darkens as the card sinks under the next one */}
                      <span
                        data-dim=""
                        data-next={hasNext || undefined}
                        aria-hidden="true"
                        className="nid-stack-dim"
                        style={hasNext ? ({ animationTimeline: rise(k + 1) } as CSSProperties) : undefined}
                      />
                    </Link>
                </div>
              </div>
            </div>
          );
        })}
        {/* Room for the finished pile to stay a moment (sticky ignores padding) */}
        <div aria-hidden="true" className="h-10 lg:h-[22svh]" />
      </div>
    </section>
  );
}
