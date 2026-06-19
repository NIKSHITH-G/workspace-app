import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { GUEST_COOKIE } from "@/lib/guestCookie"

// Only the auth screens are truly public — you must sign in OR choose
// "Continue as guest" before reaching anything else (no silent guest spawn).
const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

export const proxy = clerkMiddleware(async (auth, req) => {
  if (isPublic(req)) return

  const { userId } = await auth()
  const isGuest = req.cookies.get(GUEST_COOKIE)?.value === "1"

  // Allow signed-in users and explicit guests; send everyone else to sign-in.
  if (!userId && !isGuest) {
    return NextResponse.redirect(new URL("/sign-in", req.url))
  }
})

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
