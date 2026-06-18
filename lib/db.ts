import "server-only"
import { PrismaClient } from "./generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaLibSql } from "@prisma/adapter-libsql"
import path from "node:path"

function makeClient() {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })
    return new PrismaClient({ adapter })
  }

  const adapter = new PrismaBetterSqlite3({
    url: path.resolve(process.cwd(), "dev.db"),
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const db = globalForPrisma.prisma ?? makeClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db
