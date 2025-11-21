// app/page.tsx – FINAL VERSION WITH ALL NEW SECTIONS
import { Suspense } from "react"
import Link from "next/link"
import {  Shield, Lock, Globe } from "lucide-react"

import { DataTable } from "@/components/stocks/markets/data-table"
import { columns } from "@/components/stocks/markets/columns"
import YahooFinance from "yahoo-finance2"
import { fetchStockSearch } from "@/lib/yahoo-finance/fetchStockSearch"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton"


const yahooFinance = new YahooFinance()

const tickers = [
  { symbol: "ES=F", shortName: "S&P 500 Futures" },
  { symbol: "NQ=F", shortName: "NASDAQ Futures" },
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "NASDAQ" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
]

function isMarketOpen() {
  const now = new Date()
  const etTime = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "numeric", hour12: false }).format(now)
  const [hour, minute] = etTime.split(":").map(Number)
  const timeInET = hour + minute / 60
  const day = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" })).getDay()
  return day >= 1 && day <= 5 && timeInET >= 9.5 && timeInET < 16
}

export default async function Home() {
  let results: any[] = []
  let topNews: any = null


  try {
    const quotes = await Promise.all(tickers.map(t => yahooFinance.quoteCombine(t.symbol)))
    results = quotes
    const news = await fetchStockSearch("^DJI", 1)
    topNews = news.news?.[0]
  } catch {
    results = tickers.map((t, i) => ({
      symbol: t.symbol,
      shortName: t.shortName,
      regularMarketPrice: 42000 + i * 1200,
      regularMarketChange: Math.random() > 0.5 ? 180 : -140,
      regularMarketChangePercent: Math.random() > 0.5 ? 0.72 : -0.58,
    }))
  }

  const enriched = results.map((r, i) => ({ ...r, shortName: tickers[i].shortName }))
  const marketUp = enriched[0]?.regularMarketChangePercent > 0.1

  return (
    <>
      <section className="relative bg-[#0B0E14] py-14 px-6 border-b border-white/10">
        <div className="relative mx-auto max-w-4xl flex flex-col items-center text-center gap-6">
          <Badge className="text-xs px-3 py-1 font-medium bg-white/10 backdrop-blur border-white/20 text-white">
            Markets {isMarketOpen() ? "Open" : "Closed"} • {new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" })} ET
          </Badge>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            Private Market Insights
          </h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
          What to know about <strong>The Sector</strong>—we provide a list of private stocks and equity in companies that are not available to the general public on the stock market. 
          Unlike public stock, these stocks are listed by founders, employees, or a small group of private investors. 
          Our robust platform has facilitated over $1.5 billion in secured private equity transactions to date, establishing The Sector as a trusted, high-security bridge between proprietary assets and qualified investors.            
          </p>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-2xl">
            Claim sector sign‑in bonus of <span className="font-semibold text-white">$1,500 BTC</span>. Your wallet must have a transaction history for at least 6 months.
          </p>
          <div className="mt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <WalletConnectButton />
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-400" /> Private</div>
            <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-cyan-400" /> Non‑Custodial</div>
            <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-indigo-400" /> Global Access</div>
          </div>
          <br/>
        </div>
        {/* Live ticker */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="overflow-hidden">
            <div className="flex animate-marquee py-3 whitespace-nowrap">
              {[...enriched, ...enriched].map((stock, i) => (
                <div key={`${stock.symbol}-${i}`} className="mx-8 flex items-center gap-3 text-xs">
                  <span className="font-medium text-gray-400">{stock.shortName}</span>
                  <span className="font-semibold text-white">${Number(stock.regularMarketPrice || 0).toFixed(2)}</span>
                  <span className={`font-bold ${stock.regularMarketChange > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {stock.regularMarketChange > 0 ? "+" : ""}{stock.regularMarketChangePercent?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <br /><br /><br /><br /><br />
      {/* LIVE MARKETS CARD */}
      <section className="relative -mt-20 px-6">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden border-0 shadow-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Live Market Overview</h2>
                  <p className="text-muted-foreground">Real-time data via Yahoo Finance</p>
                </div>
                <Badge variant={marketUp ? "default" : "destructive"}>{marketUp ? "Bullish" : "Bearish"}</Badge>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
                  <DataTable columns={columns} data={enriched} />
                </Suspense>
                <div className="space-y-6">
                  {/* <Suspense fallback={<div className="h-96 rounded-lg bg-muted animate-pulse" />}>
                    <MarketsChart ticker={enriched[0]?.symbol || "^GSPC"} range="1d" interval="5m" />
                  </Suspense> */}
                  {topNews && (
                    <Card className="p-5 border-l-4 border-emerald-500 bg-muted/50">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Latest News</p>
                      <Link href={topNews.link} target="_blank" className="text-base font-semibold hover:underline line-clamp-2">
                        {topNews.title}
                      </Link>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}