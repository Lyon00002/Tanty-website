"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import type { Milestone } from "../histoire/milestones";
import { SunTrail } from "./SunTrail";

/*
 * The path of the sun (after the "Matin" proposal): a dotted arc that climbs
 * fast then levels off, like the sun in the morning sky. Heights are a
 * fraction of the sky band: 0 = horizon, 1 = highest.
 */
const rise = (t: number) => Math.pow(Math.sin((t * Math.PI) / 2), 0.85);
const ARC = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = i / 60;
    pts.push(`${(t * 1000).toFixed(1)} ${(100 - 92 * rise(t)).toFixed(2)}`);
  }
  return `M${pts.join("L")}`;
})();

/**
 * Le chemin du soleil: TANTY's verified milestones, each one on a sun a
 * little higher in the sky than the last: one row, a dotted arc across the
 * suns, each year and its text under its sun. The arc draws itself with the
 * scroll and each sun rises as the path reaches it (undone when scrolling
 * back, so it plays at every visit); the last sun glows. Wide screens only:
 * phones and tablets get the same path folded like a ribbon (SunTrail).
 * Static under reduced motion.
 */
export function SunPath({ items }: { items: Milestone[] }) {
  const root = useRef<HTMLOListElement>(null);
  const n = items.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        const el = root.current;
        if (!el) return;
        // The arc draws itself with the scroll (both ways, so at every visit), from the moment
        // the path enters the screen until its top reaches 45 % of it.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top bottom", end: "top 45%", scrub: 0.6 },
        });
        tl.fromTo(el.querySelector("[data-arc]"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1 }, 0);
        // Each sun rises when the path reaches it, its text just after.
        const box = el.getBoundingClientRect();
        const says = el.querySelectorAll("[data-say]");
        el.querySelectorAll("[data-sun]").forEach((sun, i) => {
          const r = sun.getBoundingClientRect();
          const along = (r.left + r.width / 2 - box.left) / box.width;
          const at = Math.min(0.9, Math.max(0, along));
          tl.fromTo(sun, { y: 26, scale: 0.4, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.07, ease: "back.out(1.7)" }, at).fromTo(
            says[i],
            { y: 12, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.08, ease: "power2.out" },
            at + 0.02,
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <>
      <ol ref={root} aria-label="Les grandes étapes de TANTY" className="nid-sunpath relative" style={{ "--n": n } as CSSProperties}>
        {/* The arc across the sky band */}
        <svg
          data-arc=""
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
          className="nid-deco nid-sunpath-arc"
        >
          <path d={ARC} fill="none" stroke="var(--nid-yellow)" strokeWidth="3" strokeDasharray="0.5 11" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {items.map((m, i) => {
          const t = n > 1 ? i / n : 0;
          const last = i === n - 1;
          return (
            <li key={m.year} className="nid-sunpath-step" style={{ "--h": rise(t).toFixed(3) } as CSSProperties}>
              <span data-sun="" aria-hidden="true" className={`nid-sun ${last ? "nid-sun-high" : ""}`} />
              <div data-say="">
                <p className="nid-display nid-num text-[1.7rem] leading-none text-[var(--nid-green)]">{m.year}</p>
                <p className="mt-2 text-pretty text-[0.9375rem] leading-relaxed text-[var(--nid-ink-soft)]">{m.text}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <SunTrail items={items} />
    </>
  );
}
