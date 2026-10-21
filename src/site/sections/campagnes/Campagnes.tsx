"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { getCategory, type CategoryId } from "@/data/categories";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import { RANGE_LINKS, STORE_LINKS, routes } from "../../routes";

interface Campaign {
  range: CategoryId;
  /** Wide visual (desktop and tablet), shown whole. */
  src: string;
  /** Portrait visual for phones (9:16, 1080 × 1920 or more), shown full card. Until it exists, the wide one is used. */
  srcMobile?: string;
  /**
   * Desktop framing while the visuals are wider than the card (2.38:1 in a
   * 16:10 card): the wide visual fills the card and this keeps its key part
   * in view (CSS object-position). To drop once 16:10 visuals are supplied.
   */
  focus: string;
  alt: string;
}

/** The client's three campaign visuals (public/brand/campagnes, see SOURCES.md); their headlines are part of the images. */
const CAMPAIGNS: Campaign[] = [
  {
    range: "reine",
    src: "/brand/campagnes/reine.webp",
    focus: "80% 50%",
    alt: "Campagne TANTY Reine « Pour mieux grandir » : une mère donne la bouillie à son bébé, à côté d'un seau Reine Custard Powder Banane et des étuis Reine.",
  },
  {
    range: "grignoter",
    src: "/brand/campagnes/a-grignoter.webp",
    focus: "12% 50%",
    alt: "Campagne TANTY À Grignoter « … en toute sécurité ! » : deux amis partagent des arachides enrobées, des arachides caramélisées, des croquettes et des chips de plantain.",
  },
  {
    range: "chapelure",
    src: "/brand/campagnes/chapelure.webp",
    focus: "83% 50%",
    alt: "Campagne TANTY Chapelure « Dorée et croustillante » : une cheffe saupoudre de la chapelure sur des cuisses de poulet, à côté de l'étui TANTY Chapelure.",
  },
];

/** Name of the scroll timeline that follows card k's approach. */
const rise = (k: number) => `--nid-rise-${k}`;

/**
 * À l'affiche: the three campaign visuals as a pile of cards laid one on
 * the other. Each card owns a screen of scroll and sticks near the top.
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
export function Campagnes() {
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
        const top = ctx.conditions.sm ? 80 : 64;
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
      <div className="nid-wrap pb-12 pt-20 lg:pb-16 lg:pt-24">
        <h2 data-reveal="" id="nid-campaigns-title" className="nid-title">
          À l&apos;<span className="nid-accent">affiche</span>
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
              className="pointer-events-none sticky top-16 flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center px-3 sm:top-20 sm:min-h-[calc(100svh-5rem)] sm:px-6 lg:px-8"
              style={{ zIndex: k + 1 }}
            >
              <div className="mx-auto w-full max-w-7xl">
                {/* Lands on the pile along its own approach */}
                <div data-land="" className="nid-stack-land" style={{ "--k": k, animationTimeline: rise(k) } as CSSProperties}>
                    <Link
                      href={href}
                      aria-label={`${c.alt} Voir les produits ${range.name}.`}
                      className="pointer-events-auto relative block h-[calc(100svh-6.5rem)] overflow-hidden rounded-2xl bg-[var(--nid-green-deep)] shadow-xl sm:h-[calc(100svh-7.5rem)] md:h-[min(44rem,calc(100svh-7.5rem))] lg:h-[min(44rem,calc(100svh-10rem))] lg:rounded-3xl lg:shadow-2xl"
                    >
                      {/* Phone: the portrait visual fills the card when there is one */}
                      {c.srcMobile && <Image src={c.srcMobile} alt="" fill sizes="100vw" className="object-cover md:hidden" />}
                      <span className={c.srcMobile ? "hidden md:contents" : "contents"}>
                        {/* Phone and tablet: the same visual, tiny and scaled up, as a soft fill around it */}
                        <Image src={c.src} alt="" fill sizes="64px" quality={40} className="scale-125 object-cover blur-xl lg:hidden" />
                        <span aria-hidden="true" className="absolute inset-0 bg-[rgb(9_34_18/0.2)] lg:hidden" />
                        {/* The visual: whole on phone and tablet, filling the card on desktop */}
                        <Image
                          src={c.src}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 80rem, 100vw"
                          style={{ objectPosition: c.focus }}
                          className="object-contain lg:object-cover"
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
        <div aria-hidden="true" className="h-[22svh]" />
      </div>
    </section>
  );
}
