import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Zap, Users, Clock, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react"
import TokenChart from "@/app/components/TokenChart"
import BuySellActions from "./components/BuySellActions"
import Leaderboard from "./components/Leaderboard"

// Dummy data for a specific war
const warData = {
  id: 1,
  name: "ETH vs BTC",
  description: "The clash of the titans",
  status: "active",
  timeRemaining: "2h 15m",
  participants: 1243,
  totalVolume: 1500000,
  progress: 65,
  tokenA: {
    name: "Ethereum",
    symbol: "ETH",
    price: 2150.75,
    change: 5.2,
  },
  tokenB: {
    name: "Bitcoin",
    symbol: "BTC",
    price: 36750.5,
    change: -2.1,
  },
}

export default function WarPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the war details based on the ID
  const war = warData

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">{war.name}</h1>
          <p className="text-lg text-muted-foreground">{war.description}</p>
        </div>
        <Badge variant="outline" className="text-lg uppercase cyber-gradient">
          {war.status}
        </Badge>
      </div>

      <Card className="cyber-gradient border-primary/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[war.tokenA, war.tokenB].map((token, index) => (
              <div key={index} className="bg-secondary/50 p-4 rounded-lg border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-primary text-lg">{token.symbol}</span>
                  <span className={`text-sm ${token.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                    {token.change >= 0 ? (
                      <TrendingUp className="inline mr-1 h-4 w-4" />
                    ) : (
                      <TrendingDown className="inline mr-1 h-4 w-4" />
                    )}
                    {Math.abs(token.change)}%
                  </span>
                </div>
                <div className="text-2xl font-semibold">${token.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Battle Progress</span>
              <span>{war.progress}%</span>
            </div>
            <Progress value={war.progress} className="h-2" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{war.timeRemaining} remaining</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{war.participants} participants</span>
            </div>
            <div>
              <span className="font-bold">Total Volume: </span>
              <span className="text-primary">${war.totalVolume.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="cyber-gradient border-primary/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-primary">Price Charts</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenChart />
          </CardContent>
        </Card>

        <BuySellActions tokens={[war.tokenA, war.tokenB]} />
      </div>

      <Tabs defaultValue="leaderboard" className="w-full">
        <TabsList className="cyber-gradient w-full justify-start">
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
        </TabsList>
        <TabsContent value="leaderboard">
          <Leaderboard />
        </TabsContent>
        <TabsContent value="history">
          <Card className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Recent trades will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
