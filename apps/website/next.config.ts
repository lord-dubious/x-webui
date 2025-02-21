import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images:{
    remotePatterns:[
      {protocol:"https",
        hostname:"cytd5kmgz6.ufs.sh"
      },
    ]
  }
};

export default nextConfig;
