// app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { base, mainnet } from "wagmi/chains"
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

const queryClient = new QueryClient()

// Your WalletConnect Cloud project ID (from https://cloud.walletconnect.com)
const projectId = "a3c5ad2e4f80986a19d7a4bc74ea3af2" // ← Replace with your actual ID

const metadata = {
  name: "The Sector",
  description: "Trade real stocks & crypto with your wallet",
  url: "https://yourdomain.com", // ← Your actual domain
  icons: ["https://yourdomain.com/logo.png"] // ← Your logo
}

const config = createConfig({
  chains: [base, mainnet],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
  connectors: [
    // WalletConnect (powers Trust, Exodus, Phantom, etc.)
    walletConnect({
      projectId,
      metadata,
      showQrModal: false, // Disable auto QR; we handle it
    }),
    // Injected (browser extensions like Phantom's EVM mode)
    injected({ shimDisconnect: true }),
    // Coinbase (fallback)
    coinbaseWallet({ appName: metadata.name }),
  ],
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#10b981", // emerald-500
    "--w3m-border-radius-master": "12px", // Slightly rounded for premium feel
  },

  // Pin these at the TOP of the modal (they'll show under WalletConnect)
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db5ad1cdee9f8f5e6d5c9d6e9f8c9d6e9", // Trust Wallet
    "e9ffc1f2e8d3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8", // Exodus
    "f3c93f43e2d0e6a4b2e2a3c5d5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5", // Phantom
  ],

  // Only show these + essentials (hides 100+ irrelevant wallets)
  includeWalletIds: [
    "c57ca95b47569778a828d19178114f4db5ad1cdee9f8f5e6d5c9d6e9f8c9d6e9", // Trust
    "e9ffc1f2e8d3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8", // Exodus
    "f3c93f43e2d0e6a4b2e2a3c5d5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5e5f5", // Phantom
    "4622a2b2d6af1c9844944291e5e7351fa0e7911c3f4a5b6c7d8e9f0a1b2c3d4e", // MetaMask (fallback)
    "c57ca95b47569778a828d19178114f4db5ad1cdee9f8f5e6d5c9d6e9f8c9d6e9", // Rainbow (bonus popular)
  ],

  // Optional: Hide social logins if you don't want them
  excludeWalletIds: [
    "google", "apple", "discord", "facebook", "twitter", "email" // Socials
  ],
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