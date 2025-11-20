import { Quote } from "@/types/yahoo-finance";
import { unstable_noStore as noStore } from "next/cache";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance();

export async function fetchQuote(ticker: string): Promise<Quote> {
  noStore();

  try {
    const response = await yahooFinance.quote(ticker);
    return response as Quote;
  } catch (error) {
    console.log("Failed to fetch stock quote", error);
    return {};
  }
}
