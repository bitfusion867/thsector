"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TradeModal } from "@/components/trade/TradeModal"

const mockPrices: Record<string, { price: number; change: number }> = {
  AAPL: { price: 195.20, change: 1.82 },
  TSLA: { price: 258.90, change: -2.31 },
  NVDA: { price: 512.40, change: 3.15 },
  MSFT: { price: 378.20, change: 0.94 },
  AMZN: { price: 182.50, change: 2.67 },
  META: { price: 492.10, change: -1.23 },
  GOOGL: { price: 142.80, change: 1.45 },
  COIN: { price: 228.70, change: 5.89 },
}

export function StockCard({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState(mockPrices[symbol]?.price || 0)
  const [change, setChange] = useState(mockPrices[symbol]?.change || 0)
  const [modalOpen, setModalOpen] = useState(false)
  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 2
      setPrice(prev => Math.max(1, prev + fluctuation))
      setChange(prev => prev + (Math.random() - 0.5) * 0.5)
    }, 5000)
    return () => clearInterval(interval)
  }, [symbol])

  const isPositive = change >= 0

  return (
    <Card className="p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
          {symbol[0]}
        </div>
        <Badge variant={isPositive ? "default" : "destructive"} className="text-xs">
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {Math.abs(change).toFixed(2)}%
        </Badge>
      </div>

      <h3 className="font-bold text-lg">{symbol}</h3>
      <p className="text-2xl font-black mt-2">${price.toFixed(2)}</p>

      <Button onClick={() => setModalOpen(true)} className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 hover:bg-emerald-400 text-black font-medium">
        <Plus className="h-4 w-4 mr-2" /> Buy
      </Button>

      <TradeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        symbol={symbol}
        type="stock"
        currentPrice={195.20}
        change24h={1.82}
      />
    </Card>
  )
}