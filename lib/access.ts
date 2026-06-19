import "server-only"
import { cache } from "react"
import { auth } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GUEST_COOKIE } from "./guestCookie"

export { GUEST_COOKIE }

// Read-only sentinel for guests. Guests NEVER write (see submitAttempt), so no
// row ever has this studentId — mastery/attempt reads for a guest return empty,
// which is exactly the "nothing saved" behaviour. It does not pool any data.
export const GUEST_STUDENT_ID = "__guest__"

export type Access =
  | { userId: string; isGuest: false; studentId: string }
  | { userId: null; isGuest: true; studentId: string }
  | { userId: null; isGuest: false; studentId: null }

/**
 * Who's making this request: a signed-in Clerk user, an explicit guest (chose
 * "Continue as guest" → `guest` cookie), or neither. Middleware already blocks
 * "neither" from protected routes, so pages can rely on user-or-guest.
 */
export const getAccess = cache(async (): Promise<Access> => {
  const { userId } = await auth()
  if (userId) return { userId, isGuest: false, studentId: userId }

  const isGuest = (await cookies()).get(GUEST_COOKIE)?.value === "1"
  if (isGuest) return { userId: null, isGuest: true, studentId: GUEST_STUDENT_ID }

  return { userId: null, isGuest: false, studentId: null }
})

/**
 * studentId guaranteed to be a string for protected content pages. Middleware
 * already redirects unauthenticated non-guests, so the redirect here is just a
 * type-level safety net.
 */
export async function requireStudentId(): Promise<string> {
  const { studentId } = await getAccess()
  if (studentId === null) redirect("/sign-in")
  return studentId
}
