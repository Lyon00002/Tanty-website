/**
 * Curved edges for a coloured band, drawn as white caps over its corners so
 * the photo and colour behind are shaped too. Both edges follow the same
 * 1440 x 64 curve, dipping in the middle (the footer's curve, inverted), so
 * the band reads as one gently sagging ribbon.
 */
const CAPS = {
  top: "M0 0H1440V24Q720 88 0 24Z",
  bottom: "M0 24Q720 88 1440 24V64H0Z",
} as const;

export function BandEdge({ side }: { side: keyof typeof CAPS }) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`nid-deco pointer-events-none absolute inset-x-0 z-[2] block h-10 w-full lg:h-16 ${
        side === "top" ? "-top-px" : "-bottom-px"
      }`}
    >
      <path d={CAPS[side]} fill="#ffffff" />
    </svg>
  );
}
