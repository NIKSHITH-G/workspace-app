/**
 * Generates MCQ options for all FLASHCARD exercises using Ollama (free, local).
 * Updates each exercise's `content` JSON with:
 *   { options: [correct, wrong1, wrong2, wrong3], correctOption: "correct answer" }
 *
 * Requires Ollama running locally: https://ollama.ai
 *
 * Local:  tsx scripts/generate-mcq.ts
 * Turso:  TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... tsx scripts/generate-mcq.ts
 */

import { ollamaGenerate, MODEL } from "../lib/ollama"
import { PrismaClient } from "../lib/generated/prisma/client"
import path from "node:path"

async function makeDb() {
  if (process.env.TURSO_DATABASE_URL) {
    const { PrismaLibSql } = await import("@prisma/adapter-libsql/web")
    return new PrismaClient({
      adapter: new PrismaLibSql({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }),
    })
  }
  const { PrismaBetterSqlite3 } = await import("@prisma/adapter-better-sqlite3")
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: path.resolve(process.cwd(), "dev.db") }),
  })
}

async function generateMCQ(
  front: string,
  back: string,
): Promise<{ options: string[]; correctOption: string } | null> {
  const prompt = `You are creating a multiple-choice question for a study flashcard.

Question: ${front}

Full explanation (read this to understand the correct answer): ${back}

Task:
1. Write a SHORT correct answer (max 12 words, plain text only)
2. Write exactly 3 WRONG but plausible distractors (max 12 words each, plain text only)

Rules:
- All 4 options must be similar in length and style
- Distractors must be things a confused student might believe
- No code, no markdown, no bullet points — plain short phrases only

Respond with ONLY this JSON and nothing else:
{"correctOption": "...", "distractors": ["...", "...", "..."]}`

  try {
    const raw = await ollamaGenerate(prompt)

    // Extract JSON from response (model sometimes adds extra text)
    const match = raw.match(/\{[\s\S]*\}/)
    if (!match) return null

    const parsed = JSON.parse(match[0])
    if (
      typeof parsed.correctOption !== "string" ||
      !Array.isArray(parsed.distractors) ||
      parsed.distractors.length !== 3
    ) return null

    const options = [parsed.correctOption, ...parsed.distractors]
    return { options, correctOption: parsed.correctOption }
  } catch {
    return null
  }
}

async function main() {
  console.log(`Using model: ${MODEL}`)
  const db = await makeDb()

  const exercises = await db.exercise.findMany({
    where: { type: "FLASHCARD" },
    select: {
      id: true,
      front: true,
      back: true,
      content: true,
      concept: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  console.log(`Found ${exercises.length} flashcards.\n`)

  let success = 0
  let failed = 0

  for (const ex of exercises) {
    // Skip if already has MCQ options
    try {
      const existing = JSON.parse(ex.content)
      if (existing.options && existing.correctOption) {
        console.log(`  ✓ [skip] ${ex.concept.name}`)
        success++
        continue
      }
    } catch {}

    process.stdout.write(`  Generating: ${ex.concept.name}... `)

    const result = await generateMCQ(ex.front ?? ex.concept.name, ex.back ?? "")

    if (!result) {
      console.log("✗ FAILED")
      failed++
      continue
    }

    await db.exercise.update({
      where: { id: ex.id },
      data: { content: JSON.stringify(result) },
    })

    console.log("✓")
    success++
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`)
  await db.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
