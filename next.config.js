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
  
  // Enable experimental features
  experimental: {
    // Enable React 18 features
    appDir: true,
    // Optimize bundle splitting
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compiler optimizations
  compiler: {
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // TypeScript configuration
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
  }
}

module.exports = nextConfig