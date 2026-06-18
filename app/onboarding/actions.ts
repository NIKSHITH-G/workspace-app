"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function completeOnboarding(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error("Not authenticated")

  const avatar = formData.get("avatar") as string
  const style = formData.get("style") as string
  const displayName = formData.get("displayName") as string

  const client = await clerkClient()
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: true,
      avatar,
      style,
      displayName,
    },
  })

  redirect("/")
}
