/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Type errors fail the build (tsc is clean). Lint stays off until an ESLint config exists.
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true, remotePatterns: [{ protocol: "https", hostname: "**" }] },
  experimental: { serverActions: { allowedOrigins: ["*"] } },
  async rewrites() {
    return [{ source: "/api/:path*", destination: "http://127.0.0.1:8001/api/:path*" }];
  },
};

export default nextConfig;
