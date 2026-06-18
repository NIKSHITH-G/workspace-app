/**
 * Generates MCQ options for all FLASHCARD exercises using Claude.
 * Updates each exercise's `content` JSON with:
 *   { options: [correct, wrong1, wrong2, wrong3], correctOption: "correct answer" }
 *
 * Run: ANTHROPIC_API_KEY=... TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... tsx scripts/generate-mcq.ts
 */

import Anthropic from "@anthropic-ai/sdk"
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
  client: Anthropic,
  front: string,
  back: string,
): Promise<{ options: string[]; correctOption: string } | null> {
  const prompt = `You are creating a multiple-choice question for a study flashcard.

Question: ${front}

Full explanation (use this to understand the correct answer): ${back}

Task: Create a short correct answer (max 15 words) and exactly 3 plausible but WRONG distractors (max 15 words each).

Rules:
- The correct answer must be accurate and concise
- Distractors must be plausible — things a confused student might believe
- All 4 options must be similar in length and style
- Do NOT include "All of the above" or "None of the above"

Respond with ONLY valid JSON, no explanation:
{"correctOption": "...", "distractors": ["...", "...", "..."]}`

  try {
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    })

    const text = msg.content[0].type === "text" ? msg.content[0].text.trim() : ""
    const parsed = JSON.parse(text)

    if (!parsed.correctOption || !Array.isArray(parsed.distractors) || parsed.distractors.length !== 3) {
      return null
    }

    const options = [parsed.correctOption, ...parsed.distractors]
    return { options, correctOption: parsed.correctOption }
  } catch (e) {
    console.error("  Parse error:", e)
    return null
  }
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY is required")
    process.exit(1)
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const db = await makeDb()

  const exercises = await db.exercise.findMany({
    where: { type: "FLASHCARD" },
    select: { id: true, front: true, back: true, content: true, concept: { select: { name: true } } },
  })

  console.log(`Found ${exercises.length} flashcards. Generating MCQ options...\n`)

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

    const result = await generateMCQ(client, ex.front ?? ex.concept.name, ex.back ?? "")

    if (!result) {
      console.log("FAILED")
      failed++
      continue
    }

    await db.exercise.update({
      where: { id: ex.id },
      data: { content: JSON.stringify(result) },
    })

    console.log("✓")
    success++

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200))
  }

  console.log(`\nDone: ${success} succeeded, ${failed} failed`)
  await db.$disconnect()
}

main().catch((e) => { console.error(e); process.exit(1) })
