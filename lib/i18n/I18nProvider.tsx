"use client"

import { createContext, useContext, useMemo } from "react"
import type { Locale } from "./config"
import { makeT, type TFunc } from "./t"

type I18nValue = { locale: Locale; t: TFunc }

const I18nContext = createContext<I18nValue | null>(null)

/**
 * Holds the active locale's dictionary (passed from the server layout as a
 * plain JSON prop) so client components can call `useT()`. The dict is already
 * resolved + merged server-side — the client just reads from it.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale
  dict: unknown
  children: React.ReactNode
}) {
  const value = useMemo<I18nValue>(() => ({ locale, t: makeT(dict) }), [locale, dict])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>")
  return ctx
}

/** Convenience: just the `t` function. */
export function useT(): TFunc {
  return useI18n().t
}
