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
    <div className="min-h-screen bg-gradient-to-br from-background via-emerald-500/5 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl">
        {step === "form" ? (
          // Step 1: Collect Info
          <div className="p-8 space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black">Complete Your Profile</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                We need this to send you login codes and keep your account secure
              </p>
            </div>

            <InfoCard variant="info" className="text-xs">
              Wallet connected: <span className="font-mono font-bold">{address?.slice(0, 10)}...{address?.slice(-8)}</span>
            </InfoCard>

            <div className="space-y-5">
              <div>
                <Label>Full Name</Label>
                <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input placeholder="+234 801 234 5678" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Email Address</Label>
                <Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={sendOTP}
              disabled={isSending || !name || !phone || !email}
            >
              {isSending ? "Sending Code..." : "Send OTP"}
            </Button>
          </div>
        ) : (
          // Step 2: Verify OTP
          <div className="p-8 space-y-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-black">Enter Code</h1>
              <p className="text-muted-foreground mt-2">
                We sent a 6-digit code to <strong>{email}</strong>
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {otp.map((d, i) => (
                <Input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleOtpChange(e.target.value, i)}
                  className="w-14 h-14 text-center text-2xl font-bold"
                  disabled={isVerifying}
                />
              ))}
            </div>

            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-black"
              onClick={verifyOTP}
              disabled={isVerifying || otp.join("").length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </Button>

            <div className="text-center space-y-2 text-sm">
              <p className="text-muted-foreground">
                Didn’t get it? <button onClick={sendOTP} className="font-bold underline">Resend</button>
              </p>
              <button onClick={() => setStep("form")} className="text-emerald-500 hover:underline">
                ← Change email
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}