<div align="center">

```
 __  __  ____  ____   ___
|  \/  |/ __ \|  _ \ / _ \
| |\/| | |  | | | | | | | |
| |  | | |__| | |_| | |_| |
|_|  |_|\____/|____/ \___/

  s t u d y   s m a r t e r
```

### 🧠 flashcards that actually **stick** 🧠

*Cram less. Remember more. Never forget a `def` again.*

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma)
![Vibes](https://img.shields.io/badge/Vibes-immaculate-a855f7?style=for-the-badge)
![XP](https://img.shields.io/badge/%2B10_XP-for_reading_this-22C55E?style=for-the-badge)

</div>

---

## 🎯 what even is this

MODO is a **spaced-repetition flashcard app** that schedules reviews with the
**SM-2 algorithm** — the same math behind Anki, but with XP, streaks, a
leaderboard, and 10 languages bolted on so studying feels less like eating
your vegetables and more like a game you're weirdly invested in at 1am.

You review a card *right before you'd forget it*. That's the whole trick.
No cramming, no re-reading a textbook for the fifth time, no lies to
yourself about "I'll remember this."

> Sign up → pick a subject → review cards → get better at the subject.
> Revolutionary, we know.

---

## 🃏 the loop

```
   ┌─────────────┐      answer well       ┌──────────────────┐
   │  card is due │ ───────────────────▶  │ pushed further out │
   └─────────────┘                        └──────────────────┘
          ▲                                         │
          │            struggle / forget            │
          └─────────────────────────────────────────┘
                     card comes back sooner
```

- **Multiple-choice** cards — pick the answer, get the explanation.
- **Flip** cards — reveal, then rate yourself honestly: `Again · Hard · Good · Easy`.
- Score a concept past **70%** → it's **Mastered** 🏅
- **Study Today** scoops every due card across every subject you've touched into one queue, gated by a **daily goal** (20 reviews) so you actually have a finish line.
- **Concept Graph** — an interactive dependency map per session, laid out in topological levels and colored by mastery, so you can see *what to learn before what* instead of guessing.

---

## ⚡ number-go-up department

Yes, there's a whole reward system. No, we're not sorry.

| do this | get this |
|---|---|
| ✅ Correct answer | **+10 XP** (up to +10 bonus for nailing "Easy") |
| ❌ Wrong answer | **+2 XP** — showing up still counts |
| 🏅 Master a concept | **+50 XP** |
| 🔥 Daily streak | **+5 XP × streak length** (caps at 7 days) |

Levels ride a curve — L2 @ 100 XP, L3 @ 400, L4 @ 900, L5 @ 1,600 — climbing
in a bar right in your home header. Miss a day and your 🔥 streak resets, so
no pressure, but also, some pressure.

Then there's the **leaderboard** — sortable by Level, Solved, Mastered, or
Streak — because nothing motivates quite like knowing some stranger named
`ShadowFox94` is three levels ahead of you.

---

## 🎨 make it yours

**5 styles**, each repainting the entire app's accent color:

| style | vibe | color |
|---|---|---|
| The Scholar | calm, blue, dependable | `#3B82F6` |
| The Warrior | loud, orange, unstoppable | `#F97316` |
| The Shadow | mysterious, purple | `#A855F7` |
| The Sage | grounded, green | `#22C55E` |
| The Maverick | gold, chaotic-good | `#EAB308` |

**6 avatars**: 🦉 Owl · 🦊 Fox · 🐺 Wolf · 🐉 Dragon · 🐱 Cat · 🤖 Robot

**10 languages**, right down to full RTL layout for Arabic and Hebrew — not
just flipped text, the whole UI mirrors:

`English · 日本語 · 한국어 · العربية · Русский · हिन्दी · 中文 · Ελληνικά · עברית · ไทย`

---

## 📊 for the data-curious

Every session has an **Analytics** tab: mastery %, concepts mastered, cards
due, accuracy, a per-concept breakdown (New / Learning / Mastered), and a
mini history of your recent answers per concept — so your weak spots can't
hide from you.

---

## 🔐 the boring-but-important part

- Auth is handled by **Clerk** — your email, password, and Google login
  never touch MODO's database. We only ever see an anonymous account ID.
- We store: your chosen **username**, avatar, style, review history, and
  mastery. That's it.
- We do **not** store your email, password, or payment info. There is no
  payment info. This app is free and has no idea what a credit card is.
- XP, levels, and streaks are **computed**, not stored — always accurate,
  always retroactive.
- **Guest mode** exists if you just want to poke around — nothing is saved
  until you sign in.

---

## 🛠️ built with

```
Next.js 16 (App Router · Turbopack)   React 19        Prisma 7
Clerk (auth)                          Turso / libSQL   Tailwind 4
Resend (email)                        web-push          KaTeX + react-markdown
```

Content (subjects, sessions, flashcards) is **hand-authored**, not spun up
live by an LLM at request time — every card in the catalog was written on
purpose, then piped through a static seed script into the DB.

---

## 🚀 getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, hit
**Try as guest**, or just stare at the landing page — no judgment.

Useful scripts:

```bash
npm run db:studio      # poke around the database visually
npm run i18n:ui        # regenerate translation dictionaries
npm run seed:catalog   # seed the subject catalog
```

---

<div align="center">

**MODO** · study smarter

*review daily · rate honestly · keep the streak alive*

</div>
