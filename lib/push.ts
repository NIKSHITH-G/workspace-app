import "server-only"
import webpush from "web-push"

const PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const PRIVATE = process.env.VAPID_PRIVATE_KEY

let configured = false
function ensureConfigured(): boolean {
  if (configured) return true
  if (!PUBLIC || !PRIVATE) return false
  webpush.setVapidDetails("mailto:nikshith.online@gmail.com", PUBLIC, PRIVATE)
  configured = true
  return true
}

export type PushPayload = { title: string; body: string; url?: string }
export type StoredSub = { endpoint: string; p256dh: string; auth: string }

/**
 * Send a push to one subscription. Returns "gone" if the subscription has
 * expired/been removed (HTTP 404/410) so the caller can delete the dead row.
 */
export async function sendPushTo(sub: StoredSub, payload: PushPayload): Promise<"ok" | "gone" | "error"> {
  if (!ensureConfigured()) return "error"
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload),
    )
    return "ok"
  } catch (e: unknown) {
    const code = (e as { statusCode?: number })?.statusCode
    if (code === 404 || code === 410) return "gone"
    return "error"
  }
}
