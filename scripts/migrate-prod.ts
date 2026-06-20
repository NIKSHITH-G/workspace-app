// Idempotent production schema sync for Turso, run during the Vercel build
// (where TURSO_DATABASE_URL / TURSO_AUTH_TOKEN are present even though they're
// "Sensitive" and can't be pulled locally). Locally — where those vars are
// absent — this is a no-op, so `next build` against the file DB is unaffected.
//
// Keep every statement additive + idempotent: it runs on every deploy.

import { createClient, type Client } from "@libsql/client/web"
import { randomUUID } from "node:crypto"
import { SESSIONS, cardFor } from "./seed-math-static"

const NEW_SUBJECT_COLUMNS: { name: string; ddl: string }[] = [
  { name: "description", ddl: `ALTER TABLE "Subject" ADD COLUMN "description" TEXT` },
  { name: "category", ddl: `ALTER TABLE "Subject" ADD COLUMN "category" TEXT` },
  { name: "emoji", ddl: `ALTER TABLE "Subject" ADD COLUMN "emoji" TEXT` },
  { name: "status", ddl: `ALTER TABLE "Subject" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published'` },
  { name: "order", ddl: `ALTER TABLE "Subject" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0` },
]

const CATALOG = [
  { slug: "python", name: "Python for AI", description: "Programming foundations for ML", category: "Programming", emoji: "🐍", status: "published", order: 1 },
  { slug: "database", name: "Database Systems", description: "Relational & query fundamentals", category: "Systems", emoji: "🗄️", status: "coming_soon", order: 2 },
  { slug: "architecture", name: "Computer Architecture & Networks", description: "Systems from silicon to protocol", category: "Systems", emoji: "🖥️", status: "coming_soon", order: 3 },
  { slug: "maths", name: "Mathematical Foundations", description: "Linear algebra, probability, statistics", category: "Math", emoji: "📐", status: "published", order: 4 },
]

async function addMissingSubjectColumns(db: Client) {
  const info = await db.execute(`PRAGMA table_info("Subject")`)
  const existing = new Set(info.rows.map((r) => String(r.name)))
  for (const col of NEW_SUBJECT_COLUMNS) {
    if (existing.has(col.name)) continue
    await db.execute(col.ddl)
    console.log(`  + Subject.${col.name}`)
  }
}

async function ensureContentTranslation(db: Client) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "ContentTranslation" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "entity" TEXT NOT NULL,
      "entityId" TEXT NOT NULL,
      "field" TEXT NOT NULL,
      "locale" TEXT NOT NULL,
      "text" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS "ContentTranslation_entity_entityId_field_locale_key"
      ON "ContentTranslation"("entity","entityId","field","locale")`)
  console.log("  ✓ ContentTranslation table + unique index")
}

async function ensureProfile(db: Client) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS "Profile" (
      "userId" TEXT NOT NULL PRIMARY KEY,
      "displayName" TEXT,
      "avatar" TEXT NOT NULL DEFAULT 'owl',
      "style" TEXT NOT NULL DEFAULT 'scholar',
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`)
  console.log("  ✓ Profile table")
}

// One-time backfill: mirror every existing Clerk user into the local Profile
// table so the leaderboard (which now reads Profile, not Clerk) isn't empty.
async function backfillProfiles(db: Client) {
  if (!process.env.CLERK_SECRET_KEY) {
    console.log("  · no CLERK_SECRET_KEY — skipping profile backfill")
    return
  }
  const { createClerkClient } = await import("@clerk/backend")
  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
  let offset = 0
  let total = 0
  for (;;) {
    const { data } = await clerk.users.getUserList({ limit: 100, offset })
    if (data.length === 0) break
    for (const u of data) {
      const meta = (u.publicMetadata ?? {}) as Record<string, string>
      const displayName = meta.displayName || u.username || u.firstName || null
      await db.execute({
        sql: `INSERT INTO "Profile" ("userId","displayName","avatar","style","updatedAt")
              VALUES (?,?,?,?,CURRENT_TIMESTAMP)
              ON CONFLICT("userId") DO UPDATE SET
                "displayName"=excluded."displayName","avatar"=excluded."avatar","style"=excluded."style"`,
        args: [u.id, displayName, meta.avatar ?? "owl", meta.style ?? "scholar"],
      })
      total++
    }
    offset += data.length
  }
  console.log(`  ✓ backfilled ${total} profile(s) from Clerk`)
}

// Seed the Mathematical Foundations content ONCE (skips if sessions exist, so
// deploys never wipe progress). Uses the raw libsql client that's proven to work
// in the Vercel build — avoids the Prisma driver-adapter entirely.
async function seedMathContent(db: Client) {
  const subj = await db.execute(`SELECT "id" FROM "Subject" WHERE "slug"='maths'`)
  const mathsId = subj.rows[0]?.id as string | undefined
  if (!mathsId) {
    console.log("  · maths subject not found — skipping math content")
    return
  }
  const cnt = await db.execute({
    sql: `SELECT COUNT(*) AS n FROM "Session" WHERE "subjectId"=?`,
    args: [mathsId],
  })
  if (Number(cnt.rows[0].n) > 0) {
    // Already seeded — only re-seed if the content is the OLD flip format (no MCQ
    // options), as a one-time upgrade to MCQ. If it's already MCQ, leave it alone.
    const sample = await db.execute({
      sql: `SELECT e."content" AS content FROM "Exercise" e
            JOIN "Concept" c ON c.id = e."conceptId"
            JOIN "Session" s ON s.id = c."sessionId"
            WHERE s."subjectId"=? LIMIT 1`,
      args: [mathsId],
    })
    const isMcq = String(sample.rows[0]?.content ?? "").includes('"options"')
    if (isMcq) {
      console.log(`  · maths already seeded as MCQ — skipping`)
      return
    }
    console.log(`  ⟳ upgrading maths to MCQ — clearing old flip-card content…`)
    const sub = `(SELECT c.id FROM "Concept" c JOIN "Session" s ON s.id=c."sessionId" WHERE s."subjectId"=?)`
    await db.batch(
      [
        { sql: `DELETE FROM "Attempt" WHERE "exerciseId" IN (SELECT id FROM "Exercise" WHERE "conceptId" IN ${sub})`, args: [mathsId] },
        { sql: `DELETE FROM "Exercise" WHERE "conceptId" IN ${sub}`, args: [mathsId] },
        { sql: `DELETE FROM "MasteryScore" WHERE "conceptId" IN ${sub}`, args: [mathsId] },
        { sql: `DELETE FROM "ConceptPrereq" WHERE "conceptId" IN ${sub} OR "prereqId" IN ${sub}`, args: [mathsId, mathsId] },
        { sql: `DELETE FROM "Concept" WHERE "sessionId" IN (SELECT id FROM "Session" WHERE "subjectId"=?)`, args: [mathsId] },
        { sql: `DELETE FROM "Session" WHERE "subjectId"=?`, args: [mathsId] },
      ],
      "write",
    )
  }

  const stmts: { sql: string; args: (string | number)[] }[] = []
  for (const s of SESSIONS) {
    const sid = randomUUID()
    stmts.push({
      sql: `INSERT INTO "Session" ("id","subjectId","index","title","cheatSheet","createdAt") VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)`,
      args: [sid, mathsId, s.index, s.title, s.cheatSheet],
    })
    const cids: Record<string, string> = {}
    for (const c of s.concepts) {
      const cid = randomUUID()
      cids[c.name] = cid
      stmts.push({
        sql: `INSERT INTO "Concept" ("id","sessionId","name","explanation","orderIndex","createdAt") VALUES (?,?,?,?,?,CURRENT_TIMESTAMP)`,
        args: [cid, sid, c.name, c.explanation, c.orderIndex],
      })
      const card = cardFor(c)
      stmts.push({
        sql: `INSERT INTO "Exercise" ("id","conceptId","type","front","back","content","createdAt") VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)`,
        args: [randomUUID(), cid, "FLASHCARD", card.front, card.back, card.content],
      })
    }
    for (const c of s.concepts) {
      for (const p of c.prerequisites) {
        if (cids[p]) {
          stmts.push({
            sql: `INSERT INTO "ConceptPrereq" ("conceptId","prereqId") VALUES (?,?)`,
            args: [cids[c.name], cids[p]],
          })
        }
      }
    }
  }
  await db.batch(stmts, "write")
  console.log(`  ✓ seeded ${SESSIONS.length} math sessions`)
}

async function seedCatalog(db: Client) {
  for (const s of CATALOG) {
    await db.execute({
      sql: `INSERT INTO "Subject" ("id","name","slug","sessionCount","description","category","emoji","status","order","createdAt")
            VALUES (?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP)
            ON CONFLICT("slug") DO UPDATE SET
              "description"=excluded."description","category"=excluded."category",
              "emoji"=excluded."emoji","status"=excluded."status","order"=excluded."order"`,
      args: [randomUUID(), s.name, s.slug, 15, s.description, s.category, s.emoji, s.status, s.order],
    })
    console.log(`  ✓ catalog: ${s.slug} (${s.status})`)
  }
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL
  if (!url) {
    console.log("[migrate-prod] no TURSO_DATABASE_URL — skipping (local build).")
    return
  }
  console.log("[migrate-prod] syncing Turso schema…")
  const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN })
  await addMissingSubjectColumns(db)
  await ensureContentTranslation(db)
  await ensureProfile(db)
  await seedCatalog(db)
  await seedMathContent(db)
  await backfillProfiles(db)
  console.log("[migrate-prod] done.")
}

main().catch((err) => {
  console.error("[migrate-prod] FAILED:", err)
  process.exit(1)
})
