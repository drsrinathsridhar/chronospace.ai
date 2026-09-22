import type { NextConfig } from "next";
import "./src/lib/env";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
};

export default nextConfig;
