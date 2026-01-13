import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },

  allowedDevOrigins: [
    '*.replit.dev',
    '*.replit.app',
    '*.pike.replit.dev',
  ],

  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}

export default nextConfig
