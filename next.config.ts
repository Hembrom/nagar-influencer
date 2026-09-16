import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable network interface detection
  env: {
    NEXT_SKIP_NETWORK_CHECK: "true",
  },
};

export default nextConfig;
