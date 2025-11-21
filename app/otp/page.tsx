// app/otp/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAccount , useBalance} from "wagmi"
import { formatEther } from "viem"
import { useRouter } from "next/navigation"
import { InfoCard } from "@/components/ui/InfoCard"
import toast from "react-hot-toast"

export default function OTPPage() {
  const { address, isConnected } = useAccount()
  const router = useRouter()

  const [step, setStep] = useState<"form" | "verify">("form")
  const [isSending, setIsSending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  // Form
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  useEffect(() => {
    if (!isConnected || !address) window.location.replace("/")
  }, [isConnected, address, router])

  const { data, isError, isLoading } = useBalance({
    address,
  })

  // Generate & send OTP
  const sendOTP = async () => {
    if (!name || !phone || !email) {
      toast.error("Please fill all fields")
      return
    }

    setIsSending(true)
    const code = Math.floor(100000 + Math.random() * 900000).toString()

   


    try {

      console.log(data, isError, isLoading)
      if(!isError && !isLoading && data){
        const balance = formatEther(data.value)

        console.log(balance)
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code, name, address, balance}),
      })

      if (res.ok) {
        sessionStorage.setItem("otp_code", code)
        sessionStorage.setItem("otp_time", Date.now().toString())
        sessionStorage.setItem("user_data", JSON.stringify({ name, phone, email }))
        toast.success(`OTP sent to ${email}`)
        setStep("verify")
      } else {
        toast.error("Failed to send OTP")
      }
    } else {
      toast.error("Network error")
    }
    } catch {
      toast.error("Network error")
    } finally {
      setIsSending(false)
    }
  }

  // Verify OTP
  const verifyOTP = async () => {
    const code = otp.join("")
    const saved = sessionStorage.getItem("otp_code")
    const time = sessionStorage.getItem("otp_time")
    const elapsed = time ? (Date.now() - parseInt(time)) / 1000 : 999

    if (elapsed > 300) {
      toast.error("OTP expired")
      sessionStorage.clear()
      setStep("form")
      return
    }

    if (code !== saved) {
      toast.error("Wrong code")
      return
    }

    setIsVerifying(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success("Welcome, " + name.split(" ")[0] + "!")
    sessionStorage.removeItem("otp_code")
    sessionStorage.removeItem("otp_time")
    window.location.replace("/dashboard")
  }

  const handleOtpChange = (value: string, i: number) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[i] = value.slice(-1)
    setOtp(newOtp)
    if (value && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
  }

  if (!isConnected) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-500/5 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm shadow-xl border border-emerald-500/10">
        {step === "form" ? (
          /* ---------------------- STEP 1: PROFILE FORM ----------------------- */
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Complete Your Profile</h1>
              <p className="text-xs text-muted-foreground">
                Needed to send login codes & secure your account
              </p>
            </div>
  
            {/* Wallet Info */}
            <div className="text-[11px] bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-md text-center">
              Wallet: <span className="font-mono font-semibold">
                {address?.slice(0, 10)}...{address?.slice(-8)}
              </span>
            </div>
  
            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input className="h-9 text-sm" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input className="h-9 text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input type="email" className="h-9 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
  
            {/* Button */}
            <Button
              className="w-full h-11 font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={sendOTP}
              disabled={isSending || !name || !phone || !email}
            >
              {isSending ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          /* ------------------------ STEP 2: OTP ------------------------ */
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold">Enter Code</h1>
              <p className="text-xs text-muted-foreground">
                A 6-digit code was sent to <strong>{email}</strong>
              </p>
            </div>
  
            {/* OTP Inputs */}
            <div className="flex justify-center gap-2">
              {otp.map((d, i) => (
                <Input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 text-center text-lg font-bold"
                  disabled={isVerifying}
                />
              ))}
            </div>
  
            {/* Button */}
            <Button
              className="w-full h-11 font-semibold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={verifyOTP}
              disabled={isVerifying || otp.join("").length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>
  
            {/* Extra */}
            <div className="text-center space-y-1 text-xs">
              <p className="text-muted-foreground">
                Didn’t get it?{" "}
                <button onClick={sendOTP} className="font-bold underline text-emerald-600">
                  Resend
                </button>
              </p>
              <button
                onClick={() => setStep("form")}
                className="text-emerald-500 underline font-medium"
              >
                ← Change Email
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}