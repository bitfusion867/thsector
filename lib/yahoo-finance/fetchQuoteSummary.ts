import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance()

export async function fetchQuoteSummary(ticker: string) {
  noStore()

  try {
    const response = await yahooFinance.quoteSummary(ticker)

    return response
  } catch (error) {
    console.log("Failed to fetch stock quote summary", error)
    return {}
  }
}
