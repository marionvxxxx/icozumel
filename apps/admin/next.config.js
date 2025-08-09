/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Netlify
  output: 'export',
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Ensure proper asset prefix for static export
  assetPrefix: '',
  
  // Disable server-side features for static export
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig