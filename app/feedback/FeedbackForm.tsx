"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { submitFeedback } from "./actions"

export default function FeedbackForm() {
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  if (sent) {
    return (
      <div className="text-center space-y-3 py-8">
        <div className="text-4xl" aria-hidden>
          🙌
        </div>
        <p className="text-emerald-400 text-sm font-medium">Thanks — got it!</p>
        <p className="text-zinc-500 text-sm max-w-xs mx-auto">Your feedback genuinely helps shape MODO.</p>
        <Link href="/" className="inline-block mt-1 text-xs text-zinc-400 hover:text-white underline underline-offset-4">
          Back to MODO
        </Link>
      </div>
    )
  }

  const submit = () => {
    setError(null)
    start(async () => {
      const res = await submitFeedback(message)
      if (res.ok) setSent(true)
      else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <div className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={2000}
        rows={6}
        placeholder="What's working, what's confusing, what would you love to see? Bugs, ideas, subjects you want — anything."
        className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        onClick={submit}
        disabled={pending || message.trim().length < 3}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-40 disabled:hover:scale-100"
        style={{ background: "var(--theme-primary,#6366f1)" }}
      >
        {pending ? "Sending…" : "Send feedback"}
      </button>
    </div>
  )
}
