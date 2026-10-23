"use client";

import { useEffect } from "react";

/**
 * In-page anchors glide to their section (the menu's "Contact", "Nos
 * gammes"…), without making every navigation smooth: a global
 * `scroll-behavior: smooth` turned Next's scroll reset into an animation that
 * the new page interrupted, so pages landed below their top and "back" short
 * of where the visitor was (measured, as on the NowTech storefront). Only a
 * link to a section of the page already open is taken over; the section's
 * scroll-margin is respected. Instant under reduced motion.
 */
export function AnchorScroll() {
  useEffect(() => {
    // Heard while capturing, before next/link handles the click.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
      window.history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
