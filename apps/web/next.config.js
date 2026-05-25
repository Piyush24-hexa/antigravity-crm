/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@antigravity/shared'],
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

module.exports = nextConfig;
