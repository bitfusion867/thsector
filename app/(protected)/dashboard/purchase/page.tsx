"use client"

import { useState, useMemo } from "react"
import { ArrowLeft, Check, Copy, Wallet, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { allStocks } from "@/lib/data/stocks"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"

const CRYPTO = [
  { s: "USDC", n: "Base", a: "0xD4e728Bee96e7b59819dA220eF3c3caeb29f8884" },
  { s: "USDT", n: "Polygon", a: "0xD4e728Bee96e7b59819dA220eF3c3caeb29f8884" },
  { s: "ETH", n: "Ethereum", a: "0xD4e728Bee96e7b59819dA220eF3c3caeb29f8884" },
  { s: "BTC", n: "Bitcoin", a: "bc1qjkkwqsvf456h6uecm83a2lxcep8phvd55wnrzg" },
]

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const symbol = searchParams.get("symbol")

  const [quantity, setQuantity] = useState(1)
  const [crypto, setCrypto] = useState(CRYPTO[0])
  const [paid, setPaid] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false);

  const selectedStock = useMemo(() => {
    return allStocks.find(s => s.symbol === symbol)
  }, [symbol])

  const amount = selectedStock ? parseFloat((selectedStock.price * quantity).toFixed(2)) : 0
  const isPositive = selectedStock?.change ? selectedStock.change >= 0 : true

  const copy = () => {
    navigator.clipboard.writeText(crypto.a)
    toast.success(`Copied ${crypto.s} address`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  const handlePayment = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setPaid(true);
    }, 2500); // 2.5 seconds delay (adjust as needed)
  };

  if (!selectedStock) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-xl font-bold mb-2 text-red-600">Stock Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The stock "{symbol}" could not be located.
          </p>
          <Button className="w-full font-semibold" asChild>
            <Link href="/dashboard/stocks">Return to Stocks</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // -----------------------------------------
  // SUCCESS VIEW
  // -----------------------------------------
  if (paid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-background to-emerald-500/10">
        <Card className="max-w-md w-full p-10 text-center">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>

          <h1 className="text-xl font-bold mb-2">Processing Payment</h1>
          <p className="text-muted-foreground mb-6">
            Your purchase of {quantity} share(s) of {selectedStock.symbol} will be processed shortly.
          </p>

          <Button className="w-full font-bold bg-emerald-500 hover:bg-emerald-400 text-black" asChild>
            <Link href="/dashboard">Go to Portfolio</Link>
          </Button>
        </Card>
      </div>
    )
  }

  // -----------------------------------------
  // MAIN CHECKOUT VIEW (COMPACT)
  // -----------------------------------------
  return (
    <div className="min-h-screen md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back */}
        <Link href="/dashboard/stocks" className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-emerald-500" />
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ITEM CARD */}
          <Card className="p-5 space-y-5">

            {/* Stock Info */}
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <Image
                src={selectedStock.imageUrl}
                alt="logo"
                width={48}
                height={48}
                className="rounded-lg bg-gray-50 p-2 object-contain"
              />
              <div className="flex-1">
                <p className="font-bold">{selectedStock.symbol}</p>
                <p className="text-sm text-muted-foreground">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${parseInt(selectedStock.price.toFixed(2)).toLocaleString()}</p>
                <Badge variant={isPositive ? "default" : "destructive"} className="mt-1 text-xs">
                  {selectedStock.change > 0 ? "+" : ""}{selectedStock.change.toFixed(2)}%
                </Badge>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-2 text-sm">Quantity</p>
              <div className="flex items-center justify-between p-2 border rounded-lg">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-bold min-w-[40px] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{quantity} × ${parseInt(selectedStock.price.toFixed(2)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mt-1">
                <span>Total</span>
                <span className="text-emerald-500">${amount.toFixed(2)}</span>
              </div>
            </div>
          </Card>

          {/* PAYMENT CARD */}
          <Card className="p-5 space-y-5">

            <h2 className="font-semibold flex items-center gap-2 text-lg">
              <Wallet className="h-5 w-5" /> Pay with Crypto
            </h2>

            {/* Crypto Options */}
            <RadioGroup value={crypto.s} onValueChange={(v) => setCrypto(CRYPTO.find(c => c.s === v)!)}>
              <div className="grid grid-cols-2 gap-3">
                {CRYPTO.map(c => (
                  <Label key={c.s} className="flex flex-col items-center p-3 border rounded-lg cursor-pointer text-sm [&:has([data-state=checked])]:border-emerald-500">
                    <RadioGroupItem value={c.s} className="sr-only" />
                    <span className="font-bold">{c.s}</span>
                    <span className="text-xs text-muted-foreground">{c.n}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>

            {/* Payment Box */}
            <div className="bg-muted/50 p-4 rounded-lg text-center space-y-1">
              <p className="text-xs text-muted-foreground">Send</p>
              <p className="text-xl font-bold">
                {amount.toFixed(4)} {crypto.s}
              </p>

              <div className="flex items-center justify-center gap-2 p-2 bg-background rounded-md border font-mono text-xs">
                <span className="truncate">{crypto.a}</span>
                <Button size="icon" variant="ghost" onClick={copy}>
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              className="w-full h-12 font-semibold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={handlePayment}
              disabled={amount <= 0 || loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-black/40 border-t-transparent rounded-full animate-spin"></span>
                  Processing...
                </div>
              ) : (
                "I Have Paid"
              )}
            </Button>


            <p className="text-center text-xs text-muted-foreground">
              Need help? DM us <a href="https://t.me/info_sector" className="underline">on Telegram</a>
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
