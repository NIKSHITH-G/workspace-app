"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { sanitizeProfile } from "@/lib/profile"
import { LOCALE_COOKIE } from "@/lib/i18n/config"
import { THEME_COOKIE } from "@/lib/currentUser"
import { db } from "@/lib/db"

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Not authenticated")

  const { avatar, style, language, displayName } = sanitizeProfile({
    avatar: formData.get("avatar") as string | null,
    style: formData.get("style") as string | null,
    language: formData.get("language") as string | null,
    displayName: formData.get("displayName") as string | null,
  })

  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
      avatar,
      style,
      language,
      displayName,
    },
  })

  await db.profile.upsert({
    where: { userId },
    create: { userId, displayName, avatar, style },
    update: { displayName, avatar, style },
  })

  const cookieStore = await cookies()
  const opts = { maxAge: 60 * 60 * 24 * 365, path: "/", sameSite: "lax" as const }
  cookieStore.set(LOCALE_COOKIE, language, opts)
  cookieStore.set(THEME_COOKIE, style, opts)

  redirect("/")
}
