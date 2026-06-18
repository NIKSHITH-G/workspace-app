import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getTheme } from "@/lib/themes"
import SettingsClient from "./SettingsClient"

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const meta = (user.publicMetadata ?? {}) as Record<string, string>
  const theme = getTheme(meta.style)

  return (
    <SettingsClient
      theme={theme}
      initialName={meta.displayName ?? user.firstName ?? ""}
      initialAvatar={meta.avatar ?? "owl"}
      initialStyle={meta.style ?? "scholar"}
    />
  )
}
