"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { useAccount, useDisconnect } from "wagmi"
import { Wallet, Bell, AlertTriangle } from "lucide-react"

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const router = useRouter()

  // Shorten wallet address
  const displayAddress = address
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : "Wallet not connected"

  // Generic function to wipe auth session + wallet
  const fullyLogout = () => {
    try {
      localStorage.removeItem("auth_session")
    } catch {}
    disconnect() // wagmi disconnect
    router.replace("/login")
  }

  return (
    <div className="container max-w-4xl py-12 space-y-10">

      {/* Header */}
      <div className="space-y-1">
        <h3 className="font-extrabold tracking-tight">
          Account Settings
        </h3>
        <p className="text-muted-foreground">
          Manage your connections, notifications, and security preferences.
        </p>
      </div>

      <Separator />

      <div className="space-y-8">

        {/* WALLET CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-primary" />
              <CardTitle>Wallet Connection</CardTitle>
            </div>
            <CardDescription>Your primary cryptographic identity for this platform.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2">
                <Label className="text-sm font-medium text-muted-foreground mb-1 block">
                  Connected Address
                </Label>
                <code className="bg-muted px-3 py-1.5 rounded-lg text-sm font-mono font-semibold text-primary/80 truncate">
                  {displayAddress}
                </code>
              </div>

              {/* Change wallet button with confirmation dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" disabled={!address}>
                    Change Wallet
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Change connected wallet?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will disconnect your current wallet and require you to sign in again.
                      Your session will also be cleared.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={fullyLogout}
                    >
                      Yes, Change Wallet
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>

        {/* NOTIFICATIONS CARD */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-teal-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Control how you receive alerts and confirmations.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="price-alerts" className="flex flex-col space-y-1">
                <span className="font-medium">Price Alerts</span>
                <span className="text-sm text-muted-foreground">
                  Get notified when stocks hit your target.
                </span>
              </Label>
              <Switch id="price-alerts" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="trade-confirm" className="flex flex-col space-y-1">
                <span className="font-medium">Trade Confirmation</span>
                <span className="text-sm text-muted-foreground">
                  Email or push notification after every successful trade.
                </span>
              </Label>
              <Switch id="trade-confirm" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* DANGER ZONE */}
        <Card className="border-2 border-red-500/50 bg-red-500/5">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-red-400">
              Actions in this section are irreversible and affect your session security.
            </CardDescription>
          </CardHeader>

          <CardContent>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  Disconnect & Clear Session Data
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to disconnect?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out, disconnect your wallet, and erase authentication session data.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>

                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    onClick={fullyLogout}
                  >
                    Yes, Disconnect
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
