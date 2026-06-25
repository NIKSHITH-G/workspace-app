import Link from "next/link"
import { connection } from "next/server"
import FlashcardReview from "@/app/subject/[subjectId]/session/[sessionId]/review/FlashcardReview"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { requireStudentId } from "@/lib/access"
import { getDueQueue, countTodayReviews, DAILY_GOAL } from "@/lib/due"

// "Study Today" — one daily review queue pulling every due card across all
// subjects, so spaced repetition has a single home instead of being buried
// per-session.
export default async function TodayPage() {
  await connection()
  const t = await getT()
  const studentId = await requireStudentId()
  const locale = await getLocale()

  const [cards, reviewedToday] = await Promise.all([
    getDueQueue(studentId, locale),
    countTodayReviews(studentId),
  ])
  const goalPct = Math.min(100, Math.round((reviewedToday / DAILY_GOAL) * 100))
  const goalDone = reviewedToday >= DAILY_GOAL

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: t("today.title") }]} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">{t("today.title")}</h1>
          {cards.length > 0 && (
            <p className="text-sm text-zinc-500 mt-1">{t("today.subtitle", { count: cards.length })}</p>
          )}
        </div>

        {/* daily goal */}
        <div className="mb-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-zinc-400 font-medium">{t("today.goal")}</span>
            <span className={goalDone ? "text-emerald-400" : "text-zinc-500"}>
              {goalDone ? t("today.goalDone") : t("today.goalProgress", { done: reviewedToday, total: DAILY_GOAL })}
            </span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPct}%`, background: goalDone ? "#34d399" : "var(--theme-primary,#6366f1)" }}
            />
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="text-center mt-16 space-y-3">
            <div className="text-4xl" aria-hidden>
              🎉
            </div>
            <p className="text-emerald-400 text-sm font-medium">{t("today.allCaught")}</p>
            <p className="text-zinc-500 text-sm max-w-xs mx-auto leading-relaxed">{t("today.allCaughtSub")}</p>
            <Link
              href="/"
              className="inline-block mt-2 text-xs text-zinc-400 hover:text-white underline underline-offset-4 transition-colors"
            >
              {t("today.browse")}
            </Link>
          </div>
        ) : (
          <FlashcardReview cards={cards} subjectId="" sessionId="" />
        )}
      </div>
    </div>
  )
}
