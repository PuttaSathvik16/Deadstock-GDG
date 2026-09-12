/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: [
    'washbowl-haiku-county.ngrok-free.dev',
    '*.ngrok-free.dev',
    '*.ngrok.app',
    '*.ngrok-free.app',
    '*.ngrok.io',
    'localhost:3000',
    '127.0.0.1:3000',
    '192.168.1.79',
    '192.168.1.79:3000',
    '*.local',
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
