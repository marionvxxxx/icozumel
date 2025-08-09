/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Disable SWC for WebContainer compatibility
  swcMinify: false,
  
  // Use Babel instead of SWC
  experimental: {
    forceSwcTransforms: false,
  },
  
  // Disable webpack cache to avoid issues
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in WebContainer
    config.cache = false;
    
    return config;
  },
}

module.exports = nextConfig