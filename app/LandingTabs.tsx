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
  { icon: "📚", title: "Learn", body: "Bite-size concepts with clear explanations and cheat sheets — no fluff." },
  { icon: "🔁", title: "Review", body: "Spaced repetition resurfaces each card right before you'd forget it." },
  { icon: "🏆", title: "Master", body: "Earn XP, build streaks, and climb the leaderboard as it sticks for good." },
]

const FEATURES: [string, string, string][] = [
  ["🧠", "Spaced repetition", "Proven SM-2 scheduling"],
  ["✅", "Smart flashcards", "Multiple-choice & flip cards"],
  ["🔥", "Streaks & XP", "Stay motivated daily"],
  ["📊", "Leaderboard", "Compete with other learners"],
  ["📱", "Installable app", "Add to home screen, works offline"],
  ["🌍", "10 languages", "Study in your language"],
]

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
                  active ? "text-white" : "text-zinc-400 hover:text-white"
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
              className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-5 flex flex-col items-center text-center gap-2"
            >
              <span className="text-3xl">{s.emoji ?? "📘"}</span>
              <span className="text-sm font-medium text-zinc-200 leading-snug">{s.name}</span>
              {s.category && <span className="text-[10px] uppercase tracking-wider text-zinc-600">{s.category}</span>}
            </div>
          ))}
        </div>
      )}

      {/* HOW IT WORKS */}
      {tab === "how" && (
        <div className="grid sm:grid-cols-3 gap-4">
          {STEPS.map((step, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="text-3xl mb-3">{step.icon}</div>
              <h3 className="font-semibold text-zinc-100 mb-1.5">
                <span style={{ color: ACCENT }} className="font-mono text-xs mr-2">
                  0{i + 1}
                </span>
                {step.title}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* FEATURES */}
      {tab === "features" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FEATURES.map(([icon, title, body], i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-sm font-medium text-zinc-200">{title}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{body}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
