"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface NavShellProps {
  children: ReactNode;
  /**
   * Home (Olam-like): the bar is fixed and hidden above the viewport; it
   * drops in once the hero's own menu has scrolled away, and leaves again
   * when the visitor comes back to the top. Elsewhere: an ordinary sticky bar.
   */
  reveal?: boolean;
}

/** Uses an IntersectionObserver on a sentinel (no scroll listener). */
export function NavShell({ children, reveal = false }: NavShellProps) {
  const sentinel = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(!reveal);

  useEffect(() => {
    if (!reveal) return;
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  if (!reveal) {
    return (
      <header className="nid-nav sticky top-0 z-30" data-shown="true">
        {children}
      </header>
    );
  }

  return (
    <>
      {/* Once this point (below the hero menu) leaves the viewport, the bar drops in. */}
      <div ref={sentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-[140px] h-px w-px" />
      <header className="nid-nav nid-nav-reveal fixed inset-x-0 top-0 z-30" data-shown={shown} inert={!shown}>
        {children}
      </header>
    </>
  );
}
