import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import OnboardingClient from "./OnboardingClient"

export default async function OnboardingPage() {
  const { userId, sessionClaims } = await auth()
  if (!userId) redirect("/sign-in")

  // Already onboarded — go home
  if ((sessionClaims?.metadata as Record<string, unknown>)?.onboardingComplete) {
    redirect("/")
  }

  return <OnboardingClient />
}
