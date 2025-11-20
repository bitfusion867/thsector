import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const transactions = [
  { type: "buy", symbol: "NVDA", shares: 2.5, price: 508.20, total: 1270.50, time: "2 hours ago" },
  { type: "sell", symbol: "AAPL", shares: 5.0, price: 192.10, total: 960.50, time: "5 hours ago" },
  { type: "buy", symbol: "TSLA", shares: 3.0, price: 255.80, total: 767.40, time: "1 day ago" },
  { type: "buy", symbol: "META", shares: 1.8, price: 488.30, total: 878.94, time: "2 days ago" },
]

export function RecentTransactions() {
  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {transactions.map((tx, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={tx.type === "buy" ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"}>
                  {tx.type === "buy" ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {tx.type === "buy" ? "Bought" : "Sold"} {tx.shares} {tx.symbol}
                </p>
                <p className="text-sm text-muted-foreground">{tx.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">${tx.total.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">@ ${tx.price.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}