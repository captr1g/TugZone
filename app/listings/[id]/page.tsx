import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, Zap, Users, BarChart2 } from "lucide-react"
import TokenChart from "@/app/components/TokenChart"
import BuySellActions from "@/app/wars/[id]/components/BuySellActions"

// Dummy data for arsenals (same as in listings/page.tsx)
const arsenals = [
  {
    id: 1,
    name: "Ethereum Arsenal",
    symbol: "ETH",
    totalSupply: 1000000,
    price: 2150.75,
    change24h: 5.2,
    description: "The backbone of decentralized finance",
    marketCap: 260000000000,
    volume24h: 15000000000,
    holders: 120000000,
  },
  // ... (include all other arsenals from the listings page)
]

export default function ArsenalPage({ params }: { params: { id: string } }) {
  const arsenal = arsenals.find((a) => a.id === Number.parseInt(params.id)) || arsenals[0]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">{arsenal.name}</h1>
          <p className="text-lg text-muted-foreground">{arsenal.description}</p>
        </div>
        <Badge variant="outline" className="text-lg uppercase cyber-gradient">
          {arsenal.symbol}
        </Badge>
      </div>

      <Card className="cyber-gradient border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-primary text-lg">Price</span>
                <span className={`text-sm ${arsenal.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {arsenal.change24h >= 0 ? (
                    <ArrowUpRight className="inline mr-1 h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="inline mr-1 h-4 w-4" />
                  )}
                  {Math.abs(arsenal.change24h)}%
                </span>
              </div>
              <div className="text-2xl font-semibold">${arsenal.price.toLocaleString()}</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-primary text-lg">Market Cap</span>
              </div>
              <div className="text-2xl font-semibold">${arsenal.marketCap.toLocaleString()}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary">Total Supply</span>
              </div>
              <div className="text-lg">{arsenal.totalSupply.toLocaleString()}</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary">24h Volume</span>
              </div>
              <div className="text-lg">${arsenal.volume24h.toLocaleString()}</div>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-bold text-primary">Holders</span>
              </div>
              <div className="text-lg">{arsenal.holders.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cyber-gradient border-primary/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary">Price Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenChart />
          </CardContent>
        </Card>

        <BuySellActions tokens={[{ name: arsenal.name, symbol: arsenal.symbol, price: arsenal.price }]} />
      </div>

      <Card className="cyber-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">About {arsenal.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{arsenal.description}</p>
          <div className="mt-4">
            <Button className="cyber-button">
              View on Explorer
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
