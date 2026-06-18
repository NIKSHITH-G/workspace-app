"use client"

import { useState, useEffect, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { REVIEW_BUTTONS } from "@/lib/sm2"
import { submitAttempt } from "./actions"
import Markdown from "@/components/Markdown"

type Card = {
  exerciseId: string
  conceptName: string
  front: string
  back: string
  isDue: boolean
}

type Props = {
  cards: Card[]
  subjectId: string
  sessionId: string
}

export default function FlashcardReview({ cards, subjectId, sessionId }: Props) {
  const due = cards.filter((c) => c.isDue)
  const notDue = cards.filter((c) => !c.isDue)

  const [queue, setQueue] = useState<Card[]>(due)
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [confidence, setConfidence] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " && !flipped) {
        e.preventDefault()
        setFlipped(true)
        return
      }
      if (flipped && !isPending) {
        const btn = REVIEW_BUTTONS.find((b) => b.shortcut === e.key)
        if (btn) handleRate(btn.quality)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, isPending])

  if (queue.length === 0) {
    return (
      <div className="text-center space-y-4">
        <p className="text-zinc-400 text-sm">No cards due right now.</p>
        {notDue.length > 0 && (
          <button
            onClick={() => {
              setQueue(notDue)
              setCurrent(0)
              setFlipped(false)
              setDone(false)
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            Practice {notDue.length} cards ahead of schedule
          </button>
        )}
      </div>
    )
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <p className="text-emerald-400 text-sm font-medium">Session complete</p>
        <p className="text-zinc-500 text-xs">{queue.length} cards reviewed</p>
        {notDue.length > 0 && (
          <button
            onClick={() => {
              setQueue(notDue)
              setCurrent(0)
              setFlipped(false)
              setDone(false)
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition-colors"
          >
            Practice {notDue.length} more cards (not yet due)
          </button>
        )}
      </div>
    )
  }

  const card = queue[current]

  const handleRate = (quality: number) => {
    startTransition(async () => {
      await submitAttempt(card.exerciseId, quality, confidence, subjectId, sessionId)
      setFlipped(false)
      setConfidence(null)
      if (current + 1 >= queue.length) {
        setDone(true)
      } else {
        setCurrent((c) => c + 1)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-500 rounded-full transition-all duration-300"
            style={{ width: `${(current / queue.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-600 font-mono shrink-0">
          {current + 1}/{queue.length}
        </span>
      </div>

      {/* Concept label */}
      <p className="text-xs text-zinc-600 text-center font-mono">{card.conceptName}</p>

      {/* Card */}
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
              flipped
                ? "flex flex-col justify-center"
                : "flex flex-col items-center justify-center text-center"
            }`}
          >
            {flipped ? (
              <div className="text-left w-full">
                <Markdown>{card.back}</Markdown>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <Markdown>{card.front}</Markdown>
                </div>
                <p className="text-xs text-zinc-600 mt-4">
                  tap to reveal · space to reveal
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence rating (shown before flipping) */}
      {!flipped && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 text-center">
            How confident are you? (optional)
          </p>
          <div className="flex gap-2 justify-center">
            {[
              { val: 0.1, label: "Blank" },
              { val: 0.3, label: "Fuzzy" },
              { val: 0.5, label: "Partial" },
              { val: 0.7, label: "Sure" },
              { val: 0.9, label: "Certain" },
            ].map(({ val, label }) => (
              <button
                key={val}
                onClick={(e) => {
                  e.stopPropagation()
                  setConfidence(val)
                }}
                className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors ${
                  confidence === val
                    ? "bg-zinc-600 text-white"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-500 hover:border-zinc-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rating buttons (shown after flipping) */}
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {REVIEW_BUTTONS.map((btn) => (
            <button
              key={btn.quality}
              onClick={() => handleRate(btn.quality)}
              disabled={isPending}
              className="py-2.5 rounded-xl text-xs font-medium transition-colors bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600 disabled:opacity-40"
            >
              <span className="block">{btn.label}</span>
              <span className="block text-zinc-600 text-[10px] mt-0.5 font-mono">
                {btn.shortcut}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
