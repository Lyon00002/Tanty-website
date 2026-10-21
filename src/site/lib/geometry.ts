/**
 * Small geometry helpers shared by the Nid illustrations (mascot, nests,
 * braids). Everything is deterministic so server and client render the
 * exact same path data.
 */

export type Pt = readonly [number, number];
export type Cubic = readonly [Pt, Pt, Pt, Pt];

const r1 = (n: number) => Math.round(n * 10) / 10;

export function fmt(...pts: Pt[]): string {
  return pts.map(([x, y]) => `${r1(x)} ${r1(y)}`).join(" ");
}

/** Point and tangent on a cubic Bezier. */
export function cubicAt([p0, p1, p2, p3]: Cubic, t: number): [number, number, number, number] {
  const u = 1 - t;
  const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
  const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
  const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
  const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
  return [x, y, dx, dy];
}

/** Tapered ribbon around a cubic centreline; width(s) for s in 0..1. */
export function ribbon(curve: Cubic, width: (s: number) => number, steps = 18): string {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [x, y, dx, dy] = cubicAt(curve, t);
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = width(t) / 2;
    left.push(`${r1(x + nx * w)} ${r1(y + ny * w)}`);
    right.push(`${r1(x - nx * w)} ${r1(y - ny * w)}`);
  }
  return `M${left.join("L")}L${right.reverse().join("L")}Z`;
}

/** Grass blade: wide at the base, pointed at the tip. */
export function blade(curve: Cubic, base: number): string {
  return ribbon(curve, (s) => base * Math.pow(1 - s, 0.75) + 0.3);
}

/** Feather (leaf) shape lying along +x, base at the origin. */
export function feather(length: number, width: number, tipRound = 0.82): string {
  const h = width / 2;
  return `M0 0C${r1(length * 0.18)} ${r1(-h)} ${r1(length * tipRound)} ${r1(-h)} ${r1(length)} 0C${r1(
    length * tipRound,
  )} ${r1(h)} ${r1(length * 0.18)} ${r1(h)} 0 0Z`;
}

/** Seeded PRNG (mulberry32): stable decorative randomness. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Smooth closed path through points (Catmull-Rom converted to cubic Beziers). */
export function smoothClosed(points: readonly Pt[], tension = 1): string {
  const n = points.length;
  let d = `M${fmt(points[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
    d += `C${fmt(c1, c2, p2)}`;
  }
  return `${d}Z`;
}

/** Turns a React useId value into a string safe inside url(#...). */
export function safeId(raw: string): string {
  return `n${raw.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}
