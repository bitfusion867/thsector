"use client"

import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useDisconnect } from "wagmi"
import { Wallet, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { shortenAddress } from "@/lib/utils"
import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function WalletConnectButton() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isConnected && address) {
      const wasDirected = sessionStorage.getItem("wasDirected")

      if (!wasDirected && !pathname.includes("dashboard")) {
        sessionStorage.setItem("wasDirected", "true")
        router.replace("/dashboard")
      }

    }
  }, [isConnected, address, router, pathname])

  function handleOpen() {
    open();
  }

  function handleLogOut() {
    disconnect()
    router.push("/")
    sessionStorage.removeItem("wasDirected")
  }
  if (!isConnected) {
    return (
      <Button
        size="lg"
        className="font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
        onClick={handleOpen}
      >
        <Wallet className="mr-2 h-5 w-5" />
        Connect Wallet
      </Button>
    )
  }


  return (
    <div className="flex items-center gap-3">
      <Link
        href="/dashboard"
        className="font-bold text-emerald-500 hover:text-emerald-400 text-black shadow-lg"
      >
        Dashboard
      </Link>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        <Avatar className="h-6 w-6 mr-2">
          <AvatarFallback className="bg-emerald-500 text-white text-xs">
            {address?.slice(2, 4).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {shortenAddress(address!)}
      </Button>

      <Button variant="ghost" size="icon" onClick={handleLogOut}>
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  )
}