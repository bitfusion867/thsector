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
import { useToast } from "@/hooks/use-toast"


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
  const {toast} = useToast()

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

  function handleOpenModal() {
    toast({
      title: "Account not activated",
      description: "Please activate your account before making any purchase.",
      variant: "destructive",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs p-4 rounded-xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-center">
            Trade {symbol}
          </DialogTitle>
        </DialogHeader>

        {/* Asset Header */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-lg font-black bg-gradient-to-br from-emerald-500 to-cyan-500">
                {type === "crypto"
                  ? symbol === "BTC"
                    ? "₿"
                    : symbol === "ETH"
                      ? "Ξ"
                      : symbol[0]
                  : symbol[0]}
              </AvatarFallback>
            </Avatar>

            <div className="leading-tight">
              <p className="font-bold text-sm">{symbol}/USDC</p>
              <p className="text-[11px] text-muted-foreground">
                {type === "stock" ? "U.S. Stock" : "Crypto Asset"}
              </p>
            </div>
          </div>

          <div className="text-right leading-tight">
            <p className="text-lg font-black">
              ${currentPrice.toFixed(type === "crypto" && symbol !== "BTC" ? 4 : 2)}
            </p>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className="text-[10px] px-1 py-0.5 mt-1"
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change24h).toFixed(2)}%
            </Badge>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "buy" | "sell")}
          className="mt-3"
        >
          <TabsList className="grid w-full grid-cols-2 h-8 text-xs">
            <TabsTrigger
              value="buy"
              className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
            >
              Buy
            </TabsTrigger>
            <TabsTrigger
              value="sell"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              Sell
            </TabsTrigger>
          </TabsList>

          {/* Buy */}
          <TabsContent value="buy" className="space-y-3 mt-4">
            <div className="space-y-3">
              <div>
                <Label className="text-xs" htmlFor="usd">Amount (USD)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    $
                  </span>
                  <Input
                    id="usd"
                    value={amountUSD}
                    onChange={handleUSDChange}
                    placeholder="0.00"
                    className="pl-6 h-9 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              </div>

              <div>
                <Label className="text-xs" htmlFor="shares">You Receive</Label>
                <div className="relative mt-1">
                  <Input
                    id="shares"
                    value={estimatedShares}
                    readOnly
                    placeholder="0.000000"
                    className="pr-10 h-9 text-sm bg-muted/40"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    {symbol}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Compact Summary */}
            <div className="text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Balance:</span>
                <span className="font-medium">${mockBalance.toLocaleString()} USDC</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Fees (est):</span>
                <span className="font-medium">~$2.40</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full h-10 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={handleOpenModal}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Buy {symbol}
            </Button>
          </TabsContent>

          {/* Sell */}
          <TabsContent value="sell" className="space-y-3 mt-4">
            <div className="p-3 rounded-md bg-muted/40 text-center">
              <p className="text-xs text-muted-foreground">You own</p>
              <p className="text-lg font-black">0.000000 {symbol}</p>
            </div>

            <Button variant="outline" size="sm" className="w-full"
              onClick={handleOpenModal}>
              Connect wallet to sell
            </Button>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground mt-3">
          <Wallet className="h-3 w-3" />
          <span>Instant settlement • On-chain • No custody</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}