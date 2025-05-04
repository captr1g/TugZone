'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
    connected: boolean;
    provider: ethers.Provider | null;
    address: string | null;
    signer: ethers.Signer | null;
    connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType>({
    address: null,
    signer: null,
    connectWallet: async () => { },
    provider: null,
    connected: false,
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
    const [address, setAddress] = useState<string | null>(null);
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [provider, setProvider] = useState<ethers.Provider | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const connectWallet = async () => {
        if (!(window as any).ethereum) {
            alert('Please install MetaMask');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider((window as any).ethereum);

            // Prompt MetaMask to connect and return selected accounts
            const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setProvider(provider);
            setSigner(signer);
            setAddress(address);
            setConnected(true);
        } catch (err) {
            console.error('[Wallet Connect Error]', err);
            alert('Failed to connect wallet');
        }
    };

    // useEffect(() => {
    //     // Auto-connect if already connected
    //     if ((window as any).ethereum) {
    //         (window as any).ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
    //             if (accounts.length > 0) {
    //                 connectWallet();
    //             }
    //         });
    //     }
    // }, []);

    return (
        <WalletContext.Provider value={{ address, signer, connectWallet, provider, connected }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => useContext(WalletContext);
