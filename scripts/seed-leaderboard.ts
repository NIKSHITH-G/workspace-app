/**
 * Seed "pre-merit" demo learners into the leaderboard (local dev.db).
 * Run: npx tsx scripts/seed-leaderboard.ts
 *
 * Re-runnable: wipes any existing seed_* rows first. Prod seeding lives in
 * migrate-prod (guarded, one-time). All rows are tagged seed_* — remove with:
 *   DELETE FROM "Attempt"/"MasteryScore" WHERE "studentId" LIKE 'seed_%';
 *   DELETE FROM "Profile" WHERE "userId" LIKE 'seed_%';
 */

import path from "node:path"
import { buildSeedPlan, SEED_PREFIX } from "./seed-leaderboard-data"
import { computeXp, levelFromXp, type AttemptLite } from "../lib/xp"

async function main() {
  const { PrismaClient } = await import("../lib/generated/prisma/client")
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3")
  const dbPath = path.resolve(process.cwd(), "dev.db")
  const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: dbPath }) })

  try {
    const [exercises, concepts] = await Promise.all([
      db.exercise.findMany({ where: { type: "FLASHCARD" }, select: { id: true } }),
      db.concept.findMany({ select: { id: true } }),
    ])
    const plan = buildSeedPlan({
      exerciseIds: exercises.map((e) => e.id),
      conceptIds: concepts.map((c) => c.id),
    })

    // wipe prior seed rows so this is idempotent
    await db.attempt.deleteMany({ where: { studentId: { startsWith: SEED_PREFIX } } })
    await db.masteryScore.deleteMany({ where: { studentId: { startsWith: SEED_PREFIX } } })
    await db.profile.deleteMany({ where: { userId: { startsWith: SEED_PREFIX } } })

    await db.profile.createMany({ data: plan.profiles })
    await db.masteryScore.createMany({ data: plan.mastery })
    await db.attempt.createMany({ data: plan.attempts })

    // preview: compute what the leaderboard will actually show
    console.log(`\n🌱 Seeded ${plan.profiles.length} demo learners — leaderboard preview:\n`)
    console.log("  RANK  NAME            LVL    XP   🔥   solved  mastered")
    const rows = plan.profiles.map((p) => {
      const atts: AttemptLite[] = plan.attempts
        .filter((a) => a.studentId === p.userId)
        .map((a) => ({ correct: a.correct, quality: a.quality, createdAt: a.createdAt }))
      const mastered = plan.mastery.filter((m) => m.studentId === p.userId).length
      const xp = computeXp(atts, mastered)
      return {
        name: p.displayName,
        level: levelFromXp(xp.total),
        xp: xp.total,
        streak: xp.currentStreak,
        solved: atts.filter((a) => a.correct).length,
        mastered,
      }
    })
    rows.sort((a, b) => b.xp - a.xp)
    rows.forEach((r, i) =>
      console.log(
        `  ${String(i + 1).padStart(2)}.   ${r.name.padEnd(14)}  L${r.level}  ${String(r.xp).padStart(5)}  ${String(r.streak).padStart(2)}   ${String(r.solved).padStart(5)}   ${String(r.mastered).padStart(5)}`,
      ),
    )
    console.log("")
  } finally {
    await db.$disconnect()
  }
}

if (process.argv[1]?.includes("seed-leaderboard")) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
