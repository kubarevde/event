import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Самодостаточная сборка для Docker (см. Dockerfile)
  output: "standalone",
};

export default nextConfig;
