// app/(protected)/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Wallet, Bell, Menu, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount } from "wagmi"
import { StockCard } from "@/components/dashboard/StockCard"
import { PortfolioChart } from "@/components/dashboard/PortfolioChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { Watchlist } from "@/components/dashboard/Watchlist"
import { InfoCard } from "@/components/ui/InfoCard"
import Link from "next/link"

// Mock data
const user = { balance: 0, value: 0, pnl: 0, pnlPct: 0 }
const holdings = [
  { s: "AAPL", shares: 0, price: 0, change: 0 },
  { s: "TSLA", shares: 0, price: 0, change: 0 },
  { s: "NVDA", shares: 0, price: 0, change: 0 },
  { s: "GOOGL", shares: 0, price: 0, change: 0 },
]
const popular = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOGL", "COIN"]

export default function Dashboard() {
  const { address } = useAccount()
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenu(!mobileMenu)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-xs font-bold">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Payment Banner */}
      <div className="px-4 pt-4">
        <InfoCard variant="warning" className="text-sm">
          Activate your account → <Link href="/pricing" className="font-bold underline">Buy Plan</Link>
        </InfoCard>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Portfolio Summary – Mobile Stacked */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Portfolio Value</p>
            <p className="text-2xl font-black mt-1">${user.value.toFixed(2)}</p>
            <Badge variant={user.pnlPct > 0 ? "default" : "destructive"} className="mt-2 text-xs">
              {user.pnlPct > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {user.pnlPct.toFixed(1)}%
            </Badge>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-muted-foreground">P&L</p>
            <p className={`text-2xl font-black mt-1 ${user.pnl > 0 ? "text-emerald-500" : "text-red-500"}`}>
              {user.pnl > 0 ? "+" : ""}${Math.abs(user.pnl).toFixed(2)}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-xs text-muted-foreground">Available</p>
            <p className="text-2xl font-black mt-1">${user.balance.toFixed(2)}</p>
            <Button size="sm" className="mt-3 w-full text-xs h-8">
              <Wallet className="h-3.5 w-3.5 mr-1" /> Deposit
            </Button>
          </Card>
        </div>

        {/* Chart + Holdings – Stack on mobile */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4">
              <h3 className="text-sm font-bold mb-3">Performance</h3>
              <div className="h-64">
                <PortfolioChart />
              </div>
            </Card>
          </div>

          <Card className="h-full">
            <div className="p-4 border-b">
              <h3 className="text-sm font-bold">Holdings</h3>
            </div>
            <ScrollArea className="h-72 px-4">
              {holdings.map(h => (
                <div key={h.s} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-bold text-sm">{h.s}</p>
                    <p className="text-xs text-muted-foreground">{h.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${h.price}</p>
                    <p className={`text-xs ${h.change > 0 ? "text-emerald-500" : "text-red-500"}`}>
                      {h.change > 0 ? "+" : ""}{h.change}%
                    </p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-9 text-xs">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popular.map(s => (
                <StockCard key={s} symbol={s} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="mt-4">
            <Watchlist />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <RecentTransactions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}