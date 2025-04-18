import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowUpRight, Zap } from "lucide-react"

// Dummy data for arsenals
const arsenals = [
  {
    id: 1,
    name: "Ethereum Arsenal",
    symbol: "ETH",
    totalSupply: 1000000,
    price: 2150.75,
    change24h: 5.2,
    description: "The backbone of decentralized finance",
  },
  {
    id: 2,
    name: "Bitcoin Arsenal",
    symbol: "BTC",
    totalSupply: 21000000,
    price: 36750.5,
    change24h: -2.1,
    description: "The original cryptocurrency",
  },
  {
    id: 3,
    name: "Cardano Arsenal",
    symbol: "ADA",
    totalSupply: 45000000000,
    price: 1.25,
    change24h: 3.7,
    description: "A sustainable blockchain with academic rigor",
  },
  {
    id: 4,
    name: "Polkadot Arsenal",
    symbol: "DOT",
    totalSupply: 1103303471,
    price: 6.15,
    change24h: 1.9,
    description: "Connecting blockchains for a decentralized web",
  },
  {
    id: 5,
    name: "Solana Arsenal",
    symbol: "SOL",
    totalSupply: 549226080,
    price: 23.8,
    change24h: -0.5,
    description: "Fast, secure, and censorship-resistant blockchain",
  },
]

export default function ListingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">Token Arsenals</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {arsenals.map((arsenal) => (
          <Link href={`/listings/${arsenal.id}`} key={arsenal.id}>
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-primary text-xl glow-text">{arsenal.name}</CardTitle>
                <Badge variant="outline" className="text-sm">
                  {arsenal.symbol}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-2xl font-bold">${arsenal.price.toLocaleString()}</div>
                  <div className={`text-sm ${arsenal.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {arsenal.change24h >= 0 ? "+" : ""}
                    {arsenal.change24h}%
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{arsenal.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4 text-primary" />
                    <span>{arsenal.totalSupply.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex items-center text-primary">
                    View Arsenal <ArrowUpRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
