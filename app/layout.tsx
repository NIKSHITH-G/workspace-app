import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { getUserTheme } from "@/lib/currentUser";
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
  const theme = await getUserTheme()
  const themeVars: Record<string, string> = {
    "--theme-primary": theme.primaryHex,
    "--theme-glow-rgb": theme.glowRgb,
  }

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
