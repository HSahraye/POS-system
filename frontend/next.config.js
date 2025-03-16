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
    // Add a rule to handle recharts
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
}

module.exports = nextConfig 