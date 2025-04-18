import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Sword, Trophy } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary glow-text">Welcome to the Arena</h1>
          <p className="text-lg text-muted-foreground">Choose your battles. Trade to victory.</p>
        </div>
        <Button size="lg" className="cyber-button gap-2 h-12 tracking-wider">
          <Zap className="h-5 w-5" />
          Enter Battle
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sword className="h-5 w-5" />
              Active Battles
            </CardTitle>
            <CardDescription>Currently ongoing token wars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary glow-text">7</div>
            <p className="text-xs text-muted-foreground">+2 starting in the next hour</p>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Trophy className="h-5 w-5" />
              Your Rank
            </CardTitle>
            <CardDescription>Global leaderboard position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary glow-text">#42</div>
            <p className="text-xs text-muted-foreground">Top 1% of all warriors</p>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-primary/20 md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              Battle Stats
            </CardTitle>
            <CardDescription>Your performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-bold text-primary glow-text">23</div>
                <p className="text-xs text-muted-foreground">Battles Won</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary glow-text">$13.2K</div>
                <p className="text-xs text-muted-foreground">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="cyber-gradient border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Active Battlegrounds</CardTitle>
          <CardDescription>Current token wars in progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-primary/20 p-4 bg-secondary/50 hover:bg-secondary/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-primary">ETH vs BTC</div>
                    <div className="text-sm text-muted-foreground">2.3K warriors engaged</div>
                  </div>
                </div>
                <Button variant="outline" className="cyber-button text-xs h-8">
                  Join Battle
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
