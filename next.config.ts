import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   devIndicators: false,
   env: {
      PORT: process.env.PORT || '5565',
   },
};

export default nextConfig;
