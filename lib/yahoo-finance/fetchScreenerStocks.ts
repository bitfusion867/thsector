import { PredefinedScreenerModules } from "@/types/yahoo-finance"
import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"

const yahooFinance = new YahooFinance()

export async function fetchScreenerStocks(screener: PredefinedScreenerModules) {
  noStore()

  const queryOptions = {
    count: 250, // 25 is default
    lang: "en-US",
  }

  try {
    const response = await yahooFinance.recommendationsBySymbol(screener)

    return response
  } catch (error) {
    console.log("Failed to fetch screener stocks", error)
    return {
      quotes: [],
      total: 0,
    }
  }
}
