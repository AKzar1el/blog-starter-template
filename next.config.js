/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    // Define image sizes for smaller viewports
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Optimize image formats
    formats: ['image/webp'],
    // Minimize layout shift with explicit dimensions
    minimumCacheTTL: 60,
  },
  // Strip console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactStrictMode: true,
  // Optimize package imports to reduce bundle size
  experimental: {
    optimizePackageImports: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-raw', 'highlight.js'],
  },
}

module.exports = nextConfig
