import "server-only"
import { db } from "@/lib/db"
import { localize } from "@/lib/i18n/localizeContent"
import type { Locale } from "@/lib/i18n/config"

// A due card for the cross-subject "Study Today" queue. Shape matches the
// per-session FlashcardReview Card, plus the owning subject/session so a single
// queue can span every subject (each card revalidates its own session page).
export type DueCard = {
  exerciseId: string
  conceptName: string
  front: string
  back: string
  isDue: true
  options?: string[]
  correctOption?: string
  subjectId: string
  sessionId: string
}

// A concept's flashcard is "due for review" only once it has been STUDIED (a
// mastery row exists) AND its next-review time has arrived. Cards never studied
// are NOT included here on purpose: Study Today is a global cross-subject queue,
// so brand-new cards from subjects the user hasn't started must not flood it —
// you begin a subject from the catalog, and from then on its due cards appear.
// (Mastery is per-concept, so all of a concept's cards share its due-ness.)
function isDueForReview(nextReview: Date | null | undefined, now: number): boolean {
  return !!nextReview && new Date(nextReview).getTime() <= now
}

/** Lightweight count of due flashcards across all published subjects (for the home CTA). */
export async function countDueCards(studentId: string): Promise<number> {
  const now = Date.now()
  const subjects = await db.subject.findMany({
    where: { status: "published" },
    select: {
      sessions: {
        select: {
          concepts: {
            select: {
              exercises: { where: { type: "FLASHCARD" }, select: { id: true } },
              masteryScores: { where: { studentId }, select: { nextReview: true } },
            },
          },
        },
      },
    },
  })

  let due = 0
  for (const s of subjects)
    for (const sess of s.sessions)
      for (const c of sess.concepts) {
        if (c.exercises.length === 0) continue
        if (isDueForReview(c.masteryScores[0]?.nextReview, now)) due += c.exercises.length
      }
  return due
}

/** The full due-card queue across all published subjects, localized, ordered by subject → session → concept. */
export async function getDueQueue(studentId: string, locale: Locale): Promise<DueCard[]> {
  const now = Date.now()
  const subjects = await db.subject.findMany({
    where: { status: "published" },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      sessions: {
        orderBy: { index: "asc" },
        select: {
          id: true,
          concepts: {
            orderBy: { orderIndex: "asc" },
            select: {
              id: true,
              name: true,
              exercises: { where: { type: "FLASHCARD" }, select: { id: true, front: true, back: true, content: true } },
              masteryScores: { where: { studentId }, select: { nextReview: true } },
            },
          },
        },
      },
    },
  })

  const cards: DueCard[] = []
  for (const subject of subjects) {
    for (const session of subject.sessions) {
      for (const concept of session.concepts) {
        if (!isDueForReview(concept.masteryScores[0]?.nextReview, now)) continue
        for (const ex of concept.exercises) {
          // MCQ data, if present in the content JSON
          let options: string[] | undefined
          let correctOption: string | undefined
          try {
            const content = JSON.parse(ex.content)
            if (Array.isArray(content.options) && content.options.length === 4 && content.correctOption) {
              options = content.options
              correctOption = content.correctOption
            }
          } catch {}

          const conceptName = await localize("concept", concept.id, "name", concept.name, locale)
          const front = await localize("exercise", ex.id, "front", ex.front ?? concept.name, locale)
          const back = await localize("exercise", ex.id, "back", ex.back ?? "No answer stored.", locale)

          let locOptions = options
          let locCorrect = correctOption
          if (options && correctOption) {
            const correctIdx = options.indexOf(correctOption)
            locOptions = await Promise.all(
              options.map((o, i) => localize("exercise", ex.id, `option${i}`, o, locale)),
            )
            locCorrect = correctIdx >= 0 ? locOptions[correctIdx] : locOptions[0]
          }

          cards.push({
            exerciseId: ex.id,
            conceptName,
            front,
            back,
            isDue: true,
            options: locOptions,
            correctOption: locCorrect,
            subjectId: subject.id,
            sessionId: session.id,
          })
        }
      }
    }
  }
  return cards
}
