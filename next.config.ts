/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true, // Enable compression

  images: {
    domains: [
      "images.entitysport.com",
      "gcdnimages.entitysport.com",
      "uccricket.live",
      "fantasykhiladi.com",
      "flagcdn.com",
    ],
  },

  webpack: (config: { optimization: { splitChunks: { chunks: string; minSize: number; maxSize: number; }; }; }, { isServer }: any) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 200000,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
