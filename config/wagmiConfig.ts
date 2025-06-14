import { base, baseSepolia, mainnet, sepolia } from 'viem/chains';
import { http } from 'wagmi';

import { createConfig } from '@privy-io/wagmi';


export const wagmiConfig = createConfig({
    chains: [mainnet, sepolia, base, baseSepolia],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [base.id]: http(),
        [baseSepolia.id]: http(),
    },
});