import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import FlashcardReview from "./FlashcardReview"
import { connection } from "next/server"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { localize } from "@/lib/i18n/localizeContent"

export default async function ReviewPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/review">,
) {
  await connection()
  const t = await getT()
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

  const locale = await getLocale()

  const cards = (
    await Promise.all(
      session.concepts.map(async (concept) => {
        const conceptName = await localize("concept", concept.id, "name", concept.name, locale)
        return Promise.all(
          concept.exercises.map(async (ex) => {
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

            const front = await localize("exercise", ex.id, "front", ex.front ?? concept.name, locale)
            const back = await localize("exercise", ex.id, "back", ex.back ?? "No answer stored.", locale)

            // Translate MCQ options, keeping correctOption pointing at the same choice.
            let locOptions = options
            let locCorrect = correctOption
            if (options && correctOption) {
              const correctIdx = options.indexOf(correctOption)
              locOptions = await Promise.all(
                options.map((o, i) => localize("exercise", ex.id, `option${i}`, o, locale)),
              )
              locCorrect = correctIdx >= 0 ? locOptions[correctIdx] : locOptions[0]
            }

            return {
              exerciseId: ex.id,
              conceptName,
              front,
              back,
              isDue,
              options: locOptions,
              correctOption: locCorrect,
            }
          }),
        )
      }),
    )
  ).flat()

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
          <h1 className="text-xl font-semibold tracking-tight mt-3">{t("review.title")}</h1>
        </div>

        {cards.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center mt-16">
            {t("review.noCards")}
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
