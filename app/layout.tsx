"use client"

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

import { ViewTransitions } from "next-view-transitions"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navigation from "@/components/ui/navigation"
import Footer from "@/components/ui/footer"
import { Providers } from "./providers"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as ReactHostToast } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  // Hide layout on login page
  const hideLayout = pathname === "/login"

  // Handle session redirect
  useEffect(() => {
    const stored = localStorage.getItem("session_expiry")

    // Not logged in → redirect to /login
    if (!stored && pathname !== "/login") {
      router.replace("/login")
      return
    }

    // Logged in → check expiration
    if (stored) {
      const session = JSON.parse(stored)
      const expired = Date.now() - session.timestamp > 3600_000 // 1 hour

      if (expired) {
        localStorage.removeItem("session_expiry")
        router.replace("/login")
      } else if (pathname === "/login") {
        // Logged in but visiting login → redirect home
        router.replace("/")
      }
    }
  }, [pathname, router])

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <title>The Sector: Stock Quotes, Market News, & Analysis</title>
        <body
          className={`${inter.className} bg-background antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
        >
          <Providers>
            <Toaster />
            <ReactHostToast />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {!hideLayout && <Navigation />}
              <main>{children}</main>
              {!hideLayout && <Footer />}
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
