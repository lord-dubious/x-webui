import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com', 'pbs.twimg.com', 'i.postimg.cc', 'utfs.io', 'cytd5kmgz6.ufs.sh'],
  },
};