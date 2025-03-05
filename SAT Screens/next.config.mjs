/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  optimizeFonts: false,
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      minimize: false
    };
    return config
  }
};

export default nextConfig;