// ── MODO XP & leveling ──────────────────────────────────────────────
// XP is cumulative and fully derived from Attempt + MasteryScore rows,
// so it is retroactive and never needs its own storage.
//
// Level curve (quadratic / "grindy"):  xp(L) = 100 * (L-1)^2
//   L2 = 100, L3 = 400, L4 = 900, L5 = 1600, ... L9 = 6400

export const XP = {
  correctBase: 10,        // correct flashcard review
  wrongBase: 2,           // showed up, got it wrong
  qualityBonusPerPoint: 5, // per SM-2 quality point above 3 (max +2 pts)
  masteryBonus: 50,       // per concept that crossed score >= 0.7
  streakPerDay: 5,        // per active day, multiplied by streak length
  streakCapDays: 7,       // streak multiplier caps here
} as const

export type AttemptLite = { correct: boolean; quality: number; createdAt: Date }

export function xpForLevel(level: number): number {
  return 100 * Math.max(0, level - 1) ** 2
}

export function levelFromXp(totalXp: number): number {
  return Math.floor(Math.sqrt(Math.max(0, totalXp) / 100)) + 1
}

/** Progress of `totalXp` within its current level. */
export function levelProgress(totalXp: number) {
  const level = levelFromXp(totalXp)
  const floorXp = xpForLevel(level)
  const ceilXp = xpForLevel(level + 1)
  const into = totalXp - floorXp
  const span = ceilXp - floorXp
  return {
    level,
    into,
    span,
    toNext: ceilXp - totalXp,
    pct: span > 0 ? Math.round((into / span) * 100) : 0,
  }
}

function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86_400_000)
}

export type XpBreakdown = {
  total: number
  fromReviews: number
  fromMastery: number
  fromStreak: number
  currentStreak: number
}

/** XP earned for a single review attempt of the given SM-2 quality (0–5).
 * Mirrors the per-attempt logic in computeXp so the UI can show it instantly. */
export function xpForAttempt(quality: number): number {
  const correct = quality >= 3
  if (!correct) return XP.wrongBase
  const qBonus = Math.max(0, Math.min(quality - 3, 2)) * XP.qualityBonusPerPoint
  return XP.correctBase + qBonus
}

/** Compute a student's total XP from their attempts + count of mastered concepts. */
export function computeXp(attempts: AttemptLite[], masteredCount: number): XpBreakdown {
  let fromReviews = 0
  for (const a of attempts) {
    if (a.correct) {
      const qBonus = Math.max(0, Math.min(a.quality - 3, 2)) * XP.qualityBonusPerPoint
      fromReviews += XP.correctBase + qBonus
    } else {
      fromReviews += XP.wrongBase
    }
  }

  const fromMastery = masteredCount * XP.masteryBonus

  // streak XP: walk distinct active days in order, compounding consecutive ones
  const days = Array.from(new Set(attempts.map((a) => dayNumber(a.createdAt)))).sort((x, y) => x - y)
  let fromStreak = 0
  let run = 0
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && days[i] - days[i - 1] === 1 ? run + 1 : 1
    fromStreak += Math.min(run, XP.streakCapDays) * XP.streakPerDay
  }

  // current streak: trailing consecutive days ending today or yesterday
  let currentStreak = 0
  if (days.length > 0) {
    const today = dayNumber(new Date())
    let cursor = days[days.length - 1]
    if (cursor === today || cursor === today - 1) {
      currentStreak = 1
      for (let i = days.length - 2; i >= 0; i--) {
        if (days[i] === cursor - 1) {
          currentStreak++
          cursor = days[i]
        } else break
      }
    }
  }

  return {
    total: fromReviews + fromMastery + fromStreak,
    fromReviews,
    fromMastery,
    fromStreak,
    currentStreak,
  }
}
