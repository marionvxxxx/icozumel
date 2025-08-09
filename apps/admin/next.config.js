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
  
  // Remove experimental appDir as it's now stable in Next.js 14
  // and the custom babel config that was causing conflicts
}

module.exports = nextConfig