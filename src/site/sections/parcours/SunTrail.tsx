"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import type { Milestone } from "../histoire/milestones";
import { lightStep, sunTimeline } from "./sunMotion";

/**
 * Where step i stands when the path is folded into rows of `cols`, each row
 * read the other way from the last (as a thread is woven); a step left alone
 * on the last row takes the whole row.
 */
function place(i: number, n: number, cols: number) {
  const row = Math.floor(i / cols);
  const pos = i % cols;
  const alone = n % cols === 1 && i === n - 1;
  return { row: `${row + 1}`, col: alone ? "1 / -1" : `${row % 2 === 0 ? pos + 1 : cols - pos}` };
}

type Point = { x: number; y: number };

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
const xy = (p: Point) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
/** The point `r` px from `from` towards `to`. */
const toward = (from: Point, to: Point, r: number) => ({
  x: from.x + ((to.x - from.x) / dist(from, to)) * r,
  y: from.y + ((to.y - from.y) / dist(from, to)) * r,
});

/** The turns of the path: the suns, plus a corner where two suns are neither in one row nor in one column (down first, then across). */
function turns(suns: Point[]) {
  return suns.flatMap((p, i) => {
    const a = suns[i - 1];
    return a && Math.abs(a.x - p.x) > 1 && Math.abs(a.y - p.y) > 1 ? [{ x: a.x, y: p.y }, p] : [p];
  });
}

/** The path through b, coming from a and going on to c: straight on, or round the turn. */
function through(a: Point, b: Point, c: Point) {
  const across = (p: Point, q: Point) => Math.abs(p.y - q.y) < 1;
  if (across(a, b) === across(b, c)) return `L${xy(b)}`;
  const r = Math.min(12, dist(a, b) / 2, dist(b, c) / 2);
  return `L${xy(toward(b, a, r))}Q${xy(b)} ${xy(toward(b, c, r))}`;
}

/**
 * The folded path through the suns, in px: straight runs from sun to sun,
 * every turn rounded. `at` is how far along the path each sun stands (0 to 1).
 */
function trail(suns: Point[]) {
  const v = turns(suns);
  const len = v.map((_, k) => v.slice(1, k + 1).reduce((sum, p, j) => sum + dist(v[j], p), 0));
  const total = len[len.length - 1] || 1;
  const d = `M${xy(v[0])}${v.slice(1, -1).map((b, k) => through(v[k], b, v[k + 2])).join("")}L${xy(v[v.length - 1])}`;
  return { d, at: suns.map((p) => len[v.indexOf(p)] / total) };
}

/**
 * The milestones on phones and tablets: the path of the sun of wide screens,
 * folded like a ribbon into rows of two (three on tablets), each row read the
 * other way from the last, so all seven steps hold on the screen at once.
 * Each year is strung on the dotted ribbon beside its sun, its text hanging
 * below; the suns grow from one step to the next and the last one, 2018,
 * shines. The ribbon draws itself with the scroll and each step lights up as
 * it reaches it (undone when scrolling back, so it plays at every visit).
 * Static under reduced motion.
 */
export function SunTrail({ items }: { items: Milestone[] }) {
  const root = useRef<HTMLOListElement>(null);
  const mask = `nid-trail-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [geo, setGeo] = useState<{ key: string; w: number; h: number; d: string; at: number[] } | null>(null);
  const n = items.length;

  // The path follows the suns where the layout puts them (layout offsets, so the suns' own motion does not move it).
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => {
      if (!el.offsetWidth) return;
      const suns = [...el.querySelectorAll<HTMLElement>("[data-sun]")].map((s) => ({
        x: s.offsetLeft + s.offsetWidth / 2,
        y: s.offsetTop + s.offsetHeight / 2,
      }));
      const next = { w: el.offsetWidth, h: el.offsetHeight, ...trail(suns) };
      const key = `${next.w} ${next.h} ${next.d}`;
      setGeo((g) => (g?.key === key ? g : { key, ...next }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (!geo) return;
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (max-width: 1023.98px)`, () => {
        const el = root.current;
        if (!el) return;
        // From the moment the steps enter the screen until the last one is well inside it.
        const tl = sunTimeline(el, "top bottom", "bottom 80%");
        // The ribbon is uncovered along its real length (Chrome does not scale the dash offset by pathLength).
        const draw = el.querySelector<SVGPathElement>("[data-draw]");
        const length = draw?.getTotalLength() ?? 0;
        tl.fromTo(draw, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1 }, 0);
        el.querySelectorAll("[data-step]").forEach((step, i) => {
          lightStep(tl, step.querySelector("[data-sun]"), step.querySelectorAll("[data-say]"), Math.min(0.92, geo.at[i] ?? 0));
        });
      });
    },
    { scope: root, dependencies: [geo], revertOnUpdate: true },
  );

  return (
    <ol ref={root} aria-label="Les grandes étapes de TANTY" className="nid-trail relative isolate lg:hidden">
      {/* The ribbon, under the suns and the years */}
      {geo && (
        <svg viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden="true" focusable="false" className="nid-deco absolute inset-0 -z-10 h-full w-full overflow-visible">
          <mask id={mask} maskUnits="userSpaceOnUse" x={-40} y={-40} width={geo.w + 80} height={geo.h + 80}>
            <path data-draw="" d={geo.d} fill="none" stroke="#fff" strokeWidth="10" />
          </mask>
          <path d={geo.d} fill="none" stroke="var(--nid-yellow)" strokeWidth="3" strokeDasharray="0.5 8" strokeLinecap="round" mask={`url(#${mask})`} />
        </svg>
      )}

      {items.map((m, i) => {
        const two = place(i, n, 2);
        const three = place(i, n, 3);
        const last = i === n - 1;
        // The suns grow along the path; the last one, the highest, shines.
        const size = last ? 1.5 : 0.75 + (0.375 * i) / Math.max(1, n - 2);
        return (
          <li
            key={m.year}
            data-step=""
            className="nid-trail-step"
            style={{ "--r2": two.row, "--c2": two.col, "--r3": three.row, "--c3": three.col, "--s": `${size.toFixed(3)}rem` } as CSSProperties}
          >
            <div className="flex h-7 items-center">
              <span className="flex w-4 shrink-0 justify-center">
                <span data-sun="" aria-hidden="true" className={`nid-sun shrink-0 ${last ? "nid-sun-high" : ""}`} />
              </span>
              {/* On the ribbon: the white ground hides the dots running behind the year */}
              <p data-say="" className="nid-display nid-num ml-0.5 bg-[var(--nid-white)] px-1 text-[1.375rem] leading-none text-[var(--nid-green)]">
                {m.year}
              </p>
            </div>
            <p data-say="" className="mt-1 pl-[1.375rem] text-pretty text-[0.8125rem] leading-[1.4] text-[var(--nid-ink-soft)] sm:text-[0.875rem]">
              {m.text}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
