import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   /* config options here */
   output: 'standalone',
   devIndicators: false,
   env: {
      PORT: process.env.PORT || '5565',
      TASKMASTER_DIR: process.env.TASKMASTER_DIR,
   },
};

export default nextConfig;
