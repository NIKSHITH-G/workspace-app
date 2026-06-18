import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import Markdown from "@/components/Markdown"

export default async function ConceptsPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/concepts">,
) {
  await connection()
  const { subjectId, sessionId } = await props.params

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      subject: true,
      concepts: {
        orderBy: { orderIndex: "asc" },
        include: {
          masteryScores: { where: { studentId: "default" } },
          prerequisites: { include: { prereq: true } },
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

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
          <h1 className="text-xl font-semibold tracking-tight mt-3">Concepts</h1>
        </div>

        <div className="space-y-6">
          {session.concepts.map((concept) => {
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
                  <h2 className="font-medium text-white">{concept.name}</h2>
                  <span className={`text-xs font-mono shrink-0 ${scoreColor}`}>
                    {score > 0 ? `${Math.round(score * 100)}%` : "unseen"}
                  </span>
                </div>

                {concept.prerequisites.length > 0 && (
                  <p className="text-xs text-zinc-600 mb-3">
                    Requires:{" "}
                    {concept.prerequisites.map((p) => p.prereq.name).join(", ")}
                  </p>
                )}

                {concept.explanation ? (
                  <div className="mt-1">
                    <Markdown>{concept.explanation}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-600 italic">
                    No explanation generated yet.
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
