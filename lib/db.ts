import "server-only"
import { PrismaClient } from "./generated/prisma/client"

function makeClient() {
  if (process.env.TURSO_DATABASE_URL) {
    // Production: Turso cloud SQLite
    const { PrismaLibSql } = require("@prisma/adapter-libsql")
    return new PrismaClient({
      adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  }

  // Local: better-sqlite3 with dev.db
  const path = require("node:path")
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3")
  const adapter = new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
