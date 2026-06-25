import type { Metadata } from "next"
import Link from "next/link"
import FeedbackForm from "./FeedbackForm"

export const metadata: Metadata = { title: "Feedback" }

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <div className="max-w-md mx-auto px-6 py-12">
        <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
          ← MODO
        </Link>
        <h1 className="text-2xl font-black tracking-tight mt-4">Feedback</h1>
        <p className="text-zinc-500 text-sm mt-1.5 mb-7 leading-relaxed">
          MODO is built in the open and shaped by its learners. Tell us what you think — every note is read.
        </p>
        <FeedbackForm />
        <p className="text-[11px] text-zinc-700 mt-5 text-center">
          Looking for how something works? See the{" "}
          <Link href="/docs" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
            docs
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
