"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { sanitizeProfile } from "@/lib/profile"
import { LOCALE_COOKIE } from "@/lib/i18n/config"

export async function saveSettings(formData: FormData) {
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

  // Set the locale cookie so SSR reflects the new language on the next request.
  ;(await cookies()).set(LOCALE_COOKIE, language, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  })

  revalidatePath("/")
  revalidatePath("/settings")
}
