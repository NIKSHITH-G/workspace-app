import "server-only"
import { getLocale } from "./locale"
import { getDictionary } from "./dictionaries"
import { makeT, type TFunc } from "./t"

/**
 * Server-component translator: resolves the request locale, loads its
 * dictionary, and returns a bound `t(path, vars?)`. Usage:
 *   const t = await getT()
 *   ...{t("settings.title")}
 */
export async function getT(): Promise<TFunc> {
  const locale = await getLocale()
  const dict = await getDictionary(locale)
  return makeT(dict)
}
