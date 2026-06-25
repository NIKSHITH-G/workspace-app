import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Docs",
  description: "How MODO works — studying, XP, streaks, notifications, languages and more.",
}

const ACCENT = "#6366f1"

const SECTIONS = [
  { id: "what", label: "What is MODO" },
  { id: "start", label: "Getting started" },
  { id: "study", label: "Studying" },
  { id: "srs", label: "Spaced repetition" },
  { id: "today", label: "Study Today & goal" },
  { id: "xp", label: "XP & levels" },
  { id: "streaks", label: "Streaks" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "notifications", label: "Notifications" },
  { id: "language", label: "Language" },
  { id: "profile", label: "Profile" },
  { id: "install", label: "Install as an app" },
  { id: "guest", label: "Guest mode" },
]

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-xl font-bold tracking-tight text-white mt-12 mb-3">
      {children}
    </h2>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* top bar */}
      <nav className="sticky top-0 z-30 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/[0.05] bg-[#080810]/80 backdrop-blur-md">
        <Link
          href="/"
          className="font-black tracking-tight text-lg"
          style={{ background: "linear-gradient(135deg,#fff,#a5b4fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          MODO
        </Link>
        <Link href="/feedback" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Feedback
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 flex gap-10">
        {/* TOC */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3">On this page</p>
            <ul className="space-y-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* content */}
        <article className="min-w-0 flex-1 text-sm text-zinc-400 leading-relaxed">
          <h1 className="text-3xl font-black tracking-tight text-white">Docs</h1>
          <p className="mt-2 text-zinc-500">Everything about how MODO works.</p>

          <H id="what">What is MODO</H>
          <p>
            MODO is a <span className="text-zinc-200">spaced-repetition flashcard app</span> for mastering any subject.
            Instead of cramming and forgetting, you review cards just before you&apos;d forget them — so knowledge sticks
            for the long term with minimal time.
          </p>

          <H id="start">Getting started</H>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-700">
            <li><span className="text-zinc-200">Sign up</span> (email or Google) to save your progress, or hit <span className="text-zinc-200">Try as guest</span> to look around without an account.</li>
            <li>Pick a subject from the home catalog, open a session, and start reviewing cards.</li>
            <li>Guests aren&apos;t tracked (no XP, streaks or leaderboard) — sign in any time to start saving.</li>
          </ul>

          <H id="study">Studying</H>
          <p>Each subject has weekly <span className="text-zinc-200">sessions</span>, made of <span className="text-zinc-200">concepts</span>. Every concept has a flashcard:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2 marker:text-zinc-700">
            <li><span className="text-zinc-200">Multiple-choice</span> cards — pick the right answer; you&apos;ll see an explanation after.</li>
            <li><span className="text-zinc-200">Flip</span> cards — reveal the answer, then rate how well you knew it (Again / Hard / Good / Easy).</li>
            <li>Each session also has a <span className="text-zinc-200">cheat sheet</span> and concept explanations for reference.</li>
          </ul>

          <H id="srs">Spaced repetition &amp; mastery</H>
          <p>
            MODO schedules reviews with the <span className="text-zinc-200">SM-2 algorithm</span>. Answer well and a card&apos;s
            next review is pushed further out; struggle and it comes back sooner. A concept becomes{" "}
            <span className="text-zinc-200">mastered</span> once your score passes 70%. Cards you&apos;ve studied resurface
            when they&apos;re <span className="text-zinc-200">due</span> — that&apos;s what powers Study Today.
          </p>

          <H id="today">Study Today &amp; daily goal</H>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-700">
            <li><span className="text-zinc-200">Study Today</span> gathers every card due across all your subjects into one queue — tap the CTA on the home screen.</li>
            <li>It only shows cards you&apos;ve <span className="text-zinc-200">already started</span>, so untouched subjects never flood it.</li>
            <li>A <span className="text-zinc-200">daily goal</span> (20 reviews) tracks your progress for the day with a bar that fills as you go.</li>
          </ul>

          <H id="xp">XP &amp; levels</H>
          <p>XP is earned as you review and is fully cumulative:</p>
          <div className="mt-3 rounded-xl border border-white/[0.07] overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_tr]:border-b [&_tr]:border-white/[0.05]">
                <tr><td className="text-zinc-300">Correct answer</td><td className="text-zinc-500">+10 XP (up to +10 bonus for Easy)</td></tr>
                <tr><td className="text-zinc-300">Answered, but wrong</td><td className="text-zinc-500">+2 XP (showing up still counts)</td></tr>
                <tr><td className="text-zinc-300">Mastering a concept</td><td className="text-zinc-500">+50 XP each</td></tr>
                <tr><td className="text-zinc-300">Daily streak</td><td className="text-zinc-500">+5 XP × streak length (caps at 7 days)</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            Levels follow a climbing curve — Level 2 at 100 XP, Level 3 at 400, Level 4 at 900, Level 5 at 1,600, and so on
            (each level needs more than the last). Your level and XP bar show in the home header.
          </p>

          <H id="streaks">Streaks</H>
          <p>
            Review on consecutive days to build a <span className="text-zinc-200">streak</span> 🔥. The longer it runs, the
            more bonus XP each active day earns (up to a 7-day cap). Miss a day and the streak resets — turning on
            notifications helps you protect it.
          </p>

          <H id="leaderboard">Leaderboard</H>
          <p>
            See how you rank against other learners. Sort by <span className="text-zinc-200">Level</span>, cards{" "}
            <span className="text-zinc-200">Solved</span>, concepts <span className="text-zinc-200">Mastered</span>, or{" "}
            <span className="text-zinc-200">Streak</span>. Pick a username and style in Settings to appear there.
          </p>

          <H id="notifications">Notifications</H>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-700">
            <li>Go to <span className="text-zinc-200">Settings → Notifications → Daily reminders</span> and tap <span className="text-zinc-200">Turn on</span>, then allow the browser prompt.</li>
            <li>You&apos;ll get a daily nudge when you have cards due, so you can keep your streak alive.</li>
            <li><span className="text-zinc-200">On iPhone</span>, install MODO to your home screen first (see below) — iOS only allows notifications for installed apps.</li>
          </ul>

          <H id="language">Language</H>
          <p>
            MODO is available in <span className="text-zinc-200">10 languages</span>. Change it under{" "}
            <span className="text-zinc-200">Settings → Language</span> — the interface and content switch instantly, and
            right-to-left languages (Arabic, Hebrew) are fully supported.
          </p>

          <H id="profile">Profile (avatar &amp; style)</H>
          <p>
            In <span className="text-zinc-200">Settings</span> you can set your <span className="text-zinc-200">username</span>{" "}
            (shown on the leaderboard), choose an <span className="text-zinc-200">avatar</span>, and pick a{" "}
            <span className="text-zinc-200">style</span> — which recolors your whole MODO experience with an accent theme.
          </p>

          <H id="install">Install as an app</H>
          <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-700">
            <li><span className="text-zinc-200">iPhone (Safari):</span> Share → <span className="text-zinc-200">Add to Home Screen</span>.</li>
            <li><span className="text-zinc-200">Android (Chrome):</span> you&apos;ll get an <span className="text-zinc-200">Install app</span> prompt, or use the ⋮ menu.</li>
            <li><span className="text-zinc-200">Desktop:</span> an install icon appears in the address bar.</li>
            <li>Installed, MODO runs fullscreen and shows a friendly offline screen when you lose connection.</li>
          </ul>

          <H id="guest">Guest mode</H>
          <p>
            <span className="text-zinc-200">Try as guest</span> lets you explore everything without an account. Guests
            aren&apos;t tracked — no progress, XP, streaks or leaderboard — and a notice invites you to sign in to start
            saving. Use <span className="text-zinc-200">Exit</span> in the menu to leave guest mode and return to the
            landing page.
          </p>

          <div className="mt-14 rounded-2xl border border-white/[0.08] p-6 text-center"
            style={{ background: `linear-gradient(160deg, ${ACCENT}12, transparent 70%)` }}>
            <p className="text-zinc-300 text-sm">Still have a question, or an idea to make MODO better?</p>
            <Link href="/feedback" className="inline-block mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: ACCENT }}>
              Send feedback
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
