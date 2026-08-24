/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

// Next.js 16 requires the config to be defined as an async function
// (top-level await is supported for the export).
module.exports = async () => nextConfig;