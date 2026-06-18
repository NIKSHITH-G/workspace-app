export type SM2State = {
  repetitions: number
  easeFactor: number
  interval: number
}

export type SM2Result = SM2State & {
  nextReviewMs: number
  score: number
}

/**
 * SM-2 spaced repetition algorithm.
 * quality: 0–5 (0–2 = fail, 3 = barely passed, 4 = good, 5 = perfect)
 */
export function sm2(quality: number, state: SM2State): SM2Result {
  const q = Math.max(0, Math.min(5, Math.round(quality)))

  const newEF = Math.max(
    1.3,
    state.easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02),
  )

  let newReps: number
  let newInterval: number

  if (q < 3) {
    newReps = 0
    newInterval = 1
  } else {
    newReps = state.repetitions + 1
    if (state.repetitions === 0) {
      newInterval = 1
    } else if (state.repetitions === 1) {
      newInterval = 6
    } else {
      newInterval = Math.round(state.interval * newEF)
    }
  }

  const nowMs = Date.now()
  const nextReviewMs = nowMs + newInterval * 24 * 60 * 60 * 1000

  // Mastery score: ease with which the concept is recalled (0–1)
  const score = Math.min(1, Math.max(0, (newEF - 1.3) / (2.5 - 1.3)))

  return {
    repetitions: newReps,
    easeFactor: newEF,
    interval: newInterval,
    nextReviewMs,
    score,
  }
}

export const QUALITY_LABELS: Record<number, string> = {
  0: "Blackout",
  1: "Wrong",
  2: "Wrong (familiar)",
  3: "Correct (hard)",
  4: "Correct",
  5: "Perfect",
}

export const REVIEW_BUTTONS = [
  { quality: 1, label: "Again", shortcut: "1" },
  { quality: 3, label: "Hard", shortcut: "2" },
  { quality: 4, label: "Good", shortcut: "3" },
  { quality: 5, label: "Easy", shortcut: "4" },
] as const
