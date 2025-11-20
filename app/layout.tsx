import type { Metadata } from "next"
import { headers } from 'next/headers' // added
import { Inter } from "next/font/google"
import "./globals.css"
import { ViewTransitions } from "next-view-transitions"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Navigation from "@/components/ui/navigation"
import Footer from "@/components/ui/footer"
import { Providers } from "./providers"
// import ContextProvider from "@/lib/wallet/context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Sector: Stock Quotes, Market News, & Analysis",
  description:
    "Own fractional shares of Apple, Tesla, Nvidia and 300+ U.S. stocks — instantly settled on-chain.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // const headersObj = await headers();
  // const cookies = headersObj.get('cookie')

  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className} min-h-screen bg-background pb-6 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black`}
        >
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navigation />
              <main className="container">{children}</main>
              <Footer />
            </ThemeProvider>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
