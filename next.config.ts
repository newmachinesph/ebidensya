import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static build. No server and no route handlers: every page renders
  // from the JSON files under /data at build time.
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
