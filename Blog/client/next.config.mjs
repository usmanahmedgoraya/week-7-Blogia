/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
          port: '',
        },
        {
          protocol: 'https',
          hostname: 'daisyui.com',
          port: '',
        },
      ],
  },
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
      // Merge your custom webpack configuration
      config.plugins.push(new webpack.ProgressPlugin((percentage, message, ...args) => {
          console.info(percentage, message, ...args);
      }));

      // Important: return the modified config
      return config;
  }
};

export default nextConfig;
