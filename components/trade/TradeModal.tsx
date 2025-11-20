// components/trade/TradeModal.tsx
"use client"

import { useState } from "react"
import { ArrowDownUp, Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface TradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  symbol: string
  type: "stock" | "crypto"
  currentPrice: number
  change24h: number
}

const mockBalance = 12450.32 // USDC

export function TradeModal({ open, onOpenChange, symbol, type, currentPrice, change24h }: TradeModalProps) {
  const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy")
  const [amountUSD, setAmountUSD] = useState("")
  const [amountShares, setAmountShares] = useState("")

  const isPositive = change24h >= 0
  const estimatedShares = amountUSD ? (parseFloat(amountUSD) / currentPrice).toFixed(6) : "0"

  const handleUSDChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setAmountUSD(value)
      setAmountShares((Number(value) / currentPrice).toFixed(6))
    }
  }

  const handleSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!isNaN(Number(value)) && Number(value) >= 0) {
      setAmountShares(value)
      setAmountUSD((Number(value) * currentPrice).toFixed(2))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Trade {symbol}
          </DialogTitle>
        </DialogHeader>

        {/* Asset Header */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-2xl font-black bg-gradient-to-br from-emerald-500 to-cyan-500">
                {type === "crypto" ? (symbol === "BTC" ? "₿" : symbol === "ETH" ? "Ξ" : symbol[0]) : symbol[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xl font-bold">{symbol}/USDC</p>
              <p className="text-sm text-muted-foreground">{type === "stock" ? "U.S. Stock" : "Cryptocurrency"}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black">${currentPrice.toFixed(type === "crypto" && symbol !== "BTC" ? 4 : 2)}</p>
            <Badge variant={isPositive ? "default" : "destructive"} className="mt-1">
              {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {Math.abs(change24h).toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Buy / Sell Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "buy" | "sell")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-5 mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="usd">Amount in USD</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="usd"
                    value={amountUSD}
                    onChange={handleUSDChange}
                    placeholder="0.00"
                    className="pl-8 text-lg font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDownUp className="h-5 w-5 text-muted-foreground" />
              </div>

              <div>
                <Label htmlFor="shares">You Receive</Label>
                <div className="relative mt-2">
                  <Input
                    id="shares"
                    value={estimatedShares}
                    readOnly
                    placeholder="0.000000"
                    className="pr-12 text-lg font-medium bg-muted/50"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {symbol}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">${mockBalance.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Fee (Gas + 0.3%)</span>
                <span className="font-medium">~$2.40</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
              disabled={!amountUSD || parseFloat(amountUSD) > mockBalance}
            >
              <Wallet className="h-6 w-6 mr-3" />
              {parseFloat(amountUSD) > mockBalance ? "Insufficient Balance" : `Buy ${symbol} Now`}
            </Button>
          </TabsContent>

          <TabsContent value="sell" className="space-y-5 mt-6">
            <div className="p-4 rounded-lg bg-muted/50 text-center">
              <p className="text-sm text-muted-foreground">You own</p>
              <p className="text-2xl font-black">0.000000 {symbol}</p>
            </div>

            <Button variant="outline" className="w-full" disabled>
              Connect wallet to sell
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
          <Wallet className="h-4 w-4" />
          <span>Instant settlement • No custody • 100% on-chain</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}