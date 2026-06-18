import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { getTheme } from "@/lib/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MODO",
    template: "%s | MODO",
  },
  description: "Master anything.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read user theme server-side so CSS vars are set before first paint
  let themeVars: Record<string, string> = {}
  try {
    const user = await currentUser()
    const meta = (user?.publicMetadata ?? {}) as Record<string, string>
    const theme = getTheme(meta.style)
    themeVars = {
      "--theme-primary": theme.primaryHex,
      "--theme-glow-rgb": theme.glowRgb,
    }
  } catch {}

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={themeVars as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col bg-[#080810] text-white">
        <ClerkProvider afterSignOutUrl="/sign-in">{children}</ClerkProvider>
      </body>
    </html>
  );
}
