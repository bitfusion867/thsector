// app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { base, mainnet } from "wagmi/chains"
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

const queryClient = new QueryClient()

const projectId = "1bcd2d18b56a12218555ee9c5b285878"

const metadata = {
  name: "The Sector",
  description: "Trade real stocks & crypto with your wallet",
  url: "https://yourdomain.com",
  icons: ["https://yourdomain.com/logo.png"]
}

const config = createConfig({
  chains: [base, mainnet],
  transports: { [base.id]: http(), [mainnet.id]: http() },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: metadata.name }),
  ],
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
  themeVariables: { "--w3m-accent": "#10b981" }, // emerald-500
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}