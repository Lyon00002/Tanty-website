import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";
import { HOME_ONLY, RANGES_OPEN, STORE_OPEN } from "./src/site/config";

/** Pages closed while the client reviews the home page (see src/site/config.ts); the store and the range pages may stay open. */
const CLOSED_PAGES = [...(STORE_OPEN ? [] : ["/produits", "/produits/:slug"]), ...(RANGES_OPEN ? [] : ["/gammes/:slug"])];

const nextConfig: NextConfig = {
  // Development only: lets a phone on the same Wi-Fi open the dev server by the Mac's address,
  // whichever network the Mac is on (its local IPv4 addresses, read when the server starts).
  allowedDevOrigins: Object.values(networkInterfaces())
    .flat()
    .filter((i) => i?.family === "IPv4" && !i.internal)
    .map((i) => i!.address),
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // Ranges merged into TANTY Prestige, the soy porridges in their Prestige box (2026-10-21).
    const moved = ["bouillies-tanty", "tanty-lactee", "tanty-parfume"].map((slug) => ({
      source: `/gammes/${slug}`,
      destination: "/gammes/tanty-prestige",
      permanent: false,
    }));
    if (!HOME_ONLY) return moved;
    return [...moved, ...CLOSED_PAGES.map((source) => ({ source, destination: "/", permanent: false }))];
  },
};

export default nextConfig;
