import { Interval, Range } from "@/types/yahoo-finance"
import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance()

const VALID_RANGES: Range[] = [
  "1d",
  "5d",
  "1mo",
  "3mo",
  "ytd",
  "max",
]

const VALID_INTERVALS: Interval[] = [
  "1m",
  "2m",
  "5m",
  "15m",
  "30m",
  "60m",
  "90m",
  "1h",
  "1d",
  "5d",
  "1wk",
  "1mo",
  "3mo",
]

export function validateRange(range: string): Range {
  return VALID_RANGES.includes(range as Range) ? (range as Range) : "1d"
}

export function validateInterval(range: Range, interval: string): Interval {
  const validIntervalsForRange: Record<Range, Interval[]> = {
    "1d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h"],
    "5d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d"],
    "1mo": ["2m", "5m", "15m", "30m", "60m", "90m", "1h", "1d", "5d"],
    "3mo": ["1h", "1d", "5d", "1wk", "1mo"],
    ytd: ["1d", "5d", "1wk", "1mo", "3mo"],
    max: ["1d", "5d", "1wk", "1mo", "3mo"],
    "1m": [],
    "2m": [],
    "5m": [],
    "15m": [],
    "30m": [],
    "60m": [],
    "90m": [],
    "1h": [],
    "1wk": []
  }

  const intervals = validIntervalsForRange[range]
  return intervals.includes(interval as Interval)
    ? (interval as Interval)
    : intervals[0]
}

export async function fetchChartData(
  ticker: string,
  range: Range = "1d",
  interval: Interval = "1m"
) {
  noStore()

  const queryOptions = { range, interval };

  try {
    // @ts-ignore
    const response = await yahooFinance.chart(ticker, queryOptions)
    return response
  } catch (error) {
    console.log("Failed to fetch stock chart data", error)
    return {
      meta: {} as any,
      quotes: [],
    }
  }
}
