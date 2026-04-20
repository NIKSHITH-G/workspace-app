"use client";

import { useRouter } from "next/navigation";
import BackgroundBoxes from "@/components/Boxes";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const actions = [
    { title: "Write", desc: "Notes & writing", route: "/write" },
    { title: "Code", desc: "Live playground", route: "/code" },
    { title: "Typing", desc: "Speed test", route: "/type" },
    { title: "Workspace", desc: "Saved work", route: "/workspace" },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "1") router.push("/write");
      if (e.key === "2") router.push("/code");
      if (e.key === "3") router.push("/type");
      if (e.key === "4") router.push("/workspace");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return (
    <div className="h-screen relative text-white flex items-center justify-center overflow-hidden">
      
      {/* Background */}
      <BackgroundBoxes />

      {/* Glow center */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] 
        bg-purple-500/10 rounded-full blur-3xl 
        -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-5xl px-6">
        
        {/* Title */}
        <h1 className="text-4xl mb-12 text-center font-semibold tracking-tight">
          What do you want to do?
        </h1>

        {/* Cards */}
        <div className="grid grid-cols-2 gap-6">
          {actions.map((item, i) => (
            <div
              key={i}
              onClick={() => router.push(item.route)}
              className="
                group relative p-6 rounded-2xl cursor-pointer
                bg-white/5 border border-white/10
                hover:bg-white/10 hover:border-white/20
                backdrop-blur-xl transition-all duration-300
                hover:scale-[1.03]
                active:scale-[0.98]
              "
            >
              <div className="relative z-10">
                <h2 className="text-xl font-medium mb-2">
                  {item.title}
                </h2>
                <p className="text-sm text-zinc-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-xs text-zinc-500 mt-8">
          Press 1–4 for quick access
        </p>

      </div>
    </div>
  );
}