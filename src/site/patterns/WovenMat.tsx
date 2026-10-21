import { useId } from "react";
import { safeId } from "../lib/geometry";

/*
 * Vannerie en damier: a basket weave of flat strips, over and under.
 * Used at low contrast on full rows, and at full strength as the natte
 * of the product placeholders.
 */

export type MatTone = "yellow" | "straw" | "deep" | "grass" | "natte";

const TONES: Record<MatTone, { a: string; b: string; edge: string; light: string }> = {
  yellow: { a: "#ffd21f", b: "#f6c200", edge: "#e2ad00", light: "#ffe36a" },
  straw: { a: "#efd88a", b: "#e2c56a", edge: "#c8a047", light: "#fff0bf" },
  deep: { a: "#123f22", b: "#0d3419", edge: "#0a2a14", light: "#1b4d2b" },
  grass: { a: "#52b043", b: "#45a137", edge: "#3a8f2e", light: "#6cc055" },
  natte: { a: "#f1dc95", b: "#e4c975", edge: "#b98f3c", light: "#fff4cc" },
};

interface WovenMatProps {
  tone: MatTone;
  /** Strip width in px. */
  cell?: number;
  opacity?: number;
  className?: string;
}

interface WovenPatternProps {
  id: string;
  tone: MatTone;
  /** Strip width, in user units. */
  cell?: number;
}

/** The basket weave as an SVG <pattern>, for frames drawn in SVG. */
export function WovenPattern({ id, tone, cell = 14 }: WovenPatternProps) {
  const t = TONES[tone];
  const c = cell;
  const tile = c * 2;
  const strip = (x: number, y: number, horizontal: boolean) => (
    <g key={`${x}${y}`}>
      <rect x={x} y={y} width={c} height={c} fill={horizontal ? t.a : t.b} />
      {horizontal ? (
        <>
          <rect x={x} y={y} width={c} height={c * 0.14} fill={t.light} opacity="0.8" />
          <rect x={x} y={y + c * 0.86} width={c} height={c * 0.14} fill={t.edge} />
          <rect x={x + c - 1.2} y={y} width="1.2" height={c} fill={t.edge} opacity="0.7" />
        </>
      ) : (
        <>
          <rect x={x} y={y} width={c * 0.14} height={c} fill={t.light} opacity="0.8" />
          <rect x={x + c * 0.86} y={y} width={c * 0.14} height={c} fill={t.edge} />
          <rect x={x} y={y + c - 1.2} width={c} height="1.2" fill={t.edge} opacity="0.7" />
        </>
      )}
    </g>
  );
  return (
    <pattern id={id} width={tile} height={tile} patternUnits="userSpaceOnUse">
      {strip(0, 0, true)}
      {strip(c, 0, false)}
      {strip(0, c, false)}
      {strip(c, c, true)}
    </pattern>
  );
}

/** Fills its positioned parent. */
export function WovenMat({ tone, cell = 14, opacity = 1, className }: WovenMatProps) {
  const id = safeId(useId());
  return (
    <svg
      className={`nid-deco absolute inset-0 h-full w-full ${className ?? ""}`}
      style={{ opacity }}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <WovenPattern id={id} tone={tone} cell={cell} />
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
