"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface BentoRevealProps {
  children: ReactNode;
  /** "rise": cells rise in reading order. "slide": cells slide in from the side. */
  mode?: "rise" | "slide";
  className?: string;
}

/**
 * Reveals the cells of a bento ([data-cell], with a --i index) once, when the
 * grid enters the viewport. Content is visible without JavaScript: cells are
 * only hidden after this component arms the grid, and never under
 * prefers-reduced-motion (see world.css).
 */
export function BentoReveal({ children, mode = "rise", className }: BentoRevealProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.armed = "true";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.revealed = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={root} data-reveal={mode} className={className}>
      {children}
    </div>
  );
}
