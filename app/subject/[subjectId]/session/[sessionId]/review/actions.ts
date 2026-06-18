"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { sm2 } from "@/lib/sm2"

export async function submitAttempt(
  exerciseId: string,
  quality: number,
  confidence: number | null,
  subjectId: string,
  sessionId: string,
) {
  const exercise = await db.exercise.findUnique({
    where: { id: exerciseId },
    include: {
      concept: {
        include: { masteryScores: { where: { studentId: "default" } } },
      },
    },
  })
  if (!exercise) throw new Error("Exercise not found")

  const existing = exercise.concept.masteryScores[0]
  const state = existing
    ? {
        repetitions: existing.repetitions,
        easeFactor: existing.easeFactor,
        interval: existing.interval,
      }
    : { repetitions: 0, easeFactor: 2.5, interval: 1 }

  const result = sm2(quality, state)

  await db.$transaction([
    db.attempt.create({
      data: {
        exerciseId,
        studentId: "default",
        quality,
        confidence,
        correct: quality >= 3,
      },
    }),
    db.masteryScore.upsert({
      where: { conceptId_studentId: { conceptId: exercise.conceptId, studentId: "default" } },
      create: {
        conceptId: exercise.conceptId,
        studentId: "default",
        score: result.score,
        repetitions: result.repetitions,
        easeFactor: result.easeFactor,
        interval: result.interval,
        nextReview: new Date(result.nextReviewMs),
      },
      update: {
        score: result.score,
        repetitions: result.repetitions,
        easeFactor: result.easeFactor,
        interval: result.interval,
        nextReview: new Date(result.nextReviewMs),
      },
    }),
  ])

  revalidatePath(`/subject/${subjectId}/session/${sessionId}`)
}
