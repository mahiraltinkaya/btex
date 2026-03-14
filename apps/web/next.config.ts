import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    domains: ["localhost", "127.0.0.1"],
    unoptimized: true,
    qualities: [25, 50, 75, 100],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
