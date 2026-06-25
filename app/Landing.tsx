import Link from "next/link"
import { db } from "@/lib/db"
import ModoTitle from "./ModoTitle"
import LandingTabs from "./LandingTabs"
import { continueAsGuest } from "./sign-in/actions"

const ACCENT = "#6366f1" // fixed brand indigo — signed-out visitors have no theme yet

// Public marketing page shown at "/" to signed-out visitors (crawlers + first-time
// users). Explains what MODO is and routes to sign-up / guest / sign-in.
export default async function Landing() {
  const subjects = await db.subject.findMany({
    where: { status: "published" },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, name: true, emoji: true, category: true },
  })

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col overflow-hidden">
      {/* nav */}
      <nav className="relative z-20 flex items-center justify-between px-5 sm:px-8 py-4">
        <span
          className="font-black tracking-tight text-lg"
          style={{ background: "linear-gradient(135deg,#fff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          MODO
        </span>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-zinc-400 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-medium text-white px-4 py-2 rounded-xl transition-transform hover:scale-[1.03]"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* hero */}
      <header className="relative flex flex-col items-center text-center px-6 pt-16 pb-20">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: "rgba(99,102,241,0.12)" }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <ModoTitle />
          <p className="text-zinc-600 text-[11px] tracking-[0.34em] uppercase mt-3 font-light">study smarter</p>

          <h1 className="mt-8 text-4xl sm:text-5xl font-black tracking-tight max-w-2xl leading-[1.08]">
            Flashcards that actually <span style={{ color: "#a5b4fc" }}>stick</span>.
          </h1>
          <p className="mt-5 text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
            MODO uses <span className="text-zinc-200 font-medium">spaced repetition</span> to help you learn Python, math,
            databases and computer architecture — and actually remember it, instead of cramming and forgetting.
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
        </div>
      </header>

      {/* tabbed: Subjects · How it works · Features */}
      <LandingTabs subjects={subjects} />

      {/* final CTA */}
      <section className="relative z-10 px-6 pb-24 text-center">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "rgba(168,85,247,0.10)" }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl font-black tracking-tight">Ready to actually remember it?</h2>
          <p className="text-zinc-500 mt-3 text-sm">Start in seconds — pick a subject and review your first cards today.</p>
          <Link
            href="/sign-up"
            className="inline-block mt-7 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)`, boxShadow: "0 8px 30px rgba(99,102,241,0.35)" }}
          >
            Get started
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-auto border-t border-white/[0.06] px-6 py-6 text-center">
        <p className="text-xs text-zinc-600">
          <span className="font-bold text-zinc-400">MODO</span> · study smarter ·{" "}
          <Link href="/sign-in" className="hover:text-zinc-300 transition-colors">
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  )
}
