/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/kanban',
        destination: '/dashboard/kanban/index.html',
      },
      {
        source: '/dashboard/email',
        destination: '/dashboard/email/index.html',
      },
    ];
  },
}

module.exports = nextConfig
