import { useId } from "react";
import { safeId } from "../lib/geometry";

/**
 * Section border taken from the TANTY logo: its ribbon, drawn as a long,
 * gently arched swoosh that tapers at both ends, in TANTY yellow.
 * Static, decorative, one per seam between sections.
 */

const W = 1200;
const H = 40;
const STEPS = 120;

/** Tapered ribbon along a shallow arc; thickest slightly right of centre. */
const RIBBON = (() => {
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const x = t * W;
    const y = H * 0.62 - Math.sin(t * Math.PI) * H * 0.34 + (t - 0.5) * H * 0.12;
    const w = 6.2 * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), 1.4) + 0.4;
    top.push(`${x.toFixed(1)} ${(y - w / 2).toFixed(2)}`);
    bottom.unshift(`${x.toFixed(1)} ${(y + w / 2).toFixed(2)}`);
  }
  return `M${top.join("L")}L${bottom.join("L")}Z`;
})();

export function RibbonDivider({ className }: { className?: string }) {
  const id = safeId(useId());
  return (
    <div className={`nid-wrap ${className ?? ""}`} aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="nid-deco block h-8 w-full" focusable="false">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fecc00" stopOpacity="0.2" />
            <stop offset="0.3" stopColor="#fecc00" />
            <stop offset="0.8" stopColor="#fecc00" />
            <stop offset="1" stopColor="#fecc00" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <path d={RIBBON} fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
