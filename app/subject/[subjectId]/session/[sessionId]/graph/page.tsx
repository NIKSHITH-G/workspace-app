import Link from "next/link"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { db } from "@/lib/db"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { localize } from "@/lib/i18n/localizeContent"
import { requireStudentId } from "@/lib/access"
import ConceptGraph, { type GraphNode, type GraphEdge } from "@/components/ConceptGraph"

const NODE_W = 150
const NODE_H = 58
const H_GAP = 28
const V_GAP = 76

export default async function GraphPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/graph">,
) {
  await connection()
  const t = await getT()
  const { subjectId, sessionId } = await props.params
  const studentId = await requireStudentId()
  const locale = await getLocale()

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      subject: true,
      concepts: {
        orderBy: { orderIndex: "asc" },
        include: {
          prerequisites: true, // ConceptPrereq rows: this concept depends on prereqId
          masteryScores: { where: { studentId } },
        },
      },
    },
  })
  if (!session || session.subject.id !== subjectId) notFound()

  const concepts = session.concepts
  const inSession = new Set(concepts.map((c) => c.id))

  // edges (prereq → dependent) within this session + prereq lookup for leveling
  const edgesRaw: { from: string; to: string }[] = []
  const prereqsOf = new Map<string, string[]>()
  for (const c of concepts) {
    for (const pr of c.prerequisites) {
      if (!inSession.has(pr.prereqId)) continue
      edgesRaw.push({ from: pr.prereqId, to: c.id })
      const list = prereqsOf.get(c.id) ?? []
      list.push(pr.prereqId)
      prereqsOf.set(c.id, list)
    }
  }

  // longest-path leveling: a concept sits one row below its deepest prerequisite
  const level = new Map<string, number>()
  const visiting = new Set<string>()
  const levelOf = (id: string): number => {
    const cached = level.get(id)
    if (cached !== undefined) return cached
    if (visiting.has(id)) return 0 // cycle guard (shouldn't happen — prereqs are a DAG)
    visiting.add(id)
    const ps = prereqsOf.get(id) ?? []
    const l = ps.length ? 1 + Math.max(...ps.map(levelOf)) : 0
    visiting.delete(id)
    level.set(id, l)
    return l
  }
  concepts.forEach((c) => levelOf(c.id))

  // group by level (preserving orderIndex), then position
  const byLevel = new Map<number, string[]>()
  for (const c of concepts) {
    const l = level.get(c.id)!
    const list = byLevel.get(l) ?? []
    list.push(c.id)
    byLevel.set(l, list)
  }
  const maxLevel = concepts.reduce((m, c) => Math.max(m, level.get(c.id)!), 0)
  let contentW = 0
  for (const ids of byLevel.values()) contentW = Math.max(contentW, ids.length * NODE_W + (ids.length - 1) * H_GAP)
  const contentH = (maxLevel + 1) * NODE_H + maxLevel * V_GAP

  const pos = new Map<string, { left: number; top: number }>()
  for (const [l, ids] of byLevel) {
    const rowW = ids.length * NODE_W + (ids.length - 1) * H_GAP
    const startX = (contentW - rowW) / 2
    ids.forEach((id, i) => pos.set(id, { left: startX + i * (NODE_W + H_GAP), top: l * (NODE_H + V_GAP) }))
  }

  const nodes: GraphNode[] = await Promise.all(
    concepts.map(async (c) => {
      const score = c.masteryScores[0]?.score ?? null
      const status: GraphNode["status"] = score === null ? "new" : score >= 0.7 ? "mastered" : "learning"
      const p = pos.get(c.id)!
      return {
        id: c.id,
        name: await localize("concept", c.id, "name", c.name, locale),
        status,
        left: p.left,
        top: p.top,
      }
    }),
  )

  const edges: GraphEdge[] = edgesRaw.map((e) => {
    const a = pos.get(e.from)!
    const b = pos.get(e.to)!
    return {
      from: e.from,
      to: e.to,
      x1: a.left + NODE_W / 2,
      y1: a.top + NODE_H,
      x2: b.left + NODE_W / 2,
      y2: b.top,
    }
  })

  const legend: [GraphNode["status"], string, string][] = [
    ["mastered", t("analytics.statusMastered"), "#34d399"],
    ["learning", t("analytics.statusLearning"), "#818cf8"],
    ["new", t("analytics.statusNew"), "#71717a"],
  ]

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-6">
          <Link
            href={`/subject/${subjectId}/session/${sessionId}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← {session.title}
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mt-3">{t("session.graphLabel")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("session.graphDesc")}</p>
        </div>

        {/* legend */}
        <div className="flex items-center gap-5 mb-6 text-xs text-zinc-500">
          {legend.map(([, label, color]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>

        {edgesRaw.length === 0 ? (
          <p className="text-sm text-zinc-600 text-center mt-10">
            These concepts have no prerequisite links — they can be studied in any order.
          </p>
        ) : null}

        <ConceptGraph
          nodes={nodes}
          edges={edges}
          width={contentW}
          height={contentH}
          nodeW={NODE_W}
          nodeH={NODE_H}
          conceptsHref={`/subject/${subjectId}/session/${sessionId}/concepts`}
        />
      </div>
    </div>
  )
}
