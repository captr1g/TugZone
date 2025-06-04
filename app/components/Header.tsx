"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { Wallet } from '@coinbase/onchainkit/wallet';
// import { usePrivy, LoginButton } from '@privy-io/react-auth'

import { useEffect } from "react";
import {
  usePrivy,
  useLogin,
  useLogout,
  useConnectWallet,
  useWallets
} from '@privy-io/react-auth';


function LoginButton() {
  const { ready, authenticated, user } = usePrivy();
  // const { address } = useAccount()
  const { login } = useLogin();
  const { logout } = useLogout();
  const { connectWallet } = useConnectWallet();
  const { wallets } = useWallets();   // live array of connected wallets


  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (authenticated && wallets.length === 0) {
      disconnect();
      logout();
    }
  }, [wallets, authenticated, logout]);


  const handleClick = async () => {
    if (!ready) return;

    if (authenticated) {
      // Already logged in → disconnect + logout
      // grab first wallet id; adjust if you support several
      const walletId = wallets[0]?.address;
      if (walletId) disconnect();
      await logout();
    } else {
      //  Not logged in → connect wallet then login
      connectWallet();
      login({
        loginMethods: ['wallet'],
        walletChainType: 'ethereum-only',
        disableSignup: false
      });
      console.log('Logged in as', user?.wallet?.address);
    }
  };


  const connectedAddr = user?.wallet?.address;
  return (
    <button
      disabled={!ready}
      onClick={handleClick}
    >
      {authenticated && connectedAddr
        ? `${connectedAddr.slice(0, 4)}…${connectedAddr.slice(-2)}` // e.g. 0xAb…Cd
        : 'Log in'}
    </button>
  );
}


// return (
//   <button
//     disabled={disableLogin}
//     onClick={loginOnClick}
//   >
//     {authenticated ? (
//       <p>
//         {user?.wallet?.address
//           ? `${user.wallet.address.slice(0, 4)}...${user.wallet.address.slice(-2)}`
//           : ""}
//       </p>
//     ) : "Log in"}
//   </button>
// );




export default function Header() {
  return (
    <header className="border-b border-border/50 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-md z-10">
      <div className="flex h-16 items-center px-6 cyber-gradient">
        <div className="relative flex flex-1 items-center gap-x-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the battlefield..."
              className="w-full bg-secondary/50 pl-9 border-primary/20 focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              3
            </span>
          </Button>

          <LoginButton />
        </div>
      </div>
    </header>
  );
}
