import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { getUserTheme } from "@/lib/currentUser";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { dirFor } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
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
  // Resolves relative OG/canonical URLs to absolute ones on the live domain.
  // Override per-environment with NEXT_PUBLIC_SITE_URL if the primary host changes.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://themodo.in"),
  title: {
    default: "MODO",
    template: "%s | MODO",
  },
  description:
    "MODO is a spaced-repetition flashcard app to master Python, math, databases and computer architecture — learn it once and remember it for good.",
  applicationName: "MODO",
  keywords: ["flashcards", "spaced repetition", "study app", "Python", "databases", "learn"],
  openGraph: {
    title: "MODO — Master anything",
    description: "Spaced-repetition flashcards that actually stick. Learn Python, math, databases and more.",
    siteName: "MODO",
    type: "website",
  },
  // Installable PWA: standalone iOS launch + matching home-screen title.
  appleWebApp: {
    capable: true,
    title: "MODO",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#080810",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read user theme + locale server-side so CSS vars and language are set before first paint
  const [theme, locale] = await Promise.all([getUserTheme(), getLocale()])
  const dict = await getDictionary(locale)
  const themeVars: Record<string, string> = {
    "--theme-primary": theme.primaryHex,
    "--theme-glow-rgb": theme.glowRgb,
  }

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={themeVars as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col bg-[#080810] text-white">
        <ServiceWorkerRegister />
        <I18nProvider locale={locale} dict={dict}>
          <ClerkProvider afterSignOutUrl="/sign-in">{children}</ClerkProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
