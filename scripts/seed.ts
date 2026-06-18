/**
 * Seed script: PDF → topic skeleton → generated content → SQLite
 *
 * Usage:
 *   npm run seed -- --pdf ./source-material/python-week1.pdf \
 *                   --subject python \
 *                   --session 1
 *
 * The two-step content boundary is enforced:
 *   1. EXTRACTION — reads PDF text, emits only concept names + ordering.
 *      Nothing from the source is stored in the DB.
 *   2. GENERATION — uses only the skeleton to write fresh explanations,
 *      cheat sheets, and flashcards from the model's field knowledge.
 */

import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { PDFParse } from "pdf-parse"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../lib/generated/prisma/client"
import { extractSkeleton, generateConcept, generateCheatSheet } from "../lib/pipeline"

const SUBJECT_CONFIG: Record<string, { name: string; slug: string; sessionCount: number }> = {
  python: {
    name: "Python for AI",
    slug: "python",
    sessionCount: 15,
  },
  database: {
    name: "Database Systems",
    slug: "database",
    sessionCount: 15,
  },
  architecture: {
    name: "Computer Architecture and Networks",
    slug: "architecture",
    sessionCount: 15,
  },
  maths: {
    name: "Mathematical Foundations for Data Science and AI",
    slug: "maths",
    sessionCount: 15,
  },
}

async function main() {
  const args = process.argv.slice(2)

  const pdfIdx = args.indexOf("--pdf")
  const subjectIdx = args.indexOf("--subject")
  const sessionIdx = args.indexOf("--session")

  const pdfArg = pdfIdx >= 0 ? args[pdfIdx + 1] : undefined
  const subjectKey = subjectIdx >= 0 ? args[subjectIdx + 1] : undefined
  const sessionIndex = sessionIdx >= 0 ? parseInt(args[sessionIdx + 1], 10) : 1

  if (!pdfArg || !subjectKey || !SUBJECT_CONFIG[subjectKey]) {
    console.error(
      `Usage: npm run seed -- --pdf <path> --subject <${Object.keys(SUBJECT_CONFIG).join("|")}> [--session <n>]`,
    )
    process.exit(1)
  }

  const pdfPath = path.resolve(pdfArg)
  if (!fs.existsSync(pdfPath)) {
    console.error(`File not found: ${pdfPath}`)
    process.exit(1)
  }

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set. Add it to .env")
    process.exit(1)
  }

  const subjectConfig = SUBJECT_CONFIG[subjectKey]
  const dbPath = path.resolve(process.cwd(), "dev.db")
  const adapter = new PrismaBetterSqlite3({ url: dbPath })
  const db = new PrismaClient({ adapter })

  try {
    console.log(`\n📖 Reading PDF: ${path.basename(pdfPath)}`)
    const pdfBuffer = fs.readFileSync(pdfPath)
    const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) })
    const { text: pdfText } = await parser.getText()

    // ─── STEP 1: EXTRACTION ─────────────────────────────────────────────────
    console.log("\n🔍 Step 1/2 — Extracting topic skeleton (no source text stored)…")
    const skeleton = await extractSkeleton(
      pdfText,
      `Session ${sessionIndex} of ${subjectConfig.name}`,
    )
    console.log(`   Session title : "${skeleton.title}"`)
    console.log(`   Concepts found: ${skeleton.concepts.length}`)
    skeleton.concepts.forEach((c, i) =>
      console.log(
        `     ${i + 1}. ${c.name}${c.prerequisites.length ? ` (needs: ${c.prerequisites.join(", ")})` : ""}`,
      ),
    )

    // ─── STEP 2: GENERATION ─────────────────────────────────────────────────
    // Only the skeleton is used from here. Source text is not passed further.
    console.log("\n✍️  Step 2/2 — Generating content from model knowledge…")

    const cheatSheet = await generateCheatSheet(skeleton, subjectConfig.name)
    console.log("   ✓ Cheat sheet")

    const generatedConcepts = []
    for (const concept of skeleton.concepts) {
      const prereqNames = concept.prerequisites.filter((p) =>
        skeleton.concepts.some((c) => c.name === p),
      )
      const gen = await generateConcept(concept, subjectConfig.name, skeleton.title, prereqNames)
      generatedConcepts.push(gen)
      console.log(`   ✓ ${concept.name}`)
    }

    // ─── DATABASE WRITE ──────────────────────────────────────────────────────
    console.log("\n💾 Writing to database…")

    const subject = await db.subject.upsert({
      where: { slug: subjectConfig.slug },
      create: {
        name: subjectConfig.name,
        slug: subjectConfig.slug,
        sessionCount: subjectConfig.sessionCount,
      },
      update: {},
    })

    // Delete existing session at this index so re-running is idempotent
    const existing = await db.session.findUnique({
      where: { subjectId_index: { subjectId: subject.id, index: sessionIndex } },
    })
    if (existing) {
      const concepts = await db.concept.findMany({ where: { sessionId: existing.id } })
      for (const concept of concepts) {
        await db.exercise.deleteMany({ where: { conceptId: concept.id } })
        await db.conceptPrereq.deleteMany({ where: { conceptId: concept.id } })
        await db.conceptPrereq.deleteMany({ where: { prereqId: concept.id } })
      }
      await db.concept.deleteMany({ where: { sessionId: existing.id } })
      await db.session.delete({ where: { id: existing.id } })
    }

    const session = await db.session.create({
      data: {
        subjectId: subject.id,
        index: sessionIndex,
        title: skeleton.title,
        cheatSheet,
      },
    })

    // First pass — create concept records
    const conceptIdMap: Record<string, string> = {}
    for (let i = 0; i < skeleton.concepts.length; i++) {
      const sk = skeleton.concepts[i]
      const gen = generatedConcepts[i]

      const concept = await db.concept.create({
        data: {
          sessionId: session.id,
          name: sk.name,
          explanation: gen.explanation,
          orderIndex: sk.orderIndex ?? i,
        },
      })
      conceptIdMap[sk.name] = concept.id

      await db.exercise.create({
        data: {
          conceptId: concept.id,
          type: "FLASHCARD",
          front: gen.flashcardFront,
          back: gen.flashcardBack,
        },
      })
    }

    // Second pass — wire prerequisite edges (within this session only)
    for (const sk of skeleton.concepts) {
      const conceptId = conceptIdMap[sk.name]
      for (const prereqName of sk.prerequisites) {
        const prereqId = conceptIdMap[prereqName]
        if (prereqId) {
          await db.conceptPrereq.create({ data: { conceptId, prereqId } })
        }
      }
    }

    console.log(`\n✅ Done — "${skeleton.title}" seeded.`)
    console.log(`   Open: http://localhost:3000/subject/${subject.id}/session/${session.id}`)
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
