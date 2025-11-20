"use client"

import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const watchlist = [
  { symbol: "NVDA", price: 512.40, change: 3.15 },
  { symbol: "SOL", price: 148.20, change: -4.21 },
  { symbol: "ETH", price: 3480.50, change: 2.87 },
  { symbol: "MSTR", price: 1820.00, change: 8.42 },
]

export function Watchlist() {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Your Watchlist</h3>
      <div className="space-y-4">
        {watchlist.map((item) => {
          const isPositive = item.change >= 0
          return (
            <div key={item.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </Button>
                <div>
                  <p className="font-semibold">{item.symbol}</p>
                  <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {Math.abs(item.change).toFixed(2)}%
              </div>
            </div>
          )
        })}
      </div>
      <Button variant="outline" className="w-full mt-6">
        Add to Watchlist
      </Button>
    </Card>
  )
}