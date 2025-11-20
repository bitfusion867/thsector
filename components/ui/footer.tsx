// components/Footer.tsx
"use client"

import Link from "next/link"
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton"
import { Twitter, Github, Globe, Shield, Zap, ArrowRight } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand + Tagline */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              The Sector
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Trade real U.S. stocks and crypto instantly with your wallet. No KYC. No banks. Fully on-chain.
            </p>
            <div className="mt-6">
              <WalletConnectButton />
            </div>
          </div>

          {/* Links */}
          {/* <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/stocks" className="hover:text-foreground transition-colors">Stocks</Link></li>
              <li><Link href="/crypto" className="hover:text-foreground transition-colors">Crypto</Link></li>
              <li><Link href="/portfolio" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-foreground transition-colors">Press Kit</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal & Security</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/risk" className="hover:text-foreground transition-colors">Risk Disclosure</Link></li>
              <li><Link href="/audit" className="hover:text-foreground transition-colors flex items-center gap-2">
                <Shield className="h-3 w-3 text-emerald-500" />
                Smart Contract Audit
              </Link></li>
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <p>© {currentYear} The Sector Inc. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link  type="button" href="javascript:void(0)" className="hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link type="button" href="javascript:void(0)" className="hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
                <Link type="button" href="javascript:void(0)" className="hover:text-foreground transition-colors">
                  <Globe className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span>Powered by Base</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                <span>Non-custodial • Fully on-chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}