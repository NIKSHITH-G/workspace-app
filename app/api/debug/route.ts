import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const info: Record<string, unknown> = {
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.version,
    env: {
      hasTursoUrl: !!process.env.TURSO_DATABASE_URL,
      hasTursoToken: !!process.env.TURSO_AUTH_TOKEN,
      tursoUrlPrefix: process.env.TURSO_DATABASE_URL?.slice(0, 30),
    },
  }

  // Test 1: can we load the adapter?
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const adapterMod = require("@prisma/adapter-libsql/web")
    info.adapterLoad = `ok — keys: ${Object.keys(adapterMod).join(", ")}`
  } catch (e: unknown) {
    info.adapterLoad = `FAIL: ${(e as Error).message}`
  }

  // Test 2: can we load the libsql web client?
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const clientMod = require("@libsql/client/web")
    info.clientLoad = `ok — keys: ${Object.keys(clientMod).slice(0, 5).join(", ")}`
  } catch (e: unknown) {
    info.clientLoad = `FAIL: ${(e as Error).message}`
  }

  // Test 3: can we load the Prisma client?
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require("@/lib/generated/prisma/client")
    info.prismaClientLoad = `ok — type: ${typeof PrismaClient}`
  } catch (e: unknown) {
    info.prismaClientLoad = `FAIL: ${(e as Error).message}`
  }

  // Test 4: full db init and query
  try {
    const { db } = await import("@/lib/db")
    const subjects = await db.subject.findMany({ select: { name: true } })
    info.dbQuery = `ok — ${subjects.length} subjects: ${subjects.map((s) => s.name).join(", ")}`
  } catch (e: unknown) {
    info.dbQuery = `FAIL: ${(e as Error).message}`
  }

  return NextResponse.json(info, { status: 200 })
}
