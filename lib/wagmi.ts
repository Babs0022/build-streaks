import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
