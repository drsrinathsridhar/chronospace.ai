import type { NextConfig } from "next";
import "./src/lib/env";

const nextConfig: NextConfig = {
  ...(process.env.STATIC_EXPORT
    ? { output: "export" as const, trailingSlash: true }
    : {}),
  images: {
    unoptimized: Boolean(process.env.STATIC_EXPORT),
    qualities: [75, 90],
  },
};

export default nextConfig;
