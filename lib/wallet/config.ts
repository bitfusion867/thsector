import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: "The Sector",
  description: "Trade real U.S. stocks with crypto instantly with your wallet. Fully on-chain",
  url: "https://www.thesectorfirm.com",
  icons: ["https://www.thesectorfirm.com/logo.jpg"]
}

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia], // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
})