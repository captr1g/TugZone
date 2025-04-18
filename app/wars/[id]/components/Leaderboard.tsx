import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Zap, TrendingUp } from "lucide-react"

const leaderboardData = [
  { rank: 1, username: "cryptoking", tokens: 1000, profit: 5000 },
  { rank: 2, username: "moonshot", tokens: 950, profit: 4750 },
  { rank: 3, username: "hodlgang", tokens: 900, profit: 4500 },
  { rank: 4, username: "satoshifan", tokens: 850, profit: 4250 },
  { rank: 5, username: "altcoinhunter", tokens: 800, profit: 4000 },
]

export default function Leaderboard() {
  return (
    <Card className="cyber-gradient border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-primary/20">
                <th className="pb-2 text-muted-foreground">Rank</th>
                <th className="pb-2 text-muted-foreground">Warrior</th>
                <th className="pb-2 text-muted-foreground">Tokens</th>
                <th className="pb-2 text-muted-foreground">Profit</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.rank} className="border-b border-primary/10 last:border-b-0">
                  <td className="py-3 text-primary">{entry.rank}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-primary">{entry.username}</span>
                    </div>
                  </td>
                  <td className="py-3">{entry.tokens}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="h-4 w-4" />${entry.profit}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
