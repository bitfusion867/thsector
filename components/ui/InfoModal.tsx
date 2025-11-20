// components/ui/InfoModal.tsx
"use client"

import { useState } from "react"
import { AlertCircle, Info, CheckCircle2, XCircle, ChevronDown, ChevronUp, Copy } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import { cn } from "@/lib/utils"

type Variant = "info" | "warning" | "success" | "error"

interface InfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: Variant
  title: string
  message: string
  details?: string  // Long text to show in textarea
}

const icons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
}

const colors = {
  info: "text-blue-400",
  warning: "text-yellow-400",
  success: "text-emerald-400",
  error: "text-red-400",
}

export function InfoModal({ open, onOpenChange, variant = "info", title, message, details }: InfoModalProps) {
  const [showDetails, setShowDetails] = useState(false)
  const Icon = icons[variant]

  const copyDetails = () => {
    navigator.clipboard.writeText(details || "")
    toast.success("Copied to clipboard")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Icon className={cn("h-8 w-8", colors[variant])} />
            <DialogTitle className="text-xl">{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-muted-foreground">{message}</p>

          {details && (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowDetails(!showDetails)}
              >
                <span>View Payment Details</span>
                {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>

              {showDetails && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <Textarea
                    value={details}
                    readOnly
                    className="font-mono text-xs h-32 resize-none"
                  />
                  <Button size="sm" className="w-full" onClick={copyDetails}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Details
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button size="lg" className="w-full" onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}