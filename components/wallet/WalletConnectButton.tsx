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

const CONNECT_INITIATED_FLAG = "connectInitiated";

export function WalletConnectButton() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isConnected && address) {
      const wasDirected = sessionStorage.getItem("wasDirected")
      const connectInitiated = sessionStorage.getItem(CONNECT_INITIATED_FLAG)

      // Only redirect if:
      // 1. The connection was just initiated by a button click (connectInitiated flag is present)
      // 2. We haven't already been directed to OTP/Dashboard (wasDirected flag is absent)
      // 3. We are not already on a dashboard page
      if (connectInitiated && !wasDirected && !pathname.includes("dashboard")) {
        
        // 1. Clear the one-time flag immediately
        sessionStorage.removeItem(CONNECT_INITIATED_FLAG);
        
        // 2. Set the persistent flag to prevent future redirects on page refresh/re-render
        sessionStorage.setItem("wasDirected", "true")
        
        // 3. Perform the redirection
        window.location.href = ("/otp")
      }
    }
  }, [isConnected, address, pathname])

  function handleOpen() {
    // Set a flag *before* opening the modal to signal this is a user-initiated connect
    sessionStorage.setItem(CONNECT_INITIATED_FLAG, "true");
    open();
  }

  function handleLogOut() {
    disconnect()
    window.location.href = ("/")
    sessionStorage.removeItem("wasDirected")
    sessionStorage.removeItem(CONNECT_INITIATED_FLAG) // Also clear the connect flag on logout
  }

  if (!isConnected) {
    return (
      <Button
        size="lg"
        className="font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg"
        onClick={handleOpen}
      >
        <Wallet className="mr-2 h-5 w-5" />
        Sign In
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