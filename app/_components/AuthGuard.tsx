"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

export default function AuthGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Pages that DON'T require auth
    const publicPages = ["/login"]

    // If current route is public → skip auth check
    if (publicPages.includes(pathname)) return

    const expiry = localStorage.getItem("session_expiry")

    if (!expiry || Date.now() > Number(expiry)) {
      window.location.replace("/login")
    }
  }, [pathname, router])

  return null
}
