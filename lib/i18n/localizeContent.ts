import "server-only"
import { db } from "@/lib/db"
import { translateText } from "@/lib/translate"
import { DEFAULT_LOCALE, type Locale } from "./config"

type Entity = "subject" | "session" | "concept" | "exercise"

/**
 * Return `source` translated into `locale`, cached in the ContentTranslation
 * table so each English string is machine-translated at most once per locale.
 * English (or empty) is a no-op. Falls back to the source text on any failure
 * so content always renders.
 */
export async function localize(
  entity: Entity,
  entityId: string,
  field: string,
  source: string | null | undefined,
  locale: Locale,
): Promise<string> {
  if (!source) return source ?? ""
  if (locale === DEFAULT_LOCALE) return source

  const key = { entity, entityId, field, locale }

  const cached = await db.contentTranslation.findUnique({
    where: { entity_entityId_field_locale: key },
  })
  if (cached) return cached.text

  let text: string
  try {
    text = await translateText(source, locale)
  } catch {
    return source
  }

  // Store for next time; ignore unique-constraint races from concurrent renders.
  try {
    await db.contentTranslation.create({ data: { ...key, text } })
  } catch {
    /* already cached by a concurrent request — fine */
  }

  return text
}
