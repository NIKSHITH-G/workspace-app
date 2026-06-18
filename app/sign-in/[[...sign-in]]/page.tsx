import { SignIn } from "@clerk/nextjs"
import Link from "next/link"
import ModoTitle from "@/app/ModoTitle"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#080810] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* layered background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full blur-[140px]"
          style={{ background: "rgba(99,102,241,0.10)" }} />
        <div className="absolute bottom-[-5%] right-[15%] w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: "rgba(168,85,247,0.07)" }} />
        <div className="absolute top-[40%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px]"
          style={{ background: "rgba(59,130,246,0.06)" }} />
      </div>

      {/* subtle grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative z-10 mb-8 text-center">
        <ModoTitle />
        <p className="text-zinc-600 text-[10px] tracking-[0.35em] uppercase mt-2 font-light">
          master anything
        </p>
      </div>

      <div className="relative z-10 w-full flex justify-center clerk-dark-override">
        <SignIn
          appearance={{
            variables: {
              colorBackground: "#111116",
              colorInput: "#18181f",
              colorInputForeground: "#ffffff",
              colorForeground: "#a1a1aa",
              colorMutedForeground: "#71717a",
              colorPrimary: "#6366f1",
              colorDanger: "#f87171",
              borderRadius: "0.75rem",
            },
          }}
        />
      </div>

      <div className="relative z-10 mt-5 flex items-center gap-4 text-xs text-zinc-600">
        <Link href="/sign-up" className="hover:text-indigo-400 transition-colors">
          Create account
        </Link>
        <span className="opacity-30">·</span>
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          Browse as guest <span className="opacity-60">→</span>
        </Link>
      </div>

    </div>
  )
}
