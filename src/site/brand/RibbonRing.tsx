/**
 * The TANTY logo ribbon as an elliptical ring, in a w x h box: thick at the
 * front (bottom), thin at the back (top) and on the sides, like the ribbon
 * around the word in the logo seen from slightly above. The inner ellipse is
 * the outer one shrunk and lifted, filled even-odd.
 */
export function ribbonPath(w: number, h: number, { front, back, side }: { front: number; back: number; side: number }) {
  const cx = w / 2;
  const cy = h / 2;
  const rx = cx - side;
  const ry = cy - front;
  const lift = (front - back) / 2;
  const irx = rx - side;
  const iry = ry - (front + back) / 2;
  const ellipse = (x: number, y: number, ex: number, ey: number, sweep: 0 | 1) =>
    `M${x - ex} ${y}a${ex} ${ey} 0 1 ${sweep} ${ex * 2} 0a${ex} ${ey} 0 1 ${sweep} ${-ex * 2} 0Z`;
  return `${ellipse(cx, cy, rx, ry, 0)}${ellipse(cx, cy - lift, irx, iry, 1)}`;
}

/** A flat ring, wider than tall, around a large subject. */
export const WRAP = { w: 1000, h: 300, d: ribbonPath(1000, 300, { front: 12, back: 3, side: 4 }) } as const;
/** The same, bolder, for a smaller subject (a range bubble), so it still reads as the logo ribbon. */
export const WRAP_BOLD = { w: 1000, h: 300, d: ribbonPath(1000, 300, { front: 30, back: 6, side: 8 }) } as const;

/**
 * The ring, in TANTY yellow, as a decorative layer. `part` keeps only its
 * back (top half) or its front (bottom half), so a subject can sit inside
 * the ribbon: the back drawn behind it, the front over it (see .nid-wrap-ring).
 */
export function RibbonRing({
  ring = WRAP,
  part,
  className,
}: {
  ring?: { w: number; h: number; d: string };
  part: "back" | "front";
  className?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${ring.w} ${ring.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-part={part}
      // max-w-none: the ring is often wider than its subject (globals.css caps svg at 100%).
      className={`nid-deco nid-wrap-ring max-w-none ${className ?? ""}`}
    >
      <path d={ring.d} fill="var(--nid-yellow)" fillRule="evenodd" />
    </svg>
  );
}
