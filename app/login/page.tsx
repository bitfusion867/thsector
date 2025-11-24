// app/(protected)/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Globe, MapPin } from "lucide-react"

// Define a type for the GeoIP data
interface GeoInfo {
  ip: string
  city: string
  region: string
  country: string
  org?: string
}

export default function LoginPage() {
  const [geoInfo, setGeoInfo] = useState<GeoInfo>({
    ip: "Fetching…",
    city: "Location",
    region: "Unknown",
    country: "World",
  })
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [loginError, setLoginError] = useState(false)

  useEffect(() => {
    // 🌍 Fetch detailed IP information
    async function fetchIP() {
      try {
        // NOTE: IPinfo often requires an API token for detailed lookups (city, region, etc.)
        const res = await fetch("https://ipinfo.io/json")
        const data = await res.json()
        setGeoInfo({
          ip: data.ip || "N/A",
          city: data.city || "Unknown City",
          region: data.region || "Unknown Region",
          country: data.country || "N/A",
        })
      } catch (error) {
        setGeoInfo(prev => ({ ...prev, ip: "Error Fetching IP" }))
      }
    }
    fetchIP()

    // 🔥 Check session validity
    const expiry = localStorage.getItem("session_expiry")
    if (expiry && Date.now() < Number(expiry)) {
      setAuthorized(true)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setLoginError(false)

    // Simulate Network Delay
    await new Promise((res) => setTimeout(res, 1000))

    // Example credential check
    if (email === "privatesector@thesector.com" && password === "$Qbc@1864P") {
      setAuthorized(true)
      // 🔥 Save 1-hour session
      const oneHour = Date.now() + 3600000
      localStorage.setItem("session_expiry", String(oneHour))
      setTimeout(()=>{
        window.location.replace("/")
      },3000)
    } else {
      setLoginError(true)
    }

    setLoading(false)
  }

  // --- Display Access Granted Message ---
  if (authorized) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white">
        <Image
          src="/logo.jpg"
          width={60}
          height={60}
          alt="Site Logo"
          className="rounded-xl shadow-md mb-6"
        />
        <h1 className="text-3xl font-bold mb-2 text-emerald-400">ACCESS GRANTED</h1>
        <p className="text-zinc-400 mb-4 text-center">Your secure session is active.</p>
        <p className="text-sm text-zinc-500 flex items-center gap-1">
          <MapPin size={14} /> {geoInfo.city}, {geoInfo.country} (IP: {geoInfo.ip})
        </p> 
        <br/> <p className="text-sm text-zinc-500 flex items-center gap-1">
         If you are not redirected immediately, click this button
        </p>
        <a href="/">
          <Button
            className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold"
            onClick={() => {
              localStorage.removeItem("session_expiry")
              setAuthorized(false)
            }}
          >
            Access website
          </Button>
        </a>
      </div>
    )
  }

  // --- Display 403 Forbidden Login Page ---
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 p-4 sm:p-6">

      {/* Logo */}
      <div className="mb-4">
        <Image
          src="/logo.jpg"
          width={70}
          height={70}
          alt="Site Logo"
          className="rounded-xl shadow-lg"
        />
      </div>

      {/* 🛑 403 FORBIDDEN Banner - High Contrast */}
      <div className="w-full max-w-sm bg-red-700/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 shadow-xl flex items-center justify-center space-x-3">
        <div className="text-center">
          <h1 className="text-base font-extrabold tracking-widest text-red-400">403</h1>
          <p className="text-xs font-medium uppercase text-red-300/70">Access Forbidden</p>
        </div>
      </div>

      {/* 🔑 Login Card - Compact and Sleek */}
      <Card className="w-full max-w-sm bg-zinc-900/70 border-white/10 shadow-2xl rounded-xl">
        <CardHeader className="text-center pb-3">
          <CardTitle className="text-white text-xl font-bold">
            Authentication Required
          </CardTitle>
          {/* GeoIP Info - Compact Row with IP */}
          <div className="flex flex-col text-sm text-zinc-500 mt-2 space-y-1">
            <span className="flex justify-center items-center gap-1">
              <Globe size={12} /> {geoInfo.country}
            </span>
            <span className="flex justify-center items-center gap-1 text-xs">
              <MapPin size={12} /> {geoInfo.city}, {geoInfo.region}
            </span>
            <p className="text-xs text-zinc-600 pt-1">
              Your IP: {geoInfo.ip}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email Input */}
            <div>
              <Input
                type="email"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-10"
                placeholder="Email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setLoginError(false); }}
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <Input
                type="password"
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 h-10"
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(false); }}
                required
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold hover:bg-red-700 h-10 mt-6"
              disabled={loading}
            >
              {loading ? "Verifying Credentials..." : "Access System"}
            </Button>

            {/* Error Message */}
            {loginError && (
              <div className="flex items-center justify-center gap-2 text-red-400 text-sm p-2 bg-red-900/20 rounded-md">
                <AlertCircle size={16} />
                Invalid credentials.
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <p className="mt-8 text-xs text-zinc-700 text-center max-w-xs">
        Authentication attempts are logged and monitored.
      </p>
    </div>
  )
}