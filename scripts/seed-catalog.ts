// Seeds the subject catalog metadata (description / category / emoji / status /
// order). Upserts by slug so it's safe to re-run and never touches existing
// sessions/concepts. Run: npm run seed:catalog

import "dotenv/config"
import path from "node:path"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../lib/generated/prisma/client"

const CATALOG = [
  {
    slug: "python",
    name: "Python for AI",
    description: "Programming foundations for ML",
    category: "Programming",
    emoji: "🐍",
    status: "published",
    order: 1,
  },
  {
    slug: "database",
    name: "Database Systems",
    description: "Relational & query fundamentals",
    category: "Systems",
    emoji: "🗄️",
    status: "coming_soon",
    order: 2,
  },
  {
    slug: "architecture",
    name: "Computer Architecture & Networks",
    description: "Systems from silicon to protocol",
    category: "Systems",
    emoji: "🖥️",
    status: "coming_soon",
    order: 3,
  },
  {
    slug: "maths",
    name: "Mathematical Foundations",
    description: "Linear algebra, probability, statistics",
    category: "Math",
    emoji: "📐",
    status: "coming_soon",
    order: 4,
  },
]

async function main() {
  const adapter = new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") })
  const db = new PrismaClient({ adapter })

  for (const s of CATALOG) {
    const { slug, ...data } = s
    await db.subject.upsert({
      where: { slug },
      // don't overwrite name on existing rows that may have been seeded already,
      // but do refresh the catalog metadata
      update: { description: data.description, category: data.category, emoji: data.emoji, status: data.status, order: data.order },
      create: { slug, ...data },
    })
    console.log(`  ✓ ${slug} (${data.status})`)
  }
  console.log("Catalog seeded.")
}

main().catch((err) => {
  console.error("seed-catalog failed:", err)
  process.exit(1)
})
