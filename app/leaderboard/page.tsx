import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connection } from "next/server"
import { getTheme } from "@/lib/themes"
import TopNav from "@/app/TopNav"
import LeaderboardClient, { type Row } from "./LeaderboardClient"

export const metadata = { title: "Leaderboard" }

export default async function LeaderboardPage() {
  await connection()
  const { userId: currentUserId } = await auth()

  // ── aggregate stats per student from the DB ──
  const [solvedGroups, masteryRows] = await Promise.all([
    db.attempt.groupBy({
      by: ["studentId"],
      where: { correct: true },
      _count: { _all: true },
    }),
    db.masteryScore.findMany({ select: { studentId: true, score: true } }),
  ])

  const solvedByStudent = new Map<string, number>()
  for (const g of solvedGroups) solvedByStudent.set(g.studentId, g._count._all)

  // sum + mastered count per student
  const masteryByStudent = new Map<string, { sum: number; count: number; mastered: number }>()
  for (const r of masteryRows) {
    const m = masteryByStudent.get(r.studentId) ?? { sum: 0, count: 0, mastered: 0 }
    m.sum += r.score
    m.count += 1
    if (r.score >= 0.7) m.mastered += 1
    masteryByStudent.set(r.studentId, m)
  }

  // every real student id that has any activity (exclude seed/guest "default")
  const ids = Array.from(new Set([...solvedByStudent.keys(), ...masteryByStudent.keys()]))
    .filter((id) => id && id !== "default")

  // ── map ids → Clerk users for username / avatar / style ──
  const userById = new Map<string, { username: string; avatar: string; style: string }>()
  if (ids.length > 0) {
    try {
      const client = await clerkClient()
      const { data: users } = await client.users.getUserList({ userId: ids, limit: 200 })
      for (const u of users) {
        const meta = (u.publicMetadata ?? {}) as Record<string, string>
        const username = meta.displayName || u.username || u.firstName || "Anonymous"
        userById.set(u.id, { username, avatar: meta.avatar ?? "owl", style: meta.style ?? "scholar" })
      }
    } catch {
      // Clerk unavailable — leaderboard will just be empty
    }
  }

  const rows: Row[] = ids
    .filter((id) => userById.has(id))
    .map((id) => {
      const u = userById.get(id)!
      const m = masteryByStudent.get(id) ?? { sum: 0, count: 0, mastered: 0 }
      const avgXP = m.count > 0 ? Math.round((m.sum / m.count) * 100) : 0
      const level = Math.max(1, Math.floor(avgXP / 10) + 1)
      const theme = getTheme(u.style)
      return {
        id,
        username: u.username,
        avatar: u.avatar,
        accent: theme.primaryHex,
        className: theme.class,
        level,
        xp: avgXP,
        solved: solvedByStudent.get(id) ?? 0,
        mastered: m.mastered,
        isMe: id === currentUserId,
      }
    })

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: "Leaderboard" }]} />
      <main className="max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-black tracking-tight">Leaderboard</h1>
          <p className="text-zinc-600 text-xs mt-1">
            {rows.length > 0 ? `${rows.length} learner${rows.length === 1 ? "" : "s"} ranked` : "No ranked learners yet"}
          </p>
        </div>
        <LeaderboardClient rows={rows} />
      </main>
    </div>
  )
}
