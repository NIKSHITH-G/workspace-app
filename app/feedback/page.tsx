import type { Metadata } from "next"
import Link from "next/link"
import FeedbackForm from "./FeedbackForm"

export const metadata: Metadata = { title: "Feedback" }

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white relative overflow-hidden flex flex-col">
      {/* top bar */}
      <nav className="relative z-30 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.05]">
        <Link
          href="/"
          className="font-black tracking-tight text-lg"
          style={{ background: "linear-gradient(135deg,#fff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          MODO
        </Link>
        <Link href="/help" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Help
        </Link>
      </nav>

      <div className="relative flex-1 flex items-center justify-center px-6 py-12">
        {/* textured + glowing background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 35%, #000 30%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-[2%] left-1/2 -translate-x-1/2 w-[560px] h-[520px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: "rgba(99,102,241,0.12)" }}
        />

        <div className="relative z-10 w-full max-w-lg">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 backdrop-blur p-6 sm:p-8 shadow-2xl">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4"
              style={{ background: "linear-gradient(135deg,#6366f126,#6366f10d)", border: "1px solid #6366f133" }}
            >
              💬
            </div>
            <h1 className="text-2xl font-black tracking-tight">Feedback</h1>
            <p className="text-zinc-500 text-sm mt-1.5 mb-6 leading-relaxed">
              MODO is built in the open and shaped by its learners. Tell us what you think — every note is read.
            </p>
            <FeedbackForm />
          </div>

          <p className="text-[11px] text-zinc-700 mt-5 text-center">
            Looking for how something works? Visit{" "}
            <Link href="/help" className="text-zinc-500 hover:text-zinc-300 underline underline-offset-2">
              Help
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
