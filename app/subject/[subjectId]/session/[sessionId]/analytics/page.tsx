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
          exercises: { include: { attempts: { where: { studentId }, orderBy: { createdAt: "asc" } } } },
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const now = new Date()

  // ── per-concept analysis ──
  const items = session.concepts.map((concept) => {
    const ms = concept.masteryScores[0]
    const score = ms?.score ?? 0
    const attempts = concept.exercises.flatMap((e) => e.attempts)
    const totalAttempts = attempts.length
    const correct = attempts.filter((a) => a.correct).length
    const accuracy = totalAttempts > 0 ? correct / totalAttempts : null
    const hasCards = concept.exercises.length > 0
    const nextReview = ms?.nextReview ? new Date(ms.nextReview) : null
    const due = hasCards && (!ms || (nextReview ? nextReview <= now : true))
    const intervalDays = ms?.interval ?? 0
    const tone: "new" | "learning" | "mastered" = totalAttempts === 0 ? "new" : score >= 0.7 ? "mastered" : "learning"
    return { concept, score, attempts, totalAttempts, accuracy, nextReview, due, intervalDays, tone }
  })

  // ── session summary ──
  const total = items.length
  const masteredCount = items.filter((i) => i.score >= 0.7).length
  const dueCount = items.filter((i) => i.due).length
  const totalAttempts = items.reduce((s, i) => s + i.totalAttempts, 0)
  const totalCorrect = items.reduce((s, i) => s + i.attempts.filter((a) => a.correct).length, 0)
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : null
  const masteryPct = total > 0 ? Math.round((items.reduce((s, i) => s + i.score, 0) / total) * 100) : 0

  const tile = (label: string, value: string, accent = false) => (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      <p
        className="text-2xl font-bold tabular-nums"
        style={accent ? { color: "var(--theme-primary,#6366f1)" } : undefined}
      >
        {value}
      </p>
      <p className="text-[11px] uppercase tracking-wider text-zinc-500 mt-0.5">{label}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080810] text-white">
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

        {/* summary tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {tile(t("analytics.mastery"), `${masteryPct}%`, true)}
          {tile(t("analytics.masteredLabel"), `${masteredCount}/${total}`)}
          {tile(t("analytics.due"), `${dueCount}`)}
          {tile(t("analytics.accuracy"), overallAccuracy === null ? "—" : `${overallAccuracy}%`)}
        </div>

        {/* review CTA when something is due */}
        {dueCount > 0 && (
          <Link
            href={`/subject/${subjectId}/session/${sessionId}/review`}
            className="block mb-8 rounded-2xl px-4 py-3 text-sm font-medium text-center transition-opacity hover:opacity-90"
            style={{ background: "color-mix(in srgb, var(--theme-primary,#6366f1) 18%, transparent)", color: "var(--theme-primary,#6366f1)", border: "1px solid color-mix(in srgb, var(--theme-primary,#6366f1) 35%, transparent)" }}
          >
            {t("analytics.reviewDue", { count: dueCount })}
          </Link>
        )}

        {/* per-concept */}
        <div className="space-y-2.5">
          {items.map(({ concept, score, attempts, totalAttempts, accuracy, due, intervalDays, tone }) => {
            const statusLabel =
              tone === "mastered" ? t("analytics.statusMastered") : tone === "learning" ? t("analytics.statusLearning") : t("analytics.statusNew")
            const statusCls =
              tone === "mastered"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                : tone === "learning"
                ? "border-white/10 bg-white/[0.04] text-zinc-300"
                : "border-white/[0.06] bg-transparent text-zinc-600"
            const barColor = tone === "mastered" ? "#34d399" : "var(--theme-primary,#6366f1)"

            return (
              <div key={concept.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <h2 className="text-sm font-medium text-zinc-100 truncate">{concept.name}</h2>
                    <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${statusCls}`}>{statusLabel}</span>
                    {due && tone !== "new" && (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        {t("analytics.dueNow")}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-zinc-400 shrink-0 tabular-nums">
                    {score > 0 ? `${Math.round(score * 100)}%` : "—"}
                  </span>
                </div>

                {/* mastery bar */}
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(score * 100, score > 0 ? 4 : 0)}%`, background: barColor }}
                  />
                </div>

                {/* stats + sparkline */}
                {totalAttempts > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-2.5">
                      <span>{t("analytics.attempts", { count: totalAttempts })}</span>
                      {accuracy !== null && <span>{t("analytics.correct", { pct: Math.round(accuracy * 100) })}</span>}
                      {!due && intervalDays > 0 && <span>{t("analytics.nextReview", { days: intervalDays })}</span>}
                    </div>
                    <div className="flex gap-0.5 mt-2.5">
                      {attempts.slice(-24).map((a, i) => (
                        <div
                          key={i}
                          title={`Q:${a.quality}`}
                          className={`h-4 flex-1 rounded-[2px] ${
                            a.quality >= 4 ? "bg-emerald-500/70" : a.quality === 3 ? "bg-amber-500/70" : "bg-zinc-600"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-600 mt-2.5">{t("analytics.notReviewed")}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
