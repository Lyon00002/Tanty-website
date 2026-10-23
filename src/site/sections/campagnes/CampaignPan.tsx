"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import { Photo } from "../../ui/Photo";
import { CAMPAIGNS, campaignLink } from "./campaigns";

/** Share of the slide spent still, before the first card leaves and after the last one arrives. */
const HOLD = 0.12;

/**
 * À l'affiche on phones and tablets: the title, then the campaign visuals in
 * a row, each card in its visual's own proportions (nothing cropped), the
 * next one peeking at the edge. The scroll slides the row sideways, card
 * after card, from the moment it comes into the screen; title and row end
 * held under the header while the last card arrives (sticky, a short hold:
 * world.css .nid-pan); the yellow mark under the row says which card is in view.
 * A card reached with the keyboard is scrolled to. Without scripts or under
 * reduced motion: the same row, swiped by hand.
 */
export function CampaignPan({ head, blurs }: { head: ReactNode; blurs: Record<string, string | undefined> }) {
  const pan = useRef<HTMLDivElement>(null);
  const n = CAMPAIGNS.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (max-width: 1023.98px)`, () => {
        const el = pan.current;
        const frame = el?.querySelector<HTMLElement>(".nid-pan-frame");
        const run = el?.querySelector<HTMLElement>(".nid-pan-run");
        const view = frame?.querySelector<HTMLElement>("[data-view]");
        const track = view?.querySelector<HTMLElement>("[data-track]");
        if (!el || !frame || !run || !view || !track) return;
        // How far the row slides: its length beyond the content column.
        const travel = () => {
          const cs = getComputedStyle(view);
          return Math.max(0, track.offsetWidth - (view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)));
        };
        const marks = el.querySelectorAll("[data-mark]");
        // From the moment the row is well in the screen (its top at 80 %) to the end of the hold under the header.
        // Measured on the section, which never sticks (the row's offset in the held block is layout, not position).
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: () => `top ${window.innerHeight * 0.8 - view.offsetTop}px`,
            end: () => `top ${parseFloat(getComputedStyle(frame).top) - run.offsetHeight}px`,
            scrub: 0.4,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const k = Math.round(gsap.utils.clamp(0, 1, self.progress * (1 + 2 * HOLD) - HOLD) * (n - 1));
              marks.forEach((m, i) => m.toggleAttribute("data-current", i === k));
            },
          },
        });
        tl.to(track, { x: () => -travel(), duration: 1 }, HOLD).to({}, { duration: HOLD });

        // A card reached with the keyboard: the page scrolls to where the row shows it.
        const onFocus = (e: FocusEvent) => {
          const k = [...track.children].findIndex((li) => li.contains(e.target as Node));
          const st = tl.scrollTrigger;
          if (k < 0 || !st) return;
          window.scrollTo({ top: st.start + ((st.end - st.start) * (HOLD + k / Math.max(1, n - 1))) / (1 + 2 * HOLD) });
        };
        track.addEventListener("focusin", onFocus);
        return () => track.removeEventListener("focusin", onFocus);
      });
    },
    { scope: pan },
  );

  return (
    <div ref={pan} className="nid-pan" style={{ "--n": n } as CSSProperties}>
      <div className="nid-pan-frame">
        {head}
        <div data-view="" className="nid-pan-view nid-noscrollbar lg:hidden">
          <ul data-track="" className="flex w-max gap-[var(--pan-gap)]">
            {CAMPAIGNS.map((c) => {
              const { href, label } = campaignLink(c);
              return (
                <li key={c.range} className="nid-pan-card">
                  <Link
                    href={href}
                    aria-label={label}
                    className="relative block overflow-hidden rounded-xl bg-[var(--nid-green-deep)] shadow-lg sm:rounded-2xl"
                    style={{ aspectRatio: `${c.width} / ${c.height}` }}
                  >
                    <span className="nid-skeleton absolute inset-0">
                      <Photo src={c.src} blur={blurs[c.src]} alt="" fill sizes="(min-width: 1024px) 1px, 86vw" className="object-cover" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        {/* Which card is in view */}
        <div aria-hidden="true" className="nid-pan-marks nid-wrap gap-1.5 lg:hidden">
          {CAMPAIGNS.map((c, k) => (
            <span
              key={c.range}
              data-mark=""
              data-current={k === 0 || undefined}
              className="h-1 w-4 rounded-full bg-[var(--nid-ink)]/15 transition-[width,background-color] duration-300 data-current:w-8 data-current:bg-[var(--nid-yellow)]"
            />
          ))}
        </div>
      </div>
      {/* The short scroll during which title and row stay held */}
      <div aria-hidden="true" className="nid-pan-run lg:hidden" />
    </div>
  );
}
