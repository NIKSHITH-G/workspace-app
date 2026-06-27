"use client"

import { useState } from "react"
import Link from "next/link"

export type GraphNode = {
  id: string
  name: string
  status: "mastered" | "learning" | "new"
  left: number
  top: number
}
export type GraphEdge = { from: string; to: string; x1: number; y1: number; x2: number; y2: number }

const STATUS: Record<GraphNode["status"], { bg: string; border: string; dot: string }> = {
  mastered: { bg: "rgba(52,211,153,0.12)", border: "rgba(52,211,153,0.55)", dot: "#34d399" },
  learning: { bg: "rgba(99,102,241,0.14)", border: "rgba(99,102,241,0.55)", dot: "#818cf8" },
  new: { bg: "rgba(255,255,255,0.025)", border: "rgba(255,255,255,0.1)", dot: "#71717a" },
}

export default function ConceptGraph({
  nodes,
  edges,
  width,
  height,
  nodeW,
  nodeH,
  conceptsHref,
}: {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
  nodeW: number
  nodeH: number
  conceptsHref: string
}) {
  const [hover, setHover] = useState<string | null>(null)

  const edgeActive = (e: GraphEdge) => hover === null || e.from === hover || e.to === hover
  const nodeActive = (id: string) =>
    hover === null ||
    id === hover ||
    edges.some((e) => (e.from === hover && e.to === id) || (e.to === hover && e.from === id))

  return (
    <div className="overflow-x-auto pb-2">
      <div className="relative mx-auto" style={{ width, height }}>
        {/* edges */}
        <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
          <defs>
            <marker id="ah" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#818cf8" />
            </marker>
            <marker id="ahd" markerWidth="7" markerHeight="7" refX="5.5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.12)" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const on = edgeActive(e)
            const midY = (e.y1 + e.y2) / 2
            return (
              <path
                key={i}
                d={`M ${e.x1} ${e.y1} C ${e.x1} ${midY}, ${e.x2} ${midY}, ${e.x2} ${e.y2}`}
                fill="none"
                stroke={on ? "rgba(129,140,248,0.7)" : "rgba(255,255,255,0.08)"}
                strokeWidth={on ? 1.7 : 1.2}
                markerEnd={on ? "url(#ah)" : "url(#ahd)"}
                style={{ transition: "stroke 0.15s" }}
              />
            )
          })}
        </svg>

        {/* nodes */}
        {nodes.map((n) => {
          const c = STATUS[n.status]
          const on = nodeActive(n.id)
          return (
            <Link
              key={n.id}
              href={conceptsHref}
              onMouseEnter={() => setHover(n.id)}
              onMouseLeave={() => setHover(null)}
              className="absolute flex items-center justify-center text-center rounded-xl border px-2.5 transition-all duration-150"
              style={{
                left: n.left,
                top: n.top,
                width: nodeW,
                height: nodeH,
                background: c.bg,
                borderColor: c.border,
                opacity: on ? 1 : 0.3,
                transform: hover === n.id ? "scale(1.04)" : "scale(1)",
                boxShadow: hover === n.id ? `0 6px 20px ${c.dot}33` : "none",
              }}
            >
              <span
                className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full"
                style={{ background: c.dot }}
              />
              <span className="text-[11px] font-medium leading-tight text-zinc-100 line-clamp-3">{n.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
