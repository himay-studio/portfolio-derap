/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the app can ship to Cloudflare Pages (R26).
  output: 'export',
  // Every route becomes a directory with index.html, so internal links that end
  // in a slash resolve to a real file on Pages (R59).
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
