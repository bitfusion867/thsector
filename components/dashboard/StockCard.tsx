"use client"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TradeModal } from "@/components/trade/TradeModal"
import { useToast } from "@/hooks/use-toast"

// Optional logo map (add any you want)
const stockLogos: Record<string, string> = {
  // AAPL: "/logos/aapl.png",
  // TSLA: "/logos/tsla.png",
  // NVDA: "/logos/nvda.png",
  // MSFT: "/logos/msft.png",
}

const stockGradients: Record<string, [string, string]> = {
  AAPL: ["#0A84FF", "#5AC8FA"],
  TSLA: ["#E11900", "#FF453A"],
  NVDA: ["#32D74B", "#1ABC9C"],
  MSFT: ["#30B0C7", "#007AFF"],
  META: ["#0A84FF", "#5856D6"],
  AMZN: ["#FF9F0A", "#FFCC00"],
  COIN: ["#0052FF", "#00C4FF"],
}

const fallbackGradient: [string, string] = ["#64748B", "#94A3B8"]

const mockPrices: Record<string, { price: number; change: number }> = {
  AAPL: { price: 195.2, change: 1.82 },
  TSLA: { price: 258.9, change: -2.31 },
  NVDA: { price: 512.4, change: 3.15 },
  MSFT: { price: 378.2, change: 0.94 },
  AMZN: { price: 182.5, change: 2.67 },
  META: { price: 492.1, change: -1.23 },
  GOOGL: { price: 142.8, change: 1.45 },
  COIN: { price: 228.7, change: 5.89 },
}

export function StockCard({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState(mockPrices[symbol]?.price || 0)
  const [change, setChange] = useState(mockPrices[symbol]?.change || 0)
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()
  // loading skeleton
  const [loading, setLoading] = useState(true)

  // sparkline data (last N prices)
  const [series, setSeries] = useState<number[]>(() => [mockPrices[symbol]?.price || 0])

  // animated displayed price
  const [displayPrice, setDisplayPrice] = useState(price)
  const rafRef = useRef<number | null>(null)

  const symbolImage = stockLogos[symbol]
  const [c1, c2] = stockGradients[symbol] || fallbackGradient

  // simulate initial load
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [symbol])

  // simulate live price updates and update series
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 2
      setPrice(prev => {
        const next = Math.max(0.01, +(prev + fluctuation).toFixed(2))
        setSeries(s => {
          const nextSeries = [...s.slice(-14), next]
          return nextSeries
        })
        return next
      })
      setChange(prev => +(prev + (Math.random() - 0.5) * 0.5).toFixed(2))
    }, 3500)

    return () => clearInterval(interval)
  }, [symbol])

  // animate displayPrice towards price
  useEffect(() => {
    const start = displayPrice
    const end = price
    const duration = 600
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(1, elapsed / duration)
      const value = start + (end - start) * easeOutCubic(t)
      setDisplayPrice(+value.toFixed(2))
      if (t < 1) rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }

    function easeOutCubic(x: number) {
      return 1 - Math.pow(1 - x, 3)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  const isPositive = change >= 0

  // sparkline path generator
  const sparkPath = generateSparklinePath(series, 80, 24)

  // percentage ring (map change magnitude to 0-100, cap at 10% -> full)
  const pct = Math.min(100, Math.round((Math.abs(change) / 10) * 100))
  const ringRadius = 16
  const ringCirc = 2 * Math.PI * ringRadius
  const dash = (pct / 100) * ringCirc

  function handleOpenModal(){
    toast({
      title: "Account not activated",
      description: "Please activate your account before making any purchase.",
      variant: "destructive",
    })
    setModalOpen(true)
  }
  return (
    <Card className="p-3 rounded-xl bg-background/75 backdrop-blur border hover:shadow-lg transition-all duration-250 group cursor-pointer">

      {loading ? (
        // skeleton
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-3">
            <div className="w-11 h-11 rounded-xl bg-muted/40" />
            <div className="w-12 h-6 rounded-md bg-muted/40" />
          </div>
          <div className="h-4 w-24 rounded bg-muted/40 mb-2" />
          <div className="h-6 w-32 rounded bg-muted/40 mb-3" />
          <div className="h-8 w-full rounded bg-muted/40" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            {/* Icon */}
            <div
              className="w-11 h-11 rounded-xl shadow flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0"
              style={{ background: symbolImage ? undefined : `linear-gradient(135deg, ${c1}, ${c2})` }}
            >
              {symbolImage ? (
                <img src={symbolImage} alt={ symbolImage ? symbol: symbol.charAt(0)} className="w-full h-full object-cover" />
              ) : (
                <span className="select-none">{symbol[0]}</span>
              )}
            </div>

            {/* change badge + ring */}
            <div className="flex items-center gap-3">
              <Badge className="text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1" variant={isPositive ? "default" : "destructive"}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </Badge>

              <svg width="40" height="40" viewBox="0 0 40 40" className="transform rotate-[-90deg]">
                <circle cx="20" cy="20" r={ringRadius} strokeWidth="3" stroke="rgba(255,255,255,0.06)" fill="none" />
                <circle
                  cx="20"
                  cy="20"
                  r={ringRadius}
                  strokeWidth="3"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${dash} ${ringCirc - dash}`}
                  style={{ transition: "stroke-dasharray 450ms ease" }}
                />
              </svg>
            </div>
          </div>

          {/* Symbol + price row */}
          <div className="flex items-end justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm leading-none">{symbol}</h3>
              <p className="text-[11px] text-muted-foreground">{series.length} recent</p>
            </div>

            <div className="text-right">
              <p className={`text-md font-black leading-none ${isPositive ? "text-emerald-400" : "text-red-400"}`}>${displayPrice.toFixed(2)}</p>
              <p className="text-[11px] text-muted-foreground">{isPositive ? "+" : ""}{change.toFixed(2)}%</p>
            </div>
          </div>

          {/* Sparkline */}
          <div className="mt-3">
            <svg width="100%" height="28" viewBox="0 0 80 24" preserveAspectRatio="none">
              <path d={sparkPath.path} fill="none" stroke={isPositive ? "#10b981" : "#ef4444"} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
              {/* subtle area */}
              <path d={sparkPath.area} fill={isPositive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.07)"} stroke="none" />
            </svg>
          </div>

          {/* Buy Button */}
          <Button
            onClick={ handleOpenModal}
            className="w-full h-8 mt-3 text-sm opacity-100 transition-opacity rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black"
          >
            <Plus className="h-4 w-4 mr-1" /> Buy
          </Button>

          <TradeModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            symbol={symbol}
            type="stock"
            currentPrice={price}
            change24h={change}
          />
        </>
      )}

    </Card>
  )
}

// ----------------------- helpers -----------------------
function generateSparklinePath(values: number[], width = 80, height = 24) {
  if (!values || values.length === 0) return { path: "", area: "" }
  const max = Math.max(...values)
  const min = Math.min(...values)
  const len = values.length
  const pts: { x: number; y: number }[] = values.map((v, i) => {
    const x = (i / Math.max(1, len - 1)) * (width - 2) + 1
    const y = height - 1 - ((v - min) / Math.max(0.0001, (max - min))) * (height - 4)
    return { x, y }
  })

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ")

  // area path (closed)
  const area = `${path} L ${width - 1} ${height - 1} L 1 ${height - 1} Z`

  return { path, area }
}
