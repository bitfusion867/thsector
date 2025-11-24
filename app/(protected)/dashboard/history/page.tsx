// app/(protected)/history/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"

// Define a type for better TypeScript support (optional, but professional)
type Transaction = {
  id: string;
  type: "buy" | "sell";
  symbol: string;
  shares: number;
  price: number;
  total: number;
  date: string;
};

const transactions: Transaction[] = [
  // { id: "1", type: "buy", symbol: "AAPL", shares: 5.2, price: 215.30, total: 1119.56, date: "Nov 22, 2025" },
  // { id: "2", type: "sell", symbol: "TSLA", shares: 2.0, price: 440.00, total: 880.00, date: "Nov 21, 2025" },
  // { id: "3", type: "buy", symbol: "NVDA", shares: 1.5, price: 750.00, total: 1125.00, date: "Nov 20, 2025" },
  // { id: "4", type: "buy", symbol: "MSFT", shares: 3.0, price: 380.10, total: 1140.30, date: "Nov 19, 2025" },
  // { id: "5", type: "sell", symbol: "GOOGL", shares: 1.0, price: 150.00, total: 150.00, date: "Nov 18, 2025" },
];

export default function HistoryPage() {
  return (
    <div className="container max-w-5xl py-12 space-y-8">
      
      {/* 1. Page Header with Visual Accent */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-background to-accent/50 border">
        <h3 className="font-extrabold tracking-tight">
           Transaction History
        </h3>
        <p className="text-muted-foreground mt-1">
          A comprehensive record of your recent trades and asset movements.
        </p>
      </div>

      <Separator />

      {/* 2. Transaction List */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-bold">Recent Trades</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {transactions.map((tx, index) => {
              const isBuy = tx.type === "buy";
              const typeColor = isBuy ? "text-emerald-500" : "text-red-500";
              const bgColor = isBuy ? "bg-emerald-500/10" : "bg-red-500/10";
              const Icon = isBuy ? TrendingDown : TrendingUp; // Represents cash flow: Buy (cash down), Sell (cash up)

              return (
                <div 
                  key={tx.id} 
                  className={`flex items-center justify-between p-4 transition-all hover:bg-muted/50 ${index === 0 ? 'rounded-t-lg' : ''} ${index === transactions.length - 1 ? 'rounded-b-lg' : ''}`}
                >
                  
                  {/* LEFT SECTION: Type and Symbol */}
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <div className={`p-3 rounded-xl ${bgColor} flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${typeColor}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-lg flex items-center gap-2">
                        {tx.symbol} 
                        <Badge 
                          variant="outline" 
                          className={`text-xs font-medium ${isBuy ? 'text-emerald-600 border-emerald-600/30' : 'text-red-600 border-red-600/30'}`}
                        >
                            {tx.type.toUpperCase()}
                        </Badge>
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {isBuy ? "Purchase" : "Sale"}
                      </p>
                    </div>
                  </div>
                  
                  {/* MIDDLE SECTION: Details */}
                  <div className="hidden sm:block text-left flex-grow mx-4">
                    <p className="font-medium text-sm">
                        {tx.shares.toFixed(2)} shares 
                    </p>
                    <p className="text-xs text-muted-foreground">
                        @ ${tx.price.toFixed(2)}
                    </p>
                  </div>
                  
                  {/* RIGHT SECTION: Total and Date */}
                  <div className="text-right flex-shrink-0">
                    <p className={`font-extrabold text-xl ${typeColor}`}>
                      {isBuy ? "-" : "+"}${tx.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {tx.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {transactions.length === 0 && (
        <p className="text-center text-muted-foreground py-8 border rounded-lg">
          No transactions found for this period.
        </p>
      )}
    </div>
  )
}