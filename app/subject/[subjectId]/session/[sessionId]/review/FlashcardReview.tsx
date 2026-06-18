"use client"

import { useState, useEffect, useTransition, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { submitAttempt } from "./actions"
import Markdown from "@/components/Markdown"

type Card = {
  exerciseId: string
  conceptName: string
  front: string
  back: string
  isDue: boolean
  // MCQ fields — present when options are seeded
  options?: string[]      // all 4 options (correct + 3 distractors)
  correctOption?: string  // the correct option text
}

type Props = {
  cards: Card[]
  subjectId: string
  sessionId: string
}

// Deterministic 32-bit string hash (FNV-ish) for seeding the shuffle.
function hashString(str: string): number {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return (h ^ (h >>> 16)) >>> 0
}

// Seeded Fisher–Yates (mulberry32 PRNG). Same seed → same order on server AND
// client, so the MCQ options never cause a hydration mismatch.
function seededShuffle<T>(arr: T[], seedStr: string): T[] {
  const a = [...arr]
  let s = hashString(seedStr) || 1
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffled options memo — deterministic per card (stable across SSR + hydration).
function useShuffledOptions(options: string[] | undefined, seed: string) {
  return useMemo(() => (options ? seededShuffle(options, seed) : undefined), [options, seed])
}

function MCQCard({
  card,
  onResult,
  isPending,
}: {
  card: Card
  onResult: (correct: boolean) => void
  isPending: boolean
}) {
  const shuffled = useShuffledOptions(card.options, card.exerciseId)
  const [selected, setSelected] = useState<string | null>(null)
  const revealed = selected !== null

  const pick = (option: string) => {
    if (revealed || isPending) return
    setSelected(option)
  }

  useEffect(() => {
    if (!revealed) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onResult(selected === card.correctOption)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [revealed, selected, card.correctOption, onResult])

  return (
    <div className="space-y-5">
      {/* Question */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 min-h-32 flex items-center justify-center text-center">
        <Markdown>{card.front}</Markdown>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2.5">
        {shuffled!.map((opt) => {
          const isCorrect = opt === card.correctOption
          const isSelected = opt === selected

          let style = "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
          if (revealed && isCorrect) style = "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
          else if (revealed && isSelected && !isCorrect) style = "border-red-500/60 bg-red-500/10 text-red-300"
          else if (revealed) style = "border-zinc-800 bg-zinc-900 text-zinc-600 opacity-50"

          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={revealed || isPending}
              className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm transition-all duration-150 ${style}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Explanation after answering */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
            <Markdown>{card.back}</Markdown>
          </div>
          <button
            onClick={() => onResult(selected === card.correctOption)}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white transition-colors disabled:opacity-40"
          >
            {isPending ? "Saving…" : "Next →"}
            <span className="text-zinc-500 text-xs ml-2 font-normal">Enter</span>
          </button>
        </motion.div>
      )}

      {!revealed && (
        <p className="text-xs text-zinc-600 text-center">Choose an answer</p>
      )}
    </div>
  )
}

function FlipCard({
  card,
  onRate,
  isPending,
}: {
  card: Card
  onRate: (quality: number) => void
  isPending: boolean
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [card.exerciseId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && !flipped) { e.preventDefault(); setFlipped(true); return }
      if (flipped && !isPending) {
        if (e.key === "1") onRate(1)
        if (e.key === "2") onRate(3)
        if (e.key === "3") onRate(4)
        if (e.key === "4") onRate(5)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [flipped, isPending, onRate])

  return (
    <div className="space-y-5">
      <div
        className="relative cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => !flipped && setFlipped(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={flipped ? "back" : "front"}
            initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`min-h-48 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 ${
              flipped ? "flex flex-col justify-center" : "flex flex-col items-center justify-center text-center"
            }`}
          >
            {flipped ? (
              <div className="text-left w-full text-sm text-zinc-300">
                <Markdown>{card.back}</Markdown>
              </div>
            ) : (
              <>
                <div className="text-center"><Markdown>{card.front}</Markdown></div>
                <p className="text-xs text-zinc-600 mt-4">tap to reveal · space</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {[
            { quality: 1, label: "Again", key: "1" },
            { quality: 3, label: "Hard", key: "2" },
            { quality: 4, label: "Good", key: "3" },
            { quality: 5, label: "Easy", key: "4" },
          ].map((btn) => (
            <button
              key={btn.quality}
              onClick={() => onRate(btn.quality)}
              disabled={isPending}
              className="py-2.5 rounded-xl text-xs font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-40 transition-colors"
            >
              <span className="block">{btn.label}</span>
              <span className="block text-zinc-600 text-[10px] mt-0.5 font-mono">{btn.key}</span>
            </button>
          ))}
        </div>
      )}
      {!flipped && (
        <p className="text-xs text-zinc-600 text-center">tap card or press space to reveal</p>
      )}
    </div>
  )
}

export default function FlashcardReview({ cards, subjectId, sessionId }: Props) {
  const due = cards.filter((c) => c.isDue)
  const notDue = cards.filter((c) => !c.isDue)

  const [queue, setQueue] = useState<Card[]>(due)
  const [current, setCurrent] = useState(0)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (queue.length === 0 || done) {
    return (
      <div className="text-center space-y-4 mt-16">
        {done && <p className="text-emerald-400 text-sm font-medium">Session complete ✓</p>}
        {!done && <p className="text-zinc-400 text-sm">No cards due right now.</p>}
        {notDue.length > 0 && (
          <button
            onClick={() => { setQueue(notDue); setCurrent(0); setDone(false) }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            Practice {notDue.length} cards ahead of schedule
          </button>
        )}
      </div>
    )
  }

  const card = queue[current]
  const isMCQ = !!(card.options && card.correctOption)

  const advance = () => {
    if (current + 1 >= queue.length) setDone(true)
    else setCurrent((c) => c + 1)
  }

  const handleMCQResult = (correct: boolean) => {
    startTransition(async () => {
      await submitAttempt(card.exerciseId, correct ? 4 : 1, null, subjectId, sessionId)
      advance()
    })
  }

  const handleFlipRate = (quality: number) => {
    startTransition(async () => {
      await submitAttempt(card.exerciseId, quality, null, subjectId, sessionId)
      advance()
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${(current / queue.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-600 font-mono shrink-0">{current + 1}/{queue.length}</span>
      </div>

      {/* Concept label */}
      <p className="text-xs text-zinc-600 text-center font-mono">{card.conceptName}</p>

      <AnimatePresence mode="wait">
        <motion.div
          key={card.exerciseId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {isMCQ ? (
            <MCQCard card={card} onResult={handleMCQResult} isPending={isPending} />
          ) : (
            <FlipCard card={card} onRate={handleFlipRate} isPending={isPending} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
