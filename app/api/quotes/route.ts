// app/api/quotes/route.ts
import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";
import { SimpleQuote } from "@/types/yahoo-finance";

const tickers = [
  { symbol: "ES=F", shortName: "S&P 500 Futures" },
  { symbol: "NQ=F", shortName: "NASDAQ Futures" },
  { symbol: "^GSPC", shortName: "S&P 500" },
  { symbol: "^IXIC", shortName: "NASDAQ" },
  { symbol: "^DJI", shortName: "Dow Jones" },
  { symbol: "CL=F", shortName: "Crude Oil" },
  { symbol: "GC=F", shortName: "Gold" },
  { symbol: "BTC-USD", shortName: "Bitcoin" },
];

export async function GET() {
  const yahooFinance = new YahooFinance();
  const settled = await Promise.allSettled(
    tickers.map((t) => yahooFinance.quote(t.symbol))
  );

  const results: SimpleQuote[] = settled.map((s, i) => {
    const meta = tickers[i];
    if (s.status === "fulfilled" && s.value) {
      const v = s.value as any;
      return {
        symbol: meta.symbol,
        shortName: meta.shortName,
        regularMarketPrice: Number(v.regularMarketPrice ?? 0),
        regularMarketChange: Number(v.regularMarketChange ?? 0),
        regularMarketChangePercent: Number(v.regularMarketChangePercent ?? 0),
      };
    } else {
      return {
        symbol: meta.symbol,
        shortName: meta.shortName,
        regularMarketPrice: 0,
        regularMarketChange: 0,
        regularMarketChangePercent: 0,
      };
    }
  });

  return NextResponse.json(results);
}
