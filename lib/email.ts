import "server-only"
import { Resend } from "resend"

const KEY = process.env.RESEND_API_KEY
// "from" must be a Resend-verified domain; the shared onboarding sender works for
// emailing your own Resend account address without verifying a domain.
const FROM = process.env.RESEND_FROM || "MODO Feedback <onboarding@resend.dev>"
const TO = process.env.FEEDBACK_TO_EMAIL || "nikshith.online@gmail.com"

// Best-effort: emails you when feedback arrives. No-ops if RESEND_API_KEY isn't
// set, and never throws (feedback is already saved to the DB regardless).
export async function sendFeedbackEmail(message: string, userId: string | null): Promise<void> {
  if (!KEY) return
  try {
    const resend = new Resend(KEY)
    await resend.emails.send({
      from: FROM,
      to: TO,
      subject: "📬 New MODO feedback",
      text: `From: ${userId ?? "guest / anonymous"}\nWhen:  ${new Date().toUTCString()}\n\n${message}\n`,
    })
  } catch (e) {
    console.error("[feedback email] failed to send:", e)
  }
}
