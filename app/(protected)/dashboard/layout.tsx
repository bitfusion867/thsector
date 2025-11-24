// app/(protected)/layout.tsx
"use client"

import { ReactNode } from "react"
import { Home, TrendingUp, History, Settings, Bell, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAccount, useDisconnect } from "wagmi"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Stocks", href: "/dashboard/stocks", icon: TrendingUp },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()
  const pathname = usePathname()

  if (!isConnected) {
    router.replace("/")
    return null
  }

  const NavLink = ({ item, isMobile = false }: { item: typeof navItems[0]; isMobile?: boolean }) => {
    const Icon = item.icon
    const isActive = pathname === item.href

    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`
            w-full justify-start gap-3 h-12 rounded-xl transition
            ${isActive
              ? "bg-emerald-500/10 text-emerald-400 font-semibold shadow-md"
              : "hover:bg-emerald-500/5 hover:text-emerald-400 hover:shadow-sm"
            }
            ${isMobile ? "flex-col h-16 text-xs" : "text-left"}
            transition-all duration-200
          `}
        >
          <Icon className={`h-5 w-5 ${isMobile ? "h-6 w-6" : ""}`} />
          <span>{item.name}</span>
        </Button>
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col border-r bg-card/50 backdrop-blur-xl">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            {/* <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg" />
              <Image
                src="/logo.jpg"
                width={60}
                height={60}
                alt="Site Logo"
                className="rounded-xl shadow-md mb-6"
              />
            </div> */}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </nav>

          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
              onClick={() => disconnect()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Disconnect Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg" />
                      <h2 className="text-2xl font-black text-emerald-400">The Sector</h2>
                    </div>
                  </div>
                  <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                      <NavLink key={item.name} item={item} />
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-4 ml-auto">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-muted-foreground">Connected</p>
                  <p className="text-sm font-mono font-bold">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </p>
                </div>
                <Avatar className="h-9 w-9 ring-2 ring-emerald-500/20">
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold text-xs">
                    {address?.slice(2, 4).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t lg:hidden z-50">
        <div className="grid grid-cols-4 h-20">
          {navItems.map((item) => (
            <NavLink key={item.name} item={item} isMobile />
          ))}
        </div>
      </div>
    </div>
  )
}