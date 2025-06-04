"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap } from "lucide-react"
import POOL_ABI from "../../../../abis/PumpPool.json";

interface Token {
  name: string
  symbol: string
  price: number
}

const POOL = '0x856f236a946dcd30379579f0bA37253D895d3548' as const

export default function BuySellActions({ tokens }: { tokens: Token[] }) {
  const [selectedToken, setSelectedToken] = useState(tokens[0].symbol)
  const [amount, setAmount] = useState("")



  const handleBuy = () => {
    // Implement buy logic
    console.log("Buy", amount, selectedToken)
  }

  const handleSell = () => {
    // Implement sell logic
    console.log("Sell", amount, selectedToken)
  }

  const currentPrice = tokens.find((t) => t.symbol === selectedToken)?.price || 0

  return (
    <Card className="cyber-gradient border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Trade Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select onValueChange={setSelectedToken} defaultValue={selectedToken}>
            <SelectTrigger className="w-full bg-secondary/50 border-primary/20">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-muted-foreground mb-1">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter token amount"
              className="bg-secondary/50 border-primary/20"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            Total: ${(Number.parseFloat(amount) * currentPrice || 0).toFixed(2)}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleBuy} className="cyber-button">
              Buy
            </Button>
            <Button onClick={handleSell} variant="outline" className="cyber-button">
              Sell
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
