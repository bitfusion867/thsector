// components/layout/Navigation.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X , Home} from "lucide-react"

import { ThemeToggle } from "./theme-toggle"
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import  CommandMenu  from "./command-menu"
import { useState } from "react"


export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => pathname === href

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            The Sector
          </div>
        </Link>

        {/* Right Side – Wallet + Controls */}
        <div className="flex items-center gap-4">
          <CommandMenu />
          <ThemeToggle />

          {/* Desktop Wallet Button */}
          <div className="hidden md:block">
            <WalletConnectButton />
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-8 pt-8">

                <div className="border-t pt-6">
                  <WalletConnectButton />
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>© {new Date().getFullYear()} YourApp</p>
                  <p>Non-custodial • On-chain settlement</p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}