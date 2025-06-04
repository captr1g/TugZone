// providers.tsx
"use client";
import { useMemo, useCallback } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { privyConfig } from "@/config/privyConfig";
import { wagmiConfig } from "@/config/wagmiConfig";
// import { useAuth } from "./useAuth";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    // const { getToken, isLoading } = useAuth();

    /** ---- callbacks keep their function identity ------------ */
    // const getCustomToken = useCallback(() => getToken(), [getToken]);
    /** -------------------------------------------------------- */

    // /** ---- memoise ONCE; reference never changes -------------- */
    // const privyProviderConfig = useMemo(
    //     () => ({
    //         ...privyConfig,
    //         customAuth: {
    //             isLoading,
    //             getCustomAccessToken: getCustomToken,
    //         },
    //     }),
    //     [isLoading, getCustomToken] // ⚠️  only re-create when these *really* change
    // );
    /** -------------------------------------------------------- */

    return (
        <PrivyProvider appId="cmb7yk0on018ckw0md27j3q42">
            <QueryClientProvider client={queryClient}>
                <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
    );
}
