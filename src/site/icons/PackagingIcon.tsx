import type { PackagingKind } from "@/data/products";

/*
 * Generic packaging silhouettes (64 x 80), drawn as TANTY yellow line work
 * (outline only, never inside a circle) for the product placeholders. The
 * stroke does not scale: 1.75 px at every size, like the Lucide icons. Never a label, never a fake pack: just the shape of
 * the container, so a visitor knows what kind of object to expect.
 */

const zigzag = (x0: number, x1: number, y: number, teeth: number, amp = 2.6) => {
  const step = (x1 - x0) / teeth;
  let d = `M${x0} ${y}`;
  for (let i = 0; i < teeth; i++) {
    d += `L${x0 + step * (i + 0.5)} ${y + (i % 2 === 0 ? -amp : amp)}`;
  }
  return `${d}L${x1} ${y}`;
};

const SHAPES: Record<PackagingKind, readonly string[]> = {
  sachet: [
    zigzag(12, 52, 9, 10),
    "M12 13C10 30 10 52 12 67M52 13C54 30 54 52 52 67M12 13H52M12 67H52",
    zigzag(12, 52, 71, 10),
    "M32 13V67",
  ],
  "mini-sachet": [
    zigzag(14, 50, 22, 8),
    "M14 26C12 36 12 48 14 56M50 26C52 36 52 48 50 56M14 26H50M14 56H50",
    zigzag(14, 50, 60, 8),
  ],
  etui: [
    "M14 20H44V74H14Z",
    "M14 20L22 12H52L44 20",
    "M44 74L52 66V12",
    "M18 20L24 14.5H48",
  ],
  seau: [
    "M10 24C10 20 54 20 54 24C54 28 10 28 10 24Z",
    "M11 27L16 70C16 74 48 74 48 70L53 27",
    "M13 36C24 39 40 39 51 36",
    "M10 24C10 4 54 4 54 24",
  ],
  doypack: [
    "M14 10H50",
    "M14 10C12 30 10 52 12 70C22 64 42 64 52 70C54 52 52 30 50 10",
    "M14 16H50",
    "M32 24m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0",
  ],
  flacon: [
    "M27 8H37V16H27Z",
    "M28 16V22C20 26 18 32 18 40V70C18 73 46 73 46 70V40C46 32 44 26 36 22V16",
  ],
  bouteille: [
    "M28 4H36V10H28Z",
    "M29 10V24C22 30 20 36 20 44V74C20 77 44 77 44 74V44C44 36 42 30 35 24V10",
  ],
  bidon: [
    "M12 26C12 22 16 20 20 20H48C52 20 54 22 54 26V70C54 74 50 76 46 76H18C14 76 12 74 12 70Z",
    "M30 20V10H50C53 10 54 12 54 14V20M36 20V15H48V20",
    "M14 20V12H24V20",
  ],
  inconnu: ["M16 20C16 14 48 14 48 20V70C48 76 16 76 16 70Z", "M16 26C26 30 38 30 48 26"],
};

interface PackagingIconProps {
  kind: PackagingKind;
  className?: string;
  color?: string;
  strokeWidth?: number;
}

export function PackagingIcon({ kind, className, color = "#fecc00", strokeWidth = 1.75 }: PackagingIconProps) {
  const dashed = kind === "inconnu";
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true" focusable="false">
      <g
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "4 4" : undefined}
      >
        {SHAPES[kind].map((d) => (
          <path key={d} d={d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

export const PACKAGING_LABEL: Record<PackagingKind, string> = {
  sachet: "Sachet",
  "mini-sachet": "Mini-sachet",
  etui: "Étui",
  seau: "Seau",
  doypack: "Doypack",
  flacon: "Flacon",
  bouteille: "Bouteille",
  bidon: "Bidon",
  inconnu: "Format à préciser",
};
