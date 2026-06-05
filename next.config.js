/** @type {import('next').NextConfig} */

// Backend (inferred Laravel replacement) runs as a separate service on 8047.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8047';

const nextConfig = {
  // Slim production server in .next/standalone for Docker/deploy.
  output: 'standalone',
  allowedDevOrigins: ['120.55.37.39'],
  async rewrites() {
    // Proxy the inferred backend API to the standalone backend, so client
    // components keep calling relative URLs (no CORS) exactly as the original
    // Vue code did: "/" + window.Laravel.code + "/…".
    return [
      { source: '/:lang/get/csrf', destination: `${BACKEND_URL}/:lang/get/csrf` },
      { source: '/:lang/set/cookies/pref', destination: `${BACKEND_URL}/:lang/set/cookies/pref` },
      { source: '/:lang/career', destination: `${BACKEND_URL}/:lang/career` },
    ];
  },
};

module.exports = nextConfig;
