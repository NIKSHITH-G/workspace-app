import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { connection } from "next/server"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"

export default async function SubjectPage(props: PageProps<"/subject/[subjectId]">) {
  await connection()
  const t = await getT()
  const { subjectId } = await props.params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  const studentId = userId

  const subject = await db.subject.findUnique({
    where: { id: subjectId },
    include: {
      sessions: {
        include: {
          concepts: {
            include: { masteryScores: { where: { studentId } } },
          },
        },
        orderBy: { index: "asc" },
      },
    },
  })

  if (!subject) notFound()

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: t("nav.subjects"), href: "/subject" }, { label: subject.name }]} />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{subject.name}</h1>
        </div>

        {/* Session heatmap grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {Array.from({ length: subject.sessionCount }, (_, i) => i + 1).map((idx) => {
            const session = subject.sessions.find((s) => s.index === idx)
            const concepts = session?.concepts ?? []
            const totalC = concepts.length
            const masteredC = concepts.filter(
              (c) => (c.masteryScores[0]?.score ?? 0) >= 0.7,
            ).length
            const avgScore =
              totalC > 0
                ? concepts.reduce(
                    (sum, c) => sum + (c.masteryScores[0]?.score ?? 0),
                    0,
                  ) / totalC
                : 0

            const heatColor =
              totalC === 0
                ? "bg-zinc-900 border-zinc-800"
                : avgScore >= 0.7
                ? "bg-emerald-900/60 border-emerald-700"
                : avgScore >= 0.4
                ? "bg-yellow-900/50 border-yellow-700"
                : "bg-red-900/40 border-red-800"

            if (!session) {
              return (
                <div
                  key={idx}
                  className="aspect-square rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-1"
                >
                  <span className="text-xs text-zinc-600 font-mono">{idx}</span>
                </div>
              )
            }

            return (
              <Link
                key={idx}
                href={`/subject/${subject.id}/session/${session.id}`}
                className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 transition-opacity hover:opacity-80 ${heatColor}`}
              >
                <span className="text-xs text-zinc-400 font-mono">{idx}</span>
                {totalC > 0 && (
                  <span className="text-[10px] text-zinc-500">
                    {masteredC}/{totalC}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Session list */}
        <div className="mt-10 space-y-2">
          {subject.sessions.map((session) => {
            const totalC = session.concepts.length
            const masteredC = session.concepts.filter(
              (c) => (c.masteryScores[0]?.score ?? 0) >= 0.7,
            ).length

            return (
              <Link
                key={session.id}
                href={`/subject/${subject.id}/session/${session.id}`}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs text-zinc-600 font-mono w-4 text-right">
                    {session.index}
                  </span>
                  <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                    {session.title}
                  </span>
                </div>
                {totalC > 0 && (
                  <span className="text-xs text-zinc-500">
                    {t("subjects.mastered", { mastered: masteredC, total: totalC })}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
