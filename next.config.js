const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is now the default in Next.js 13+
  // experimental.appDir is no longer needed as it's the default in Next.js 14+
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript during production builds
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias['#'] = path.join(__dirname, '.');
    return config;
  },
};

module.exports = nextConfig;
