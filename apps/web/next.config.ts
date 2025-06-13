import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  images:{
    remotePatterns: [
      {protocol:"https",
        hostname:"lh3.googleusercontent.com"
      },
      {protocol:"https",
        hostname:"pbs.twimg.com"
      },
      {protocol:"https",
        hostname:"i.postimg.cc"
      },
      {protocol:"https",
        hostname:"utfs.io"
      },
      {protocol:"https",
        hostname:"cytd5kmgz6.ufs.sh"
      }]
  }
};

export default nextConfig;
