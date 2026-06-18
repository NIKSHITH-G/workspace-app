"use client"

import { useState } from "react"
import { AVATAR_EMOJI } from "@/lib/themes"

export type Row = {
  id: string
  username: string
  avatar: string
  accent: string
  className: string
  level: number
  xp: number
  solved: number
  mastered: number
  isMe: boolean
}

type SortKey = "level" | "solved" | "mastered"

const TABS: { key: SortKey; label: string }[] = [
  { key: "level", label: "Level" },
  { key: "solved", label: "Cards Solved" },
  { key: "mastered", label: "Concepts Mastered" },
]

const MEDALS = ["#FFD700", "#C0C0C0", "#CD7F32"]

export default function LeaderboardClient({ rows }: { rows: Row[] }) {
  const [sort, setSort] = useState<SortKey>("level")

  const sorted = [...rows].sort((a, b) => {
    if (sort === "level") return b.xp - a.xp || b.solved - a.solved
    if (sort === "solved") return b.solved - a.solved || b.xp - a.xp
    return b.mastered - a.mastered || b.xp - a.xp
  })

  if (rows.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-600 text-sm">
        Be the first — solve some flashcards and you&apos;ll show up here.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* filter tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-fit">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setSort(t.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: sort === t.key ? "rgba(255,255,255,0.08)" : "transparent",
              color: sort === t.key ? "#fff" : "#71717a",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ranked list */}
      <div className="space-y-1.5">
        {sorted.map((r, i) => {
          const rank = i + 1
          const medal = MEDALS[i]
          const statValue = sort === "level" ? `LVL ${r.level}` : sort === "solved" ? `${r.solved}` : `${r.mastered}`
          const statLabel = sort === "level" ? "" : sort === "solved" ? "cards" : "mastered"

          return (
            <div
              key={r.id}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-colors"
              style={{
                background: r.isMe ? `${r.accent}10` : "rgba(255,255,255,0.02)",
                borderColor: r.isMe ? `${r.accent}55` : "rgba(255,255,255,0.05)",
              }}
            >
              {/* rank */}
              <div className="w-7 text-center shrink-0">
                {medal ? (
                  <span className="text-base" style={{ color: medal }}>●</span>
                ) : (
                  <span className="text-xs font-mono text-zinc-600">{rank}</span>
                )}
              </div>

              {/* avatar */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
                style={{ background: `${r.accent}18`, border: `1px solid ${r.accent}33` }}
              >
                {AVATAR_EMOJI[r.avatar] ?? "🦉"}
              </div>

              {/* name + class */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{r.username}</span>
                  {r.isMe && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ color: r.accent, background: `${r.accent}1f` }}>
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-mono tracking-[0.15em] opacity-80" style={{ color: r.accent }}>
                  {r.className}
                </span>
              </div>

              {/* level pill always visible */}
              <span
                className="text-[10px] font-mono px-2 py-1 rounded border shrink-0 hidden sm:inline"
                style={{ color: r.accent, borderColor: `${r.accent}44`, background: `${r.accent}11` }}
              >
                LVL {r.level}
              </span>

              {/* active stat */}
              <div className="text-right shrink-0 w-16">
                <p className="text-sm font-bold text-white leading-none">{statValue}</p>
                {statLabel && <p className="text-[9px] text-zinc-600 mt-0.5">{statLabel}</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
