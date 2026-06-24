// Pure generator for "pre-merit" leaderboard seed data — a small set of
// believable demo learners with recent, varied activity so a brand-new
// leaderboard doesn't look empty. No DB here: callers pass in real exercise /
// concept id pools (local or prod) and insert the returned rows.
//
// Every row is tagged with a `seed_*` studentId/userId so it's trivially
// removable later:
//   DELETE FROM "Attempt"      WHERE "studentId" LIKE 'seed_%';
//   DELETE FROM "MasteryScore" WHERE "studentId" LIKE 'seed_%';
//   DELETE FROM "Profile"      WHERE "userId"    LIKE 'seed_%';

import { randomUUID } from "node:crypto"

export const SEED_PREFIX = "seed_"

type Learner = {
  id: string
  displayName: string
  avatar: string // owl | cat | fox | wolf | dragon | robot
  style: string // scholar | warrior | shadow | sage | maverick
  streakDays: number // consecutive active days ending today
  attemptsPerDay: number
  mastered: number // concepts with mastery ≥ 0.7
}

// Ordered roughly strongest → weakest so the board has a natural spread (≈ L5 → L2).
const LEARNERS: Learner[] = [
  { id: "seed_01", displayName: "Aarav Mehta", avatar: "fox", style: "maverick", streakDays: 9, attemptsPerDay: 6, mastered: 20 },
  { id: "seed_02", displayName: "Priya Nair", avatar: "owl", style: "scholar", streakDays: 7, attemptsPerDay: 5, mastered: 16 },
  { id: "seed_03", displayName: "Rohan Iyer", avatar: "wolf", style: "warrior", streakDays: 6, attemptsPerDay: 5, mastered: 13 },
  { id: "seed_04", displayName: "Ananya Rao", avatar: "cat", style: "sage", streakDays: 5, attemptsPerDay: 4, mastered: 10 },
  { id: "seed_05", displayName: "Kabir Singh", avatar: "dragon", style: "shadow", streakDays: 4, attemptsPerDay: 4, mastered: 8 },
  { id: "seed_06", displayName: "Mei Lin", avatar: "robot", style: "scholar", streakDays: 4, attemptsPerDay: 3, mastered: 6 },
  { id: "seed_07", displayName: "Liam Walsh", avatar: "owl", style: "maverick", streakDays: 3, attemptsPerDay: 3, mastered: 4 },
  { id: "seed_08", displayName: "Sara Khan", avatar: "fox", style: "sage", streakDays: 2, attemptsPerDay: 3, mastered: 3 },
]

export type Pools = { exerciseIds: string[]; conceptIds: string[] }
export type SeedProfile = { userId: string; displayName: string; avatar: string; style: string }
export type SeedAttempt = { id: string; exerciseId: string; studentId: string; quality: number; correct: boolean; createdAt: Date }
export type SeedMastery = { id: string; conceptId: string; studentId: string; score: number; repetitions: number; easeFactor: number; interval: number; nextReview: Date }
export type SeedPlan = { profiles: SeedProfile[]; attempts: SeedAttempt[]; mastery: SeedMastery[] }

// Deterministic PRNG so a given build always produces the same data.
function mulberry32(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Mostly-correct, occasionally-wrong SM-2 qualities → realistic accuracy.
function pickQuality(r: number): number {
  if (r < 0.05) return 1 // wrong
  if (r < 0.15) return 3 // hard but correct
  if (r < 0.3) return 5 // easy
  return 4 // good
}

export function buildSeedPlan(pools: Pools, now: Date = new Date()): SeedPlan {
  const profiles: SeedProfile[] = []
  const attempts: SeedAttempt[] = []
  const mastery: SeedMastery[] = []
  if (pools.exerciseIds.length === 0 || pools.conceptIds.length === 0) {
    return { profiles, attempts, mastery }
  }

  // UTC noon today — anchors the streak days to whole UTC days (matches lib/xp).
  const todayNoon = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12, 0, 0)
  const DAY = 86_400_000

  LEARNERS.forEach((L, i) => {
    const rand = mulberry32(0x9e3779b1 ^ (i + 1) * 2654435761)
    profiles.push({ userId: L.id, displayName: L.displayName, avatar: L.avatar, style: L.style })

    // mastery over distinct concepts (offset per learner so they don't all overlap)
    const seen = new Set<string>()
    const offset = i * 17
    for (let j = 0; seen.size < L.mastered && j < pools.conceptIds.length; j++) {
      const cid = pools.conceptIds[(offset + j) % pools.conceptIds.length]
      if (seen.has(cid)) continue
      seen.add(cid)
      const interval = 2 + Math.floor(rand() * 6)
      mastery.push({
        id: randomUUID(),
        conceptId: cid,
        studentId: L.id,
        score: 0.72 + rand() * 0.2,
        repetitions: 2 + Math.floor(rand() * 3),
        easeFactor: 2.5,
        interval,
        nextReview: new Date(todayNoon + interval * DAY),
      })
    }

    // attempts across `streakDays` consecutive days ending today → drives XP + streak
    for (let d = 0; d < L.streakDays; d++) {
      const dayBase = todayNoon - d * DAY
      for (let k = 0; k < L.attemptsPerDay; k++) {
        const exId = pools.exerciseIds[Math.floor(rand() * pools.exerciseIds.length)]
        const quality = pickQuality(rand())
        attempts.push({
          id: randomUUID(),
          exerciseId: exId,
          studentId: L.id,
          quality,
          correct: quality >= 3,
          createdAt: new Date(dayBase + Math.floor(rand() * 8 * 3_600_000)),
        })
      }
    }
  })

  return { profiles, attempts, mastery }
}
