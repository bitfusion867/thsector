"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createWeb3Modal } from "@web3modal/wagmi/react"
import { WagmiProvider, createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors"

// --- Configuration Constants ---

// Replace with your actual project ID
// This is required for WalletConnect functionality
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

// Replace with your actual Alchemy ID
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID!;

const metadata = {
  name: "The Sector",
  description: "Trade real U.S. stocks with crypto instantly with your wallet. Fully on-chain",
  url: "https://www.thesectorfirm.com",
  icons: ["https://www.thesectorfirm.com/logo.jpg"]
}

// 1. Configure Wagmi
const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`,
    ),
  },
  // Define the connectors you want to use.
  // The WalletConnect Modal will use these connectors and style the UI.
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    // Coinbase Wallet is necessary to support their specific wallet integration
    coinbaseWallet({ appName: metadata.name }),
  ],
})


// 2. Configure the Web3Modal UI (This is where the magic happens)
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#10b981", // Example theme color
  },
  
  // This is the core fix: `featuredWalletIds` explicitly sets the order
  // and visibility of the wallets listed here.
  featuredWalletIds: [
    "c57ca95b47569778a828d19178114f4db1f899cc20407e50803a152f86231780", // Trust Wallet
    "3cc21d51c27b0db5c1061922c069bc920f690b2b8e39886a1130616e25f190bc", // Exodus
    "529e70135d9d7f08c3505c879d71c4828f86f7996c5e2d6771337b512a8335f6", // Phantom
    "c57ca95b47569778a828d19178114f4db1f899cc20407e50803a152f86231780", // MetaMask (Uses same ID as Trust, but is often found by its injected connector)
  ],
  
  // You can optionally exclude other popular wallets to clean up the UI
  excludeWalletIds: [
    "coinbaseWallet",
    "rainbow",
    "binance"
  ],  
})

const queryClient = new QueryClient();

// 3. Export the Provider Component
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}