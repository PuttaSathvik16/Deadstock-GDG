/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'washbowl-haiku-county.ngrok-free.dev',
    '*.ngrok-free.dev',
    '*.ngrok.app',
    '*.ngrok.io',
    'localhost:3000',
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;
