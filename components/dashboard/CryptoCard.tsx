"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const cryptoData: Record<string, { price: number; change24h: number; icon: string }> = {
  BTC: { price: 68250.00, change24h: 2.41, icon: "₿" },
  ETH: { price: 3482.10, change24h: -1.23, icon: "Ξ" },
  SOL: { price: 148.90, change24h: 5.67, icon: "◎" },
  AVAX: { price: 48.20, change24h: -3.21, icon: "AVAX" },
  MATIC: { price: 0.92, change24h: 1.88, icon: "MATIC" },
  ARB: { price: 1.84, change24h: 4.12, icon: "ARB" },
  OP: { price: 2.68, change24h: -2.45, icon: "OP" },
  LINK: { price: 18.42, change24h: 6.89, icon: "LINK" },
}

export function CryptoCard({ symbol }: { symbol: string }) {
  const data = cryptoData[symbol]
  const [price, setPrice] = useState(data.price)
  const [change, setChange] = useState(data.change24h)

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 100
      setPrice(prev => Math.max(0.01, prev + fluctuation))
      setChange(prev => prev + (Math.random() - 0.5) * 1.2)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const isPositive = change >= 0

  return (
    <Card className="p-5 hover:shadow-xl transition-all group cursor-pointer border border-border/50">
      <div className="flex items-center justify-between mb-4">
        <div className="text-4xl">{data.icon}</div>
        <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(change).toFixed(2)}%
        </Badge>
      </div>

      <h3 className="font-bold text-lg">{symbol}/USDC</h3>
      <p className="text-2xl font-black mt-2">
        ${symbol === "BTC" ? price.toLocaleString(undefined, { maximumFractionDigits: 0 }) :
           price.toFixed(symbol === "ETH" || symbol === "SOL" ? 2 : 4)}
      </p>

      <Button className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 hover:bg-emerald-400 text-black font-medium">
        <Plus className="h-4 w-4 mr-2" /> Trade
      </Button>
    </Card>
  )
}