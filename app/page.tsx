import Link from "next/link"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/currentUser"
import { db } from "@/lib/db"
import ModoTitle from "./ModoTitle"
import SubjectCatalog, { type CatalogSubject } from "./SubjectCatalog"
import { connection } from "next/server"
import { getTheme } from "@/lib/themes"
import { computeXp, levelProgress } from "@/lib/xp"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { localize } from "@/lib/i18n/localizeContent"
import { countDueCards } from "@/lib/due"
import { getAccess } from "@/lib/access"
import Landing from "./Landing"
import AvatarIcon from "@/components/AvatarIcon"
import NavMenu from "@/components/NavMenu"

export default async function Home() {
  await connection()

  // Signed-out visitors (and crawlers) get the public marketing page; only
  // signed-in users and explicit guests see the app dashboard below.
  const access = await getAccess()
  if (!access.studentId) return <Landing />

  const t = await getT()
  const user = await getUser()
  const meta = (user?.publicMetadata ?? {}) as Record<string, string>

  // Brand-new accounts must pick a username + style before reaching the app
  if (user && !meta.onboardingComplete) redirect("/onboarding")

  const theme = getTheme(meta.style)
  const avatarId = meta.avatar ?? "owl"
  const displayName = meta.displayName ?? user?.firstName ?? "PLAYER"

  const locale = await getLocale()
  const studentId = user?.id ?? "__none__"

  const [subjectRows, masteryRows, attempts, dueCount] = await Promise.all([
    db.subject.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      // select only what the catalog needs — avoid pulling every session's full
      // cheatSheet markdown and concept text just to compute progress counts.
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        category: true,
        status: true,
        sessions: {
          select: {
            concepts: {
              select: { masteryScores: { where: { studentId }, select: { score: true } } },
            },
          },
        },
      },
    }),
    user
      ? db.masteryScore.findMany({ where: { studentId: user.id }, select: { score: true } })
      : Promise.resolve([]),
    user
      ? db.attempt.findMany({ where: { studentId: user.id }, select: { correct: true, quality: true, createdAt: true } })
      : Promise.resolve([]),
    countDueCards(studentId),
  ])

  // Build the localized, DB-driven catalog (name/description translated per locale).
  const subjects: CatalogSubject[] = await Promise.all(
    subjectRows.map(async (s) => {
      const concepts = s.sessions.flatMap((sess) => sess.concepts)
      const total = concepts.length
      const mastered = concepts.filter((c) => (c.masteryScores[0]?.score ?? 0) >= 0.7).length
      const comingSoon = s.status === "coming_soon"
      return {
        id: s.id,
        slug: s.slug,
        href: comingSoon ? null : `/subject/${s.id}`,
        name: await localize("subject", s.id, "name", s.name, locale),
        description: await localize("subject", s.id, "description", s.description ?? "", locale),
        category: s.category,
        comingSoon,
        total,
        mastered,
      }
    }),
  )

  const masteredCount = masteryRows.filter((r) => r.score >= 0.7).length
  const xp = computeXp(attempts, masteredCount)
  const progress = levelProgress(xp.total)
  const level = progress.level
  const progressPct = progress.pct

  return (
    <div className="min-h-screen bg-[#080810] text-white flex flex-col overflow-hidden">
      {/* ── nav bar ── */}
      <nav
        className="relative z-30 flex items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3 border-b border-white/[0.05]"
        style={{ minHeight: 60 }}
      >
        {/* left: character info */}
        {meta.onboardingComplete && user ? (
          <Link href="/settings" className="group flex items-center gap-3 min-w-0" style={{ textDecoration: "none" }}>
            {/* avatar */}
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                fontSize: 20,
                flexShrink: 0,
                background: `${theme.primaryHex}18`,
                border: `1px solid ${theme.primaryHex}33`,
              }}
            >
              <AvatarIcon id={avatarId} size={20} style={{ color: theme.primaryHex }} />
            </div>
            {/* name + class + level */}
            <div className="flex flex-col" style={{ gap: 3 }}>
              <div className="flex items-center" style={{ gap: 7 }}>
                <span className="text-xs font-bold text-white tracking-wide leading-none truncate max-w-[90px] sm:max-w-[140px]">{displayName}</span>
                <span
                  className="font-mono leading-none shrink-0"
                  style={{ fontSize: 9, padding: "2px 5px", borderRadius: 4, color: theme.primaryHex, border: `1px solid ${theme.primaryHex}44`, background: `${theme.primaryHex}11` }}
                >
                  LVL {level}
                </span>
                {xp.currentStreak > 0 && (
                  <span className="font-mono leading-none text-orange-400" style={{ fontSize: 9 }} title={`${xp.currentStreak}-day streak`}>
                    🔥 {xp.currentStreak}
                  </span>
                )}
              </div>
              <div className="flex items-center" style={{ gap: 7 }}>
                <span className="font-mono leading-none opacity-80" style={{ fontSize: 9, letterSpacing: "0.18em", color: theme.primaryHex }}>
                  {theme.class}
                </span>
                {/* XP bar — progress to next level */}
                <div
                  title={`${xp.total.toLocaleString()} XP · ${progress.toNext.toLocaleString()} to next level`}
                  style={{ width: 64, height: 3, borderRadius: 999, overflow: "hidden", background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    style={{ height: "100%", width: `${progressPct}%`, borderRadius: 999, background: `linear-gradient(90deg, ${theme.primaryHex}88, ${theme.primaryHex})` }}
                  />
                </div>
                <span className="font-mono leading-none text-zinc-600 hidden sm:inline" style={{ fontSize: 8.5 }}>
                  {xp.total.toLocaleString()} XP
                </span>
              </div>
            </div>
          </Link>
        ) : !user ? (
          <Link href="/sign-in" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            {t("home.signInToSave")}
          </Link>
        ) : (
          <Link
            href="/settings"
            className="group flex items-center gap-2.5"
            style={{ textDecoration: "none" }}
          >
            <div
              className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ width: 38, height: 38, borderRadius: 10, fontSize: 20, flexShrink: 0, background: `${theme.primaryHex}18`, border: `1px solid ${theme.primaryHex}33` }}
            >
              <AvatarIcon id={avatarId} size={20} style={{ color: theme.primaryHex }} />
            </div>
            <div className="flex flex-col" style={{ gap: 3 }}>
              <span className="text-xs font-bold text-white leading-none">{t("home.setupProfile")}</span>
              <span className="font-mono leading-none opacity-80" style={{ fontSize: 9, letterSpacing: "0.12em", color: theme.primaryHex }}>
                {t("home.pickUsernameStyle")}
              </span>
            </div>
          </Link>
        )}

        {/* right: hamburger menu (leaderboard + sign-in/exit or settings/sign-out) */}
        <NavMenu isGuest={!user} />
      </nav>

      {/* ── hero + grid ── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[110px] pointer-events-none"
          style={{ background: `rgba(${theme.glowRgb},0.09)` }}
        />

        {/* MODO title */}
        <div className="relative z-10 text-center mb-10">
          <ModoTitle gradientCss={theme.titleGradientCss} />
          <p className="text-zinc-600 text-[11px] tracking-[0.32em] uppercase mt-3 font-light">
            {t("home.tagline")}
          </p>
        </div>

        {/* Study Today — one daily queue of all due cards across subjects */}
        {dueCount > 0 && (
          <Link
            href="/today"
            className="relative z-10 mb-8 group flex items-center gap-3 rounded-2xl px-5 py-3 transition-transform hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryHex}26, ${theme.primaryHex}0d)`,
              border: `1px solid ${theme.primaryHex}55`,
            }}
          >
            <span
              className="flex items-center justify-center shrink-0"
              style={{ width: 34, height: 34, borderRadius: 9, fontSize: 17, background: `${theme.primaryHex}22` }}
            >
              ⚡
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-white">{t("today.cta")}</span>
              <span className="text-[11px]" style={{ color: theme.primaryHex }}>
                {t("today.due", { count: dueCount })}
              </span>
            </span>
            <span className="ml-1 text-zinc-400 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        )}

        {/* subject catalog — searchable, scales to any number of subjects */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <SubjectCatalog subjects={subjects} primaryHex={theme.primaryHex} />
        </div>

        <p className="relative z-10 mt-7 text-[10px] text-zinc-700 tracking-[0.25em] uppercase">
          {t("home.searchHint")}
        </p>
      </main>
    </div>
  )
}
