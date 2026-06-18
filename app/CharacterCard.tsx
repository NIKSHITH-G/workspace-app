"use client"

import { type Theme, AVATAR_EMOJI } from "@/lib/themes"

type Props = {
  theme: Theme
  avatarId: string
  displayName: string
  xp: number       // 0-100 overall mastery %
  level: number
}

export default function CharacterCard({ theme, avatarId, displayName, xp, level }: Props) {
  const emoji = AVATAR_EMOJI[avatarId] ?? "🧙"

  return (
    <div
      className="relative pixel-border-pulse rounded-lg p-4 bg-[#080810] select-none"
      style={{ minWidth: 200 }}
    >
      {/* scanline overlay */}
      <div className="scanlines absolute inset-0 rounded-lg pointer-events-none" />

      {/* header row */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">CHARACTER</span>
        <span
          className="text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded border"
          style={{ color: theme.primaryHex, borderColor: `${theme.primaryHex}44`, background: `${theme.primaryHex}11` }}
        >
          LVL {level}
        </span>
      </div>

      {/* avatar + name */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="text-3xl w-12 h-12 flex items-center justify-center rounded-md border"
          style={{ borderColor: `${theme.primaryHex}33`, background: `${theme.primaryHex}0d` }}
        >
          {emoji}
        </div>
        <div>
          <p className="font-black text-white text-sm tracking-wide leading-none">
            {displayName || "PLAYER"}
          </p>
          <p
            className="text-[10px] font-mono tracking-[0.2em] mt-1"
            style={{ color: theme.primaryHex }}
          >
            ─ {theme.class} ─
          </p>
        </div>
      </div>

      {/* XP bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[9px] font-mono text-zinc-600">
          <span>MASTERY XP</span>
          <span>{xp}%</span>
        </div>
        <div className="h-2 bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800">
          <div
            className="h-full transition-all duration-700 rounded-sm"
            style={{
              width: `${xp}%`,
              background: `linear-gradient(90deg, ${theme.primaryHex}88, ${theme.primaryHex})`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
