"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * A photo that waits for its file without leaving a hole, the way the NowTech
 * storefront does it. The photo is never hidden: a cached one paints at once,
 * scripts or not. Behind it, its frame (marked .nid-skeleton) shows a light
 * sweep on an almost white ground until the photo has loaded or failed; with
 * `blur` (its blurred placeholder, src/lib/blur.ts) the blurred photo shows
 * at once instead (world.css).
 */
export function Photo({ alt, onLoad, onError, blur, ...props }: ImageProps & { blur?: string }) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <Image
      {...props}
      {...(blur ? { placeholder: "blur" as const, blurDataURL: blur } : {})}
      alt={alt}
      data-state={state}
      data-blur={blur ? "" : undefined}
      // A photo already in cache has decoded before React attaches onLoad: ask the element itself.
      ref={(node) => {
        if (node?.complete && node.naturalWidth > 0) setState("loaded");
      }}
      onLoad={(e) => {
        setState("loaded");
        onLoad?.(e);
      }}
      onError={(e) => {
        setState("error");
        onError?.(e);
      }}
    />
  );
}
