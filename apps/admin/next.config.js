/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC completely for WebContainer compatibility
  swcMinify: false,
  
  // Use Babel instead of SWC
  experimental: {
    forceSwcTransforms: false,
  },
  
  // Image configuration
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },
  
  // Output configuration for better deployment
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Disable webpack cache to avoid issues
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in WebContainer
    config.cache = false;
    
    return config;
  },
}

module.exports = nextConfig