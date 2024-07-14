import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, arbitrumSepolia, base, mainnet, optimism, polygon, sepolia } from 'wagmi/chains';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

const config = getDefaultConfig({
  appName: 'Mi app con frontend',
  projectId: import.meta.env.VITE_PROJECT_ID,
  chains: [arbitrumSepolia, arbitrum, sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
