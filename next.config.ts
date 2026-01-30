import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "search1.kakaocdn.net",
        pathname: "/thumb/**",
      },
      {
        protocol: "https",
        hostname: "t1.daumcdn.net",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "t1.daumcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doktori-dev-images.s3.ap-northeast-2.amazonaws.com",
        pathname: "/images/meetings/**",
      },
      {
        protocol: "https",
        hostname: "doktori-dev-images.s3.ap-northeast-2.amazonaws.com",
        pathname: "/images/profiles/**",
      },
      {
        protocol: "https",
        hostname: "cdn.example.com",
        pathname: "/meetings/**",
      },
    ],
  },
};

export default nextConfig;
