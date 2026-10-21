"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) in production: it keeps the
 * offline page ready and serves it when a page cannot load without a
 * connection. Left out in development, where it would get in the way.
 */
export function OfflineSupport() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
