import { redirect } from "next/navigation"
import { getUser } from "@/lib/currentUser"
import OnboardingClient from "./OnboardingClient"

export default async function OnboardingPage() {
  const user = await getUser()
  if (!user) redirect("/sign-in")

  // Already onboarded — go home
  const meta = (user.publicMetadata ?? {}) as Record<string, unknown>
  if (meta.onboardingComplete) redirect("/")

  return <OnboardingClient />
}
