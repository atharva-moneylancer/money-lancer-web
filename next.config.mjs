/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Allow external images (AMC logos from third-party URLs if ever needed)
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
    // Aggressive caching for static assets
    minimumCacheTTL: 86400, // 24 hours
  },

  // Compress responses
  compress: true,

  // Strip powered-by header
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // HSTS — forces HTTPS after first visit
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Redirect legacy disclosure hash-links to new sub-pages
      {
        source: "/disclosures",
        has: [{ type: "query", key: "grievance" }],
        destination: "/disclosures/investor-grievances",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
