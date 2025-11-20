// app/checkout/page.tsx
"use client"

import { useState } from "react"
import { ArrowLeft, Check, Copy, Wallet, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"
import Link from "next/link"

const PLANS = { premium: 1300, elite: 2500 }
const CRYPTO = [
  { s: "USDC", n: "Base", a: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" },
  { s: "USDT", n: "Polygon", a: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" },
  { s: "ETH", n: "Ethereum", a: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" },
  { s: "BTC", n: "Bitcoin", a: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
]

export default function CheckoutPage() {
  const [plan, setPlan] = useState<"premium" | "elite">("elite")
  const [crypto, setCrypto] = useState(CRYPTO[0])
  const [paid, setPaid] = useState(false)
  const [copied, setCopied] = useState(false)

  const amount = PLANS[plan]

  const copy = () => {
    navigator.clipboard.writeText(crypto.a)
    setCopied(true)
    toast.success("Copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-emerald-500/10">
        <Card className="max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-emerald-500" />
          </div>
          <h1 className="text-xl font-black mb-3">Confirming Payment</h1>
          <p className="text-muted-foreground mb-8">
            {plan === "elite" ? "Elite" : "Premium"} your access will be activated after payment is confirmed.
          </p>
          <Button size="lg" className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/pricing" className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Select Plan</h2>
            <RadioGroup value={plan} onValueChange={(v) => setPlan(v as any)}>
              <Label className={`flex items-center justify-between p-4 rounded-lg border mb-3 cursor-pointer ${plan === "premium" ? "border-emerald-500 bg-emerald-500/5" : ""}`}>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="premium" />
                  <span className="font-semibold">Premium</span>
                </div>
                <span className="text-xl font-black">$1,300</span>
              </Label>

              <Label className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer relative ${plan === "elite" ? "border-emerald-500 bg-emerald-500/5" : ""}`}>
                <Badge className="absolute -top-2 -right-2 text-xs">Popular</Badge>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="elite" />
                  <div>
                    <span className="font-semibold flex items-center gap-1">Elite <Zap className="h-4 w-4 text-yellow-500" /></span>
                  </div>
                </div>
                <span className="text-xl font-black">$2,500</span>
              </Label>
            </RadioGroup>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${amount.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Pay with Crypto
            </h2>

            <RadioGroup value={crypto.s} onValueChange={(v) => setCrypto(CRYPTO.find(c => c.s === v)!)}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {CRYPTO.map(c => (
                  <Label key={c.s} className="flex flex-col items-center p-4 rounded-lg border cursor-pointer text-center text-sm [&:has([data-state=checked])]:border-emerald-500 [&:has([data-state=checked])]:bg-emerald-500/5">
                    <RadioGroupItem value={c.s} className="sr-only" />
                    <span className="font-bold">{c.s}</span>
                    <span className="text-xs text-muted-foreground">{c.n}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            <div className="bg-muted/50 rounded-lg p-5 text-center">
              <p className="text-sm text-muted-foreground mb-2">Send exactly</p>
              <p className="text-2xl font-black mb-4">{amount} {crypto.s}</p>
              <div className="flex items-center justify-center gap-2 bg-background rounded-lg p-3 font-mono text-sm">
                <span className="truncate">{crypto.a}</span>
                <Button size="icon" variant="ghost" onClick={copy}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full mt-6 h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={() => setPaid(true)}
            >
              I Have Paid
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              DM <a href="https://t.me/hlymrk" className="underline">@hlymrk</a> if stuck
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}