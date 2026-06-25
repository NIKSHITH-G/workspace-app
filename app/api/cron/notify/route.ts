import { db } from "@/lib/db"
import { sendPushTo } from "@/lib/push"
import { countDueCards } from "@/lib/due"

// Daily reminder cron (configured in vercel.json). For every user with a push
// subscription and cards due, send "N cards due". Vercel attaches
// `Authorization: Bearer <CRON_SECRET>` so we can reject anything else.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 })
  }

  const subs = await db.pushSubscription.findMany()
  const byUser = new Map<string, typeof subs>()
  for (const s of subs) {
    const list = byUser.get(s.userId) ?? []
    list.push(s)
    byUser.set(s.userId, list)
  }

  let sent = 0
  let notified = 0
  for (const [userId, list] of byUser) {
    const due = await countDueCards(userId)
    if (due <= 0) continue
    notified++
    const payload = {
      title: "MODO",
      body: `You have ${due} card${due === 1 ? "" : "s"} due — keep your streak alive 🔥`,
      url: "/today",
    }
    for (const s of list) {
      const res = await sendPushTo(s, payload)
      if (res === "ok") sent++
      else if (res === "gone") await db.pushSubscription.delete({ where: { id: s.id } }).catch(() => {})
    }
  }

  return Response.json({ ok: true, users: byUser.size, notified, sent })
}
