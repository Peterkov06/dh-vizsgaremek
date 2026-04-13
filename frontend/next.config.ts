import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true, // ← ignores all TS errors during build
  },
  // eslint: {
  //   ignoreDuringBuilds: true, // ← ignores eslint errors too
  // },
};

export default nextConfig;
