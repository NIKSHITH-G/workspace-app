"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { completeOnboarding } from "./actions"

const AVATARS = [
  { id: "owl", emoji: "🦉", label: "Owl" },
  { id: "fox", emoji: "🦊", label: "Fox" },
  { id: "wolf", emoji: "🐺", label: "Wolf" },
  { id: "dragon", emoji: "🐉", label: "Dragon" },
  { id: "cat", emoji: "🐱", label: "Cat" },
  { id: "robot", emoji: "🤖", label: "Robot" },
]

const STYLES = [
  { id: "scholar", label: "The Scholar", desc: "Calm, methodical, thorough", color: "from-blue-500/20 to-indigo-500/20 border-blue-500/40" },
  { id: "warrior", label: "The Warrior", desc: "Bold, fast, relentless", color: "from-orange-500/20 to-red-500/20 border-orange-500/40" },
  { id: "shadow", label: "The Shadow", desc: "Sharp, quiet, precise", color: "from-purple-500/20 to-violet-900/20 border-purple-500/40" },
  { id: "sage", label: "The Sage", desc: "Patient, wise, grounded", color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40" },
  { id: "maverick", label: "The Maverick", desc: "Creative, bold, unconventional", color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/40" },
]

const STEP_COUNT = 3

export default function OnboardingClient() {
  const [step, setStep] = useState(0)
  const [avatar, setAvatar] = useState("")
  const [style, setStyle] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [pending, setPending] = useState(false)

  const canNext =
    (step === 0 && displayName.trim().length > 0) ||
    (step === 1 && avatar !== "") ||
    (step === 2 && style !== "")

  const handleSubmit = async () => {
    setPending(true)
    const fd = new FormData()
    fd.append("avatar", avatar)
    fd.append("style", style)
    fd.append("displayName", displayName.trim())
    await completeOnboarding(fd)
  }

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col items-center justify-center px-6">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= step ? "w-8 bg-indigo-400" : "w-4 bg-zinc-700"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="w-full max-w-sm text-center space-y-8"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight">What should we call you?</h1>
              <p className="text-zinc-500 text-sm mt-2">Your name inside MODO</p>
            </div>
            <input
              autoFocus
              type="text"
              maxLength={24}
              placeholder="Enter your name…"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canNext && setStep(1)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3.5 text-white placeholder-zinc-600 text-center text-lg focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="w-full max-w-sm text-center space-y-8"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight">Choose your avatar</h1>
              <p className="text-zinc-500 text-sm mt-2">This represents you in MODO</p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvatar(a.id)}
                  className={`p-4 rounded-2xl border transition-all duration-150 flex flex-col items-center gap-2 ${
                    avatar === a.id
                      ? "border-indigo-400 bg-indigo-500/10"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                  }`}
                >
                  <span className="text-4xl">{a.emoji}</span>
                  <span className="text-xs text-zinc-400">{a.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="style"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            className="w-full max-w-sm text-center space-y-8"
          >
            <div>
              <h1 className="text-3xl font-black tracking-tight">Pick your style</h1>
              <p className="text-zinc-500 text-sm mt-2">This shapes your MODO experience</p>
            </div>
            <div className="space-y-2.5">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`w-full p-4 rounded-2xl border bg-gradient-to-r transition-all duration-150 text-left ${s.color} ${
                    style === s.id ? "opacity-100 scale-[1.02]" : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <p className="font-semibold text-sm">{s.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-10 flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 transition-colors"
          >
            Back
          </button>
        )}
        {step < STEP_COUNT - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext}
            className="px-8 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canNext || pending}
            className="px-8 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {pending ? "Entering MODO…" : "Enter MODO →"}
          </button>
        )}
      </div>
    </div>
  )
}
