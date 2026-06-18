import Link from "next/link"
import { db } from "@/lib/db"
import { connection } from "next/server"

export default async function SubjectsPage() {
  await connection()
  const subjects = await db.subject.findMany({
    include: {
      sessions: {
        include: { concepts: { include: { masteryScores: true } } },
        orderBy: { index: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  })

  if (subjects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-zinc-400 text-sm">No subjects yet.</p>
          <p className="text-zinc-600 text-xs">
            Run <code className="text-zinc-400">npm run seed</code> with a source file to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-8">Subjects</h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {subjects.map((subject) => {
            const totalConcepts = subject.sessions.flatMap((s) => s.concepts).length
            const masteredConcepts = subject.sessions
              .flatMap((s) => s.concepts)
              .filter((c) => (c.masteryScores[0]?.score ?? 0) >= 0.7).length
            const completedSessions = subject.sessions.filter(
              (s) => s.concepts.length > 0,
            ).length

            return (
              <Link
                key={subject.id}
                href={`/subject/${subject.id}`}
                className="group block p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors"
              >
                <h2 className="font-medium text-white group-hover:text-zinc-100 mb-3">
                  {subject.name}
                </h2>
                <div className="flex gap-4 text-xs text-zinc-500">
                  <span>{completedSessions}/{subject.sessionCount} sessions</span>
                  {totalConcepts > 0 && (
                    <span>{masteredConcepts}/{totalConcepts} concepts mastered</span>
                  )}
                </div>
                {totalConcepts > 0 && (
                  <div className="mt-3 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${(masteredConcepts / totalConcepts) * 100}%` }}
                    />
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
