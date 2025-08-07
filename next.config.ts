import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'desakepayangbackend-production.up.railway.app',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
