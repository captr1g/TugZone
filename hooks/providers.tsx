"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider } from '@privy-io/wagmi';

import { privyConfig } from '../config/privyConfig';
import { wagmiConfig } from '../config/wagmiConfig';
import { useAuth } from './useAuth';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    const { getToken, isLoading } = useAuth();

    return (
        <PrivyProvider
            appId="cmb7yk0on018ckw0md27j3q42"
            config={{
                ...privyConfig,
                customAuth: {
                    isLoading: isLoading,
                    getCustomAccessToken: getToken,
                },
            }}
        >
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}