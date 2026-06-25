"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { GUEST_COOKIE } from "@/lib/access"

/** Enter the app as a guest: set the guest marker cookie, then go to the catalog. */
export async function continueAsGuest() {
  ;(await cookies()).set(GUEST_COOKIE, "1", {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  })
  redirect("/")
}

/** Leave guest mode: clear the marker cookie so "/" shows the landing page again. */
export async function exitGuest() {
  ;(await cookies()).delete(GUEST_COOKIE)
  redirect("/")
}
