"use client"
// app/(protected)/dashboard/page.tsx
import { Wallet, ArrowUpRight, ArrowDownRight, Bell, Search, Menu } from "lucide-react"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount } from "wagmi"
import { StockCard } from "@/components/dashboard/StockCard"
import { PortfolioChart } from "@/components/dashboard/PortfolioChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { Watchlist } from "@/components/dashboard/Watchlist"
import { InfoModal } from "@/components/ui/InfoModal"
import { InfoCard } from "@/components/ui/InfoCard"
import { useState } from "react"
import Link from "next/link"

// Mock user & portfolio (replace with wagmi + backend later)
const mockUser = {
  balanceUSDC: 0.00,
  totalValue: 0.00,
  pnl24h: 0.00,
  pnl24hPercent: 0.00,
}

const mockHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 0.00, avgCost: 0.00, currentPrice: 0.00, pnl: 0.00, pnlPercent: 0.00 },
  { symbol: "TSLA", name: "Tesla", shares: 0.00, avgCost: 0.00, currentPrice: 0.00, pnl: 0.00, pnlPercent: 0.00 },
  { symbol: "NVDA", name: "NVIDIA", shares: 0.00, avgCost: 0.00, currentPrice: 0.00, pnl: 0.00, pnlPercent: 0.00 },
  { symbol: "GOOGL", name: "Alphabet", shares: 0.00, avgCost: 0.00, currentPrice: 0.00, pnl: 0.00, pnlPercent: 0.00 },
]

const popularStocks = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOGL", "COIN"]

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(true)
  const { address } = useAccount()

  if (!address) {
    setTimeout(() => {
      redirect("/")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search stocks..." className="pl-10 w-64" />
            </div> */}

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-emerald-500" />
            </Button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{address}</p>
                <p className="text-xs text-muted-foreground">
                  ${mockUser.balanceUSDC.toLocaleString()} USDC
                </p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white font-bold">
                  {address?.slice(2, 4).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <InfoCard variant="warning" title="Action needed">
        Your account must be activated to gain full access to all website features.
        Purchase  your membership plan from the <Link href="/pricing" className="font-bold underline">pricing page</Link> to get started.
      </InfoCard>

      <InfoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        variant="warning"
        title="Payment Required"
        message="Send exactly 2500 USDC to activate Elite access."
        details={`Amount: 2500 USDC\nNetwork: Base\nAddress: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913\n\nOnly send from your connected wallet.`}
      />
      <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        {/* Portfolio Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${mockUser.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={mockUser.pnl24h > 0 ? "default" : "destructive"} className="text-xs">
                  {mockUser.pnl24h > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {mockUser.pnl24h > 0 ? "+" : ""}{mockUser.pnl24hPercent.toFixed(2)}%
                </Badge>
                <span className="text-sm text-muted-foreground">24h</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Total P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${mockUser.pnl24h > 0 ? "text-emerald-500" : "text-red-500"}`}>
                {mockUser.pnl24h > 0 ? "+" : ""}${Math.abs(mockUser.pnl24h).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Unrealized gains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${mockUser.balanceUSDC.toLocaleString()}</p>
              <Button className="mt-3 w-full" size="sm">
                <Wallet className="h-4 w-4 mr-2" /> Deposit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chart + Holdings */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Your holdings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioChart />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {mockHoldings.map((holding) => (
                    <div key={holding.symbol} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div>
                        <p className="font-semibold">{holding.symbol}</p>
                        <p className="text-sm text-muted-foreground">{holding.shares} shares</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${holding.currentPrice.toFixed(2)}</p>
                        <p className={`text-sm ${holding.pnl > 0 ? "text-emerald-500" : "text-red-500"}`}>
                          {holding.pnl > 0 ? "+" : ""}{holding.pnlPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs: Popular Stocks + Watchlist + Activity */}
        <Tabs defaultValue="popular" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="popular">Popular Stocks</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="popular" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularStocks.map((symbol) => (
                <StockCard key={symbol} symbol={symbol} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="watchlist">
            <Watchlist />
          </TabsContent>

          <TabsContent value="activity">
            <RecentTransactions />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}