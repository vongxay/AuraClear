/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: 'out',
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    scrollRestoration: true,
  },
  transpilePackages: ['framer-motion', 'lucide-react'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Reduce bundle size by excluding unnecessary dependencies
  webpack: (config) => {
    return config;
  },
  // Enable brotli compression for better performance
  compress: true,
  poweredByHeader: false,
  // Disable tracing to avoid permission issues
  tracePageData: false,
  generateEtags: false,
};

module.exports = nextConfig;
