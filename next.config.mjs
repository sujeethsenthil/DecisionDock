/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed output: "export" — Vercel supports Next.js natively.
  // Static export was causing full page reloads on tab switches
  // and breaking dynamic imports, code splitting, and client navigation.
};

export default nextConfig;
