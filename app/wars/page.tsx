import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Users, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"

// Dummy data for active wars
const activeWars = [
  {
    id: 1,
    name: "ETH vs BTC",
    description: "The clash of the titans",
    participants: 1243,
    timeRemaining: "2h 15m",
    totalVolume: 1500000,
  },
  {
    id: 2,
    name: "DOGE vs SHIB",
    description: "Battle of the meme coins",
    participants: 567,
    timeRemaining: "1d 3h",
    totalVolume: 750000,
  },
  {
    id: 3,
    name: "ADA vs DOT",
    description: "Smart contract showdown",
    participants: 892,
    timeRemaining: "4h 30m",
    totalVolume: 1200000,
  },
  {
    id: 4,
    name: "XRP vs XLM",
    description: "Payment protocol face-off",
    participants: 456,
    timeRemaining: "6h 45m",
    totalVolume: 900000,
  },
]

export default function WarsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">Active Token Wars</h1>
        <Button className="cyber-button">
          <Zap className="mr-2 h-4 w-4" />
          Create New War
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {activeWars.map((war) => (
          <Card key={war.id} className="cyber-gradient border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary text-xl glow-text">{war.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{war.description}</p>
              <div className="flex justify-between items-center text-sm mb-4">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{war.participants} participants</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{war.timeRemaining} left</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                  <div className="font-bold text-primary">${war.totalVolume.toLocaleString()}</div>
                </div>
                <Link href={`/wars/${war.id}`}>
                  <Button variant="outline" className="cyber-button">
                    Enter Battle
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
