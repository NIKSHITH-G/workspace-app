import { ollamaGenerate, MODEL } from "./ollama"
import { jsonrepair } from "jsonrepair"

function extractJSON(raw: string): string | null {
  // Model sometimes wraps JSON in ```json ... ``` fences
  const fenced = raw.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
  if (fenced) return fenced[1]
  const bare = raw.match(/\{[\s\S]*\}/)
  return bare ? bare[0] : null
}

export type ConceptSkeleton = {
  name: string
  orderIndex: number
  prerequisites: string[]
  notation?: string
}

export type SessionSkeleton = {
  title: string
  concepts: ConceptSkeleton[]
}

export type GeneratedConcept = {
  name: string
  explanation: string
  flashcardFront: string
  flashcardBack: string
}

async function generate(prompt: string, attempt = 0): Promise<string> {
  try {
    return await ollamaGenerate(prompt)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    const isConnError =
      msg.includes("ECONNREFUSED") ||
      msg.includes("fetch failed") ||
      msg.includes("connection refused")
    if (isConnError && attempt < 3) {
      const delaySec = 5 * (attempt + 1)
      process.stdout.write(`   ⏳ Ollama not responding — waiting ${delaySec}s…`)
      await new Promise((r) => setTimeout(r, delaySec * 1000))
      process.stdout.write(" retrying\n")
      return generate(prompt, attempt + 1)
    }
    if (isConnError) {
      throw new Error(
        "Cannot reach Ollama at http://localhost:11434. " +
        "Run: brew services start ollama",
      )
    }
    throw err
  }
}

/**
 * EXTRACTION STEP — reads PDF text, emits only a topic skeleton.
 * Never stores or returns sentences from the source material.
 */
export async function extractSkeleton(
  pdfText: string,
  sessionHint: string,
): Promise<SessionSkeleton> {
  const raw = await generate(
    `You are analyzing course material to extract a topic skeleton for a Python programming course session.

Session hint: "${sessionHint}"

From the following course material, extract ONLY:
1. A specific, descriptive session title (5–8 words, matching the actual topics — e.g. "Variables, Types and Assignment in Python")
2. ALL concepts the session covers — aim for 6 to 10 distinct concepts. Be thorough and granular. Each sub-topic counts as a concept.
3. The natural learning order (orderIndex starting at 0)
4. Direct prerequisite relationships between concepts in this list only

RULES:
- Do NOT copy, quote, or paraphrase any sentence from the source
- Do NOT include examples or worked problems from the source
- Concept names must be canonical Python/CS terms (e.g. "Integer Literals", "String Indexing", "Boolean Short-Circuit Evaluation")
- Extract at minimum 6 concepts — if the material covers more, include them all

Return ONLY a JSON object with this exact shape, no explanation before or after:
{
  "title": "string",
  "concepts": [
    {
      "name": "string",
      "orderIndex": 0,
      "prerequisites": ["other concept name from this list"],
      "notation": "optional Python syntax or operator"
    }
  ]
}

SOURCE MATERIAL:
---
${pdfText.slice(0, 14000)}
---`,
  )

  const jsonStr = extractJSON(raw)
  if (!jsonStr) throw new Error("Extraction: no JSON in model response")
  return JSON.parse(jsonrepair(jsonStr)) as SessionSkeleton
}

/**
 * GENERATION STEP — takes only the skeleton (never the source text) and
 * writes fresh explanations, cheat sheet content, and flashcards from the
 * model's own knowledge of the field.
 */
export async function generateConcept(
  concept: ConceptSkeleton,
  subjectName: string,
  sessionTitle: string,
  prereqNames: string[],
): Promise<GeneratedConcept> {
  const raw = await generate(
    `You are writing study material for a Python programming student. Be concrete, practical, and thorough.

Subject: ${subjectName}
Session: ${sessionTitle}
Concept: ${concept.name}
${concept.notation ? `Python syntax/notation: ${concept.notation}` : ""}
${prereqNames.length ? `Already covered (build on these, don't re-explain): ${prereqNames.join(", ")}` : ""}

Write the following using ONLY your own knowledge — do NOT reference course materials or instructors.
Use the exact delimiter lines shown — they must appear verbatim.

===EXPLANATION===
Write a rich explanation in markdown (150–220 words):
- A clear definition (1–2 sentences) with **bold** key terms
- How it works / the key mechanism
- A short runnable Python code example in a fenced \`\`\`python block
- One common mistake or gotcha prefixed with ⚠️
===END_EXPLANATION===

===FRONT===
A single question probing conceptual understanding or a common misconception about "${concept.name}". NOT a definition — make the student think.
===END_FRONT===

===BACK===
A precise, complete answer (4–6 sentences). Lead with the key insight. Include a one-line inline code example if it helps. Address the WHY, not just the WHAT.
===END_BACK===`,
  )

  function extractSection(tag: string): string {
    // Strict: content between ===TAG=== and ===END_TAG===
    const strict = raw.match(new RegExp(`===${tag}===\\s*([\\s\\S]*?)\\s*===END_${tag}===`))
    if (strict) return strict[1].trim()
    // Loose: grab everything after ===TAG=== until the next ===WORD=== marker or end
    const startIdx = raw.indexOf(`===${tag}===`)
    if (startIdx === -1) return ""
    const after = raw.slice(startIdx + tag.length + 6)
    const nextMarker = after.search(/===[A-Z_]+=/)
    return (nextMarker === -1 ? after : after.slice(0, nextMarker)).trim()
  }

  const explanation = extractSection("EXPLANATION")
  const flashcardFront = extractSection("FRONT")
  const flashcardBack = extractSection("BACK")

  if (!explanation || !flashcardFront || !flashcardBack) {
    throw new Error(`Generation: missing sections for concept "${concept.name}". Got: ${raw.slice(0, 200)}`)
  }

  return { name: concept.name, explanation, flashcardFront, flashcardBack }
}

/**
 * GENERATION STEP — cheat sheet for the whole session.
 * Written from model knowledge using only the skeleton as a guide.
 */
export async function generateCheatSheet(
  skeleton: SessionSkeleton,
  subjectName: string,
): Promise<string> {
  const conceptList = skeleton.concepts.map((c) => c.name).join(", ")

  return generate(
    `You are writing a Python cheat sheet for a masters student. Make it genuinely useful for quick revision — not a summary, but a reference card they would actually reach for.

Subject: ${subjectName}
Session: ${skeleton.title}
Concepts: ${conceptList}

Format using markdown. For each concept write:
- **Concept Name** as a heading
- One-sentence definition
- The key rule, syntax, or formula — use an inline code snippet where applicable
- A minimal runnable code example in a \`\`\`python\`\`\` block (3–6 lines max)
- One-line gotcha or pro-tip starting with ⚠️ or 💡

Keep each section tight (5–8 lines). Cover every concept listed. Total length: 400–600 words.

Write from your own knowledge. Do not reference any course, professor, or textbook.`,
  )
}
