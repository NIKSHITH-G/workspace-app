import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import FlashcardReview from "./FlashcardReview"
import { connection } from "next/server"

export default async function ReviewPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/review">,
) {
  await connection()
  const { subjectId, sessionId } = await props.params
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  const studentId = userId

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      subject: true,
      concepts: {
        orderBy: { orderIndex: "asc" },
        include: {
          exercises: {
            where: { type: "FLASHCARD" },
          },
          masteryScores: { where: { studentId } },
        },
      },
    },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const now = new Date()

  const cards = session.concepts.flatMap((concept) =>
    concept.exercises.map((ex) => {
      const ms = concept.masteryScores[0]
      const isDue = !ms || new Date(ms.nextReview) <= now

      // Parse MCQ data from content JSON if present
      let options: string[] | undefined
      let correctOption: string | undefined
      try {
        const content = JSON.parse(ex.content)
        if (Array.isArray(content.options) && content.options.length === 4 && content.correctOption) {
          options = content.options
          correctOption = content.correctOption
        }
      } catch {}

      return {
        exerciseId: ex.id,
        conceptName: concept.name,
        front: ex.front ?? concept.name,
        back: ex.back ?? "No answer stored.",
        isDue,
        options,
        correctOption,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href={`/subject/${subjectId}/session/${sessionId}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← {session.title}
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mt-3">Review</h1>
        </div>

        {cards.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center mt-16">
            No flashcards yet. Run the seed script to generate exercises.
          </p>
        ) : (
          <FlashcardReview
            cards={cards}
            subjectId={subjectId}
            sessionId={sessionId}
          />
        )}
      </div>
    </div>
  )
}
