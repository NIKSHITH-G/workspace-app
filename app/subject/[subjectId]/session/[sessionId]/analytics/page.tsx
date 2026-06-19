import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import { getT } from "@/lib/i18n/server"
import { requireStudentId } from "@/lib/access"

export default async function AnalyticsPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/analytics">,
) {
  await connection()
  const t = await getT()
  const { subjectId, sessionId } = await props.params
  const studentId = await requireStudentId()

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      subject: true,
      concepts: {
        orderBy: { orderIndex: "asc" },
        include: {
          masteryScores: { where: { studentId } },
          exercises: {
            include: {
              attempts: {
                where: { studentId },
                orderBy: { createdAt: "asc" },
              },
            },
          },
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const now = new Date()

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href={`/subject/${subjectId}/session/${sessionId}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← {session.title}
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mt-3">{t("analytics.title")}</h1>
        </div>

        <div className="space-y-3">
          {session.concepts.map((concept) => {
            const ms = concept.masteryScores[0]
            const score = ms?.score ?? 0
            const attempts = concept.exercises.flatMap((e) => e.attempts)
            const totalAttempts = attempts.length
            const correctAttempts = attempts.filter((a) => a.correct).length
            const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : null
            const nextReview = ms?.nextReview ? new Date(ms.nextReview) : null
            const isDue = nextReview ? nextReview <= now : true
            const intervalDays = ms?.interval ?? 0

            const scoreColor =
              score >= 0.7
                ? "bg-emerald-600"
                : score >= 0.4
                ? "bg-yellow-600"
                : score > 0
                ? "bg-red-700"
                : "bg-zinc-800"

            return (
              <div
                key={concept.id}
                className="p-4 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-sm font-medium text-white">{concept.name}</h2>
                  <span className="text-xs font-mono text-zinc-400 shrink-0">
                    {score > 0 ? `${Math.round(score * 100)}%` : "—"}
                  </span>
                </div>

                {/* Mastery bar */}
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full transition-all ${scoreColor}`}
                    style={{ width: `${score * 100}%` }}
                  />
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-600">
                  {totalAttempts > 0 && (
                    <>
                      <span>{t("analytics.attempts", { count: totalAttempts })}</span>
                      {accuracy !== null && (
                        <span>{t("analytics.correct", { pct: Math.round(accuracy * 100) })}</span>
                      )}
                    </>
                  )}
                  {nextReview && (
                    <span className={isDue ? "text-yellow-600" : ""}>
                      {isDue
                        ? t("analytics.dueNow")
                        : t("analytics.nextReview", { days: intervalDays })}
                    </span>
                  )}
                  {totalAttempts === 0 && (
                    <span className="text-zinc-700">{t("analytics.notReviewed")}</span>
                  )}
                </div>

                {/* Attempt history sparkline */}
                {attempts.length > 0 && (
                  <div className="flex gap-0.5 mt-3">
                    {attempts.slice(-20).map((a, i) => (
                      <div
                        key={i}
                        title={`Q:${a.quality}`}
                        className={`h-4 flex-1 rounded-sm ${
                          a.quality >= 4
                            ? "bg-emerald-700"
                            : a.quality === 3
                            ? "bg-yellow-700"
                            : "bg-red-800"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
