"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

type WebSub = { endpoint: string; keys: { p256dh: string; auth: string } }

// Store a browser's push subscription against the signed-in user (guests can't
// subscribe — nothing to notify). One row per endpoint; re-subscribing updates it.
export async function subscribeToPush(sub: WebSub): Promise<{ ok: boolean }> {
  const { userId } = await auth()
  if (!userId || !sub?.endpoint || !sub?.keys?.p256dh || !sub?.keys?.auth) return { ok: false }
  await db.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    create: { userId, endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
    update: { userId, p256dh: sub.keys.p256dh, auth: sub.keys.auth },
  })
  return { ok: true }
}

export async function unsubscribeFromPush(endpoint: string): Promise<{ ok: boolean }> {
  const { userId } = await auth()
  if (!userId) return { ok: false }
  await db.pushSubscription.deleteMany({ where: { endpoint, userId } })
  return { ok: true }
}
