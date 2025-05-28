"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useAccount, useConnect, useDisconnect } from "wagmi";
// import { Wallet } from '@coinbase/onchainkit/wallet';
// import { usePrivy, LoginButton } from '@privy-io/react-auth'

import { useLogin, usePrivy } from '@privy-io/react-auth';
import { useConnectWallet, useWallets } from '@privy-io/react-auth';

function LoginButton() {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated);

  return (
    <button
      disabled={disableLogin}
      onClick={() => login({
        loginMethods: ['wallet'],
        walletChainType: 'ethereum-and-solana',
        disableSignup: false
      })}
    >
      Log in
    </button>
  );
}


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
