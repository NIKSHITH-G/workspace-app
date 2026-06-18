import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep better-sqlite3 out of the server bundle entirely — it's only
  // used locally and its native binary must not be loaded on Vercel
  // better-sqlite3 has a native .node binary — keep it out of the Turbopack bundle
  // (only used locally; Vercel uses Turso via the pure-JS web client instead)
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
};

export default nextConfig;
