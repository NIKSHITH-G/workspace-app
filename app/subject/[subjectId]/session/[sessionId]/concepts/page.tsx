import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import Markdown from "@/components/Markdown"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { localize } from "@/lib/i18n/localizeContent"
import { requireStudentId } from "@/lib/access"

export default async function ConceptsPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/concepts">,
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
          prerequisites: { include: { prereq: true } },
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const locale = await getLocale()
  const concepts = await Promise.all(
    session.concepts.map(async (concept) => ({
      ...concept,
      locName: await localize("concept", concept.id, "name", concept.name, locale),
      locExplanation: await localize("concept", concept.id, "explanation", concept.explanation, locale),
      locPrereqs: await Promise.all(
        concept.prerequisites.map((p) =>
          localize("concept", p.prereqId, "name", p.prereq.name, locale),
        ),
      ),
    })),
  )

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav
        crumbs={[
          { label: t("nav.subjects"), href: "/subject" },
          { label: session.subject.name, href: `/subject/${subjectId}` },
          { label: t("nav.session", { index: session.index }), href: `/subject/${subjectId}/session/${sessionId}` },
          { label: t("concepts.title") },
        ]}
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">{t("concepts.title")}</h1>
        </div>

        <div className="space-y-6">
          {concepts.map((concept) => {
            const score = concept.masteryScores[0]?.score ?? 0
            const scoreColor =
              score >= 0.7
                ? "text-emerald-400"
                : score >= 0.4
                ? "text-yellow-400"
                : "text-zinc-600"

            return (
              <div
                key={concept.id}
                className="p-5 rounded-xl bg-zinc-900 border border-zinc-800"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="font-medium text-white">{concept.locName}</h2>
                  <span className={`text-xs font-mono shrink-0 ${scoreColor}`}>
                    {score > 0 ? `${Math.round(score * 100)}%` : t("concepts.unseen")}
                  </span>
                </div>

                {concept.locPrereqs.length > 0 && (
                  <p className="text-xs text-zinc-600 mb-3">
                    {t("concepts.requires", { names: concept.locPrereqs.join(", ") })}
                  </p>
                )}

                {concept.explanation ? (
                  <div className="mt-1">
                    <Markdown>{concept.locExplanation}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 italic">
                    {t("concepts.noExplanation")}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
