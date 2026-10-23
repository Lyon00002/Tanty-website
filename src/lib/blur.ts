import placeholders from "@/data/blur-placeholders.json";

/**
 * The blurred placeholder of a photograph in /public (scripts/make-blur-placeholders.mjs),
 * shown while it loads. Server side only: client components receive it through their props,
 * so the whole table never ships to the browser.
 */
export function blurFor(src: string): string | undefined {
  return (placeholders as Record<string, string>)[src];
}
