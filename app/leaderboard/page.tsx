import { auth } from "@clerk/nextjs/server"
import { unstable_cache } from "next/cache"
import { db } from "@/lib/db"
import { connection } from "next/server"
import { getTheme } from "@/lib/themes"
import { computeXp, levelFromXp, type AttemptLite } from "@/lib/xp"
import TopNav from "@/app/TopNav"
import LeaderboardClient, { type Row } from "./LeaderboardClient"
import { getT } from "@/lib/i18n/server"
import type { TFunc } from "@/lib/i18n/t"

export const metadata = { title: "Leaderboard" }

// Safety ceiling so a flood of attempts can't OOM the lambda. Ordered newest-first;
// well above any realistic dataset — revisit (move aggregation DB-side) before it's hit.
const MAX_ROWS = 100_000

// Per-student stats with no identity attached — safe to cache (no headers/auth).
type StudentStat = {
  id: string
  xp: number
  level: number
  streak: number
  solved: number
  mastered: number
}

// The heavy work — full DB scan + per-student aggregation — is cached across requests
// so this PUBLIC endpoint can't be used to hammer the DB on every hit. The Clerk user
// lookup is deliberately NOT cached: it reads request headers, which is disallowed
// inside `unstable_cache`, and it's cheap relative to the full-table scan.
const getStudentStats = unstable_cache(
  async (): Promise<StudentStat[]> => {
    const [attemptRows, masteryRows] = await Promise.all([
      db.attempt.findMany({
        select: { studentId: true, correct: true, quality: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: MAX_ROWS,
      }),
      db.masteryScore.findMany({ select: { studentId: true, score: true }, take: MAX_ROWS }),
    ])
    return computeStats(attemptRows, masteryRows)
  },
  ["leaderboard-stats"],
  { revalidate: 60, tags: ["leaderboard"] },
)

export default async function LeaderboardPage() {
  await connection()
  const { userId: currentUserId } = await auth()

  const stats = await getStudentStats()

  // ── map ids → profiles from the LOCAL DB (was a US-region Clerk API call) ──
  const userById = new Map<string, { username: string; avatar: string; style: string }>()
  if (stats.length > 0) {
    const profiles = await db.profile.findMany({
      where: { userId: { in: stats.map((s) => s.id) } },
    })
    for (const p of profiles) {
      userById.set(p.userId, {
        username: p.displayName || "Anonymous",
        avatar: p.avatar,
        style: p.style,
      })
    }
  }

  const rows: Row[] = stats
    .filter((s) => userById.has(s.id))
    .map((s) => {
      const u = userById.get(s.id)!
      const theme = getTheme(u.style)
      return {
        id: s.id,
        username: u.username,
        avatar: u.avatar,
        accent: theme.primaryHex,
        className: theme.class,
        level: s.level,
        xp: s.xp,
        streak: s.streak,
        solved: s.solved,
        mastered: s.mastered,
        isMe: s.id === currentUserId,
      }
    })

  const t = await getT()
  return renderPage(rows, t)
}

function computeStats(
  attemptRows: { studentId: string; correct: boolean; quality: number; createdAt: Date }[],
  masteryRows: { studentId: string; score: number }[],
): StudentStat[] {

  // attempts + correct-count per student
  const attemptsByStudent = new Map<string, AttemptLite[]>()
  const solvedByStudent = new Map<string, number>()
  for (const a of attemptRows) {
    const list = attemptsByStudent.get(a.studentId) ?? []
    list.push({ correct: a.correct, quality: a.quality, createdAt: a.createdAt })
    attemptsByStudent.set(a.studentId, list)
    if (a.correct) solvedByStudent.set(a.studentId, (solvedByStudent.get(a.studentId) ?? 0) + 1)
  }

  // mastered count per student
  const masteredByStudent = new Map<string, number>()
  for (const r of masteryRows) {
    if (r.score >= 0.7) masteredByStudent.set(r.studentId, (masteredByStudent.get(r.studentId) ?? 0) + 1)
  }

  // every real student id that has any activity (exclude seed/guest "default")
  const ids = Array.from(new Set([...attemptsByStudent.keys(), ...masteredByStudent.keys()]))
    .filter((id) => id && id !== "default")

  return ids.map((id) => {
    const mastered = masteredByStudent.get(id) ?? 0
    const xp = computeXp(attemptsByStudent.get(id) ?? [], mastered)
    return {
      id,
      xp: xp.total,
      level: levelFromXp(xp.total),
      streak: xp.currentStreak,
      solved: solvedByStudent.get(id) ?? 0,
      mastered,
    }
  })
}

function renderPage(rows: Row[], t: TFunc) {
  const count = rows.length
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: t("leaderboard.title") }]} />
      <main className="max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">{t("leaderboard.title")}</h1>
          <p className="text-zinc-600 text-xs mt-1">
            {count > 0
              ? t(count === 1 ? "leaderboard.rankedOne" : "leaderboard.rankedOther", { count })
              : t("leaderboard.empty")}
          </p>
        </div>
        <LeaderboardClient rows={rows} />
      </main>
    </div>
  )
}
