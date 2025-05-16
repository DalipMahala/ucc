import { webpack } from "next/dist/compiled/webpack/webpack";

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
    // legacyBrowserSupport: false,
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
    plugins: any;
    devtool: string; optimization: any; 
}, { isServer, dev }: any) => {
  if (!dev) {
    config.plugins.push(
      new webpack.IgnorePlugin({
        // Ignore any modules related to dev tools
        resourceRegExp: /dev-tools-indicator|error-overlay|inspector|next-logo/,
      })
    );
  }
  if (!isServer && !dev) {
    config.devtool = 'source-map';
  }

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
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/sitemap/players/:page.xml',
        destination: '/sitemap/players/:page',
      },
      {
        source: '/sitemap/matches/:page.xml',
        destination: '/sitemap/matches/:page',
      },
      {
        source: '/sitemap/team/:page.xml',
        destination: '/sitemap/team/:page',
      },
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
      },
    ]
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

// module.exports = nextConfig;