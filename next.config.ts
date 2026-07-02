import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // output: 'export', // раскомментируй для статического хостинга без Node.js
};

export default nextConfig;
