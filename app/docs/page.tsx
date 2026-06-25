import type { Metadata } from "next"
import Link from "next/link"
import DocsToc from "@/components/DocsToc"

export const metadata: Metadata = {
  title: "Docs",
  description: "How MODO works — studying, XP, streaks, notifications, languages and more.",
}

const ACCENT = "#6366f1"

const SECTIONS = [
  { id: "what", icon: "🎯", title: "What is MODO", label: "What is MODO" },
  { id: "start", icon: "🚀", title: "Getting started", label: "Getting started" },
  { id: "study", icon: "🃏", title: "Studying", label: "Studying" },
  { id: "srs", icon: "🔁", title: "Spaced repetition & mastery", label: "Spaced repetition" },
  { id: "today", icon: "📅", title: "Study Today & daily goal", label: "Study Today" },
  { id: "analytics", icon: "📊", title: "Analytics", label: "Analytics" },
  { id: "xp", icon: "⚡", title: "XP & levels", label: "XP & levels" },
  { id: "streaks", icon: "🔥", title: "Streaks", label: "Streaks" },
  { id: "leaderboard", icon: "🏆", title: "Leaderboard", label: "Leaderboard" },
  { id: "shortcuts", icon: "⌨️", title: "Keyboard shortcuts", label: "Keyboard shortcuts" },
  { id: "notifications", icon: "🔔", title: "Notifications", label: "Notifications" },
  { id: "language", icon: "🌍", title: "Language", label: "Language" },
  { id: "profile", icon: "🎨", title: "Profile, avatars & styles", label: "Profile & styles" },
  { id: "install", icon: "📱", title: "Install as an app", label: "Install app" },
  { id: "guest", icon: "👤", title: "Guest mode", label: "Guest mode" },
  { id: "account", icon: "🔐", title: "Your account & data", label: "Account & data" },
  { id: "subjects", icon: "📚", title: "Subjects & requests", label: "Subjects & requests" },
  { id: "tips", icon: "✨", title: "Tips for studying", label: "Tips for studying" },
  { id: "faq", icon: "❓", title: "FAQ", label: "FAQ" },
]

function IconTile({ emoji }: { emoji: string }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 w-10 h-10 rounded-xl text-xl"
      style={{ background: `linear-gradient(135deg, ${ACCENT}26, ${ACCENT}0d)`, border: `1px solid ${ACCENT}33` }}
    >
      {emoji}
    </div>
  )
}

function Section({ id, icon, title, children }: { id: string; icon: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 mb-12">
      <div className="flex items-center gap-3 mb-4">
        <IconTile emoji={icon} />
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      </div>
      <div className="text-sm text-zinc-400 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06] px-4 py-3 text-zinc-300">
      <span aria-hidden>💡</span>
      <div>{children}</div>
    </div>
  )
}

function FAQ({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
      <p className="text-zinc-200 font-medium">{q}</p>
      <p className="mt-1.5">{children}</p>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[24px] rounded-md border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[11px] font-mono text-zinc-200">
      {children}
    </kbd>
  )
}

const li = "marker:text-zinc-700"
const em = "text-zinc-200"

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-white relative">
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

      {/* hero */}
      <header className="relative overflow-hidden border-b border-white/[0.05] px-6 py-14 text-center">
        <div
          className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[130px] pointer-events-none"
          style={{ background: "rgba(99,102,241,0.12)" }}
        />
        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-600">Documentation</p>
          <h1 className="text-4xl font-black tracking-tight mt-3">How MODO works</h1>
          <p className="text-zinc-500 mt-3 text-sm max-w-md mx-auto">
            Everything about studying, XP, streaks, notifications, languages and more.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12 flex gap-10">
        {/* TOC */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="sticky top-24">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-3 pl-3">On this page</p>
            <DocsToc items={SECTIONS.map((s) => ({ id: s.id, label: s.label }))} />
          </div>
        </aside>

        {/* content */}
        <article className="min-w-0 flex-1">
          <Section id="what" icon="🎯" title="What is MODO">
            <p>
              MODO is a <span className={em}>spaced-repetition flashcard app</span> for mastering any subject. Instead of
              cramming and forgetting, you review cards just before you&apos;d forget them — so knowledge sticks for the
              long term with minimal time.
            </p>
          </Section>

          <Section id="start" icon="🚀" title="Getting started">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>Sign up</span> (email or Google) to save progress, or hit <span className={em}>Try as guest</span> to look around.</li>
              <li className={li}>Pick a subject from the home catalog, open a session, and start reviewing cards.</li>
              <li className={li}>Guests aren&apos;t tracked (no XP, streaks or leaderboard) — sign in any time to start saving.</li>
            </ul>
          </Section>

          <Section id="study" icon="🃏" title="Studying">
            <p>Each subject has weekly <span className={em}>sessions</span>, made of <span className={em}>concepts</span>. Every concept has a flashcard:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>Multiple-choice</span> — pick the right answer; an explanation follows.</li>
              <li className={li}><span className={em}>Flip</span> cards — reveal the answer, then rate how well you knew it (Again / Hard / Good / Easy).</li>
              <li className={li}>Each session also has a <span className={em}>cheat sheet</span> and concept explanations for reference.</li>
            </ul>
          </Section>

          <Section id="srs" icon="🔁" title="Spaced repetition & mastery">
            <p>
              MODO schedules reviews with the <span className={em}>SM-2 algorithm</span>. Answer well and a card&apos;s next
              review is pushed further out; struggle and it returns sooner. A concept becomes <span className={em}>mastered</span>{" "}
              once your score passes 70%. Studied cards resurface when they&apos;re <span className={em}>due</span> — which powers Study Today.
            </p>
          </Section>

          <Section id="today" icon="📅" title="Study Today & daily goal">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>Study Today</span> gathers every due card across your subjects into one queue — tap the CTA on the home screen.</li>
              <li className={li}>It only shows cards you&apos;ve <span className={em}>already started</span>, so untouched subjects never flood it.</li>
              <li className={li}>A <span className={em}>daily goal</span> (20 reviews) tracks your progress for the day with a bar that fills as you go.</li>
            </ul>
          </Section>

          <Section id="analytics" icon="📊" title="Analytics">
            <p>Open <span className={em}>Analytics</span> from any session page to see exactly where you stand:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>Session summary — overall <span className={em}>mastery %</span>, concepts mastered, cards due now, and answer <span className={em}>accuracy</span>.</li>
              <li className={li}>A per-concept breakdown with a status (New / Learning / Mastered), a mastery bar, attempts, accuracy and when it&apos;s next due.</li>
              <li className={li}>A mini history of your recent answers per concept, so weak spots are easy to spot.</li>
            </ul>
          </Section>

          <Section id="xp" icon="⚡" title="XP & levels">
            <p>XP is earned as you review and is fully cumulative:</p>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_tr]:border-b [&_tr]:border-white/[0.05] [&_tr:last-child]:border-0">
                  <tr><td className="text-zinc-300">Correct answer</td><td className="text-zinc-500">+10 XP (up to +10 bonus for Easy)</td></tr>
                  <tr><td className="text-zinc-300">Answered, but wrong</td><td className="text-zinc-500">+2 XP (showing up still counts)</td></tr>
                  <tr><td className="text-zinc-300">Mastering a concept</td><td className="text-zinc-500">+50 XP each</td></tr>
                  <tr><td className="text-zinc-300">Daily streak</td><td className="text-zinc-500">+5 XP × streak length (caps at 7 days)</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              Levels climb on a curve — L2 at 100 XP, L3 at 400, L4 at 900, L5 at 1,600 (each level needs more than the last).
              Your level and XP bar show in the home header.
            </p>
          </Section>

          <Section id="streaks" icon="🔥" title="Streaks">
            <p>
              Review on consecutive days to build a <span className={em}>streak</span> 🔥. The longer it runs, the more bonus
              XP each active day earns (up to a 7-day cap). Miss a day and it resets.
            </p>
            <Tip>Turn on notifications (below) to get a daily nudge and protect your streak.</Tip>
          </Section>

          <Section id="leaderboard" icon="🏆" title="Leaderboard">
            <p>
              See how you rank against other learners. Sort by <span className={em}>Level</span>, cards{" "}
              <span className={em}>Solved</span>, concepts <span className={em}>Mastered</span>, or <span className={em}>Streak</span>.
              Pick a username and style in Settings to appear there.
            </p>
          </Section>

          <Section id="shortcuts" icon="⌨️" title="Keyboard shortcuts">
            <p>Review faster without the mouse:</p>
            <div className="rounded-xl border border-white/[0.07] overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_tr]:border-b [&_tr]:border-white/[0.05] [&_tr:last-child]:border-0">
                  <tr><td><Kbd>Space</Kbd></td><td className="text-zinc-500">Reveal a flip card / continue</td></tr>
                  <tr><td><Kbd>1</Kbd> <Kbd>2</Kbd> <Kbd>3</Kbd> <Kbd>4</Kbd></td><td className="text-zinc-500">Rate a flip card — Again · Hard · Good · Easy</td></tr>
                  <tr><td><Kbd>Enter</Kbd></td><td className="text-zinc-500">Next card (after answering)</td></tr>
                  <tr><td><Kbd>/</Kbd></td><td className="text-zinc-500">Focus the subject search on the home screen</td></tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="notifications" icon="🔔" title="Notifications">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>Go to <span className={em}>Settings → Notifications → Daily reminders</span> and tap <span className={em}>Turn on</span>, then allow the browser prompt.</li>
              <li className={li}>You&apos;ll get a daily nudge when you have cards due, so you can keep your streak alive.</li>
            </ul>
            <Tip>On iPhone, install MODO to your home screen first (see below) — iOS only allows notifications for installed apps.</Tip>
          </Section>

          <Section id="language" icon="🌍" title="Language">
            <p>
              MODO is available in <span className={em}>10 languages</span>. Change it under <span className={em}>Settings → Language</span>{" "}
              — the interface and content switch instantly, and right-to-left languages (Arabic, Hebrew) are fully supported.
            </p>
          </Section>

          <Section id="profile" icon="🎨" title="Profile, avatars & styles">
            <p>
              In <span className={em}>Settings</span> you can set your <span className={em}>username</span> (shown on the
              leaderboard), pick an <span className={em}>avatar</span>, and choose a <span className={em}>style</span> that
              recolors your whole MODO experience with an accent theme.
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>Avatars:</span> Owl, Fox, Wolf, Dragon, Cat, Robot.</li>
              <li className={li}><span className={em}>Styles:</span> Scholar (blue), Warrior (orange), Shadow (purple), Sage (green), Maverick (gold) — each sets your accent color across the app.</li>
            </ul>
          </Section>

          <Section id="install" icon="📱" title="Install as an app">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>iPhone (Safari):</span> Share → <span className={em}>Add to Home Screen</span>.</li>
              <li className={li}><span className={em}>Android (Chrome):</span> tap the <span className={em}>Install app</span> prompt, or use the ⋮ menu.</li>
              <li className={li}><span className={em}>Desktop:</span> an install icon appears in the address bar.</li>
              <li className={li}>Installed, MODO runs fullscreen and shows a friendly offline screen when you lose connection.</li>
            </ul>
          </Section>

          <Section id="guest" icon="👤" title="Guest mode">
            <p>
              <span className={em}>Try as guest </span> lets you explore everything without an account. Guests aren&apos;t
              tracked — no progress, XP, streaks or leaderboard. Use <span className={em}>Exit</span> in the menu to leave
              guest mode and return to the landing page.
            </p>
          </Section>

          <Section id="account" icon="🔐" title="Your account & data">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}>Sign in with email or Google to save everything — authentication is handled securely by Clerk.</li>
              <li className={li}>We store your profile (name, avatar, style), your review attempts and mastery, and — only if you opt in — your notification subscription.</li>
              <li className={li}>Your XP, levels and streaks are <span className={em}>computed</span> from your attempts, so they&apos;re always accurate and update retroactively.</li>
              <li className={li}>Guests are never tracked — nothing is saved until you sign in.</li>
            </ul>
          </Section>

          <Section id="subjects" icon="📚" title="Subjects & requests">
            <p>
              Subjects are hand-crafted — each is a full set of weekly sessions with original explanations and flashcards,
              and the catalog grows over time. Progress is tracked separately for every subject you start.
            </p>
            <p>
              Want something we don&apos;t have yet?{" "}
              <Link href="/feedback" className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2">
                Request a subject
              </Link>{" "}
              (pick the 📚 Subject tag) and tell us what you&apos;re studying.
            </p>
          </Section>

          <Section id="tips" icon="✨" title="Tips for studying">
            <ul className="list-disc pl-5 space-y-1.5">
              <li className={li}><span className={em}>Review daily.</span> Short, regular sessions beat occasional cramming — that&apos;s the whole point of spaced repetition.</li>
              <li className={li}><span className={em}>Rate honestly.</span> On flip cards, don&apos;t mark &quot;Easy&quot; if you guessed — accurate ratings make the schedule work.</li>
              <li className={li}><span className={em}>Clear Study Today first.</span> Knock out due reviews before learning new cards, so nothing slips.</li>
              <li className={li}><span className={em}>Keep the streak.</span> Even a few cards a day keeps momentum — and bonus XP — going.</li>
            </ul>
          </Section>

          <Section id="faq" icon="❓" title="FAQ">
            <div className="space-y-3">
              <FAQ q="Why does a subject show no progress?">
                Progress is per-person — a subject stays at zero until you&apos;ve studied its cards. Other learners&apos;
                progress never affects yours.
              </FAQ>
              <FAQ q="My progress didn't save.">
                You&apos;re probably browsing as a guest. Sign in (it&apos;s free) and your reviews start saving immediately.
              </FAQ>
              <FAQ q="I turned on notifications but got nothing.">
                Reminders only fire when you actually have cards due. Also check that your browser allowed notifications,
                and on iPhone make sure MODO is installed to your home screen.
              </FAQ>
              <FAQ q="Can I study offline?">
                Installed, MODO opens offline with a friendly screen — but reviewing needs a connection so your progress
                can be saved.
              </FAQ>
              <FAQ q="How do I change my name or avatar?">
                Open <span className={em}>Settings</span> — you can change your username, avatar, style and language any time.
              </FAQ>
            </div>
          </Section>

          {/* CTA */}
          <div
            className="mt-6 rounded-2xl border border-white/[0.08] p-6 text-center"
            style={{ background: `linear-gradient(160deg, ${ACCENT}12, transparent 70%)` }}
          >
            <p className="text-zinc-300 text-sm">Still have a question, or an idea to make MODO better?</p>
            <Link
              href="/feedback"
              className="inline-block mt-3 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${ACCENT}, #a855f7)` }}
            >
              Send feedback
            </Link>
          </div>
        </article>
      </div>
    </div>
  )
}
