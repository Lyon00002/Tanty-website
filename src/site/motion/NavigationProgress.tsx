"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Other code can announce a navigation it starts itself (router.push), e.g. the search. */
export const NAVIGATION_START = "nid:navigation-start";

/** Below this, a navigation is quick enough to need no bar (no flash). */
const SHOW_AFTER = 120;

/**
 * The loading bar: a thin TANTY yellow line along the top of the screen
 * while the next page loads, so a slow connection never looks like a dead
 * click. It starts on a click towards another page (not on the browser's
 * back / forward: a page already seen comes back from the cache at once, the
 * bar only flashed there, user feedback), creeps forward while waiting, fills
 * up when the new page is there, then fades. Written straight to the DOM: no
 * re-render while it moves.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const run = useRef<{ shown: boolean; value: number; timers: number[] } | null>(null);

  const finish = useRef(() => {});

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const set = (value: number) => {
      el.style.transform = `scaleX(${value})`;
    };
    const clear = () => run.current?.timers.forEach((t) => window.clearTimeout(t));

    const start = () => {
      if (run.current) return;
      const r = { shown: false, value: 0, timers: [] as number[] };
      run.current = r;
      r.timers.push(
        window.setTimeout(() => {
          r.shown = true;
          el.dataset.active = "true";
          r.value = 0.12;
          set(r.value);
          // Creep towards 92 %, ever slower, until the page is there.
          const creep = () => {
            r.value += (0.92 - r.value) * 0.14;
            set(r.value);
            r.timers.push(window.setTimeout(creep, 380));
          };
          r.timers.push(window.setTimeout(creep, 380));
        }, SHOW_AFTER),
        // Never left hanging (a navigation that did not happen).
        window.setTimeout(() => finish.current(), 15000),
      );
    };

    finish.current = () => {
      const r = run.current;
      if (!r) return;
      clear();
      run.current = null;
      if (!r.shown) return;
      set(1);
      window.setTimeout(() => {
        el.dataset.active = "false";
        window.setTimeout(() => {
          if (!run.current) set(0);
        }, 400);
      }, 220);
    };

    // A left click on a link to another page of the site (not a jump within the page). Heard while
    // capturing: next/link cancels the click's default before it would bubble up to here.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      start();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener(NAVIGATION_START, start);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener(NAVIGATION_START, start);
      clear();
    };
  }, []);

  // The new page is there.
  useEffect(() => {
    finish.current();
  }, [pathname]);

  return (
    // Thicker than a hairline so it shows on phones (user request): 5 px there, 4 px on wide screens.
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[5px] lg:h-1">
      <div ref={bar} data-active="false" className="nid-progress h-full origin-left bg-[var(--nid-yellow)]" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
