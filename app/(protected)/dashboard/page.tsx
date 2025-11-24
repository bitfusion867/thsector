// app/(protected)/dashboard/page.tsx
"use client"

import React, { useEffect, useState } from "react"
import { TrendingUp, DollarSign, Activity, ArrowRight, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAccount } from "wagmi"
// import { StockCard } from "@/components/dashboard/StockCard"
import { PortfolioChart } from "@/components/dashboard/PortfolioChart"
import { RecentTransactions } from "@/components/dashboard/RecentTransactions"
import { Watchlist } from "@/components/dashboard/Watchlist"
import { InfoCard } from "@/components/ui/InfoCard"
import { Client, Databases } from "appwrite"
import { useToast } from "@/hooks/use-toast"
import { KeywordsModal } from "@/app/keywords/KeywordsModal"
import { allStocks } from "@/lib/data/stocks"
import Image from "next/image"
import Link from "next/link"
// import { Separator } from "@/components/ui/separator"
// import { SummaryCard } from "@/components/dashboard/SummaryCard" // optional central component if you have; otherwise fallback below
// import { popular as popularSymbols } from "@/lib/data/popular" // optional; fallback below if missing

// -----------------------------
// Appwrite config (read from env)
// -----------------------------
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || ""
const APPWRITE_PROJECT = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || ""
const APPWRITE_DATABASE = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || ""
const APPWRITE_COLLECTION = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || ""

// initialize appwrite safely (only if env present)
const appwriteClient =
  APPWRITE_ENDPOINT && APPWRITE_PROJECT
    ? new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT)
    : null

const databases = appwriteClient ? new Databases(appwriteClient) : null

// -----------------------------
// Compact SummaryCard fallback
// -----------------------------
const CompactSummaryCard: React.FC<{
  title: string
  value: string | number
  icon?: React.ReactNode
  badge?: { text: string; variant?: string }
}> = ({ title, value, icon, badge }) => (
  <Card className="p-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className="text-md font-extrabold mt-1">{value}</p>
      </div>
      <div className="flex flex-col items-end gap-2">
        {icon}
        {badge && (
          <Badge className="text-[11px] px-2 py-0.5">{badge.text}</Badge>
        )}
      </div>
    </div>
  </Card>
)

// -----------------------------
// Mock / example data (kept compact)
// -----------------------------
const userDefault = { balance: 0.00, value: 0.00, pnl: 0.00, pnlPct: 0.00 }
interface Holdings {
  s: string,
  shares: number
  price: number
  change: number
}

const holdingsDefault: Holdings[] = [
  { s: "KOCH", shares: 0, price: 0, change: 0.00 },
  { s: "PBLX", shares: 0, price: 0.00, change: 0.00 },
  { s: "ACHN", shares: 0, price: 0.00, change: 0.00 },
  { s: "TRGT", shares: 0, price: 0.00, change: 0.00 },
]
const defaultPopular = ["KOCH", "PBLX", "ACHN", "TRGT", "CAFR", "WGRNS"]

// -----------------------------
// Dashboard Page (compact + responsive)
// -----------------------------
export default function DashboardPage() {
  const { address } = useAccount()
  const { toast } = useToast()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [user] = useState(userDefault) // replace with live data later
  const [holdings] = useState(holdingsDefault)
  const [popular] = useState(defaultPopular)
  const [keywordModalOpen, setKeywordModalOpen] = useState(false)

  // keywords state from Appwrite
  const [keywords, setKeywords] = useState<string[][]>([])
  const [loadingKeywords, setLoadingKeywords] = useState(false)

  // Small helper: indicate account activated if keywords exist
  const accountActivated = keywords.length > 0

  // compact fetch function using appwrite (safe-guarded)
  useEffect(() => {
    if (!databases || !APPWRITE_DATABASE || !APPWRITE_COLLECTION) return
    let mounted = true
    setLoadingKeywords(true)

      ; (async () => {
        try {
          const res = await databases.listDocuments(APPWRITE_DATABASE, APPWRITE_COLLECTION)
          if (!mounted) return
          const docs = res.documents || []
          const k = docs.map((d: any) => Array.isArray(d.keywords) ? d.keywords : [])
          setKeywords(k)
        } catch (err) {
          console.error("Keywords fetch failed", err)
        } finally {
          if (mounted) setLoadingKeywords(false)
        }
      })()

    return () => { mounted = false }
  }, [])

  // Handle open modal (if account not activated show toast)
  const handleActivateClick = () => {
    // If account is already activated, open modal to edit
    if (accountActivated) {
      setKeywordModalOpen(true)
      return
    }

    // Otherwise ask user to activate (soft flow)
    toast({
      title: "Activate account",
      description: "Activate your account to claim bonuses and enable trading.",
      variant: "default",
    })
    // still allow opening activation flow
    setKeywordModalOpen(true)
  }

  // small P&L helpers
  const pnlPositive = user.pnl >= 0
  const pnlSign = pnlPositive ? "+" : "-"

  // Compact layout
  return (
    <div className="min-h-screen bg-background/50 dark:bg-zinc-950/90 pb-20">
      {/* header
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">Sector</h2>
            <span className="text-xs text-muted-foreground hidden sm:inline">Private markets & equity</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast({ title: "Notifications", description: "No new alerts", variant: "default" })}>
              <Bell className="h-4 w-4" />
            </Button>

            <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-600 text-black" onClick={handleActivateClick}>
              <Wallet className="h-4 w-4 mr-2" /> {accountActivated ? "Account Active" : "Activate"}
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={() => setMobileMenuOpen(v => !v)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 space-y-6">
        {/* Activation banner / InfoCard */}
        <div>
          <InfoCard variant={accountActivated ? "success" : "warning"} className="p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm leading-tight">
                {accountActivated ? (
                  <div>
                    <strong className="font-semibold">Account active</strong> — your keywords are synced.
                  </div>
                ) : (
                  <div>
                    <strong className="font-semibold">Activate your account</strong> to claim your sign-up bonus and enable trading.
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" className="h-8" onClick={handleActivateClick}>
                  {accountActivated ? "Manage Keywords" : "Activate"}
                </Button>
              </div>
            </div>
          </InfoCard>
        </div>

        <KeywordsModal open={keywordModalOpen} onOpenChange={setKeywordModalOpen} />

        {/* Summary cards (compact grid) */}
        <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <CompactSummaryCard
            title="Total Value"
            value={`$${user.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            icon={<TrendingUp className="h-5 w-5" />}
            badge={{ text: `${pnlSign}${user.pnlPct.toFixed(2)}%` }}
          />
          <CompactSummaryCard
            title="Today's P&L"
            value={`${pnlSign}$${Math.abs(user.pnl).toFixed(2)}`}
            icon={<Activity className="h-5 w-5" />}
          />
          <CompactSummaryCard
            title="Available"
            value={`$${user.balance.toFixed(2)}`}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <Card className="p-3 flex flex-col items-center justify-center">
            <p className="text-sm text-muted-foreground">Profile ID</p>
            <p className="font-mono font-semibold text-sm mt-1 truncate">{address?.slice(2, 6).repeat(2) ?? "Not connected"}</p>
            <Button variant="outline" size="sm" className="mt-3 h-8 w-full" onClick={() => toast({ title: "Profile", description: "Open profile", variant: "default" })}>
              View Settings
            </Button>
          </Card>
        </section>

        {/* Performance + Holdings */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold">Portfolio Performance</h3>
              <div className="text-sm text-muted-foreground">Last 30d</div>
            </div>

            <div className="min-h-[160px] md:min-h-[200px]">
              <PortfolioChart />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Unrealized P&L</div>
              <div className={`font-semibold ${pnlPositive ? "text-emerald-500" : "text-red-500"}`}>{pnlSign}${user.pnl.toFixed(2)}</div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold">Holdings</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="max-h-[260px]">
              <div className="space-y-3 p-1">
                {holdings.map((h, idx) => (
                  <div key={h.s} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{h.s}</p>
                      <p className="text-xs text-muted-foreground">{h.shares} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">${h.price.toFixed(2)}</p>
                      <p className={`text-xs ${h.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {h.change >= 0 ? "+" : ""}{h.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </section>

        {/* Market Tabs (compact) */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold">Markets</h3>
            <div className="text-xs text-muted-foreground">Live data • delayed quotes</div>
          </div>

          <Tabs defaultValue="popular" className="w-full">
            <div className="mb-3">
              <div className="inline-flex rounded-lg bg-muted/40 p-1">
                <TabsList className="grid grid-cols-3 gap-1 rounded-lg">
                  <TabsTrigger value="popular" className="px-3 py-1 text-sm">Popular</TabsTrigger>
                  <TabsTrigger value="watchlist" className="px-3 py-1 text-sm">Watchlist</TabsTrigger>
                  <TabsTrigger value="activity" className="px-3 py-1 text-sm">Activity</TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="popular" className="mt-1">
              <div className="">
                {/* {(popular || defaultPopular).map(s => <StockCard key={s} symbol={s} />)} */}
                {/* <h2 className="text-md font-bold tracking-tight flex items-center gap-2">
                  Featured Stocks
                </h2> */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {allStocks.filter(stock => stock.isFeatured).map((stock) => {
                    const isPositive = stock.change >= 0;
                    const changeColor = isPositive ? "text-emerald-500" : "text-red-500";
                    const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

                    return (
                      <Card
                        key={stock.symbol}
                        className="p-5 flex flex-col items-center justify-between hover:border-primary transition-all duration-200 shadow-xl"
                      >

                        {/* LOGO: MASSIVE & CENTERED */}
                        <div className="flex flex-col items-center mb-4 w-full">
                          {stock.imageUrl && (
                            <Image
                              src={stock.imageUrl}
                              alt={`${stock.symbol} logo`}
                              width={128} // Increased Size
                              height={128} // Increased Size
                              className="rounded-2xl bg-gray-50 p-4 shadow-lg object-contain mb-4" // Prominent Styling
                              priority
                            />
                          )}

                          {/* TEXT: Symbol & Name (Centered under logo) */}
                          <h3 className="text-xl font-bold tracking-tight text-center">{stock.symbol}</h3>
                          <p className="text-xs text-muted-foreground text-center mt-0.5">{stock.name}</p>
                        </div>

                        {/* PRICE & CHANGE (Bottom Section, remains separated for clarity) */}
                        <div className="text-center w-full pt-4 border-t border-border/50">
                          <p className="text-2xl font-extrabold">${parseInt(stock.price.toFixed(2)).toLocaleString()}</p>
                          <div className={`flex items-center justify-center mt-1 ${changeColor}`}>
                            <ChangeIcon className="h-4 w-4 mr-1" />
                            <p className={`text-base font-semibold`}>
                              {isPositive ? "+" : ""}{stock.change.toFixed(2)}%
                            </p>
                          </div>
                        </div>

                        <Link
                          href={`/dashboard/purchase?symbol=${stock.symbol}`}
                        >
                          <Button
                            className="w-full text-sm font-semibold mt-4 transition-transform duration-100 hover:scale-[1.01]"
                            variant={isPositive ? "default" : "destructive"}
                          >
                            Purchase {stock.symbol}
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="watchlist" className="mt-1">
              <Watchlist />
            </TabsContent>

            <TabsContent value="activity" className="mt-1">
              <RecentTransactions />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  )
}
