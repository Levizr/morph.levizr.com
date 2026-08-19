import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { GoogleAnalytics } from "@/lib/analytics";
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
  title: "Morph — Native UI from JSX + CSS",
  description:
    "A compiler-based UI framework that compiles .mx files into lightweight native binaries with OpenGL rendering. No browser. No Electron. Under 1 MB.",
  keywords: [
    "morph",
    "native",
    "UI",
    "framework",
    "JSX",
    "CSS",
    "OpenGL",
    "compiler",
    "levizr",
  ],
  openGraph: {
    title: "Morph — Native UI from JSX + CSS",
    description:
      "Write web code. Ship native apps. Under 1 MB.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
