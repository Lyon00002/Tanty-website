"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { gsap, MOTION_OK, useGSAP } from "../../motion/gsap";
import type { Milestone } from "../histoire/milestones";

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

/**
 * The folded path through the suns, in px: straight runs from sun to sun, a
 * corner where two suns are neither in one row nor in one column (down
 * first, then across), every turn rounded. `at` is how far along the path
 * each sun stands (0 to 1).
 */
function trail(suns: Point[]) {
  const v: Point[] = [];
  const index: number[] = [];
  suns.forEach((p, i) => {
    const a = v[v.length - 1];
    if (a && Math.abs(a.x - p.x) > 1 && Math.abs(a.y - p.y) > 1) v.push({ x: a.x, y: p.y });
    index[i] = v.length;
    v.push(p);
  });
  const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);
  const len = [0];
  for (let k = 1; k < v.length; k++) len[k] = len[k - 1] + dist(v[k - 1], v[k]);
  const total = len[len.length - 1] || 1;

  const f = (n: number) => n.toFixed(1);
  let d = `M${f(v[0].x)} ${f(v[0].y)}`;
  for (let k = 1; k < v.length - 1; k++) {
    const [a, b, c] = [v[k - 1], v[k], v[k + 1]];
    const across = (p: Point, q: Point) => Math.abs(p.y - q.y) < 1;
    if (across(a, b) === across(b, c)) {
      d += `L${f(b.x)} ${f(b.y)}`;
      continue;
    }
    const r = Math.min(12, dist(a, b) / 2, dist(b, c) / 2);
    const from = { x: b.x + ((a.x - b.x) / dist(a, b)) * r, y: b.y + ((a.y - b.y) / dist(a, b)) * r };
    const to = { x: b.x + ((c.x - b.x) / dist(b, c)) * r, y: b.y + ((c.y - b.y) / dist(b, c)) * r };
    d += `L${f(from.x)} ${f(from.y)}Q${f(b.x)} ${f(b.y)} ${f(to.x)} ${f(to.y)}`;
  }
  if (v.length > 1) d += `L${f(v[v.length - 1].x)} ${f(v[v.length - 1].y)}`;
  return { d, at: index.map((k) => len[k] / total) };
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
  const [geo, setGeo] = useState<{ w: number; h: number; d: string; at: number[] } | null>(null);
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
      setGeo((g) => (g && g.d === next.d && g.w === next.w && g.h === next.h ? g : next));
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
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom 80%", scrub: 0.6 },
        });
        // The ribbon is uncovered along its real length (Chrome does not scale the dash offset by pathLength).
        const draw = el.querySelector<SVGPathElement>("[data-draw]");
        const length = draw?.getTotalLength() ?? 0;
        tl.fromTo(draw, { strokeDasharray: `${length} ${length}`, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1 }, 0);
        el.querySelectorAll("[data-step]").forEach((step, i) => {
          const at = Math.min(0.92, geo.at[i] ?? 0);
          tl.fromTo(step.querySelector("[data-sun]"), { scale: 0.3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.06, ease: "back.out(1.7)" }, at).fromTo(
            step.querySelectorAll("[data-say]"),
            { y: 8, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.07, ease: "power2.out" },
            at + 0.015,
          );
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
