/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  productionBrowserSourceMaps: true,
  experimental: {
    optimizePackageImports: [
      'lodash',
      'date-fns',
      'react-icons'
    ],
    optimizeCss: true,
    scrollRestoration: true,
    optimizeServerReact: true,
    gzipSize: true,
    // Remove unsupported options
  },
  images: {
    domains: [
      "images.entitysport.com",
      "gcdnimages.entitysport.com",
      "uccricket.live",
      "fantasykhiladi.com",
      "flagcdn.com",
      "13.202.213.65"
    ],
    formats: ['image/avif', 'image/webp'],
    loader: 'default',
    minimumCacheTTL: 60,
  },
  webpack: (config: {
    devtool: string; optimization: any; 
}, { isServer }: any) => {
    if (!isServer) {
      config.devtool = 'hidden-source-map',
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxSize: 244 * 1024,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  }
};

module.exports = nextConfig;