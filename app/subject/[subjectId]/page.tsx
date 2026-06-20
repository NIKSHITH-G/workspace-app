import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"
import { requireStudentId } from "@/lib/access"

// Circular progress ring with the session number in the centre.
function SessionRing({
  index,
  pct,
  tone,
}: {
  index: number
  pct: number
  tone: "locked" | "none" | "progress" | "done"
}) {
  const r = 17
  const circ = 2 * Math.PI * r
  const stroke =
    tone === "done" ? "#34d399" : tone === "progress" ? "var(--theme-primary,#6366f1)" : "transparent"
  const numColor = tone === "locked" ? "#52525b" : "#e4e4e7"
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
      {pct > 0 && (
        <circle
          cx="22"
          cy="22"
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 22 22)"
        />
      )}
      <text x="22" y="23" textAnchor="middle" dominantBaseline="middle" fontSize="13" fontFamily="ui-monospace, monospace" fill={numColor}>
        {index}
      </text>
    </svg>
  )
}

export default async function SubjectPage(props: PageProps<"/subject/[subjectId]">) {
  await connection()
  const t = await getT()
  const { subjectId } = await props.params
  const studentId = await requireStudentId()

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: {
      sessions: {
        include: { concepts: { include: { masteryScores: { where: { studentId } } } } },
        orderBy: { index: "asc" },
      },
    },
  })

  if (!subject) notFound()

  const allConcepts = subject.sessions.flatMap((s) => s.concepts)
  const totalConcepts = allConcepts.length
  const totalMastered = allConcepts.filter((c) => (c.masteryScores[0]?.score ?? 0) >= 0.7).length
  const overallPct = totalConcepts > 0 ? (totalMastered / totalConcepts) * 100 : 0

  const rows = Array.from({ length: subject.sessionCount }, (_, i) => i + 1).map((idx) => {
    const session = subject.sessions.find((s) => s.index === idx)
    const concepts = session?.concepts ?? []
    const total = concepts.length
    const mastered = concepts.filter((c) => (c.masteryScores[0]?.score ?? 0) >= 0.7).length
    const pct = total > 0 ? mastered / total : 0
    const tone: "locked" | "none" | "progress" | "done" =
      total === 0 ? "locked" : mastered === total ? "done" : mastered > 0 ? "progress" : "none"
    return { idx, session, total, mastered, pct, tone }
  })

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: t("nav.subjects"), href: "/subject" }, { label: subject.name }]} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* header + overall progress */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">{subject.name}</h1>
          {totalConcepts > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>{t("subjects.conceptsMastered", { mastered: totalMastered, total: totalConcepts })}</span>
                <span className="font-mono">{Math.round(overallPct)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${overallPct}%`, background: "var(--theme-primary,#6366f1)" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* session path */}
        <div className="space-y-2">
          {rows.map(({ idx, session, total, mastered, pct, tone }) => {
            const inner = (
              <>
                <SessionRing index={idx} pct={pct} tone={tone} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium truncate ${tone === "locked" ? "text-zinc-600" : "text-zinc-100"}`}>
                    {session ? session.title : t("home.comingSoon")}
                  </p>
                  <p className="text-xs mt-0.5">
                    {tone === "locked" ? (
                      <span className="text-zinc-700">{t("session.phase2")}</span>
                    ) : tone === "done" ? (
                      <span className="text-emerald-400">{t("subjects.mastered", { mastered, total })} ✓</span>
                    ) : (
                      <span className="text-zinc-500">{t("subjects.mastered", { mastered, total })}</span>
                    )}
                  </p>
                </div>
                {session && (
                  <span className="text-zinc-600 transition-transform group-hover:translate-x-0.5">›</span>
                )}
              </>
            )

            const base = "flex items-center gap-4 p-3.5 rounded-2xl border"
            if (!session) {
              return (
                <div key={idx} className={`${base} border-dashed border-white/[0.06] bg-transparent opacity-60`}>
                  {inner}
                </div>
              )
            }
            return (
              <Link
                key={idx}
                href={`/subject/${subject.id}/session/${session.id}`}
                className={`${base} group border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200 active:scale-[0.99]`}
                style={{ borderColor: tone === "done" ? "rgba(52,211,153,0.25)" : undefined }}
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
