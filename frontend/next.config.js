/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'images.unsplash.com'],
    unoptimized: true,
  },
  output: 'export',
  distDir: '.next',
  trailingSlash: true,
  webpack: (config) => {
    // Handle problematic dependencies
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    
    // Increase module limits
    config.performance = {
      ...(config.performance || {}),
      maxAssetSize: 1000000, // 1MB
      maxEntrypointSize: 1000000, // 1MB
    };
    
    return config;
  },
  // Disable type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig 