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
}

module.exports = nextConfig 