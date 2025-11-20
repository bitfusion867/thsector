// app/pricing/page.tsx
import { Check, Zap, Shield, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton"
import Link from "next/link"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="mb-3">One-time payment</Badge>
          <h1 className="text-4xl md:text-5xl font-black">
            Own Real U.S. Stocks
            <span className="block text-emerald-500">With Your Wallet</span>
          </h1>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Premium */}
          <Card className="p-8 border-2 hover:border-emerald-500/50 transition-all">
            <h3 className="text-2xl font-black">Premium</h3>
            <p className="text-4xl font-black mt-4">$1,300</p>
            <p className="text-sm text-muted-foreground mb-6">one-time</p>

            <ul className="space-y-3 mb-8 text-sm">
              {["300+ real stocks", "Apple • Tesla • Nvidia", "No KYC • No broker", "Buy with USDC/USDT", "24/7 trading"].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="w-full h-12 font-bold">
              <Link href="/checkout?plan=premium">Get Premium</Link>
            </Button>
          </Card>

          {/* Elite */}
          <Card className="p-8 border-2 border-emerald-500 ring-2 ring-emerald-500/20 relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Chosen</Badge>
            <h3 className="text-2xl font-black flex items-center gap-2">
              Elite <Zap className="h-6 w-6 text-yellow-500" />
            </h3>
            <p className="text-4xl font-black mt-4">$2,500</p>
            <p className="text-sm text-muted-foreground mb-6">one-time</p>

            <ul className="space-y-3 mb-8 text-sm">
              {["Everything in Premium", "Priority support", "Early access", "Founders Circle NFT", "Name in credits"].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500" />
                  {f}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="w-full h-12 font-bold bg-emerald-500 hover:bg-emerald-400 text-black">
              <Link href="/checkout?plan=elite">Join Elite</Link>
            </Button>
          </Card>
        </div>

        {/* Trust */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-12">
          <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-500" /> Audited</div>
          <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-emerald-500" /> Instant on Base</div>
          <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-emerald-500" /> Non-custodial</div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <WalletConnectButton />
        </div>
      </div>
    </div>
  )
}