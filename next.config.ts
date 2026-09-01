import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.replit.dev', '*.pike.replit.dev', '*.repl.co'],
  typescript: {
    ignoreBuildErrors: true,
  },

  webpack: (config, { dev }) => {
    /* The on-disk pack.gz cache repeatedly fails to write on this machine
       (ENOENT/EPERM on rename), which leaves an inconsistent build: the server
       returns healthy HTML while the browser gets chunks that cannot resolve,
       surfacing as "Cannot read properties of undefined (reading 'call')" in
       __webpack_exec__. Memory-only caching skips the failing subsystem and
       still caches within a session, so only cross-restart reuse is lost.
       Dev only — production builds keep the default cache.
       Note: ignored under --turbopack, which does not use this cache anyway. */
    if (dev) config.cache = { type: 'memory' }
    return config
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
}

export default nextConfig
