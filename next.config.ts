import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep better-sqlite3 out of the server bundle entirely — it's only
  // used locally and its native binary must not be loaded on Vercel
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
