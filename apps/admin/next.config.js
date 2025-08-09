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
  
  // Enable Turbopack for development and production optimizations
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable React 19 features when available
    reactCompiler: true,
    // Optimize bundle splitting
    optimizePackageImports: ['@cozumel/ui', 'lucide-react'],
  },
  
  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // Enable ISR for specific pages
  async generateStaticParams() {
    return [];
  },
}

module.exports = nextConfig