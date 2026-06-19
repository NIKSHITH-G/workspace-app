import Link from "next/link"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { connection } from "next/server"
import Markdown from "@/components/Markdown"
import { getT } from "@/lib/i18n/server"
import { getLocale } from "@/lib/i18n/locale"
import { localize } from "@/lib/i18n/localizeContent"

export default async function CheatSheetPage(
  props: PageProps<"/subject/[subjectId]/session/[sessionId]/cheatsheet">,
) {
  await connection()
  const t = await getT()
  const { subjectId, sessionId } = await props.params

  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { subject: true },
  })

  if (!session || session.subject.id !== subjectId) notFound()

  const locale = await getLocale()
  const cheatSheet = await localize("session", session.id, "cheatSheet", session.cheatSheet, locale)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href={`/subject/${subjectId}/session/${sessionId}`}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← {session.title}
          </Link>
          <h1 className="text-xl font-semibold tracking-tight mt-3">{t("cheatsheet.title")}</h1>
        </div>

        {session.cheatSheet ? (
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
            <Markdown>{cheatSheet}</Markdown>
          </div>
        ) : (
          <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">{t("cheatsheet.empty")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
