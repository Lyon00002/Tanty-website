/**
 * Hero curves drawn from the TANTY logo: the photo's edge is an ellipse arc
 * like the ribbon orbiting the word, and the ribbon itself runs along it,
 * tapering at both ends. All coordinates are in a 0..1 box
 * (objectBoundingBox for clip paths, viewBox "0 0 1 1" for the ribbon).
 */

type Pt = readonly [number, number];
const N = 64;

/* Desktop: the left edge of the photo. Ellipse centred right of the box,
   crossing the top at x ≈ 0.46 and the bottom-left corner. */
const D = { cx: 0.909, cy: 1.0, rx: 0.909, ry: 1.15 };
const D_FROM = (240.4 * Math.PI) / 180;
const D_TO = Math.PI;

function desktopPoint(t: number): Pt {
  const a = D_FROM + (D_TO - D_FROM) * t;
  return [D.cx + D.rx * Math.cos(a), D.cy + D.ry * Math.sin(a)];
}

/* Mobile: the bottom edge of the photo, a wide shallow ellipse. */
const M = { cx: 0.5, cy: 0, rx: 1.15, ry: 0.94 };
function mobilePoint(t: number): Pt {
  const x = -0.02 + 1.04 * t;
  const k = (x - M.cx) / M.rx;
  return [x, M.cy + M.ry * Math.sqrt(Math.max(0, 1 - k * k))];
}

const f = (n: number) => n.toFixed(4);

function samples(point: (t: number) => Pt): Pt[] {
  return Array.from({ length: N + 1 }, (_, i) => point(i / N));
}

/** Clip path of the photo (desktop): everything right of the arc. */
export const DESKTOP_CLIP = (() => {
  const pts = samples(desktopPoint);
  return `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}L1 1L1 0Z`;
})();

/** Clip path of the photo (mobile): everything above the bottom arc. */
export const MOBILE_CLIP = (() => {
  const pts = samples(mobilePoint);
  return `M0 0L${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}L1 0Z`;
})();

/**
 * The logo ribbon along an edge: offset outside the photo by `gap`, as thick
 * as `max` in the middle, tapering to a point at both ends (like the swoosh).
 */
function ribbon(point: (t: number) => Pt, outward: 1 | -1, gap: number, max: number): string {
  const inner: string[] = [];
  const outer: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const [x, y] = point(t);
    const [x2, y2] = point(Math.min(1, t + 0.001));
    const [x1, y1] = point(Math.max(0, t - 0.001));
    const tx = x2 - x1;
    const ty = y2 - y1;
    const len = Math.hypot(tx, ty) || 1;
    const nx = (outward * -ty) / len;
    const ny = (outward * tx) / len;
    const w = max * Math.pow(Math.sin(Math.PI * t), 0.9);
    inner.push(`${f(x + nx * gap)} ${f(y + ny * gap)}`);
    outer.unshift(`${f(x + nx * (gap + w))} ${f(y + ny * (gap + w))}`);
  }
  return `M${inner.join("L")}L${outer.join("L")}Z`;
}

/** Ribbon beside the desktop arc (outward = towards the white text side). */
export const DESKTOP_RIBBON = ribbon(desktopPoint, 1, 0.008, 0.016);
/** Ribbon under the mobile arc. */
export const MOBILE_RIBBON = ribbon(mobilePoint, 1, 0.012, 0.03);

/**
 * Section border under the hero (desktop), in a 1000 x 12 viewBox: flat along
 * the bottom, a point on the left, full thickness on the right where it leaves
 * the screen with the photo. Its top edge is the photo's lower limit.
 */
export const BASE_RIBBON = (() => {
  const top = samples((t) => [t * 1000, 12 - 12 * (1 - Math.pow(1 - t, 2.2))]);
  return `M${top.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(2)}`).join("L")}L1000 12L0 12Z`;
})();

/* Slide transition: the arc, shifted right by dx, sweeps across the photo. */

/** Start and end shifts so the sweeping arc enters fully left and leaves fully right. */
export const WIPE_FROM = -0.52;
export const WIPE_TO = 1.06;

const WIPE_PTS = samples(desktopPoint);

/** clip-path revealing what lies left of the arc shifted by dx (in % of the box). */
export function wipeClip(dx: number): string {
  const edge = WIPE_PTS.map(([x, y]) => `${((x + dx) * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(", ");
  return `polygon(-200% 0%, ${edge}, -200% 100%)`;
}

/** The ribbon riding just ahead of the sweeping arc (same curve, tapered). */
export const WIPE_RIBBON = ribbon(desktopPoint, -1, 0, 0.022);
