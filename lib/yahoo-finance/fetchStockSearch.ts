import { unstable_noStore as noStore } from "next/cache"
import YahooFinance from "yahoo-finance2"
import  SearchResult  from "yahoo-finance2"

type sT  = typeof SearchResult
const yahooFinance = new YahooFinance()

export async function fetchStockSearch(ticker: string, newsCount: number = 5) {
  noStore()

  const queryOptions = {
    quotesCount: 1,
    newsCount: newsCount,
    enableFuzzyQuery: true,
  }

  try {
    const response = await yahooFinance.search(
      ticker,
      queryOptions
    )

    return response
  } catch (error) {
    console.log("Failed to fetch stock search", error)
    return {
      quotes: [],
      news: [],
    } 
  }
}
