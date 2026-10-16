import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        // Static brand artwork: let browsers and CDNs keep it for a week.
        source: "/assets/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/destinations", destination: "/destination", permanent: true },
      { source: "/destinations/:slug", destination: "/destination/:slug", permanent: true },
      { source: "/study-abroad", destination: "/destination", permanent: true },
      { source: "/study-abroad/:slug", destination: "/destination/:slug", permanent: true },
      { source: "/test-prep", destination: "/classes", permanent: true },
      { source: "/test-prep/:slug", destination: "/classes/:slug", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME || "localhost",
      },
      {
        // Local dev: Django serves media over plain http on the backend port.
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
    ],
  },
};

export default nextConfig;
