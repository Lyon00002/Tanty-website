"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * A photo that waits in a skeleton: until it has loaded, its frame (marked
 * .nid-skeleton) shows a soft light sweeping over a grey ground, then the
 * photo fades in; if it cannot load, the sweep stops (world.css). Without
 * scripts the photo shows as usual.
 */
export function Photo({ alt, onLoad, onError, ...props }: ImageProps) {
  const [state, setState] = useState<"loading" | "loaded" | "error">("loading");
  return (
    <Image
      {...props}
      alt={alt}
      data-state={state}
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
