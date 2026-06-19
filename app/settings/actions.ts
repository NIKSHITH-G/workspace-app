"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { sanitizeProfile } from "@/lib/profile"

export async function saveSettings(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Not authenticated")

  const { avatar, style, displayName } = sanitizeProfile({
    avatar: formData.get("avatar") as string | null,
    style: formData.get("style") as string | null,
    displayName: formData.get("displayName") as string | null,
  })

  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
      avatar,
      style,
      displayName,
    },
  })

  revalidatePath("/")
  revalidatePath("/settings")
}
