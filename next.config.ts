import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  // Disable Turbopack to fix Google Fonts issue in Next.js 16
  experimental: {
    turbopack: false,
  },
};

export default nextConfig;
