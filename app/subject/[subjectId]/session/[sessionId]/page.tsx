import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"
import { requireStudentId } from "@/lib/access"

export default async function SessionPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]">,
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
          exercises: true,
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const totalConcepts = session.concepts.length
  const masteredConcepts = session.concepts.filter(
    (c) => (c.masteryScores[0]?.score ?? 0) >= 0.7,
  ).length
  const dueForReview = session.concepts.filter((c) => {
    const ms = c.masteryScores[0]
    if (!ms) return c.exercises.length > 0
    return new Date(ms.nextReview) <= new Date()
  }).length

  const stages = [
    {
      num: 1,
      label: t("session.conceptsLabel"),
      desc: t("session.conceptsDesc"),
      href: `concepts`,
      available: totalConcepts > 0,
    },
    {
      num: 2,
      label: t("session.cheatsheetLabel"),
      desc: t("session.cheatsheetDesc"),
      href: `cheatsheet`,
      available: !!session.cheatSheet,
    },
    {
      num: 3,
      label: t("session.graphLabel"),
      desc: t("session.graphDesc"),
      href: `graph`,
      available: totalConcepts > 0,
    },
    {
      num: 4,
      label: t("session.reviewLabel"),
      desc: t("session.reviewDesc", { due: dueForReview }),
      href: `review`,
      available: totalConcepts > 0,
    },
    {
      num: 5,
      label: t("session.analyticsLabel"),
      desc: t("session.analyticsDesc"),
      href: `analytics`,
      available: totalConcepts > 0,
    },
  ]

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav
        crumbs={[
          { label: t("nav.subjects"), href: "/subject" },
          { label: session.subject.name, href: `/subject/${subjectId}` },
          { label: t("nav.session", { index: session.index }) },
        ]}
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-baseline gap-3">
            <span className="text-xs text-zinc-600 font-mono">{t("nav.session", { index: session.index })}</span>
            <h1 className="text-2xl font-semibold tracking-tight">{session.title}</h1>
          </div>
        </div>

        {totalConcepts > 0 && (
          <div className="mb-8 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-500">{t("session.mastery")}</span>
              <span className="text-xs text-zinc-400">
                {masteredConcepts}/{totalConcepts}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${totalConcepts > 0 ? (masteredConcepts / totalConcepts) * 100 : 0}%`,
                  background: "var(--theme-primary)",
                }}
              />
            </div>
          </div>
        )}

        <div className="space-y-3">
          {stages.map((stage) => (
            <div key={stage.num}>
              {stage.available ? (
                <Link
                  href={`/subject/${subjectId}/session/${sessionId}/${stage.href}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0"
                    style={{
                      color: "var(--theme-primary)",
                      background: "color-mix(in srgb, var(--theme-primary) 12%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--theme-primary) 35%, transparent)",
                    }}
                  >
                    {stage.num}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                      {stage.label}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{stage.desc}</p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-950 border border-zinc-900 opacity-50">
                  <span className="w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs text-zinc-600 shrink-0">
                    {stage.num}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{stage.label}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">{stage.desc}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
