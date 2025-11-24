"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

const LayoutContext = createContext({ hideLayout: false })

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [hideLayout, setHideLayout] = useState(false)

  useEffect(() => {
    const authPages = ["/login"]
    setHideLayout(authPages.includes(pathname))
  }, [pathname])

  return (
    <LayoutContext.Provider value={{ hideLayout }}>
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  return useContext(LayoutContext)
}
