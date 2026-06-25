import Link from "next/link"
import { db } from "@/lib/db"
import ModoTitle from "./ModoTitle"
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
          <p className="text-zinc-600 text-[11px] tracking-[0.34em] uppercase mt-3 font-light">master anything</p>

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
              Start learning — free
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
          <p className="mt-4 text-xs text-zinc-600">No credit card. Works on your phone. Free.</p>
        </div>
      </header>

      {/* subjects */}
      <section className="relative z-10 px-6 pb-20 max-w-4xl mx-auto w-full">
        <p className="text-center text-zinc-500 text-xs uppercase tracking-[0.25em] mb-6">Learn real subjects</p>
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
      </section>

      {/* how it works */}
      <section className="relative z-10 px-6 pb-20 max-w-4xl mx-auto w-full">
        <h2 className="text-center text-2xl font-bold tracking-tight mb-10">How MODO works</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "📚", title: "Learn", body: "Bite-size concepts with clear explanations and cheat sheets — no fluff." },
            { icon: "🔁", title: "Review", body: "Spaced repetition resurfaces each card right before you'd forget it." },
            { icon: "🏆", title: "Master", body: "Earn XP, build streaks, and climb the leaderboard as it sticks for good." },
          ].map((step, i) => (
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
      </section>

      {/* features */}
      <section className="relative z-10 px-6 pb-20 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            ["🧠", "Spaced repetition", "Proven SM-2 scheduling"],
            ["✅", "Smart flashcards", "Multiple-choice & flip cards"],
            ["🔥", "Streaks & XP", "Stay motivated daily"],
            ["📊", "Leaderboard", "Compete with other learners"],
            ["📱", "Installable app", "Add to home screen, works offline"],
            ["🌍", "10 languages", "Study in your language"],
          ].map(([icon, title, body], i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4">
              <div className="text-xl mb-2">{icon}</div>
              <div className="text-sm font-medium text-zinc-200">{title}</div>
              <div className="text-xs text-zinc-600 mt-0.5">{body}</div>
            </div>
          ))}
        </div>
      </section>

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
            Get started — it's free
          </Link>
        </div>
      </section>

      <footer className="relative z-10 mt-auto border-t border-white/[0.06] px-6 py-6 text-center">
        <p className="text-xs text-zinc-600">
          <span className="font-bold text-zinc-400">MODO</span> · master anything ·{" "}
          <Link href="/sign-in" className="hover:text-zinc-300 transition-colors">
            Sign in
          </Link>
        </p>
      </footer>
    </div>
  )
}
