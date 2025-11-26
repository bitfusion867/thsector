import type { Interval, Range } from "@/types/yahoo-finance"

export const DEFAULT_TICKER = "AAPL"
export const DEFAULT_RANGE: Range = "1d"
export const DEFAULT_INTERVAL: Interval = "1m"
export const DEFAULT_SCREENER = "most_actives"

// These must match your Range type exactly:
export const VALID_RANGES: Range[] = ["1d", "5d", "1mo", "3mo", "ytd", "max"]

/**
 * Mapping of allowed ranges to valid Yahoo Finance intervals.
 * Must only contain intervals included in your Interval union.
 */
export const INTERVALS_FOR_RANGE: Record<Range, Interval[]> = {
  "1d": ["1m", "2m", "5m", "15m", "30m", "60m", "90m"],
  "5d": ["5m", "15m", "30m", "60m", "90m", "1h", "1d"],
  "1mo": ["1h", "1d", "5d", "1wk"],
  "3mo": ["1d", "5d", "1wk", "1mo"],
  "ytd": ["1d", "5d", "1wk", "1mo", "3mo"],
  "max": ["1d", "5d", "1wk", "1mo", "3mo"],
}
