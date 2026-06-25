import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { GUEST_COOKIE } from "@/lib/guestCookie"

// Only the auth screens are truly public — you must sign in OR choose
// "Continue as guest" before reaching anything else (no silent guest spawn).
// PWA assets (offline fallback, generated icons) must also be reachable without
// auth so the service worker can precache them and they load when signed out.
const isPublic = createRouteMatcher([
  "/", // public marketing landing — the page itself shows the app to signed-in users/guests
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/offline",
  "/icons(.*)",
  "/apple-icon(.*)",
])

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
