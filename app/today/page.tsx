import Link from "next/link"
import { connection } from "next/server"
import FlashcardReview from "@/app/subject/[subjectId]/session/[sessionId]/review/FlashcardReview"
import TopNav from "@/app/TopNav"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { requireStudentId } from "@/lib/access"
import { getDueQueue } from "@/lib/due"

// "Study Today" — one daily review queue pulling every due card across all
// subjects, so spaced repetition has a single home instead of being buried
// per-session.
export default async function TodayPage() {
  await connection()
  const t = await getT()
  const studentId = await requireStudentId()
  const locale = await getLocale()

  const cards = await getDueQueue(studentId, locale)

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      <TopNav crumbs={[{ label: t("today.title") }]} />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-xl font-semibold tracking-tight">{t("today.title")}</h1>
          {cards.length > 0 && (
            <p className="text-sm text-zinc-500 mt-1">{t("today.subtitle", { count: cards.length })}</p>
          )}
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
