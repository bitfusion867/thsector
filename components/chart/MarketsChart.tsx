import { fetchChartData } from "@/lib/yahoo-finance/fetchChartData"
import { Interval, Range } from "@/types/yahoo-finance"
import AreaClosedChart from "./AreaClosedChart"
import { fetchQuote } from "@/lib/yahoo-finance/fetchQuote"

export default async function MarketsChart({
  ticker,
  range,
  interval,
}: {
  ticker: string
  range: Range
  interval: Interval
}) {
  const chartData = await fetchChartData(ticker, range, interval)
  const quoteData = await fetchQuote(ticker)

  const [chart, quote] = await Promise.all([chartData, quoteData])

  const stockQuotes: { date: number; close: string }[] = chart.quotes
  ? chart.quotes
      .filter((q) => q.close !== undefined && q.date !== null)
      .map((q) => ({
        date: q.date as number,
        close: (q.close as number).toFixed(2), // string now
      }))
  : []

  return (
    <>
      <div className="mb-0.5 font-medium">
        {quote.shortName} ({quote.symbol}){" "}
        {quote.regularMarketPrice?.toLocaleString(undefined, {
          style: "currency",
          currency: quote.currency,
        })}
      </div>
      {chart.quotes.length > 0 ? (
        <AreaClosedChart chartQuotes={stockQuotes} range={range} />
      ) : (
        <div className="flex h-full items-center justify-center text-center text-neutral-500">
          No data available
        </div>
      )}
    </>
  )
}
