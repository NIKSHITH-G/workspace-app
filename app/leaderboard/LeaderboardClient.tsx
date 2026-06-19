"use client"

import { useState } from "react"
import { useT } from "@/lib/i18n/I18nProvider"
import AvatarIcon from "@/components/AvatarIcon"

export type Row = {
  id: string
  username: string
  avatar: string
  accent: string
  className: string
  level: number
  xp: number
  streak: number
  solved: number
  mastered: number
  isMe: boolean
}

type SortKey = "level" | "solved" | "mastered" | "streak"

const TABS: { key: SortKey; tKey: string }[] = [
  { key: "level", tKey: "leaderboard.tabLevel" },
  { key: "solved", tKey: "leaderboard.tabSolved" },
  { key: "mastered", tKey: "leaderboard.tabMastered" },
  { key: "streak", tKey: "leaderboard.tabStreak" },
]

const MEDALS = ["🥇", "🥈", "🥉"]

function StatCell({
  value,
  label,
  active,
  accent,
  alwaysShow,
}: {
  value: string | number
  label: string
  active: boolean
  accent: string
  alwaysShow?: boolean
}) {
  return (
    <div
      className={`px-2.5 py-1 rounded-lg text-center ${alwaysShow ? "" : "hidden sm:block"}`}
      style={{ minWidth: 52, background: active ? `${accent}1a` : "transparent" }}
    >
      <p className="text-sm font-bold leading-none tabular-nums" style={{ color: active ? accent : "#fafafa" }}>
        {value}
      </p>
      <p className="text-[8.5px] uppercase tracking-wide mt-1" style={{ color: active ? accent : "#52525b" }}>
        {label}
      </p>
    </div>
  )
}

export default function LeaderboardClient({ rows }: { rows: Row[] }) {
  const t = useT()
  const [sort, setSort] = useState<SortKey>("level")

  const sorted = [...rows].sort((a, b) => {
    if (sort === "level") return b.xp - a.xp || b.solved - a.solved
    if (sort === "solved") return b.solved - a.solved || b.xp - a.xp
    if (sort === "streak") return b.streak - a.streak || b.xp - a.xp
    return b.mastered - a.mastered || b.xp - a.xp
  })

  if (rows.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-600 text-sm">
        {t("leaderboard.emptyCta")}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* filter tabs */}
      <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.05] w-full">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSort(tab.key)}
            className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            style={{
              background: sort === tab.key ? "rgba(255,255,255,0.08)" : "transparent",
              color: sort === tab.key ? "#fff" : "#71717a",
            }}
          >
            {t(tab.tKey)}
          </button>
        ))}
      </div>

      {/* ranked list */}
      <div className="space-y-1.5">
        {sorted.map((r, i) => {
          const rank = i + 1
          const medal = MEDALS[i]

          return (
            <div
              key={r.id}
              className="flex items-center gap-3 px-3 sm:px-3.5 py-3 rounded-xl border transition-colors"
              style={{
                background: r.isMe ? `${r.accent}10` : "rgba(255,255,255,0.02)",
                borderColor: r.isMe ? `${r.accent}55` : "rgba(255,255,255,0.05)",
              }}
            >
              {/* rank */}
              <div className="w-7 flex items-center justify-center shrink-0">
                {medal ? (
                  <span className="text-lg leading-none">{medal}</span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-white/[0.04] text-[11px] font-mono text-zinc-500 flex items-center justify-center">
                    {rank}
                  </span>
                )}
              </div>

              {/* avatar */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${r.accent}18`, border: `1px solid ${r.accent}33` }}
              >
                <AvatarIcon id={r.avatar} size={20} style={{ color: r.accent }} />
              </div>

              {/* name + class + level */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{r.username}</span>
                  {r.isMe && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0" style={{ color: r.accent, background: `${r.accent}1f` }}>
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono tracking-[0.15em] opacity-80" style={{ color: r.accent }}>
                    {r.className}
                  </span>
                  <span
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded shrink-0"
                    style={{ color: r.accent, border: `1px solid ${r.accent}44`, background: `${r.accent}11` }}
                  >
                    LVL {r.level}
                  </span>
                </div>
              </div>

              {/* selected metric only */}
              <div className="shrink-0">
                {sort === "level" && <StatCell value={r.xp.toLocaleString()} label={t("leaderboard.statXp")} active accent={r.accent} alwaysShow />}
                {sort === "solved" && <StatCell value={r.solved} label={t("leaderboard.statCards")} active accent={r.accent} alwaysShow />}
                {sort === "mastered" && <StatCell value={r.mastered} label={t("leaderboard.statMastered")} active accent={r.accent} alwaysShow />}
                {sort === "streak" && <StatCell value={r.streak > 0 ? `🔥${r.streak}` : "0"} label={t("leaderboard.statStreak")} active accent={r.accent} alwaysShow />}
              </div>
            </div>
          )
        })}
      </div>

      {/* how XP works */}
      <p className="text-[11px] text-zinc-700 text-center pt-4 leading-relaxed">
        {t("leaderboard.howXp")}
        <br className="hidden sm:block" />
        {t("leaderboard.pickToShow", { settings: t("leaderboard.settingsLink") })}
      </p>
    </div>
  )
}
