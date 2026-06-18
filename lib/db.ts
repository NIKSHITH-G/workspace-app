import "server-only"
import { PrismaClient } from "./generated/prisma/client"
import path from "node:path"

function makeClient() {
  if (process.env.TURSO_DATABASE_URL) {
    // Production (Vercel): Turso cloud SQLite
    // Lazy-loaded so native libsql binary is resolved from node_modules at runtime
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaLibSql } = require("@prisma/adapter-libsql")
    return new PrismaClient({
      adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  }

  // Local dev: better-sqlite3
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") }),
  })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
