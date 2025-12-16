/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sendexa.co",
        port: "",
        pathname: "/**",
      },
      //supabase images
      {
        protocol: "https",
        hostname: "evtmtescnzknoeepoce.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "https://server.sendexa.co/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
