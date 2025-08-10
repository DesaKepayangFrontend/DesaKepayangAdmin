// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
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

  // Hilangkan console.log di production
  compiler: {
    removeConsole: true,
  },
}

export default nextConfig
