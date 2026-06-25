"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { sendFeedbackEmail } from "@/lib/email"

// Store a feedback message + email a copy. Works for signed-in users and guests.
export async function submitFeedback(message: string): Promise<{ ok: boolean; error?: string }> {
  const trimmed = (message ?? "").trim()
  if (trimmed.length < 3) return { ok: false, error: "Please write a little more." }
  if (trimmed.length > 2000) return { ok: false, error: "That's a bit long — keep it under 2000 characters." }

  const { userId } = await auth()
  await db.feedback.create({ data: { userId: userId ?? null, message: trimmed } })
  await sendFeedbackEmail(trimmed, userId ?? null) // best-effort; never throws
  return { ok: true }
}
