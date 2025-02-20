import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images:{
    domains: ['lh3.googleusercontent.com', 'pbs.twimg.com', 'i.postimg.cc', 'utfs.io', 'cytd5kmgz6.ufs.sh']
  }
};

export default nextConfig;
