/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  experimental: {
    // Remove appDir as it's now stable in Next.js 14
  },
  // Disable SWC to avoid compilation issues in WebContainer
  swcMinify: false,
  compiler: {
    // Use Babel instead of SWC
  },
}

module.exports = nextConfig