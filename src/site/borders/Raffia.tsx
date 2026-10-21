
/*
 * Couture de raphia. Two stitches:
 * - RaffiaSeam: a running stitch (surpiqûre) around a rounded box, for cards.
 */

interface SeamProps {
  /** Distance from the box edge, in px. */
  inset?: number;
  radius?: number;
  color?: string;
  className?: string;
}

export function RaffiaSeam({ inset = 9, radius = 16, color = "#c8a047", className }: SeamProps) {
  return (
    <svg
      className={`nid-deco absolute ${className ?? ""}`}
      style={{ inset, width: `calc(100% - ${inset * 2}px)`, height: `calc(100% - ${inset * 2}px)` }}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <rect
        width="100%"
        height="100%"
        rx={radius}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray="9 7"
        strokeLinecap="round"
      />
      <rect
        width="100%"
        height="100%"
        rx={radius}
        fill="none"
        stroke="#fff6d6"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeDasharray="5 11"
        strokeDashoffset="-2"
        strokeLinecap="round"
      />
    </svg>
  );
}
