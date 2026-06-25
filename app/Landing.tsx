import Link from "next/link"
import { db } from "@/lib/db"
import ModoTitle from "./ModoTitle"
import LandingTabs from "./LandingTabs"
import { continueAsGuest } from "./sign-in/actions"

const ACCENT = "#6366f1" // fixed brand indigo — signed-out visitors have no theme yet

// Static product-preview card (mirrors the real MCQ reviewer) so visitors see
// exactly what studying looks like — "show, don't tell".
function PreviewCard() {
  const options: { text: string; correct?: boolean }[] = [
    { text: "func" },
    { text: "def", correct: true },
    { text: "lambda" },
    { text: "function" },
  ]
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div
        className="absolute -inset-6 rounded-[2rem] blur-2xl pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 30%, rgba(99,102,241,0.18), transparent 70%)" }}
      />
      <div className="relative rounded-2xl border border-white/[0.1] bg-[#0c0c14]/90 p-5 shadow-2xl backdrop-blur">
        {/* +XP pop */}
        <div className="absolute -top-3 right-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
          +15 XP
        </div>
        {/* progress */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full rounded-full" style={{ width: "42%", background: `linear-gradient(90deg, ${ACCENT}, #a855f7)` }} />
          </div>
          <span className="text-[10px] font-mono text-zinc-600 tabular-nums">5/12</span>
        </div>
        <p className="text-center text-[10px] font-mono tracking-[0.2em] text-zinc-600 mb-3">PYTHON · FUNCTIONS</p>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 text-center text-sm font-medium text-zinc-100 mb-3">
          Which keyword defines a function in Python?
        </div>
        <div className="space-y-2">
          {options.map((o) => (
            <div
              key={o.text}
              className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-sm ${
                o.correct
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                  : "border-white/[0.06] bg-white/[0.015] text-zinc-400"
              }`}
            >
              <span>{o.text}</span>
              {o.correct && <span className="text-emerald-400 text-xs">✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Public marketing page shown at "/" to signed-out visitors (crawlers + first-time
// users). Explains what MODO is and routes to sign-up / guest / sign-in.
export default async function Landing() {
  const [subjects, subjectCount, cardCount] = await Promise.all([
    db.subject.findMany({
      where: { status: "published" },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, emoji: true, category: true },
    }),
    db.subject.count({ where: { status: "published" } }),
    db.exercise.count({ where: { type: "FLASHCARD" } }),
  ])

  const stats: [string, string][] = [
    [`${subjectCount}`, "subjects"],
    [`${Math.floor(cardCount / 10) * 10}+`, "flashcards"],
    ["10", "languages"],
  ]

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col overflow-hidden">
      {/* nav */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.05] bg-[#080810]/80 backdrop-blur-md">
        <span
          className="font-black tracking-tight text-lg"
          style={{ background: "linear-gradient(135deg,#fff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          MODO
        </span>
        <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Sign in
        </Link>
      </nav>

      {/* hero */}
      <header className="relative flex flex-col items-center text-center px-6 pt-16 pb-16">
        {/* textured + glowing background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          }}
        />
        <div
          className="absolute top-[-12%] left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full blur-[140px] pointer-events-none"
          style={{ background: "rgba(99,102,241,0.13)" }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <ModoTitle />
          <p className="text-zinc-600 text-[11px] tracking-[0.34em] uppercase mt-3 font-light">study smarter</p>

          <h1 className="mt-8 text-4xl sm:text-5xl font-black tracking-tight max-w-2xl leading-[1.08]">
            Flashcards that actually <span style={{ color: "#a5b4fc" }}>stick</span>
          </h1>
          <p className="mt-5 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            MODO uses <span className="text-zinc-200 font-medium">spaced repetition</span> to help you learn
            <span className="text-zinc-200 font-medium"> any subject</span> — and actually remember it, instead of
            cramming and forgetting.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/sign-up"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03] w-full sm:w-auto text-center"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)`, boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }}
            >
              Get started
            </Link>
            <form action={continueAsGuest}>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-medium text-zinc-300 border border-white/12 hover:border-white/30 hover:text-white transition-colors w-full sm:w-auto"
              >
                Try as guest
              </button>
            </form>
          </div>

          {/* stats */}
          <div className="mt-8 flex items-center gap-6 sm:gap-9">
            {stats.map(([n, label]) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: "#c7d2fe" }}>
                  {n}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-zinc-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* product preview */}
          <div className="mt-14 w-full">
            <PreviewCard />
          </div>
        </div>
      </header>

      {/* tabbed: Subjects · How it works · Features */}
      <LandingTabs subjects={subjects} />

      {/* final CTA */}
      <section className="relative z-10 px-6 pb-20">
        <div className="relative max-w-3xl mx-auto rounded-3xl border border-white/[0.08] px-8 py-14 text-center overflow-hidden"
          style={{ background: "linear-gradient(160deg, rgba(99,102,241,0.10), rgba(168,85,247,0.05) 60%, transparent)" }}>
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[400px] h-[260px] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "rgba(168,85,247,0.14)" }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl font-black tracking-tight">Ready to actually remember it?</h2>
            <p className="text-zinc-400 mt-3 text-sm">Start in seconds — pick a subject and review your first cards today.</p>
            <Link
              href="/sign-up"
              className="inline-block mt-7 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)`, boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }}
            >
              Get started
            </Link>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="relative z-10 mt-auto border-t border-white/[0.06] px-6 py-7">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>
            <span className="font-bold text-zinc-400">MODO</span> · study smarter
          </span>
          <div className="flex items-center gap-5">
            <Link href="/help" className="hover:text-zinc-300 transition-colors">Help</Link>
            <Link href="/feedback" className="hover:text-zinc-300 transition-colors">Feedback</Link>
            <Link href="/sign-in" className="hover:text-zinc-300 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
