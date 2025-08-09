/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Remove problematic env config that requires environment variables
  // Environment variables will be loaded automatically from .env files
}

module.exports = nextConfig