import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Dev only: lets the dev server hydrate when opened via 127.0.0.1 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
