import type { NextConfig } from "next";
import { HOME_ONLY, RANGES_OPEN, STORE_OPEN } from "./src/site/config";

/** Pages closed while the client reviews the home page (see src/site/config.ts); the store and the range pages may stay open. */
const CLOSED_PAGES = [...(STORE_OPEN ? [] : ["/produits", "/produits/:slug"]), ...(RANGES_OPEN ? [] : ["/gammes/:slug"])];

const nextConfig: NextConfig = {
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
    if (!HOME_ONLY) return [];
    return CLOSED_PAGES.map((source) => ({ source, destination: "/", permanent: false }));
  },
};

export default nextConfig;
