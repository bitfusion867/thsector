// app/(protected)/dashboard/page.tsx
"use client"

import { useState } from "react"
import { Wallet, Bell, Menu, } from "lucide-react"
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
import { KeywordsModal } from "@/app/keywords/KeywordsModal"
import { Client, Databases, ID } from "appwrite"
import { useToast } from "@/hooks/use-toast"

const user = { balance: 0, value: 0, pnl: 0, pnlPct: 0 }
const holdings = [
  { s: "AAPL", shares: 0, price: 0, change: 0 },
  { s: "TSLA", shares: 0, price: 0, change: 0 },
  { s: "NVDA", shares: 0, price: 0, change: 0 },
  { s: "GOOGL", shares: 0, price: 0, change: 0 },
]
const popular = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOGL", "COIN"]

const appEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const appId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!
const client = new Client()

  .setEndpoint(appEndpoint)
  .setProject(appId)

const database = new Databases(client)


export default function Dashboard() {
  const { address } = useAccount()
  const [mobileMenu, setMobileMenu] = useState(false)
  const [keywordModalOpen, setKeywordModalOpen] = useState(false)
  const [keywordData, setKeywordData] = useState<string[]>([])

  const { toast } = useToast()

  const fetchKeywords = async () => {
    try {
      const response = await database.listDocuments({
        databaseId,
        collectionId: collectionId,
      })
      console.log(response)
      setKeywordData(response.documents.map(doc => doc.keywords))
    } catch (error) {
      console.error('Error fetching keywords:', error)
    }
  }

  fetchKeywords()

  function handleOpenModal() {
    toast({
      title: "Account not activated",
      description: "Please activate your account before making any purchase.",
      variant: "destructive",
    })
  }
  return (

    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Compact Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-12">
        <div className="flex h-12 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenu(!mobileMenu)} className="h-7 w-7">
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-7 w-7">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </Button>
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-[10px] font-bold">
                {address?.slice(2, 4).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Payment Banner */}
      <div className="px-3 pt-3">

        {
          keywordData && keywordData.length !== 0 ? (
            <div className="p-3 text-sm border-gray-300 border-b flex items-center justify-between">
              {keywordData.join(" ")}
            </div>
          ) :
            (
              <InfoCard variant="warning" className="text-xs py-2 px-3">
                Your account is not activated, please use this button to activate your account to recieve your sign up bonus of <strong>$1,500</strong>
                <Button
                  onClick={() => setKeywordModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-md"
                >
                  {" "}
                  Activate
                </Button>
              </InfoCard>
            )
        }
        <KeywordsModal open={keywordModalOpen} onOpenChange={setKeywordModalOpen} />
      </div>

      <div className="px-3 py-5 space-y-4">
        {/* Portfolio Summary – More Compact */}
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3">
            <p className="text-[10px] text-muted-foreground">Value</p>
            <p className="text-xl font-bold mt-0.5">${user.value.toFixed(2)}</p>
            <Badge variant={user.pnlPct > 0 ? "default" : "destructive"} className="mt-1 text-[10px] px-1.5 py-0.5">
              {user.pnlPct > 0 ? "+" : ""}{user.pnlPct.toFixed(1)}%
            </Badge>
          </Card>

          <Card className="p-3">
            <p className="text-[10px] text-muted-foreground">P&L</p>
            <p className={`text-xl font-bold mt-0.5 ${user.pnl > 0 ? "text-emerald-500" : "text-red-500"}`}>{user.pnl > 0 ? "+" : "-"}${Math.abs(user.pnl).toFixed(2)}</p>
          </Card>

          <Card className="p-3 flex flex-col justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">Available</p>
              <p className="text-xl font-bold mt-0.5">${user.balance.toFixed(2)}</p>
            </div>
            <Button size="sm" className="w-full text-[10px] h-7 mt-1" onClick={handleOpenModal}>
              <Wallet className="h-3 w-3 mr-1" /> Deposit
            </Button>
          </Card>
        </div>

        {/* Chart + Holdings – Much cleaner mobile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="p-3 lg:col-span-2">
            <h3 className="text-xs font-bold mb-2">Performance</h3>
            <div className="min-h-[220px] h-auto">
              <PortfolioChart />
            </div>
          </Card>

          <Card className="h-full">
            <div className="p-3 border-b">
              <h3 className="text-xs font-bold">Holdings</h3>
            </div>
            <ScrollArea className="max-h-[240px] sm:max-h-[300px] px-3 pt-3 pb-2">
              {holdings.map(h => (
                <div key={h.s} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="font-bold text-xs">{h.s}</p>
                    <p className="text-[10px] text-muted-foreground">{h.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xs">${h.price}</p>
                    <p className={`text-[10px] ${h.change > 0 ? "text-emerald-500" : "text-red-500"}`}>{h.change > 0 ? "+" : ""}{h.change}%</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </div>

        {/* Tabs */}
        <br />
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full grid-cols-3 text-[11px]">
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <br />

          <TabsContent value="popular" className="mt-5">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {popular.map(s => <StockCard key={s} symbol={s} />)}
            </div>
          </TabsContent>

          <TabsContent value="watchlist" className="mt-5">
            <Watchlist />
          </TabsContent>

          <TabsContent value="activity" className="mt-5">
            <RecentTransactions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}