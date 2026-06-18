import { auth, clerkClient } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connection } from "next/server"
import { getTheme } from "@/lib/themes"
import { computeXp, levelFromXp, type AttemptLite } from "@/lib/xp"
import TopNav from "@/app/TopNav"
import LeaderboardClient, { type Row } from "./LeaderboardClient"

export const metadata = { title: "Leaderboard" }

export default async function LeaderboardPage() {
  await connection()
  const { userId: currentUserId } = await auth()

  // ── pull raw rows and aggregate per student in JS ──
  const [attemptRows, masteryRows] = await Promise.all([
    db.attempt.findMany({ select: { studentId: true, correct: true, quality: true, createdAt: true } }),
    db.masteryScore.findMany({ select: { studentId: true, score: true } }),
  ])

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
      const mastered = masteredByStudent.get(id) ?? 0
      const xp = computeXp(attemptsByStudent.get(id) ?? [], mastered)
      const theme = getTheme(u.style)
      return {
        id,
        username: u.username,
        avatar: u.avatar,
        accent: theme.primaryHex,
        className: theme.class,
        level: levelFromXp(xp.total),
        xp: xp.total,
        streak: xp.currentStreak,
        solved: solvedByStudent.get(id) ?? 0,
        mastered,
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
