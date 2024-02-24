import webpack from 'webpack'; // Import webpack module

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
    plugins: [] // Initialize plugins array here
};

nextConfig.plugins.push(
  new webpack.ProgressPlugin((percentage, message, ...args) => {
    // e.g. Output each progress message directly to the console:
    console.info(percentage, message, ...args);
  })
);

export default nextConfig;
