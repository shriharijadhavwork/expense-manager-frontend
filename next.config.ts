import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone/tablet testing via LAN IP in dev (Next.js blocks cross-origin HMR/chunks otherwise).
  allowedDevOrigins: ["10.201.148.171"],
};

export default nextConfig;
