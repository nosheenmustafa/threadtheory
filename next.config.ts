import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ... existing config options ...
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
