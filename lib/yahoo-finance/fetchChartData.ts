import { Interval, Range } from "@/types/yahoo-finance"
import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance()

export function validateRange(range: string): Range {
  const validRanges: Range[] = ["1d", "5d", "1mo", "3mo", "ytd", "max"]
  return validRanges.includes(range as Range) ? (range as Range) : "1d"
}

export function validateInterval(range: Range, interval: string): Interval {
  const validIntervalsForRange: Record<Range, Interval[]> = {
    "1d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h"],
    "5d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d"],
    "1mo": ["2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d"],
    "3mo": ["1h", "1d", "5d", "1wk", "1mo"],
    ytd: ["1d", "5d", "1wk", "1mo", "3mo"],
    max: ["1d", "5d", "1wk", "1mo", "3mo"],
  }

  const intervals = validIntervalsForRange[range] || ["1d"]
  return intervals.includes(interval as Interval)
    ? (interval as Interval)
    : intervals[0]
}

/**
 * Converts a Range string to concrete start/end dates for Yahoo Finance
 */
function rangeToPeriod(range: Range): { period1: Date; period2: Date } {
  const now = new Date()
  let period1: Date

  switch (range) {
    case "1d":
      period1 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      break
    case "5d":
      period1 = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      break
    case "1mo":
      period1 = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
      break
    case "3mo":
      period1 = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      break
    case "ytd":
      period1 = new Date(now.getFullYear(), 0, 1)
      break
    case "max":
      period1 = new Date(1970, 0, 1) // Yahoo Finance earliest
      break
    default:
      period1 = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      break
  }

  return { period1, period2: now }
}

export interface SimpleQuoteChart {
  date: string | number
  close: number
}


export async function fetchChartData(
  ticker: string,
  range: Range = "1d",
  interval: Interval = "1m"
) {
  noStore()

  const { period1, period2 } = rangeToPeriod(range)

  try {
    const result = await yahooFinance.chart(ticker, {
      period1,
      period2,
      interval,
      return: "object", // easier for charting
    })

    if (!result || !result.timestamp || !result.indicators?.quote?.[0]?.close) {
      return { meta: {} as any, quotes: [] as SimpleQuoteChart[] }
    }

    const timestamps = result.timestamp
    const closes = result.indicators.quote[0].close

    const quotes: SimpleQuoteChart[] = timestamps.map((t, i) => ({
      date: t * 1000, // convert to ms
      close: closes[i] ?? 0,
    }))

    return {
      meta: result.meta,
      quotes,
    }
  } catch (error) {
    console.error("Failed to fetch stock chart data", error)
    return { meta: {} as any, quotes: [] as SimpleQuoteChart[] }
  }
}
