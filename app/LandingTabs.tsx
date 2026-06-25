"use client"

import { useState } from "react"

const ACCENT = "#6366f1"

type Subject = { id: string; name: string; emoji: string | null; category: string | null }

const TABS = [
  { id: "subjects", label: "Subjects" },
  { id: "how", label: "How it works" },
  { id: "features", label: "Features" },
] as const
type TabId = (typeof TABS)[number]["id"]

const STEPS = [
  { icon: "📚", title: "Learn", body: "Bite-size concepts with clear explanations and cheat sheets — no fluff.", accent: "#6366f1" },
  { icon: "🔁", title: "Review", body: "Spaced repetition resurfaces each card right before you'd forget it.", accent: "#a855f7" },
  { icon: "🏆", title: "Master", body: "Earn XP, build streaks, and climb the leaderboard as it sticks for good.", accent: "#eab308" },
]

const FEATURES = [
  { icon: "🧠", title: "Spaced repetition", body: "Proven SM-2 scheduling", accent: "#6366f1" },
  { icon: "✅", title: "Smart flashcards", body: "Multiple-choice & flip cards", accent: "#22c55e" },
  { icon: "🔥", title: "Streaks & XP", body: "Stay motivated daily", accent: "#f97316" },
  { icon: "📊", title: "Leaderboard", body: "Compete with other learners", accent: "#eab308" },
  { icon: "📱", title: "Installable app", body: "Add to home screen, works offline", accent: "#3b82f6" },
  { icon: "🌍", title: "10 languages", body: "Study in your language", accent: "#a855f7" },
]

// A square, gradient-tinted icon tile — the key bit of polish vs a bare emoji.
function IconTile({ emoji, accent, size = 44 }: { emoji: string; accent: string; size?: number }) {
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        fontSize: Math.round(size * 0.5),
        background: `linear-gradient(135deg, ${accent}26, ${accent}0d)`,
        border: `1px solid ${accent}33`,
        boxShadow: `inset 0 1px 0 ${accent}1f`,
      }}
    >
      {emoji}
    </div>
  )
}

// Tabbed section under the hero — one compact switcher instead of three stacked
// sections. "Subjects" pulls live data; the others are static.
export default function LandingTabs({ subjects }: { subjects: Subject[] }) {
  const [tab, setTab] = useState<TabId>("subjects")

  return (
    <section className="relative z-10 px-6 pb-20 max-w-4xl mx-auto w-full">
      {/* tab bar */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
                style={active ? { background: ACCENT } : undefined}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* SUBJECTS */}
      {tab === "subjects" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="group flex flex-col items-center text-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.04]"
            >
              <IconTile emoji={s.emoji ?? "📘"} accent={ACCENT} size={52} />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-zinc-100 leading-snug">{s.name}</span>
                {s.category && (
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600">{s.category}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* HOW IT WORKS */}
      {tab === "how" && (
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.07] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-white/[0.16]"
              style={{ background: `linear-gradient(160deg, ${step.accent}14, rgba(255,255,255,0.015) 55%)` }}
            >
              {/* oversized faded step numeral */}
              <span className="pointer-events-none absolute -top-3 right-1 text-8xl font-black leading-none text-white/[0.035] select-none">
                {i + 1}
              </span>
              <div className="relative z-10">
                <IconTile emoji={step.icon} accent={step.accent} size={48} />
                <h3 className="mt-4 flex items-center gap-2 font-semibold text-base text-zinc-100">
                  <span className="font-mono text-[11px]" style={{ color: step.accent }}>
                    0{i + 1}
                  </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-500 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FEATURES */}
      {tab === "features" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="group flex items-start gap-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.04]"
            >
              <IconTile emoji={f.icon} accent={f.accent} size={42} />
              <div className="min-w-0 pt-0.5">
                <div className="text-sm font-semibold text-zinc-100">{f.title}</div>
                <div className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{f.body}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
