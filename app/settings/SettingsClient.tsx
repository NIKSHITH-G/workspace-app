"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { saveSettings } from "./actions"
import { type Theme } from "@/lib/themes"

const AVATARS = [
  { id: "owl",    emoji: "🦉", label: "Owl" },
  { id: "fox",    emoji: "🦊", label: "Fox" },
  { id: "wolf",   emoji: "🐺", label: "Wolf" },
  { id: "dragon", emoji: "🐉", label: "Dragon" },
  { id: "cat",    emoji: "🐱", label: "Cat" },
  { id: "robot",  emoji: "🤖", label: "Robot" },
]

const STYLES = [
  { id: "scholar",  label: "The Scholar",  desc: "Calm, methodical, thorough",       hex: "#3B82F6" },
  { id: "warrior",  label: "The Warrior",  desc: "Bold, fast, relentless",           hex: "#F97316" },
  { id: "shadow",   label: "The Shadow",   desc: "Sharp, quiet, precise",            hex: "#A855F7" },
  { id: "sage",     label: "The Sage",     desc: "Patient, wise, grounded",          hex: "#22C55E" },
  { id: "maverick", label: "The Maverick", desc: "Creative, bold, unconventional",   hex: "#EAB308" },
]

type Props = {
  theme: Theme
  initialName: string
  initialAvatar: string
  initialStyle: string
}

export default function SettingsClient({ theme, initialName, initialAvatar, initialStyle }: Props) {
  const [displayName, setDisplayName] = useState(initialName)
  const [avatar, setAvatar] = useState(initialAvatar)
  const [style, setStyle] = useState(initialStyle)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const selectedStyle = STYLES.find(s => s.id === style)
  const accentHex = selectedStyle?.hex ?? theme.primaryHex

  const handleSave = () => {
    startTransition(async () => {
      const fd = new FormData()
      fd.append("avatar", avatar)
      fd.append("style", style)
      fd.append("displayName", displayName.trim() || initialName)
      await saveSettings(fd)
      setSaved(true)
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 800)
    })
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white px-6 py-12 flex flex-col items-center">

      {/* back link */}
      <div className="w-full max-w-md mb-8">
        <button
          onClick={() => router.back()}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1.5"
        >
          ← Back
        </button>
      </div>

      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: accentHex }}>
            Settings
          </h1>
          <p className="text-zinc-600 text-xs mt-1">Customize your MODO identity</p>
        </div>

        {/* Username */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">Username</label>
          <input
            type="text"
            maxLength={24}
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/60 transition-colors text-sm"
            placeholder="Pick your handle"
          />
          <p className="text-[11px] text-zinc-600">This is the name shown on the leaderboard.</p>
        </section>

        {/* Avatar */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">Avatar</label>
          <div className="grid grid-cols-6 gap-2">
            {AVATARS.map(a => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className="aspect-square rounded-xl border text-2xl flex items-center justify-center transition-all duration-150"
                style={{
                  borderColor: avatar === a.id ? `${accentHex}88` : "rgba(255,255,255,0.06)",
                  background: avatar === a.id ? `${accentHex}18` : "rgba(255,255,255,0.03)",
                  boxShadow: avatar === a.id ? `0 0 12px ${accentHex}33` : "none",
                }}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </section>

        {/* Style */}
        <section className="space-y-3">
          <label className="text-xs text-zinc-500 tracking-widest uppercase font-mono">Style</label>
          <div className="space-y-2">
            {STYLES.map(s => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className="w-full p-3.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-3"
                style={{
                  borderColor: style === s.id ? `${s.hex}55` : "rgba(255,255,255,0.06)",
                  background: style === s.id ? `${s.hex}12` : "rgba(255,255,255,0.02)",
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: s.hex, boxShadow: style === s.id ? `0 0 8px ${s.hex}` : "none" }}
                />
                <div>
                  <p className="text-sm font-semibold text-white">{s.label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.desc}</p>
                </div>
                {style === s.id && (
                  <span className="ml-auto text-[10px] font-mono tracking-widest" style={{ color: s.hex }}>
                    ACTIVE
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending || saved}
          className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200"
          style={{
            background: saved ? "#22c55e" : accentHex,
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {saved ? "✓ Saved — returning…" : isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
