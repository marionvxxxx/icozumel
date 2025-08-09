/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  // Completely disable SWC to avoid WebContainer issues
  swcMinify: false,
  compiler: {
    // Force use of Babel instead of SWC
  },
  // Remove experimental settings that cause issues
  experimental: {},
  // Disable webpack optimization that might use SWC
  webpack: (config, { dev, isServer }) => {
    // Disable SWC loader
    config.module.rules.forEach((rule) => {
      if (rule.use && rule.use.loader === 'next-swc-loader') {
        rule.use.loader = 'babel-loader';
      }
    });
    return config;
  },
}

module.exports = nextConfig