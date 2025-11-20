// components/ui/InfoCard.tsx
import { AlertCircle, Info, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Variant = "info" | "warning" | "success" | "error"

interface InfoCardProps {
  variant?: Variant
  title?: string
  children: React.ReactNode
  className?: string
}

const icons = {
  info: Info,
  warning: AlertCircle,
  success: CheckCircle2,
  error: XCircle,
}

const colors = {
  info: "border-blue-500/50 bg-blue-500/5 text-blue-400",
  warning: "border-yellow-500/50 bg-yellow-500/5 text-yellow-400",
  success: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
  error: "border-red-500/50 bg-red-500/5 text-red-400",
}

export function InfoCard({ variant = "info", title, children, className }: InfoCardProps) {
  const Icon = icons[variant]

  return (
    <div className={cn("flex items-start gap-4 rounded-xl border p-5", colors[variant], className)}>
      <Icon className="h-6 w-6 shrink-0 mt-0.5" />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}