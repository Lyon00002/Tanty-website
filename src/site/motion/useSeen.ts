"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether an element is being visited, for entrances that play at every
 * visit: true once `enter` of it is in view, false again once it has left
 * the screen entirely (so the entrance resets out of sight).
 */
export function useSeen(ref: RefObject<Element | null>, enter = 0.3) {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= enter) setSeen(true);
        else if (!entry.isIntersecting) setSeen(false);
      },
      { threshold: [0, enter] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, enter]);

  return seen;
}
