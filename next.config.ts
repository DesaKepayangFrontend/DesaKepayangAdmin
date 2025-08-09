import type { NextConfig } from "next";

// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'desakepayangbackend-production.up.railway.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // ← domain cloudinary
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig

