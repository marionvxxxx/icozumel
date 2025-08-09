/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  // Disable SWC to avoid WebContainer issues
  swcMinify: false,
  // Ensure proper transpilation
  transpilePackages: ['@cozumel/ui', '@cozumel/database', '@cozumel/i18n'],
  // Disable experimental features that might cause issues
  experimental: {},
  // Output standalone for better deployment
  output: 'standalone',
}

module.exports = nextConfig