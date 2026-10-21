"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";
/** Elements already brought in, across client navigations. */
const done = new WeakSet<Element>();

/** The entrance of one element, by kind: "" rises and fades, "fade" only fades, "clip" opens from the top. */
const play = (el: HTMLElement, delay: number) => {
  const kind = el.dataset.reveal;
  if (kind === "clip") {
    el.animate([{ clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0 0)" }], { duration: 1100, delay, easing: EASE_IN_OUT, fill: "forwards" });
  } else if (kind === "fade") {
    el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay, easing: EASE_OUT, fill: "forwards" });
  } else {
    el.animate(
      [
        { opacity: 0, transform: "translate3d(0, 1.5rem, 0)" },
        { opacity: 1, transform: "translate3d(0, 0, 0)" },
      ],
      { duration: 950, delay, easing: EASE_OUT, fill: "forwards" },
    );
  }
};

/**
 * Entrances of the page's elements as they come into view, once. Elements
 * opt in with data-reveal; world.css holds them out of sight (only when
 * scripts run and motion is welcome) and this plays their entrance with the
 * Web Animations API, so the markup React renders is never touched (no
 * hydration mismatch). Elements entering together come in one after the
 * other, in reading order. One observer for the page, no scroll listener.
 */
export function RevealRoot() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter((el) => !done.has(el));
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || typeof Element.prototype.animate !== "function") {
      els.forEach((el) => play(el, 0));
      return;
    }
    // A "clip" element starts with no visible height, so its container is watched instead.
    const watched = new Map<Element, HTMLElement[]>();
    els.forEach((el) => {
      const target = el.dataset.reveal === "clip" && el.parentElement ? el.parentElement : el;
      watched.set(target, [...(watched.get(target) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .flatMap((e) => {
            io.unobserve(e.target);
            return watched.get(e.target) ?? [];
          })
          .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
          .forEach((el, i) => {
            done.add(el);
            play(el, Math.min(i, 6) * 90);
          });
      },
      { threshold: 0, rootMargin: "0px 0px -6% 0px" },
    );
    watched.forEach((_, target) => io.observe(target));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
